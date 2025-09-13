// middleware/dataStorage.js - JSON file data persistence
const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.ensureDir(DATA_DIR);
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
};

// Initialize default data files
const initializeDataFiles = async (req, res, next) => {
  try {
    await ensureDataDir();

    const dataFiles = {
      'compliance.json': {
        score: 75,
        checks: {},
        lastScan: null,
        history: []
      },
      'training.json': {
        completedModules: [],
        currentScore: 0,
        streak: 0,
        badges: [],
        progress: {},
        leaderboard: [
          { name: 'Alexandru Popescu', department: 'IT Security', points: 1250, position: 1 },
          { name: 'Maria Ionescu', department: 'Finance', points: 980, position: 2 },
          { name: 'Dmitri Petrov', department: 'Operations', points: 720, position: 4 },
          { name: 'Ana Muresan', department: 'HR', points: 650, position: 5 }
        ]
      },
      'incidents.json': {
        incidents: [],
        templates: {},
        statistics: {
          totalIncidents: 0,
          resolvedIncidents: 0,
          averageResolutionTime: 0
        }
      },
      'audit-results.json': {
        results: [],
        currentScan: null,
        scanHistory: [],
        riskAssessments: []
      },
      'notifications.json': {
        notifications: [
          { 
            id: 1, 
            type: 'warning', 
            message: 'Password policy review due in 7 days', 
            time: '2 hours ago',
            timestamp: new Date().toISOString(),
            read: false
          },
          { 
            id: 2, 
            type: 'info', 
            message: 'New cybersecurity training module available', 
            time: '1 day ago',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            read: false
          },
          { 
            id: 3, 
            type: 'critical', 
            message: '2 high-priority vulnerabilities detected', 
            time: '3 days ago',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            read: false
          }
        ],
        settings: {
          emailNotifications: true,
          pushNotifications: true,
          weeklyReports: true
        }
      }
    };

    // Create data files if they don't exist
    for (const [filename, defaultData] of Object.entries(dataFiles)) {
      const filePath = path.join(DATA_DIR, filename);
      const exists = await fs.pathExists(filePath);
      
      if (!exists) {
        await fs.writeJson(filePath, defaultData, { spaces: 2 });
        console.log(`Created default data file: ${filename}`);
      }
    }

    next();
  } catch (error) {
    console.error('Failed to initialize data files:', error);
    next(error);
  }
};

// Read data from JSON file
const readData = async (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readJson(filePath);
    return data;
  } catch (error) {
    console.error(`Failed to read ${filename}:`, error);
    throw error;
  }
};

// Write data to JSON file
const writeData = async (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeJson(filePath, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Failed to write ${filename}:`, error);
    throw error;
  }
};

// Update specific fields in data file
const updateData = async (filename, updates) => {
  try {
    const currentData = await readData(filename);
    const updatedData = { ...currentData, ...updates };
    await writeData(filename, updatedData);
    return updatedData;
  } catch (error) {
    console.error(`Failed to update ${filename}:`, error);
    throw error;
  }
};

// Append to array in data file
const appendToArray = async (filename, arrayKey, newItem) => {
  try {
    const currentData = await readData(filename);
    if (!Array.isArray(currentData[arrayKey])) {
      currentData[arrayKey] = [];
    }
    currentData[arrayKey].push(newItem);
    await writeData(filename, currentData);
    return currentData;
  } catch (error) {
    console.error(`Failed to append to ${filename}:`, error);
    throw error;
  }
};

module.exports = {
  initializeDataFiles,
  readData,
  writeData,
  updateData,
  appendToArray,
  DATA_DIR
};