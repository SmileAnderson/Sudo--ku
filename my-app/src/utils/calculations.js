import { SCORING } from './constants.js';

/**
 * Calculate overall risk score based on audit results
 * @param {Object} auditResults - Results from security audit
 * @returns {number} Risk score from 0-10 (10 being highest risk)
 */
export const calculateRiskScore = (auditResults) => {
  if (!auditResults) return 0;

  let totalRisk = 0;
  let componentCount = 0;

  // Network security component
  if (auditResults.networkScan) {
    totalRisk += calculateNetworkRisk(auditResults.networkScan);
    componentCount++;
  }

  // Vulnerability component
  if (auditResults.vulnerabilities) {
    totalRisk += calculateVulnerabilityRisk(auditResults.vulnerabilities);
    componentCount++;
  }

  // Access control component
  if (auditResults.accessControls) {
    totalRisk += calculateAccessControlRisk(auditResults.accessControls);
    componentCount++;
  }

  // Monitoring component
  if (auditResults.monitoring) {
    totalRisk += calculateMonitoringRisk(auditResults.monitoring);
    componentCount++;
  }

  // Web security component
  if (auditResults.webHeaders && auditResults.tlsCheck) {
    totalRisk += calculateWebSecurityRisk(auditResults.webHeaders, auditResults.tlsCheck);
    componentCount++;
  }

  // Email security component
  if (auditResults.emailAuth) {
    totalRisk += calculateEmailSecurityRisk(auditResults.emailAuth);
    componentCount++;
  }

  // Calculate average risk and scale to 0-10
  const averageRisk = componentCount > 0 ? totalRisk / componentCount : 0;
  return Math.min(Math.round(averageRisk * 100) / 100, 10);
};

/**
 * Calculate network security risk (0-4 scale)
 */
const calculateNetworkRisk = (networkScan) => {
  let risk = 0;
  
  // Vulnerable ports (high impact)
  if (networkScan.vulnerablePorts && networkScan.vulnerablePorts.length > 0) {
    risk += Math.min(networkScan.vulnerablePorts.length * 0.8, 2);
  }
  
  // Firewall status
  if (!networkScan.firewall || !networkScan.firewall.enabled) {
    risk += 1.5;
  } else if (!networkScan.firewall.configured) {
    risk += 0.8;
  }
  
  // Network segmentation
  if (!networkScan.segmentation || !networkScan.segmentation.implemented) {
    risk += 0.7;
  }
  
  return Math.min(risk, 4);
};

/**
 * Calculate vulnerability risk (0-4 scale)
 */
const calculateVulnerabilityRisk = (vulnerabilities) => {
  let risk = 0;
  
  // Weight vulnerabilities by severity
  const critical = vulnerabilities.critical || 0;
  const high = vulnerabilities.high || 0;
  const medium = vulnerabilities.medium || 0;
  const low = vulnerabilities.low || 0;
  
  risk += critical * 1.0;    // Critical = 1.0 each
  risk += high * 0.6;       // High = 0.6 each
  risk += medium * 0.3;     // Medium = 0.3 each
  risk += low * 0.1;        // Low = 0.1 each
  
  return Math.min(risk, 4);
};

/**
 * Calculate access control risk (0-4 scale)
 */
const calculateAccessControlRisk = (accessControls) => {
  let risk = 0;
  
  // Multi-factor authentication
  if (!accessControls.mfa || !accessControls.mfa.enabled) {
    risk += 1.5;
  } else {
    const coverage = accessControls.mfa.coverage || 0;
    if (coverage < 100) {
      risk += (100 - coverage) / 100; // Linear scale based on coverage
    }
  }
  
  // Password policy
  if (!accessControls.passwordPolicy || !accessControls.passwordPolicy.enforced) {
    risk += 1.0;
  } else {
    const policy = accessControls.passwordPolicy;
    if (!policy.minLength || policy.minLength < 12) {
      risk += 0.3;
    }
    if (!policy.complexity) {
      risk += 0.3;
    }
    if (!policy.rotation || policy.rotation > 90) {
      risk += 0.2;
    }
  }
  
  // Privileged access management
  if (!accessControls.privilegedAccess || !accessControls.privilegedAccess.managed) {
    risk += 0.8;
  }
  
  // Access review timing
  if (accessControls.accessReview && accessControls.accessReview.lastReview) {
    try {
      const lastReview = new Date(accessControls.accessReview.lastReview);
      const daysSinceReview = (Date.now() - lastReview.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceReview > 90) {
        risk += 0.4;
      }
    } catch (e) {
      risk += 0.4; // Invalid date format
    }
  } else {
    risk += 0.4; // No access review data
  }
  
  return Math.min(risk, 4);
};

