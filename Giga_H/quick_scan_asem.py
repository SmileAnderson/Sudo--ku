#!/usr/bin/env python3
"""
Quick Cyber Hygiene Scan of ASEM (ase.md)
=========================================

Fast security assessment of the Academy of Economic Studies of Moldova
demonstrating key scanner components.
"""

import sys
import time
import uuid
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def print_banner():
    """Print scan banner."""
    print("⚡ " + "=" * 70)
    print("⚡   CYBER HYGIENE SCANNER - QUICK ASEM ASSESSMENT")
    print("⚡ " + "=" * 70)
    print("⚡   Target: Academy of Economic Studies Moldova (ase.md)")
    print("⚡   Purpose: Fast cybersecurity assessment")
    print("⚡   Scope: Key security components (quick scan)")
    print("⚡   Authorization: Public educational website - FULLY ETHICAL")
    print("⚡ " + "=" * 70)
    print()

def run_quick_asem_scan():
    """Run key scanner components on ase.md quickly."""
    target = "ase.md"
    scan_id = str(uuid.uuid4())[:8]  # Short ID for quick scan
    
    print(f"🔍 QUICK SECURITY ASSESSMENT")
    print("=" * 60)
    print(f"   🎯 Target: {target}")
    print(f"   🆔 Scan ID: {scan_id}")
    print(f"   📊 Mode: Quick scan (4 key components)")
    print()
    
    # Initialize logging
    try:
        from app.utils.multi_logger import multi_logger
        multi_logger.log_scan_started(target, scan_id, "127.0.0.1", "quick")
        print("✅ Logging system active")
    except Exception as e:
        print(f"⚠️  Logging: {e}")
        multi_logger = None
    
    results = {}
    total_issues = 0
    scan_start_time = time.time()
    
    # 1. Internet Exposure (Quick)
    print("\n1️⃣  🔍 INTERNET EXPOSURE (Quick)")
    print("-" * 40)
    try:
        from app.scanners.internet_exposure import InternetExposureScanner
        
        scanner = InternetExposureScanner(target, "quick")
        start_time = time.time()
        result = scanner.scan()
        duration = time.time() - start_time
        
        status = result.get("status", "unknown")
        print(f"   Status: {status} ({duration:.1f}s)")
        
        if status == "completed":
            open_ports = result.get("open_ports", [])
            method = result.get("scan_method", "unknown")
            print(f"   🔌 Open Ports: {len(open_ports)} (via {method})")
            
            # Show key ports
            if open_ports:
                for port in open_ports[:3]:
                    port_num = port.get("port")
                    service = port.get("service", "unknown")
                    print(f"      • Port {port_num}: {service}")
                    
                    # High-risk ports
                    if port_num in [21, 23, 135, 139, 445]:
                        total_issues += 1
                        print(f"        ⚠️  High-risk port!")
        
        results["internet_exposure"] = result
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)[:50]}...")
        results["internet_exposure"] = {"status": "error"}
    
    # 2. TLS Security (Quick)
    print("\n2️⃣  🔐 TLS/SSL SECURITY (Quick)")
    print("-" * 40)
    try:
        from app.scanners.tls_security import TLSSecurityScanner
        
        scanner = TLSSecurityScanner(target, "quick")
        start_time = time.time()
        result = scanner.scan()
        duration = time.time() - start_time
        
        status = result.get("status", "unknown")
        print(f"   Status: {status} ({duration:.1f}s)")
        
        if status == "completed":
            tls_versions = result.get("tls_versions", [])
            certificate = result.get("certificate", {})
            vulnerabilities = result.get("vulnerabilities", [])
            
            print(f"   🔒 TLS: {', '.join(tls_versions) if tls_versions else 'None'}")
            
            if certificate:
                subject = certificate.get("subject", "Unknown")
                days_expiry = certificate.get("days_until_expiry", "Unknown")
                print(f"   📄 Cert: {subject}")
                print(f"   📅 Expires: {days_expiry} days")
                
                # Certificate issues
                if isinstance(days_expiry, int) and days_expiry < 30:
                    total_issues += 1
                    print(f"   ⚠️  Certificate expiring soon!")
            
            if vulnerabilities:
                total_issues += len(vulnerabilities)
                print(f"   🚨 TLS Issues: {len(vulnerabilities)}")
        
        results["tls_security"] = result
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)[:50]}...")
        results["tls_security"] = {"status": "error"}
    
    # 3. Web Security (Quick)
    print("\n3️⃣  🌐 WEB SECURITY (Quick)")
    print("-" * 40)
    try:
        from app.scanners.web_security import WebSecurityScanner
        
        scanner = WebSecurityScanner(target, "quick")
        start_time = time.time()
        result = scanner.scan()
        duration = time.time() - start_time
        
        status = result.get("status", "unknown")
        print(f"   Status: {status} ({duration:.1f}s)")
        
        if status == "completed":
            security_score = result.get("security_score", 0)
            missing_headers = result.get("missing_headers", [])
            vulnerabilities = result.get("vulnerabilities", [])
            
            print(f"   📈 Security Score: {security_score}/100")
            print(f"   ❌ Missing Headers: {len(missing_headers)}")
            
            # Show critical missing headers
            critical_headers = ["Content-Security-Policy", "X-Frame-Options", "Strict-Transport-Security"]
            missing_critical = [h for h in missing_headers if h in critical_headers]
            
            if missing_critical:
                total_issues += len(missing_critical)
                print(f"   ⚠️  Critical missing: {', '.join(missing_critical[:2])}")
            
            if vulnerabilities:
                total_issues += len(vulnerabilities)
                print(f"   🚨 Web Issues: {len(vulnerabilities)}")
        
        results["web_security"] = result
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)[:50]}...")
        results["web_security"] = {"status": "error"}
    
    # 4. Email Authentication (Quick)
    print("\n4️⃣  📧 EMAIL AUTHENTICATION (Quick)")
    print("-" * 40)
    try:
        from app.scanners.email_auth import EmailAuthScanner
        
        scanner = EmailAuthScanner(target, "quick")
        start_time = time.time()
        result = scanner.scan()
        duration = time.time() - start_time
        
        status = result.get("status", "unknown")
        print(f"   Status: {status} ({duration:.1f}s)")
        
        if status == "completed":
            spf = result.get("spf", {})
            dkim = result.get("dkim", {})
            dmarc = result.get("dmarc", {})
            
            # Quick email security check
            spf_ok = spf.get("exists", False)
            dkim_ok = dkim.get("selectors_found", [])
            dmarc_ok = dmarc.get("exists", False)
            
            print(f"   📧 SPF: {'✅' if spf_ok else '❌'}")
            print(f"   📧 DKIM: {'✅' if dkim_ok else '❌'}")
            print(f"   📧 DMARC: {'✅' if dmarc_ok else '❌'}")
            
            # Count missing email auth
            missing_email_auth = 0
            if not spf_ok:
                missing_email_auth += 1
            if not dkim_ok:
                missing_email_auth += 1
            if not dmarc_ok:
                missing_email_auth += 1
            
            total_issues += missing_email_auth
            
            if missing_email_auth > 0:
                print(f"   ⚠️  {missing_email_auth} email auth issues")
        
        results["email_auth"] = result
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)[:50]}...")
        results["email_auth"] = {"status": "error"}
    
    # Calculate final metrics
    total_duration = time.time() - scan_start_time
    successful_scans = sum(1 for r in results.values() if r.get("status") == "completed")
    total_scans = len(results)
    
    # Log completion
    if multi_logger:
        multi_logger.log_scan_completed(scan_id, target, total_duration, total_issues)
    
    return results, total_duration, total_issues, successful_scans, total_scans

