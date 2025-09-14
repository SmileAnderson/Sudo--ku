#!/usr/bin/env python3
"""
Quick Full Scan of ase.md - Optimized for speed
===============================================

Fast comprehensive scan using optimized timeouts and focused scanning.
"""

import time
import signal
import sys
from datetime import datetime
from app.scanners.internet_exposure import InternetExposureScanner
from app.scanners.tls_security import TLSSecurityScanner
from app.scanners.web_security import WebSecurityScanner
from app.scanners.email_auth import EmailAuthScanner
from app.scanners.cve_vulnerabilities import CVEVulnerabilityScanner
from app.scanners.iam_assessment import IAMAssessmentScanner
from app.scanners.backup_dr import BackupDRScanner
from app.scanners.security_monitoring import SecurityMonitoringScanner
from app.scanners.scoring import ScoringEngine
from app.utils.multi_logger import multi_logger

class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException("Scanner timeout")

def run_scanner_with_timeout(scanner_name, scanner, timeout_seconds=60):
    """Run scanner with timeout protection."""
    print(f"🔍 {scanner_name} (timeout: {timeout_seconds}s)...")
    
    try:
        # Set timeout alarm (Unix/Linux only, skip on Windows)
        if hasattr(signal, 'SIGALRM'):
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(timeout_seconds)
        
        start_time = time.time()
        results = scanner.scan()
        duration = time.time() - start_time
        
        # Clear alarm
        if hasattr(signal, 'SIGALRM'):
            signal.alarm(0)
        
        return results, duration, None
        
    except TimeoutException:
        return None, timeout_seconds, f"Scanner timed out after {timeout_seconds}s"
    except Exception as e:
        duration = time.time() - start_time
        return None, duration, str(e)
    finally:
        # Always clear alarm
        if hasattr(signal, 'SIGALRM'):
            signal.alarm(0)

