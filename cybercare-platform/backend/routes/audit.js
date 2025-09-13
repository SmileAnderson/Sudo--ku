// routes/audit.js - Security audit management
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData, updateData, appendToArray } = require('../middleware/dataStorage');
const router = express.Router();

// Start a new security audit
router.post('/start', async (req, res) => {
  try {
    const { target } = req.body;
    
    if (!target) {
      return res.status(400).json({ error: 'Target is required' });
    }

    const auditId = uuidv4();
    const audit = {
      id: auditId,
      target,
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      results: null
    };

    // Store the audit
    await updateData('audit-results.json', { currentScan: audit });

    // Simulate audit process (replace with real scanning service)
    setTimeout(async () => {
      const mockResults = {
        networkScan: {
          openPorts: [22, 80, 443, 8080],
          vulnerablePorts: [8080],
          status: 'warning'
        },
        tlsCheck: {
          version: 'TLS 1.3',
          certificateValid: true,
          hstsEnabled: false,
          status: 'warning'
        },
        webHeaders: {
          https: true,
          csp: false,
          xFrameOptions: true,
          status: 'warning'
        },
        emailAuth: {
          spf: true,
          dkim: true,
          dmarc: false,
          status: 'warning'
        },
        vulnerabilities: {
          critical: 0,
          high: 2,
          medium: 5,
          low: 8,
          status: 'warning'
        },
        riskScore: 6.7
      };

      const completedAudit = {
        ...audit,
        status: 'completed',
        progress: 100,
        endTime: new Date().toISOString(),
        results: mockResults
      };

      // Update current scan and add to history
      const data = await readData('audit-results.json');
      data.currentScan = completedAudit;
      data.scanHistory.unshift(completedAudit);
      
      // Keep only last 10 scans
      if (data.scanHistory.length > 10) {
        data.scanHistory = data.scanHistory.slice(0, 10);
      }

      await writeData('audit-results.json', data);
    }, 3000);

    res.json({ auditId, message: 'Audit started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start audit' });
  }
});

// Get current audit status
router.get('/status', async (req, res) => {
  try {
    const data = await readData('audit-results.json');
    const currentScan = data.currentScan;
    
    if (!currentScan) {
      return res.status(404).json({ error: 'No active audit found' });
    }

    res.json(currentScan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get audit status' });
  }
});

// Get a specific audit result by ID
router.get('/results/:auditId', async (req, res) => {
  try {
    const { auditId } = req.params;
    const data = await readData('audit-results.json');
    
    // Get specific audit by ID
    const audit = data.scanHistory.find(scan => scan.id === auditId) || data.currentScan;
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get audit results' });
  }
});

// Get the latest audit results (no ID provided)
router.get('/results', async (req, res) => {
  try {
    const data = await readData('audit-results.json');
    
    // Get latest audit results
    const latestAudit = data.currentScan || data.scanHistory[0];
    if (!latestAudit) {
      return res.status(404).json({ error: 'No audit results found' });
    }
    res.json(latestAudit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get audit results' });
  }
});

// Get audit history
router.get('/history', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const data = await readData('audit-results.json');
    
    const history = data.scanHistory.slice(0, parseInt(limit));
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get audit history' });
  }
});

// Generate risk assessment
router.post('/risk-assessment', async (req, res) => {
  try {
    const { auditResults } = req.body;
    
    if (!auditResults) {
      return res.status(400).json({ error: 'Audit results required' });
    }

    const risks = [
      {
        id: 1,
        category: 'Network Security',
        risk: 'Vulnerable port 8080 exposed',
        severity: 'High',
        impact: 'Unauthorized access to internal systems',
        likelihood: 'Medium',
        recommendation: 'Close port 8080 or implement proper access controls'
      },
      {
        id: 2,
        category: 'Web Security',
        risk: 'Missing Content Security Policy',
        severity: 'Medium',
        impact: 'XSS attack vulnerability',
        likelihood: 'Low',
        recommendation: 'Implement CSP headers on all web applications'
      },
      {
        id: 3,
        category: 'Email Security',
        risk: 'DMARC policy not configured',
        severity: 'Medium',
        impact: 'Email spoofing and phishing attacks',
        likelihood: 'Medium',
        recommendation: 'Configure DMARC policy with monitoring'
      }
    ];

    // Store risk assessment
    const data = await readData('audit-results.json');
    data.riskAssessments.unshift({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      risks,
      auditId: auditResults.id
    });
    
    // Keep only last 10 assessments
    if (data.riskAssessments.length > 10) {
      data.riskAssessments = data.riskAssessments.slice(0, 10);
    }
    
    await writeData('audit-results.json', data);
    res.json(risks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate risk assessment' });
  }
});

module.exports = router;