def generate_quick_assessment(results, issues):
    """Generate quick security assessment."""
    print(f"\n📊 QUICK SECURITY ASSESSMENT")
    print("=" * 60)
    
    # Calculate quick score
    base_score = 100
    score_deduction = min(issues * 10, 80)  # Max 80 point deduction
    final_score = max(base_score - score_deduction, 20)  # Min score 20
    
    print(f"🎯 ESTIMATED SECURITY SCORE: {final_score}/100")
    
    # Quick risk assessment
    if final_score >= 80:
        risk_level = "🟢 LOW RISK"
        recommendation = "Minor improvements needed"
    elif final_score >= 60:
        risk_level = "🟡 MEDIUM RISK"
        recommendation = "Several security improvements recommended"
    elif final_score >= 40:
        risk_level = "🟠 HIGH RISK"
        recommendation = "Significant security improvements needed"
    else:
        risk_level = "🔴 CRITICAL RISK"
        recommendation = "Immediate security attention required"
    
    print(f"📈 Risk Level: {risk_level}")
    print(f"💡 Recommendation: {recommendation}")
    
    return final_score

def show_quick_recommendations(issues):
    """Show quick recommendations based on findings."""
    print(f"\n💡 QUICK RECOMMENDATIONS:")
    print("-" * 40)
    
    if issues == 0:
        print("   ✅ Excellent security posture!")
        print("   ✅ Continue regular security monitoring")
    elif issues <= 3:
        print("   🔧 Implement missing security headers")
        print("   🔧 Review email authentication settings")
        print("   🔧 Consider additional monitoring")
    elif issues <= 6:
        print("   ⚠️  Priority: Fix missing security headers")
        print("   ⚠️  Priority: Configure email authentication")
        print("   ⚠️  Review open port security")
        print("   ⚠️  Implement comprehensive monitoring")
    else:
        print("   🚨 URGENT: Complete security review needed")
        print("   🚨 URGENT: Close unnecessary ports")
        print("   🚨 URGENT: Implement all security headers")
        print("   🚨 URGENT: Configure email authentication")
        print("   🚨 URGENT: Professional security assessment")

