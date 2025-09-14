"""Email Authentication Analysis Scanner - SPF, DKIM, DMARC assessment."""

import dns.resolver
import dns.exception
import re
from typing import Dict, List, Any, Optional

from app.scanners.base import BaseScanner, NetworkTimeoutError, ScanningNotPossibleError
from app.config import settings


class EmailAuthScanner(BaseScanner):
    """
    Scanner for email authentication mechanisms including:
    - SPF (Sender Policy Framework) record analysis
    - DKIM (DomainKeys Identified Mail) selector discovery
    - DMARC (Domain-based Message Authentication) policy analysis
    - MX record security assessment
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        super().__init__(target, scan_type)
        self.results = {
            "spf": None,
            "dkim": None,
            "dmarc": None,
            "mx_records": [],
            "vulnerabilities": []
        }
        
        # Common DKIM selectors to check
        self.common_dkim_selectors = [
            "default", "selector1", "selector2", "google", "gmail",
            "k1", "dkim", "mail", "email", "s1", "s2", "key1", "key2"
        ]
    
    def scan(self) -> Dict[str, Any]:
        """
        Perform email authentication scanning.
        
        Returns:
            dict: Email authentication analysis results
        """
        self.start_scan()
        
        try:
            # Only scan domains, not IP addresses
            if self.is_ip:
                return self.handle_service_not_found("email authentication (IP addresses not supported)")
            
            # Set DNS timeout with fallback
            try:
                dns.resolver.default_resolver.timeout = getattr(settings, 'DNS_TIMEOUT', 10)
                dns.resolver.default_resolver.lifetime = getattr(settings, 'DNS_TIMEOUT', 10)
            except AttributeError:
                # Fallback if resolver not properly initialized
                dns.resolver.default_resolver = dns.resolver.Resolver()
                dns.resolver.default_resolver.timeout = 10
                dns.resolver.default_resolver.lifetime = 10
            
            # Check MX records first
            self._check_mx_records()
            
            # Analyze SPF records
            self._analyze_spf_record()
            
            # Discover and analyze DKIM
            self._analyze_dkim()
            
            # Analyze DMARC policy
            self._analyze_dmarc_record()
            
            return self.create_result("completed", self.results)
            
        except dns.exception.Timeout:
            return self.handle_timeout("DNS queries for email authentication")
        except ScanningNotPossibleError as e:
            return self.handle_network_error("email authentication analysis", str(e))
        except Exception as e:
            return self.handle_network_error("email authentication analysis", str(e))
    
    def _check_mx_records(self) -> None:
        """
        Check MX records for the domain.
        """
        try:
            self.log_scan_info("Checking MX records")
            
            mx_records = dns.resolver.resolve(self.target, 'MX')
            
            for mx in mx_records:
                mx_info = {
                    "priority": mx.preference,
                    "exchange": str(mx.exchange).rstrip('.'),
                    "security_issues": []
                }
                
                # Check for common security issues
                exchange_lower = mx_info["exchange"].lower()
                
                # Check for non-encrypted mail servers (basic heuristics)
                if any(term in exchange_lower for term in ['smtp.', 'mail.']):
                    # This is normal, no issue
                    pass
                
                self.results["mx_records"].append(mx_info)
            
            if not self.results["mx_records"]:
                self.results["vulnerabilities"].append({
                    "type": "no_mx_records",
                    "severity": "low",
                    "description": "No MX records found for domain",
                    "recommendation": "Configure MX records if email services are used"
                })
            
        except dns.resolver.NXDOMAIN:
            self.log_scan_info("Domain does not exist")
            raise ScanningNotPossibleError("Domain does not exist")
        except dns.resolver.NoAnswer:
            self.log_scan_info("No MX records found")
            # Not having MX records is not necessarily an error
        except Exception as e:
            self.log_scan_info(f"MX record check failed: {e}")
    
    def _analyze_spf_record(self) -> None:
        """
        Analyze SPF (Sender Policy Framework) record.
        """
        try:
            self.log_scan_info("Analyzing SPF record")
            
            # Query TXT records for SPF
            txt_records = dns.resolver.resolve(self.target, 'TXT')
            
            spf_record = None
            for record in txt_records:
                record_text = str(record).strip('"')
                if record_text.startswith('v=spf1'):
                    spf_record = record_text
                    break
            
            if spf_record:
                spf_analysis = self._parse_spf_record(spf_record)
                self.results["spf"] = spf_analysis
                self.log_scan_info(f"SPF record found: {spf_record}")
            else:
                self.results["spf"] = {
                    "exists": False,
                    "record": None,
                    "policy": None,
                    "valid": False
                }
                
                # Only flag as vulnerability if MX records exist
                if self.results["mx_records"]:
                    self.results["vulnerabilities"].append({
                        "type": "missing_spf",
                        "severity": "medium",
                        "description": "SPF record not configured",
                        "recommendation": "Configure SPF record to prevent email spoofing"
                    })
            
        except dns.resolver.NoAnswer:
            self.log_scan_info("No TXT records found")
        except Exception as e:
            self.log_scan_info(f"SPF analysis failed: {e}")
    
    def _parse_spf_record(self, spf_record: str) -> Dict[str, Any]:
        """
        Parse and analyze SPF record.
        
        Args:
            spf_record: SPF record string
            
        Returns:
            dict: SPF analysis results
        """
        spf_analysis = {
            "exists": True,
            "record": spf_record,
            "policy": None,
            "valid": True,
            "mechanisms": [],
            "issues": []
        }
        
        # Extract mechanisms
        mechanisms = re.findall(r'(?:^|\s)([-+~?]?(?:a|mx|ip4|ip6|include|exists|ptr|redirect|exp)(?::[^\s]*)?)', spf_record)
        spf_analysis["mechanisms"] = mechanisms
        
        # Determine policy from last mechanism
        if spf_record.endswith(' -all'):
            spf_analysis["policy"] = "fail"
        elif spf_record.endswith(' ~all'):
            spf_analysis["policy"] = "softfail"
        elif spf_record.endswith(' +all'):
            spf_analysis["policy"] = "pass"
            spf_analysis["issues"].append("Permissive policy (+all) allows any sender")
        elif spf_record.endswith(' ?all'):
            spf_analysis["policy"] = "neutral"
        else:
            spf_analysis["policy"] = "unknown"
            spf_analysis["issues"].append("No explicit policy specified")
        
        # Check for common issues
        if '+all' in spf_record:
            self.results["vulnerabilities"].append({
                "type": "permissive_spf",
                "severity": "high",
                "description": "SPF record contains permissive +all policy",
                "recommendation": "Change SPF policy to ~all or -all"
            })
        
        # Check for too many DNS lookups (SPF RFC limit is 10)
        include_count = len(re.findall(r'include:', spf_record))
        if include_count > 8:  # Leave some buffer
            spf_analysis["issues"].append(f"High number of includes ({include_count}) may cause DNS lookup limit issues")
            self.results["vulnerabilities"].append({
                "type": "spf_dns_lookups",
                "severity": "medium",
                "description": f"SPF record has {include_count} includes, approaching DNS lookup limit",
                "recommendation": "Reduce number of include statements in SPF record"
            })
        
        return spf_analysis
    
    def _analyze_dkim(self) -> None:
        """
        Discover and analyze DKIM selectors.
        """
        try:
            self.log_scan_info("Discovering DKIM selectors")
            
            found_selectors = []
            
            # Try common DKIM selectors
            selectors_to_check = self.common_dkim_selectors
            if self.should_scan_quickly():
                selectors_to_check = ["default", "selector1", "google"]  # Limit for quick scan
            
            for selector in selectors_to_check:
                try:
                    dkim_domain = f"{selector}._domainkey.{self.target}"
                    txt_records = dns.resolver.resolve(dkim_domain, 'TXT')
                    
                    for record in txt_records:
                        record_text = str(record).strip('"')
                        if 'v=DKIM1' in record_text or 'k=' in record_text:
                            found_selectors.append({
                                "selector": selector,
                                "record": record_text,
                                "valid": self._validate_dkim_record(record_text)
                            })
                            self.log_scan_info(f"DKIM selector found: {selector}")
                            break
                            
                except dns.resolver.NXDOMAIN:
                    continue  # Selector doesn't exist
                except dns.resolver.NoAnswer:
                    continue  # No TXT record for this selector
                except Exception as e:
                    self.log_scan_info(f"Error checking DKIM selector {selector}: {e}")
                    continue
            
            if found_selectors:
                self.results["dkim"] = {
                    "selectors_found": [s["selector"] for s in found_selectors],
                    "valid_signatures": all(s["valid"] for s in found_selectors),
                    "records": found_selectors
                }
            else:
                self.results["dkim"] = {
                    "selectors_found": [],
                    "valid_signatures": False,
                    "records": []
                }
                
                # Only flag as vulnerability if email services are configured
                if self.results["mx_records"]:
                    self.results["vulnerabilities"].append({
                        "type": "missing_dkim",
                        "severity": "medium",
                        "description": "No DKIM selectors found",
                        "recommendation": "Configure DKIM signing for email authentication"
                    })
            
        except Exception as e:
            self.log_scan_info(f"DKIM analysis failed: {e}")
    
    def _validate_dkim_record(self, dkim_record: str) -> bool:
        """
        Validate DKIM record format.
        
        Args:
            dkim_record: DKIM record string
            
        Returns:
            bool: True if record appears valid
        """
        # Basic validation - check for required components
        required_fields = ['v=DKIM1']
        
        # Check for version
        if not any(field in dkim_record for field in required_fields):
            return False
        
        # Check for key data (k= or p=)
        if not ('k=' in dkim_record or 'p=' in dkim_record):
            return False
        
        return True
    
    def _analyze_dmarc_record(self) -> None:
        """
        Analyze DMARC (Domain-based Message Authentication) record.
        """
        try:
            self.log_scan_info("Analyzing DMARC record")
            
            # Query DMARC record
            dmarc_domain = f"_dmarc.{self.target}"
            txt_records = dns.resolver.resolve(dmarc_domain, 'TXT')
            
            dmarc_record = None
            for record in txt_records:
                record_text = str(record).strip('"')
                if record_text.startswith('v=DMARC1'):
                    dmarc_record = record_text
                    break
            
            if dmarc_record:
                dmarc_analysis = self._parse_dmarc_record(dmarc_record)
                self.results["dmarc"] = dmarc_analysis
                self.log_scan_info(f"DMARC record found: {dmarc_record}")
            else:
                self.results["dmarc"] = {
                    "exists": False,
                    "policy": None,
                    "percentage": None,
                    "aggregate_reports": None,
                    "forensic_reports": None
                }
                
                # Only flag as vulnerability if email services are configured
                if self.results["mx_records"]:
                    self.results["vulnerabilities"].append({
                        "type": "missing_dmarc",
                        "severity": "medium",
                        "description": "DMARC record not configured",
                        "recommendation": "Configure DMARC policy for email authentication"
                    })
            
        except dns.resolver.NXDOMAIN:
            self.log_scan_info("No DMARC record found")
        except dns.resolver.NoAnswer:
            self.log_scan_info("No DMARC TXT record found")
        except Exception as e:
            self.log_scan_info(f"DMARC analysis failed: {e}")
    
    def _parse_dmarc_record(self, dmarc_record: str) -> Dict[str, Any]:
        """
        Parse and analyze DMARC record.
        
        Args:
            dmarc_record: DMARC record string
            
        Returns:
            dict: DMARC analysis results
        """
        dmarc_analysis = {
            "exists": True,
            "record": dmarc_record,
            "policy": None,
            "percentage": 100,
            "aggregate_reports": None,
            "forensic_reports": None,
            "alignment": {},
            "issues": []
        }
        
        # Parse policy
        policy_match = re.search(r'p=([^;]+)', dmarc_record)
        if policy_match:
            dmarc_analysis["policy"] = policy_match.group(1)
        
        # Parse percentage
        pct_match = re.search(r'pct=(\d+)', dmarc_record)
        if pct_match:
            dmarc_analysis["percentage"] = int(pct_match.group(1))
        
        # Parse reporting addresses
        rua_match = re.search(r'rua=([^;]+)', dmarc_record)
        if rua_match:
            dmarc_analysis["aggregate_reports"] = rua_match.group(1)
        
        ruf_match = re.search(r'ruf=([^;]+)', dmarc_record)
        if ruf_match:
            dmarc_analysis["forensic_reports"] = ruf_match.group(1)
        
        # Check policy strength
        if dmarc_analysis["policy"] == "none":
            dmarc_analysis["issues"].append("DMARC policy is set to 'none' (monitoring only)")
            self.results["vulnerabilities"].append({
                "type": "weak_dmarc_policy",
                "severity": "low",
                "description": "DMARC policy is set to 'none'",
                "recommendation": "Consider upgrading DMARC policy to 'quarantine' or 'reject'"
            })
        
        # Check percentage
        if dmarc_analysis["percentage"] < 100:
            dmarc_analysis["issues"].append(f"DMARC policy applies to only {dmarc_analysis['percentage']}% of emails")
        
        return dmarc_analysis
