"""Scoring Engine - Calculate overall security scores and generate recommendations."""

from typing import Dict, List, Any, Tuple
import logging

logger = logging.getLogger(__name__)


class ScoringEngine:
    """
    Engine for calculating overall security scores and generating
    prioritized problems and recommendations based on scan results.
    """
    
    def __init__(self):
        # Scoring weights for different categories (total = 100)
        self.category_weights = {
            "internet_exposure": 20,     # High impact - external attack surface
            "tls_security": 15,          # High impact - encryption and trust
            "web_security": 15,          # High impact - web application security
            "email_security": 10,        # Medium impact - email authentication
            "vulnerabilities": 25,       # Highest impact - known exploitable issues
            "iam_assessment": 8,         # Medium impact - access controls
            "backup_dr": 4,              # Lower impact - data protection
            "logging_monitoring": 3      # Lower impact - detection capabilities
        }
        
        # Severity multipliers for problems
        self.severity_multipliers = {
            "critical": 1.0,
            "high": 0.7,
            "medium": 0.4,
            "low": 0.1
        }
        
        # Maximum deductions per category to prevent single category from dominating
        self.max_category_deduction = {
            "internet_exposure": 20,
            "tls_security": 15,
            "web_security": 15,
            "email_security": 10,
            "vulnerabilities": 25,
            "iam_assessment": 8,
            "backup_dr": 4,
            "logging_monitoring": 3
        }
    
    def calculate_score(self, scan_results: Dict[str, Any]) -> Tuple[int, List[Dict], List[Dict], Dict]:
        """
        Calculate overall security score and generate problems/recommendations.
        
        Args:
            scan_results: Complete scan results from all categories
            
        Returns:
            tuple: (score, problems, recommendations, summary)
        """
        logger.info("Calculating security score and generating recommendations")
        
        # Initialize scoring
        total_score = 100
        all_problems = []
        all_recommendations = []
        category_scores = {}
        
        # Process each category
        for category, weight in self.category_weights.items():
            category_result = scan_results.get(category, {})
            
            if category_result.get("status") == "completed":
                score, problems, recommendations = self._score_category(category, category_result, weight)
                category_scores[category] = score
                all_problems.extend(problems)
                all_recommendations.extend(recommendations)
                
                # Deduct from total score
                deduction = min(weight - score, self.max_category_deduction[category])
                total_score -= deduction
                
            else:
                # Category failed - minimal deduction for missing data
                category_scores[category] = weight * 0.8  # 80% score for failed scans
                total_score -= weight * 0.2
        
        # Ensure score stays within bounds
        final_score = max(0, min(100, int(total_score)))
        
        # Sort problems by severity and impact
        sorted_problems = self._prioritize_problems(all_problems)
        
        # Generate summary recommendations (remove duplicates)
        unique_recommendations = self._consolidate_recommendations(all_recommendations)
        
        # Generate scan summary
        summary = self._generate_summary(scan_results, category_scores, sorted_problems)
        
        logger.info(f"Security score calculated: {final_score}/100 with {len(sorted_problems)} issues")
        
        return final_score, sorted_problems, unique_recommendations, summary
    
    def _score_category(self, category: str, category_result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """
        Score individual category and extract problems/recommendations.
        
        Args:
            category: Category name
            category_result: Category scan results
            max_weight: Maximum possible weight for category
            
        Returns:
            tuple: (score, problems, recommendations)
        """
        if category == "internet_exposure":
            return self._score_internet_exposure(category_result, max_weight)
        elif category == "tls_security":
            return self._score_tls_security(category_result, max_weight)
        elif category == "web_security":
            return self._score_web_security(category_result, max_weight)
        elif category == "email_security":
            return self._score_email_security(category_result, max_weight)
        elif category == "vulnerabilities":
            return self._score_vulnerabilities(category_result, max_weight)
        elif category == "iam_assessment":
            return self._score_iam_assessment(category_result, max_weight)
        elif category == "backup_dr":
            return self._score_backup_dr(category_result, max_weight)
        elif category == "logging_monitoring":
            return self._score_security_monitoring(category_result, max_weight)
        else:
            return max_weight, [], []
    
    def _score_internet_exposure(self, result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """Score internet exposure results."""
        problems = []
        recommendations = []
        deductions = 0
        
        open_ports = result.get("open_ports", [])
        
        # Analyze open ports
        for port_info in open_ports:
            port = port_info.get("port")
            service = port_info.get("service", "unknown")
            
            # High-risk ports
            if port in [21, 23, 135, 139, 445, 1433, 3389]:
                problems.append({
                    "category": "internet_exposure",
                    "issue": f"High-risk port {port} ({service}) is open",
                    "severity": "high",
                    "description": f"Port {port} running {service} is accessible from the internet",
                    "impact": "Potential unauthorized access and exploitation"
                })
                deductions += 4
            
            # Medium-risk ports without proper security
            elif port in [80, 8080] and not any(p.get("port") == 443 for p in open_ports):
                problems.append({
                    "category": "internet_exposure",
                    "issue": f"HTTP service on port {port} without HTTPS",
                    "severity": "medium",
                    "description": "Unencrypted web service detected",
                    "impact": "Data transmitted in plain text"
                })
                deductions += 2
        
        # Generate recommendations
        if any(p.get("port") in [21, 23] for p in open_ports):
            recommendations.append({
                "problem_id": "insecure_protocols",
                "recommendation": "Disable insecure protocols (FTP, Telnet) and use secure alternatives",
                "effort_estimate": "Medium",
                "steps": [
                    "Identify services using insecure protocols",
                    "Migrate to secure alternatives (SFTP, SSH)",
                    "Update firewall rules to block insecure ports",
                    "Verify secure configuration"
                ]
            })
        
        score = max(0, max_weight - deductions)
        return score, problems, recommendations
    
    def _score_tls_security(self, result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """Score TLS security results."""
        problems = []
        recommendations = []
        deductions = 0
        
        tls_versions = result.get("tls_versions", [])
        certificate = result.get("certificate", {})
        vulnerabilities = result.get("vulnerabilities", [])
        
        # Check for weak TLS versions
        if "TLSv1.0" in tls_versions or "TLSv1.1" in tls_versions:
            problems.append({
                "category": "tls_security",
                "issue": "Outdated TLS versions supported",
                "severity": "high",
                "description": "TLS 1.0/1.1 are deprecated and vulnerable",
                "impact": "Potential for man-in-the-middle attacks"
            })
            deductions += 6
        
        # Check certificate expiry
        if certificate:
            days_until_expiry = certificate.get("days_until_expiry", 365)
            if days_until_expiry < 0:
                problems.append({
                    "category": "tls_security",
                    "issue": "SSL certificate expired",
                    "severity": "critical",
                    "description": "SSL certificate has expired",
                    "impact": "Service unavailable, security warnings"
                })
                deductions += 8
            elif days_until_expiry < 30:
                problems.append({
                    "category": "tls_security",
                    "issue": "SSL certificate expiring soon",
                    "severity": "medium",
                    "description": f"Certificate expires in {days_until_expiry} days",
                    "impact": "Potential service disruption"
                })
                deductions += 3
        
        # Process vulnerabilities
        for vuln in vulnerabilities:
            severity = vuln.get("severity", "low")
            problems.append({
                "category": "tls_security",
                "issue": vuln.get("type", "TLS vulnerability"),
                "severity": severity,
                "description": vuln.get("description", "TLS security issue detected"),
                "impact": "Encryption weakness"
            })
            
            if severity == "critical":
                deductions += 5
            elif severity == "high":
                deductions += 3
            elif severity == "medium":
                deductions += 1
        
        # Generate recommendations
        if problems:
            recommendations.append({
                "problem_id": "tls_security_issues",
                "recommendation": "Update TLS configuration and certificates",
                "effort_estimate": "Low",
                "steps": [
                    "Disable TLS 1.0 and 1.1",
                    "Enable only TLS 1.2 and 1.3",
                    "Renew SSL certificates before expiry",
                    "Test configuration with SSL testing tools"
                ]
            })
        
        score = max(0, max_weight - deductions)
        return score, problems, recommendations
    
    def _score_web_security(self, result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """Score web security results."""
        problems = []
        recommendations = []
        
        security_score = result.get("security_score", 0)
        missing_headers = result.get("missing_headers", [])
        vulnerabilities = result.get("vulnerabilities", [])
        
        # Convert security score to weight scale
        score_percentage = security_score / 100
        base_score = int(max_weight * score_percentage)
        
        # Process missing headers
        for header in missing_headers:
            if header in ["HSTS", "CSP"]:
                problems.append({
                    "category": "web_security",
                    "issue": f"Missing {header} header",
                    "severity": "medium",
                    "description": f"{header} security header not implemented",
                    "impact": "Reduced web application security"
                })
        
        # Process vulnerabilities
        for vuln in vulnerabilities:
            problems.append({
                "category": "web_security",
                "issue": vuln.get("type", "Web security issue"),
                "severity": vuln.get("severity", "low"),
                "description": vuln.get("description", "Web security vulnerability"),
                "impact": "Web application security weakness"
            })
        
        if missing_headers or vulnerabilities:
            recommendations.append({
                "problem_id": "web_security_headers",
                "recommendation": "Implement comprehensive security headers",
                "effort_estimate": "Low",
                "steps": [
                    "Configure Content Security Policy (CSP)",
                    "Enable HSTS with appropriate max-age",
                    "Set X-Frame-Options to DENY or SAMEORIGIN",
                    "Add X-Content-Type-Options: nosniff"
                ]
            })
        
        return base_score, problems, recommendations
    
    def _score_email_security(self, result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """Score email security results."""
        problems = []
        recommendations = []
        deductions = 0
        
        spf = result.get("spf", {})
        dkim = result.get("dkim", {})
        dmarc = result.get("dmarc", {})
        vulnerabilities = result.get("vulnerabilities", [])
        
        # Check SPF
        if not spf or not spf.get("exists"):
            problems.append({
                "category": "email_security",
                "issue": "SPF record not configured",
                "severity": "medium",
                "description": "No SPF record found for domain",
                "impact": "Email spoofing vulnerability"
            })
            deductions += 3
        
        # Check DKIM
        if not dkim or not dkim.get("selectors_found"):
            problems.append({
                "category": "email_security",
                "issue": "DKIM not configured",
                "severity": "medium",
                "description": "No DKIM selectors found",
                "impact": "Email authenticity cannot be verified"
            })
            deductions += 3
        
        # Check DMARC
        if not dmarc or not dmarc.get("exists"):
            problems.append({
                "category": "email_security",
                "issue": "DMARC policy not configured",
                "severity": "medium",
                "description": "No DMARC record found",
                "impact": "Email domain abuse vulnerability"
            })
            deductions += 4
        
        # Process vulnerabilities
        for vuln in vulnerabilities:
            severity = vuln.get("severity", "low")
            problems.append({
                "category": "email_security",
                "issue": vuln.get("type", "Email security issue"),
                "severity": severity,
                "description": vuln.get("description", "Email authentication issue"),
                "impact": "Email security weakness"
            })
            
            if severity == "high":
                deductions += 2
            elif severity == "medium":
                deductions += 1
        
        if problems:
            recommendations.append({
                "problem_id": "email_authentication",
                "recommendation": "Implement comprehensive email authentication",
                "effort_estimate": "Medium",
                "steps": [
                    "Configure SPF record with appropriate policy",
                    "Set up DKIM signing for outbound emails",
                    "Implement DMARC policy starting with p=none",
                    "Monitor DMARC reports and gradually strengthen policy"
                ]
            })
        
        score = max(0, max_weight - deductions)
        return score, problems, recommendations
    
    def _score_vulnerabilities(self, result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """Score vulnerability assessment results."""
        problems = []
        recommendations = []
        deductions = 0
        
        vulnerabilities = result.get("vulnerabilities", [])
        risk_summary = result.get("risk_summary", {})
        
        # Score based on vulnerability severity
        critical_count = risk_summary.get("critical", 0)
        high_count = risk_summary.get("high", 0)
        medium_count = risk_summary.get("medium", 0)
        low_count = risk_summary.get("low", 0)
        
        # Calculate deductions
        deductions += critical_count * 8  # 8 points per critical
        deductions += high_count * 4      # 4 points per high
        deductions += medium_count * 2    # 2 points per medium
        deductions += low_count * 0.5     # 0.5 points per low
        
        # Convert vulnerabilities to problems
        for vuln in vulnerabilities:
            problems.append({
                "category": "vulnerabilities",
                "issue": f"CVE {vuln.get('cve_id', 'Unknown')} detected",
                "severity": vuln.get("severity", "medium"),
                "description": vuln.get("description", "Known vulnerability detected"),
                "impact": "Potential for exploitation and system compromise"
            })
        
        # Generate recommendations for critical and high vulnerabilities
        if critical_count > 0 or high_count > 0:
            recommendations.append({
                "problem_id": "critical_vulnerabilities",
                "recommendation": "Immediately patch critical and high severity vulnerabilities",
                "effort_estimate": "High",
                "steps": [
                    "Prioritize critical vulnerabilities for immediate patching",
                    "Test patches in staging environment",
                    "Apply patches to production systems",
                    "Verify vulnerability remediation with rescanning"
                ]
            })
        
        score = max(0, max_weight - int(deductions))
        return score, problems, recommendations
    
    def _score_iam_assessment(self, result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """Score IAM assessment results."""
        problems = []
        recommendations = []
        deductions = 0
        
        admin_interfaces = result.get("admin_interfaces", [])
        vulnerabilities = result.get("vulnerabilities", [])
        
        # Check admin interfaces
        for interface in admin_interfaces:
            if not interface.get("authentication_required"):
                problems.append({
                    "category": "iam_assessment",
                    "issue": "Exposed admin interface",
                    "severity": "critical",
                    "description": f"Admin interface accessible without authentication: {interface.get('url')}",
                    "impact": "Unauthorized administrative access"
                })
                deductions += 6
            
            if not interface.get("mfa_detected"):
                problems.append({
                    "category": "iam_assessment",
                    "issue": "Missing multi-factor authentication",
                    "severity": "medium",
                    "description": "Admin interface lacks MFA protection",
                    "impact": "Increased risk of credential compromise"
                })
                deductions += 2
        
        # Process vulnerabilities
        for vuln in vulnerabilities:
            severity = vuln.get("severity", "low")
            problems.append({
                "category": "iam_assessment",
                "issue": vuln.get("type", "IAM security issue"),
                "severity": severity,
                "description": vuln.get("description", "Access control vulnerability"),
                "impact": "Unauthorized access risk"
            })
            
            if severity == "critical":
                deductions += 4
            elif severity == "high":
                deductions += 2
            elif severity == "medium":
                deductions += 1
        
        if problems:
            recommendations.append({
                "problem_id": "iam_security",
                "recommendation": "Strengthen access controls and authentication",
                "effort_estimate": "Medium",
                "steps": [
                    "Implement MFA for all admin interfaces",
                    "Restrict admin access by IP whitelist",
                    "Regular access reviews and cleanup",
                    "Implement principle of least privilege"
                ]
            })
        
        score = max(0, max_weight - deductions)
        return score, problems, recommendations
    
    def _score_backup_dr(self, result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """Score backup and DR results."""
        problems = []
        recommendations = []
        deductions = 0
        
        exposed_backups = result.get("exposed_backups", [])
        config_files = result.get("config_files", [])
        vulnerabilities = result.get("vulnerabilities", [])
        
        # Exposed backups are critical
        for backup in exposed_backups:
            problems.append({
                "category": "backup_dr",
                "issue": "Exposed backup file",
                "severity": "critical",
                "description": f"Backup file publicly accessible: {backup.get('url')}",
                "impact": "Data exposure and potential system compromise"
            })
            deductions += 2
        
        # Exposed config files are critical
        for config in config_files:
            problems.append({
                "category": "backup_dr",
                "issue": "Exposed configuration file",
                "severity": "critical",
                "description": f"Configuration file publicly accessible: {config.get('url')}",
                "impact": "Sensitive configuration data exposure"
            })
            deductions += 2
        
        # Process other vulnerabilities
        for vuln in vulnerabilities:
            severity = vuln.get("severity", "low")
            problems.append({
                "category": "backup_dr",
                "issue": vuln.get("type", "Backup security issue"),
                "severity": severity,
                "description": vuln.get("description", "Backup/DR security issue"),
                "impact": "Data protection weakness"
            })
            
            if severity == "critical":
                deductions += 2
            elif severity == "high":
                deductions += 1
        
        if problems:
            recommendations.append({
                "problem_id": "backup_security",
                "recommendation": "Secure backup files and configuration",
                "effort_estimate": "Low",
                "steps": [
                    "Remove backup files from public directories",
                    "Implement proper backup storage security",
                    "Use encrypted backup solutions",
                    "Regular backup security audits"
                ]
            })
        
        score = max(0, max_weight - deductions)
        return score, problems, recommendations
    
    def _score_security_monitoring(self, result: Dict[str, Any], max_weight: int) -> Tuple[int, List[Dict], List[Dict]]:
        """Score security monitoring results."""
        problems = []
        recommendations = []
        
        waf_detected = result.get("waf_detected", False)
        ddos_protection = result.get("ddos_protection", False)
        rate_limiting = result.get("rate_limiting", False)
        security_tools = result.get("security_tools", [])
        
        score = max_weight  # Start with full score
        
        # Deduct for missing security controls
        if not waf_detected:
            problems.append({
                "category": "logging_monitoring",
                "issue": "No WAF detected",
                "severity": "low",
                "description": "Web Application Firewall not detected",
                "impact": "Reduced protection against web attacks"
            })
            score -= 1
        
        if not ddos_protection:
            problems.append({
                "category": "logging_monitoring",
                "issue": "No DDoS protection detected",
                "severity": "low",
                "description": "DDoS protection mechanisms not detected",
                "impact": "Vulnerability to denial of service attacks"
            })
            score -= 1
        
        if not rate_limiting:
            problems.append({
                "category": "logging_monitoring",
                "issue": "No rate limiting detected",
                "severity": "low",
                "description": "Rate limiting not implemented",
                "impact": "Vulnerability to abuse and DoS attacks"
            })
            score -= 1
        
        if not security_tools:
            recommendations.append({
                "problem_id": "security_monitoring",
                "recommendation": "Implement comprehensive security monitoring",
                "effort_estimate": "High",
                "steps": [
                    "Deploy Web Application Firewall (WAF)",
                    "Implement DDoS protection",
                    "Configure rate limiting",
                    "Set up security event monitoring and alerting"
                ]
            })
        
        return max(0, score), problems, recommendations
    
    def _prioritize_problems(self, problems: List[Dict]) -> List[Dict]:
        """Sort problems by severity and impact."""
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        
        return sorted(problems, key=lambda x: (
            severity_order.get(x.get("severity", "low"), 3),
            x.get("category", "")
        ))
    
    def _consolidate_recommendations(self, recommendations: List[Dict]) -> List[Dict]:
        """Remove duplicate recommendations and consolidate similar ones."""
        seen_recommendations = set()
        unique_recommendations = []
        
        for rec in recommendations:
            rec_key = rec.get("recommendation", "")
            if rec_key not in seen_recommendations:
                seen_recommendations.add(rec_key)
                unique_recommendations.append(rec)
        
        return unique_recommendations
    
    def _generate_summary(self, scan_results: Dict[str, Any], category_scores: Dict[str, int], problems: List[Dict]) -> Dict[str, Any]:
        """Generate scan summary statistics."""
        total_categories = len(self.category_weights)
        completed_categories = sum(1 for result in scan_results.values() if result.get("status") == "completed")
        failed_categories = total_categories - completed_categories
        
        # Count problems by severity
        severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
        for problem in problems:
            severity = problem.get("severity", "low")
            if severity in severity_counts:
                severity_counts[severity] += 1
        
        return {
            "categories_scanned": total_categories,
            "categories_completed": completed_categories,
            "categories_failed": failed_categories,
            "total_issues_found": len(problems),
            "critical_issues": severity_counts["critical"],
            "high_issues": severity_counts["high"],
            "medium_issues": severity_counts["medium"],
            "low_issues": severity_counts["low"]
        }
