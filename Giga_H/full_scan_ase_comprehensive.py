#!/usr/bin/env python3
"""
Full Comprehensive Scan of ase.md using ALL scanners
====================================================

This script performs a complete cybersecurity scan of ase.md using all 8 scanner modules:
1. Internet Exposure Scanner
2. TLS/SSL Security Scanner  
3. Web Security Headers Scanner
4. Email Authentication Scanner
5. CVE Vulnerability Scanner
6. IAM Assessment Scanner
7. Backup & DR Scanner
8. Security Monitoring Scanner
"""

import asyncio
import time
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

def print_banner():
    """Print scan banner."""
    print("🎯 " + "=" * 70)
    print("🎯   COMPREHENSIVE CYBERSECURITY SCAN - ASE.MD")
    print("🎯 " + "=" * 70)
    print("🎯   Target: ase.md (Academy of Economic Studies)")
    print("🎯   Scan Type: FULL (All 8 Scanners)")
    print("🎯   Ethical: Educational/Research Purpose")
    print("🎯 " + "=" * 70)
    print()

def format_duration(seconds):
    """Format duration in human readable format."""
    if seconds < 60:
        return f"{seconds:.1f} seconds"
    elif seconds < 3600:
        minutes = seconds / 60
        return f"{minutes:.1f} minutes"
    else:
        hours = seconds / 3600
        return f"{hours:.1f} hours"