/**
 * Calculate monitoring risk (0-4 scale)
 */
const calculateMonitoringRisk = (monitoring) => {
  let risk = 0;
  
  // SIEM deployment (critical component)
  if (!monitoring.siem || !monitoring.siem.deployed) {
    risk += 1.5;
  }
  
  // Log management
  if (!monitoring.logging || !monitoring.logging.centralized) {
    risk += 1.0;
  } else {
    const coverage = monitoring.logging.coverage || 0;
    if (coverage < 80) {
      risk += 0.5;
    }
  }
  
  // Real-time monitoring
  if (!monitoring.realTimeMonitoring || !monitoring.realTimeMonitoring.enabled) {
    risk += 0.8;
  } else {
    const coverage = monitoring.realTimeMonitoring.coverage || 0;
    if (coverage < 80) {
      risk += 0.3;
    }
  }
  
  // Automated threat detection
  if (!monitoring.threatDetection || !monitoring.threatDetection.automated) {
    risk += 0.7;
  }
  
  return Math.min(risk, 4);
};

/**
 * Calculate web security risk (0-2 scale)
 */
const calculateWebSecurityRisk = (webHeaders, tlsCheck) => {
  let risk = 0;
  
  // Security headers assessment
  if (!webHeaders.csp) risk += 0.4;
  if (!webHeaders.xFrameOptions) risk += 0.3;
  if (!webHeaders.strictTransportSecurity) risk += 0.3;
  if (!webHeaders.contentTypeOptions) risk += 0.2;
  
  // TLS configuration assessment
  if (!tlsCheck.hstsEnabled) risk += 0.3;
  if (tlsCheck.weakCiphers && Array.isArray(tlsCheck.weakCiphers) && tlsCheck.weakCiphers.length > 0) {
    risk += Math.min(tlsCheck.weakCiphers.length * 0.2, 0.5);
  }
  
  return Math.min(risk, 2);
};

/**
 * Calculate email security risk (0-2 scale)
 */
const calculateEmailSecurityRisk = (emailAuth) => {
  let risk = 0;
  
  if (!emailAuth.spf) risk += 0.4;
  if (!emailAuth.dkim) risk += 0.4;
  if (!emailAuth.dmarc) risk += 0.8; // DMARC is most important
  
  return Math.min(risk, 2);
};

/**
 * Calculate compliance score based on completed checks
 */
export const calculateComplianceScore = (completedChecks, totalChecks) => {
  if (!completedChecks || !totalChecks || totalChecks === 0) return 0;
  
  const completedCount = Object.values(completedChecks).filter(Boolean).length;
  return Math.round((completedCount / totalChecks) * 100);
};

/**
 * Calculate weighted compliance score (required items have higher weight)
 */
