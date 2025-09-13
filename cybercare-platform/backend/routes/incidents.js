// routes/incidents.js - Incident management
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData, appendToArray } = require('../middleware/dataStorage');
const router = express.Router();

// Get all incidents
router.get('/', async (req, res) => {
  try {
    const data = await readData('incidents.json');
    res.json(data.incidents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// Create new incident
router.post('/', async (req, res) => {
  try {
    const { type, severity, category, description, impact, actions } = req.body;
    
    if (!type || !severity || !category || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newIncident = {
      id: uuidv4(),
      type,
      severity,
      category,
      description,
      impact: impact || '',
      actions: actions || '',
      status: 'open',
      timestamp: new Date().toISOString(),
      reportDate: new Date().toLocaleString(),
      submittedBy: req.body.submittedBy || 'Current User',
      updates: []
    };

    await appendToArray('incidents.json', 'incidents', newIncident);
    
    // Update statistics
    const data = await readData('incidents.json');
    data.statistics.totalIncidents = data.incidents.length;
    await writeData('incidents.json', data);

    res.status(201).json(newIncident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// Update incident
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const data = await readData('incidents.json');
    const incidentIndex = data.incidents.findIndex(incident => incident.id === id);
    
    if (incidentIndex === -1) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Add update to history
    const updateEntry = {
      timestamp: new Date().toISOString(),
      changes: updates,
      updatedBy: req.body.updatedBy || 'Current User'
    };

    data.incidents[incidentIndex] = {
      ...data.incidents[incidentIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    data.incidents[incidentIndex].updates.push(updateEntry);

    await writeData('incidents.json', data);
    res.json(data.incidents[incidentIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

// Get incident by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData('incidents.json');
    const incident = data.incidents.find(incident => incident.id === id);
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

// Delete incident
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData('incidents.json');
    const incidentIndex = data.incidents.findIndex(incident => incident.id === id);
    
    if (incidentIndex === -1) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    data.incidents.splice(incidentIndex, 1);
    data.statistics.totalIncidents = data.incidents.length;
    
    await writeData('incidents.json', data);
    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete incident' });
  }
});

// Get incident statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const data = await readData('incidents.json');
    const incidents = data.incidents;
    
    const stats = {
      totalIncidents: incidents.length,
      openIncidents: incidents.filter(i => i.status === 'open').length,
      resolvedIncidents: incidents.filter(i => i.status === 'resolved').length,
      criticalIncidents: incidents.filter(i => i.severity === 'critical').length,
      highSeverityIncidents: incidents.filter(i => i.severity === 'high').length,
      recentIncidents: incidents.filter(i => {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return new Date(i.timestamp) > dayAgo;
      }).length,
      categoryBreakdown: {}
    };

    // Calculate category breakdown
    incidents.forEach(incident => {
      if (!stats.categoryBreakdown[incident.category]) {
        stats.categoryBreakdown[incident.category] = 0;
      }
      stats.categoryBreakdown[incident.category]++;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incident statistics' });
  }
});

module.exports = router;