def main():
    """Main scanning function."""
    target = "ase.md"
    scan_id = f"quick_full_{int(time.time())}"
    
    print("🎯 " + "=" * 60)
    print("🎯   QUICK FULL SCAN - ASE.MD")
    print("🎯 " + "=" * 60)
    print(f"🎯   Target: {target}")
    print(f"🎯   Optimized for Speed & Completeness")
    print("🎯 " + "=" * 60)
    print()
    
    # Log scan start
    multi_logger.log_scan_started(
        target=target,
        scan_id=scan_id,
        client_ip="127.0.0.1",
        scan_type="full"
    )
    
    total_start = time.time()
    all_results = {}
    all_problems = []
    all_recommendations = []
    
    # Define scanners with timeouts
    scanners_config = [
        ("TLS/SSL Security", TLSSecurityScanner(target), 30),
        ("Web Security Headers", WebSecurityScanner(target), 20),
        ("Email Authentication", EmailAuthScanner(target), 25),
        ("Internet Exposure", InternetExposureScanner(target), 90),  # Longer for nmap
        ("CVE Vulnerabilities", CVEVulnerabilityScanner(target), 45),
        ("IAM Assessment", IAMAssessmentScanner(target), 40),
        ("Backup & DR", BackupDRScanner(target), 30),
        ("Security Monitoring", SecurityMonitoringScanner(target), 25)
    ]
    
    print(f"🚀 Running {len(scanners_config)} security scanners...")
    print()
    
    for i, (scanner_name, scanner, timeout) in enumerate(scanners_config, 1):
        print(f"[{i}/{len(scanners_config)}] ", end="")
        
        results, duration, error = run_scanner_with_timeout(scanner_name, scanner, timeout)
        
        if error:
            print(f"   ❌ Failed: {error}")
            all_results[scanner_name] = {"error": error, "problems": [], "recommendations": []}
            
            # Log error
            multi_logger.log_scan_error(
                scan_id=scan_id,
                scanner=scanner_name.replace(" ", ""),
                target=target,
                error=error
            )
        else:
            print(f"   ✅ Completed in {duration:.1f}s")
            all_results[scanner_name] = results
            
            # Log timing
            multi_logger.log_scan_timing(
                scan_id=scan_id,
                scanner=scanner_name.replace(" ", ""),
                duration=duration
            )
            
            # Collect problems and recommendations
            if 'problems' in results:
                all_problems.extend(results['problems'])
                print(f"      🚨 Found {len(results['problems'])} issues")
            
            if 'recommendations' in results:
                all_recommendations.extend(results['recommendations'])
        
        print()
    
    # Calculate overall score
    print("📊 Calculating Security Score...")
    scorer = ScoringEngine()
    
    # Convert scanner names to match scoring engine categories
    scoring_results = {}
    for scanner_name, results in all_results.items():
        if scanner_name == "Internet Exposure":
            scoring_results["internet_exposure"] = results
        elif scanner_name == "TLS/SSL Security":
            scoring_results["tls_security"] = results
        elif scanner_name == "Web Security Headers":
            scoring_results["web_security"] = results
        elif scanner_name == "Email Authentication":
            scoring_results["email_security"] = results
        elif scanner_name == "CVE Vulnerabilities":
            scoring_results["vulnerabilities"] = results
        elif scanner_name == "IAM Assessment":
            scoring_results["iam_assessment"] = results
        elif scanner_name == "Backup & DR":
            scoring_results["backup_dr"] = results
        elif scanner_name == "Security Monitoring":
            scoring_results["logging_monitoring"] = results
    
    overall_score, scored_problems, scored_recommendations, summary = scorer.calculate_score(scoring_results)
    
    total_duration = time.time() - total_start
    
    # Log scan completion
    multi_logger.log_scan_completed(
        scan_id=scan_id,
        target=target,
        duration=total_duration,
        issues_found=len(all_problems)
    )
    
    # Results summary
    print("🎯 " + "=" * 60)
    print("🎯   SCAN RESULTS SUMMARY")
    print("🎯 " + "=" * 60)
    print()
    
    print(f"🎯 Target: {target}")
    print(f"⏱️  Total Duration: {total_duration:.1f} seconds")
    print(f"🔢 Overall Security Score: {overall_score}/100")
    print(f"🚨 Total Issues: {len(scored_problems)}")
    print(f"💡 Total Recommendations: {len(scored_recommendations)}")
    print()
    
    # Scanner results
    print("📋 SCANNER RESULTS:")
    print("-" * 50)
    for scanner_name, results in all_results.items():
        if 'error' in results:
            print(f"   ❌ {scanner_name:<25} FAILED")
        else:
            problems_count = len(results.get('problems', []))
            scanner_score = max(0, 100 - (problems_count * 10))
            print(f"   ✅ {scanner_name:<25} {scanner_score}/100 ({problems_count} issues)")
    print()
    
    # Critical findings
    if scored_problems:
        critical_problems = [p for p in scored_problems if p.get('severity') in ['high', 'critical']]
        print(f"🚨 CRITICAL FINDINGS ({len(critical_problems)}):")
        print("-" * 50)
        for i, problem in enumerate(critical_problems[:8], 1):
            severity = problem.get('severity', 'medium').upper()
            title = problem.get('title', 'Security Issue')
            print(f"   {i}. [{severity}] {title}")
        
        if len(critical_problems) > 8:
            print(f"   ... and {len(critical_problems) - 8} more critical issues")
        print()
    
    # Key recommendations
    if scored_recommendations:
        high_priority = [r for r in scored_recommendations if r.get('priority') == 'high']
        print(f"💡 KEY RECOMMENDATIONS ({len(high_priority)}):")
        print("-" * 50)
        for i, rec in enumerate(high_priority[:8], 1):
            title = rec.get('title', 'Security Recommendation')
            print(f"   {i}. {title}")
            
        if len(high_priority) > 8:
            print(f"   ... and {len(high_priority) - 8} more recommendations")
        print()
    
    # Quick insights
    print("🔍 QUICK INSIGHTS:")
    print("-" * 50)
    
    # TLS insights
    if 'TLS/SSL Security' in all_results and 'error' not in all_results['TLS/SSL Security']:
        tls_results = all_results['TLS/SSL Security']
        if 'certificate' in tls_results:
            cert = tls_results['certificate']
            print(f"   🔒 TLS Certificate: {cert.get('subject', 'Unknown')}")
            print(f"      Expires: {cert.get('valid_until', 'Unknown')}")
    
    # Email auth insights
    if 'Email Authentication' in all_results and 'error' not in all_results['Email Authentication']:
        email_results = all_results['Email Authentication']
        spf_status = "✅" if email_results.get('spf', {}).get('valid') else "❌"
        dkim_status = "✅" if email_results.get('dkim', {}).get('valid') else "❌"
        dmarc_status = "✅" if email_results.get('dmarc', {}).get('valid') else "❌"
        print(f"   📧 Email Auth: SPF {spf_status} | DKIM {dkim_status} | DMARC {dmarc_status}")
    
    # Port scanning insights
    if 'Internet Exposure' in all_results and 'error' not in all_results['Internet Exposure']:
        exposure_results = all_results['Internet Exposure']
        if 'open_ports' in exposure_results:
            open_count = len(exposure_results['open_ports'])
            print(f"   🔓 Open Ports: {open_count} discovered")
    
    print()
    print("🎯 " + "=" * 60)
    print("🎯   QUICK FULL SCAN COMPLETED!")
    print("🎯 " + "=" * 60)
    
    return overall_score

if __name__ == "__main__":
    try:
        score = main()
        print(f"\n✅ Final Security Score: {score}/100")
    except KeyboardInterrupt:
        print("\n⚠️  Scan interrupted by user")
    except Exception as e:
        print(f"\n❌ Scan failed: {str(e)}")
        multi_logger.log_error(
            error_type="quick_full_scan_error",
            message=f"Quick full scan of ase.md failed: {str(e)}"
        )
