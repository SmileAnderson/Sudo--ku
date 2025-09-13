// routes/compliance.js - Compliance data management
const express = require('express');
const { readData, writeData, updateData } = require('../middleware/dataStorage');
const router = express.Router();

// Get compliance data
router.get('/', async (req, res) => {
  try {
    const data = await readData('compliance.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance data' });
  }
});

// Update compliance check
router.put('/check', async (req, res) => {
  try {
    const { category, itemId, checked } = req.body;
    
    if (!category || !itemId || typeof checked !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const data = await readData('compliance.json');
    const checkKey = `${category}-${itemId}`;
    
    data.checks[checkKey] = checked;
    data.lastUpdated = new Date().toISOString();
    
    // Recalculate compliance score based on total possible checks
    const totalPossibleChecks = 48; // Based on your compliance checklist
    const completedChecks = Object.values(data.checks).filter(Boolean).length;
    data.score = Math.round((completedChecks / totalPossibleChecks) * 100);
    
    await writeData('compliance.json', data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update compliance check' });
  }
});

// Update compliance score based on audit results
router.put('/score', async (req, res) => {
  try {
    const { auditResults } = req.body;
    
    if (!auditResults) {
      return res.status(400).json({ error: 'Audit results required' });
    }

    let score = 75; // Base score
    
    // Deduct points based on findings
    if (auditResults.vulnerabilities?.critical > 0) score -= 20;
    if (auditResults.vulnerabilities?.high > 0) score -= 10;
    if (!auditResults.tlsCheck?.hstsEnabled) score -= 5;
    if (!auditResults.webHeaders?.csp) score -= 5;
    if (!auditResults.emailAuth?.dmarc) score -= 5;
    
    const finalScore = Math.max(0, score);
    
    const data = await updateData('compliance.json', {
      score: finalScore,
      lastScan: new Date().toLocaleString(),
      lastAuditResults: auditResults
    });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update compliance score' });
  }
});

// Export compliance report
router.get('/export', async (req, res) => {
  try {
    const data = await readData('compliance.json');
    
    const report = {
      generatedAt: new Date().toISOString(),
      complianceScore: data.score,
      totalChecks: Object.keys(data.checks).length,
      completedChecks: Object.values(data.checks).filter(Boolean).length,
      checks: data.checks,
      lastScan: data.lastScan,
      recommendations: generateRecommendations(data)
    };
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate compliance report' });
  }
});

// Generate recommendations based on compliance data
function generateRecommendations(data) {
  const recommendations = [];
  const incompleteChecks = Object.entries(data.checks)
    .filter(([key, completed]) => !completed)
    .map(([key]) => key);
  
  if (incompleteChecks.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'Compliance Gaps',
      message: `Complete ${incompleteChecks.length} remaining compliance checks`,
      items: incompleteChecks
    });
  }
  
  if (data.score < 80) {
    recommendations.push({
      priority: 'medium',
      category: 'Score Improvement',
      message: 'Focus on high-impact security measures to improve compliance score'
    });
  }
  
  return recommendations;
}

module.exports = router;