async def run_comprehensive_scan():
    """Run comprehensive scan with all scanners."""
    target = "ase.md"
    scan_id = f"comp_scan_{int(time.time())}"
    
    print_banner()
    
    # Log scan start
    multi_logger.log_scan_started(
        target=target,
        scan_id=scan_id,
        client_ip="127.0.0.1",
        scan_type="full"
    )
    
    total_start_time = time.time()
    all_results = {}
    all_problems = []
    all_recommendations = []
    scanner_timings = {}
    
    # Initialize all scanners
    scanners = [
        ("Internet Exposure", InternetExposureScanner(target)),
        ("TLS/SSL Security", TLSSecurityScanner(target)),
        ("Web Security Headers", WebSecurityScanner(target)),
        ("Email Authentication", EmailAuthScanner(target)),
        ("CVE Vulnerabilities", CVEVulnerabilityScanner(target)),
        ("IAM Assessment", IAMAssessmentScanner(target)),
        ("Backup & DR", BackupDRScanner(target)),
        ("Security Monitoring", SecurityMonitoringScanner(target))
    ]
    
    print(f"🚀 Starting comprehensive scan of {target}")
    print(f"📊 Running {len(scanners)} security scanners...")
    print()
    
    # Run each scanner
    for i, (scanner_name, scanner) in enumerate(scanners, 1):
        print(f"[{i}/{len(scanners)}] 🔍 Running {scanner_name}...")
        
        scanner_start = time.time()
        
        try:
            # Run the scan
            results = scanner.scan()
            scanner_duration = time.time() - scanner_start
            scanner_timings[scanner_name] = scanner_duration
            
            # Log scanner completion
            multi_logger.log_scan_timing(
                scan_id=scan_id,
                scanner=scanner_name.replace(" ", ""),
                duration=scanner_duration
            )
            
            # Store results
            all_results[scanner_name] = results
            
            # Extract problems and recommendations
            if 'problems' in results:
                all_problems.extend(results['problems'])
            if 'recommendations' in results:
                all_recommendations.extend(results['recommendations'])
            
            print(f"   ✅ {scanner_name} completed in {format_duration(scanner_duration)}")
            
            if 'problems' in results and results['problems']:
                print(f"      🚨 Found {len(results['problems'])} issues")
                for problem in results['problems'][:2]:  # Show first 2 problems
                    print(f"         • {problem.get('title', 'Security Issue')}")
                if len(results['problems']) > 2:
                    print(f"         • ... and {len(results['problems']) - 2} more")
            else:
                print(f"      ✅ No critical issues found")
                
        except Exception as e:
            scanner_duration = time.time() - scanner_start
            print(f"   ❌ {scanner_name} failed: {str(e)}")
            
            # Log scanner error
            multi_logger.log_scan_error(
                scan_id=scan_id,
                scanner=scanner_name.replace(" ", ""),
                target=target,
                error=str(e)
            )
            
            all_results[scanner_name] = {
                "error": str(e),
                "problems": [],
                "recommendations": []
            }
        
        print()
    
    # Calculate overall score
    print("📊 Calculating Security Score...")
    scorer = ScoringEngine()
    overall_score = scorer.calculate_overall_score(all_results)
    
    total_duration = time.time() - total_start_time
    
    # Log scan completion
    multi_logger.log_scan_completed(
        scan_id=scan_id,
        target=target,
        duration=total_duration,
        issues_found=len(all_problems)
    )
    
    # Print comprehensive results
    print("🎯 " + "=" * 70)
    print("🎯   COMPREHENSIVE SCAN RESULTS")
    print("🎯 " + "=" * 70)
    print()
    
    print(f"🎯 Target: {target}")
    print(f"⏱️  Total Duration: {format_duration(total_duration)}")
    print(f"🔢 Overall Security Score: {overall_score}/100")
    print(f"🚨 Total Issues Found: {len(all_problems)}")
    print(f"💡 Total Recommendations: {len(all_recommendations)}")
    print()
    
    # Scanner performance breakdown
    print("📈 SCANNER PERFORMANCE:")
    print("-" * 40)
    for scanner_name, duration in scanner_timings.items():
        print(f"   {scanner_name:<25} {format_duration(duration):>15}")
    print()
    
    # Security score breakdown
    print("🏆 SECURITY SCORE BREAKDOWN:")
    print("-" * 40)
    for scanner_name, results in all_results.items():
        if 'error' not in results:
            # Calculate individual scanner score (simplified)
            problems_count = len(results.get('problems', []))
            scanner_score = max(0, 100 - (problems_count * 10))  # Simple scoring
            print(f"   {scanner_name:<25} {scanner_score:>10}/100")
    print()
    
    # Top critical issues
    if all_problems:
        print("🚨 TOP CRITICAL ISSUES:")
        print("-" * 40)
        critical_issues = [p for p in all_problems if p.get('severity') in ['high', 'critical']]
        for i, problem in enumerate(critical_issues[:5], 1):
            severity = problem.get('severity', 'medium').upper()
            title = problem.get('title', 'Security Issue')
            print(f"   {i}. [{severity}] {title}")
        
        if len(critical_issues) > 5:
            print(f"   ... and {len(critical_issues) - 5} more critical issues")
        print()
    
    # Top recommendations
    if all_recommendations:
        print("💡 TOP SECURITY RECOMMENDATIONS:")
        print("-" * 40)
        high_priority = [r for r in all_recommendations if r.get('priority') == 'high']
        for i, rec in enumerate(high_priority[:5], 1):
            title = rec.get('title', 'Security Recommendation')
            print(f"   {i}. {title}")
            
        if len(high_priority) > 5:
            print(f"   ... and {len(high_priority) - 5} more recommendations")
        print()
    
    # Detailed results by scanner
    print("📋 DETAILED RESULTS BY SCANNER:")
    print("=" * 70)
    
    for scanner_name, results in all_results.items():
        print(f"\n🔍 {scanner_name.upper()}")
        print("-" * 50)
        
        if 'error' in results:
            print(f"   ❌ Scanner Error: {results['error']}")
            continue
            
        # Scanner-specific details
        if scanner_name == "Internet Exposure":
            if 'open_ports' in results:
                ports = results['open_ports']
                print(f"   🔓 Open Ports: {len(ports)} found")
                for port_info in ports[:3]:
                    print(f"      • Port {port_info.get('port')}: {port_info.get('service', 'Unknown')}")
                    
        elif scanner_name == "TLS/SSL Security":
            if 'certificate' in results:
                cert = results['certificate']
                print(f"   🔒 Certificate: {cert.get('subject', 'Unknown')}")
                print(f"   📅 Expires: {cert.get('valid_until', 'Unknown')}")
                
        elif scanner_name == "Web Security Headers":
            if 'headers' in results:
                headers = results['headers']
                missing = [h for h, present in headers.items() if not present]
                print(f"   🛡️  Security Headers: {len(headers) - len(missing)}/{len(headers)} present")
                if missing:
                    print(f"   ❌ Missing: {', '.join(missing[:3])}")
                    
        elif scanner_name == "Email Authentication":
            if 'spf' in results:
                spf = "✅" if results['spf'].get('valid') else "❌"
                dkim = "✅" if results.get('dkim', {}).get('valid') else "❌"
                dmarc = "✅" if results.get('dmarc', {}).get('valid') else "❌"
                print(f"   📧 SPF: {spf} | DKIM: {dkim} | DMARC: {dmarc}")
        
        # Show problems for this scanner
        scanner_problems = results.get('problems', [])
        if scanner_problems:
            print(f"   🚨 Issues: {len(scanner_problems)}")
            for problem in scanner_problems[:2]:
                print(f"      • {problem.get('title', 'Issue')}")
        else:
            print(f"   ✅ No issues found")
    
    print("\n🎯 " + "=" * 70)
    print("🎯   SCAN COMPLETED SUCCESSFULLY!")
    print("🎯 " + "=" * 70)
    
    return {
        'target': target,
        'scan_id': scan_id,
        'overall_score': overall_score,
        'total_duration': total_duration,
        'total_issues': len(all_problems),
        'total_recommendations': len(all_recommendations),
        'scanner_results': all_results,
        'scanner_timings': scanner_timings
    }

def main():
    """Main function."""
    print("🚀 Initializing Comprehensive Security Scanner...")
    print("📋 Preparing to scan ase.md with all 8 security modules")
    print()
    
    try:
        # Run the comprehensive scan
        results = asyncio.run(run_comprehensive_scan())
        
        print(f"\n✅ Comprehensive scan completed successfully!")
        print(f"📊 Final Score: {results['overall_score']}/100")
        print(f"⏱️  Total Time: {format_duration(results['total_duration'])}")
        
    except KeyboardInterrupt:
        print("\n⚠️  Scan interrupted by user")
    except Exception as e:
        print(f"\n❌ Scan failed: {str(e)}")
        multi_logger.log_error(
            error_type="comprehensive_scan_error",
            message=f"Full scan of ase.md failed: {str(e)}"
        )

if __name__ == "__main__":
    main()