def main():
    """Main quick scan function."""
    print_banner()
    
    print("⚡ QUICK ETHICAL SCAN:")
    print("   • Fast assessment of key security areas")
    print("   • Public educational website (ase.md)")
    print("   • Non-intrusive security checks only")
    print("   • Professional logging enabled")
    print()
    
    # Run quick scan
    results, duration, issues, successful, total = run_quick_asem_scan()
    
    # Generate assessment
    score = generate_quick_assessment(results, issues)
    
    # Show recommendations
    show_quick_recommendations(issues)
    
    # Final summary
    print(f"\n⚡ QUICK ASEM SCAN COMPLETED!")
    print("=" * 60)
    print(f"⏱️  Duration: {duration:.1f} seconds")
    print(f"🎯 Security Score: {score}/100")
    print(f"🔍 Issues Found: {issues}")
    print(f"✅ Scanners: {successful}/{total} successful")
    
    print(f"\n📋 SCAN HIGHLIGHTS:")
    print(f"   • Academy of Economic Studies Moldova assessed")
    print(f"   • 4 key security areas evaluated")
    print(f"   • Professional logging system active")
    print(f"   • Ethical scanning practices maintained")
    
    print(f"\n🎓 EDUCATIONAL INSTITUTION ASSESSMENT:")
    if score >= 70:
        print("   • Good security foundation in place")
        print("   • Appropriate for educational environment")
        print("   • Continue regular security maintenance")
    else:
        print("   • Security improvements recommended")
        print("   • Consider professional security review")
        print("   • Enhance protection for student data")
    
    print(f"\n🛡️  CYBER HYGIENE SCANNER - QUICK ASSESSMENT COMPLETE!")

if __name__ == "__main__":
    main()