export const calculateWeightedComplianceScore = (completedChecks, checklistData) => {
  if (!completedChecks || !checklistData) return 0;
  
  let totalWeight = 0;
  let completedWeight = 0;
  
  Object.entries(checklistData).forEach(([categoryKey, category]) => {
    if (category && category.items && Array.isArray(category.items)) {
      category.items.forEach(item => {
        const weight = item.required ? 2 : 1;
        const checkKey = `${categoryKey}-${item.id}`;
        
        totalWeight += weight;
        if (completedChecks[checkKey]) {
          completedWeight += weight;
        }
      });
    }
  });
  
  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

/**
 * Calculate training progress
 */
export const calculateTrainingProgress = (completedModules, totalModules) => {
  if (!totalModules || totalModules === 0) return 0;
  return Math.round((completedModules / totalModules) * 100);
};

/**
 * Calculate overall security maturity score
 */
export const calculateSecurityMaturity = (metrics) => {
  const {
    complianceScore = 0,
    riskScore = 10,
    trainingProgress = 0,
    auditFrequency = 0,
    incidentCount = 0
  } = metrics;
  
  // Calculate components (0-100 scale)
  const complianceComponent = Math.max(0, Math.min(100, complianceScore));
  const riskComponent = Math.max(0, Math.min(100, 100 - (riskScore * 10)));
  const trainingComponent = Math.max(0, Math.min(100, trainingProgress));
  const auditComponent = Math.max(0, Math.min(100, auditFrequency * 25));
  const incidentComponent = Math.max(0, Math.min(100, 100 - (incidentCount * 20)));
  
  // Weighted calculation
  const weights = {
    compliance: 0.3,
    risk: 0.25,
    training: 0.2,
    audit: 0.15,
    incident: 0.1
  };
  
  const overallScore = Math.round(
    complianceComponent * weights.compliance +
    riskComponent * weights.risk +
    trainingComponent * weights.training +
    auditComponent * weights.audit +
    incidentComponent * weights.incident
  );
  
  // Determine maturity level
  let maturityLevel = 'Initial';
  const recommendations = [];
  
  if (overallScore >= 90) {
    maturityLevel = 'Advanced';
    recommendations.push('Maintain current security posture');
    recommendations.push('Consider advanced threat hunting capabilities');
  } else if (overallScore >= 70) {
    maturityLevel = 'Developing';
    recommendations.push('Focus on automation and process improvement');
    recommendations.push('Expand security monitoring capabilities');
  } else if (overallScore >= 50) {
    maturityLevel = 'Basic';
    recommendations.push('Implement fundamental security controls');
    recommendations.push('Increase employee training frequency');
  } else {
    maturityLevel = 'Initial';
    recommendations.push('Establish basic cybersecurity framework');
    recommendations.push('Conduct comprehensive risk assessment');
    recommendations.push('Implement essential security controls immediately');
  }
  
  return {
    overallScore,
    maturityLevel,
    components: {
      compliance: Math.round(complianceComponent),
      risk: Math.round(riskComponent),
      training: Math.round(trainingComponent),
      audit: Math.round(auditComponent),
      incident: Math.round(incidentComponent)
    },
    recommendations
  };
};

/**
 * Calculate time to compliance
 */
export const calculateTimeToCompliance = (currentScore, targetScore = 80, weeklyProgress = 5) => {
  if (currentScore >= targetScore) {
    return {
      weeks: 0,
      months: 0,
      status: 'achieved'
    };
  }
  
  const remainingPoints = Math.max(0, targetScore - currentScore);
  const estimatedWeeks = weeklyProgress > 0 ? Math.ceil(remainingPoints / weeklyProgress) : 0;
  const estimatedMonths = Math.round(estimatedWeeks / 4.33);
  
  return {
    weeks: estimatedWeeks,
    months: estimatedMonths,
    status: 'in-progress',
    remainingPoints
  };
};

/**
 * Calculate security ROI
 */
export const calculateSecurityROI = (investmentCost, riskReduction, potentialLoss, incidentProbability) => {
  if (investmentCost <= 0 || riskReduction < 0 || potentialLoss < 0 || incidentProbability < 0) {
    return {
      roi: 0,
      netBenefit: 0,
      avoidedLoss: 0,
      paybackPeriod: null
    };
  }
  
  const riskReductionDecimal = Math.min(riskReduction / 100, 1);
  const adjustedProbability = Math.min(incidentProbability, 1);
  
  const expectedLossWithoutInvestment = potentialLoss * adjustedProbability;
  const expectedLossWithInvestment = potentialLoss * adjustedProbability * (1 - riskReductionDecimal);
  const avoidedLoss = expectedLossWithoutInvestment - expectedLossWithInvestment;
  const netBenefit = avoidedLoss - investmentCost;
  const roi = (netBenefit / investmentCost) * 100;
  const paybackPeriod = roi > 0 ? Math.round(12 / (roi / 100)) : null;
  
  return {
    roi: Math.round(roi),
    netBenefit: Math.round(netBenefit),
    avoidedLoss: Math.round(avoidedLoss),
    paybackPeriod
  };
};