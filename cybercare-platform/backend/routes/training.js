// routes/training.js - Training data management
const express = require('express');
const { readData, writeData, updateData } = require('../middleware/dataStorage');
const router = express.Router();

// Get training data
router.get('/', async (req, res) => {
  try {
    const data = await readData('training.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch training data' });
  }
});

// Complete a training module
router.post('/complete', async (req, res) => {
  try {
    const { moduleId, score, answers } = req.body;
    
    if (!moduleId || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const data = await readData('training.json');
    
    // Check if module already completed
    if (data.completedModules.includes(moduleId)) {
      return res.status(400).json({ error: 'Module already completed' });
    }
    
    // Add to completed modules
    data.completedModules.push(moduleId);
    
    // Update score and streak
    data.currentScore += score * 20;
    data.streak += 1;
    
    // Add badge if perfect score
    if (score === answers?.length) {
      data.badges.push(moduleId);
    }
    
    // Store completion details
    data.progress[moduleId] = {
      completedAt: new Date().toISOString(),
      score,
      answers,
      attempts: 1
    };
    
    await writeData('training.json', data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete training module' });
  }
});

// Update leaderboard position
router.put('/leaderboard', async (req, res) => {
  try {
    const { userScore } = req.body;
    
    if (typeof userScore !== 'number') {
      return res.status(400).json({ error: 'Invalid score' });
    }

    const data = await readData('training.json');
    
    // Update user's position in leaderboard
    const userEntry = data.leaderboard.find(entry => entry.name === 'You');
    if (userEntry) {
      userEntry.points = userScore;
    } else {
      data.leaderboard.push({
        name: 'You',
        department: 'Your Department',
        points: userScore,
        position: 0
      });
    }
    
    // Recalculate positions
    data.leaderboard.sort((a, b) => b.points - a.points);
    data.leaderboard.forEach((entry, index) => {
      entry.position = index + 1;
    });
    
    await writeData('training.json', data);
    res.json(data.leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leaderboard' });
  }
});

// Get available training modules
router.get('/modules', async (req, res) => {
  try {
    const modules = [
      {
        id: 'phishing',
        title: 'Advanced Threat Recognition',
        description: 'Comprehensive analysis of phishing techniques and defensive strategies',
        level: 'Foundation',
        duration: '25 min',
        credits: '2.5 CEU',
        category: 'Email Security'
      },
      {
        id: 'passwords',
        title: 'Enterprise Identity Management',
        description: 'Authentication protocols, password policies, and access controls',
        level: 'Foundation',
        duration: '20 min',
        credits: '2.0 CEU',
        category: 'Access Control'
      },
      {
        id: 'social-engineering',
        title: 'Human Factor Security',
        description: 'Psychological manipulation tactics and organizational defenses',
        level: 'Intermediate',
        duration: '35 min',
        credits: '3.5 CEU',
        category: 'Risk Management'
      },
      {
        id: 'malware',
        title: 'Malware Analysis & Prevention',
        description: 'Modern malware families, attack vectors, and mitigation strategies',
        level: 'Intermediate',
        duration: '30 min',
        credits: '3.0 CEU',
        category: 'Threat Analysis'
      },
      {
        id: 'data-protection',
        title: 'Data Governance & Compliance',
        description: 'Privacy frameworks, data classification, and regulatory requirements',
        level: 'Advanced',
        duration: '45 min',
        credits: '4.5 CEU',
        category: 'Compliance'
      },
      {
        id: 'incident-response',
        title: 'Crisis Management & Response',
        description: 'Incident handling procedures, forensics, and business continuity',
        level: 'Advanced',
        duration: '50 min',
        credits: '5.0 CEU',
        category: 'Operations'
      }
    ];
    
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch training modules' });
  }
});

// Get training questions for a module
router.get('/questions/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    const questions = {
      phishing: [
        {
          question: "You receive an urgent email from your 'bank' asking you to verify your account. What should you do?",
          options: [
            "Click the link immediately to secure your account",
            "Call your bank directly using their official number",
            "Forward the email to your IT department",
            "Reply with your account details"
          ],
          correct: 1,
          explanation: "Always verify requests independently through official channels."
        },
        {
          question: "Which of these is a red flag in a phishing email?",
          options: [
            "Proper company logo",
            "Urgent language with threats",
            "Your correct name in greeting",
            "Professional formatting"
          ],
          correct: 1,
          explanation: "Phishing emails often use urgency and threats to pressure quick action."
        }
      ],
      passwords: [
        {
          question: "What makes a password strong?",
          options: [
            "Using your birthday",
            "12+ characters with mixed types",
            "Your pet's name",
            "Simple words"
          ],
          correct: 1,
          explanation: "Strong passwords are long and use uppercase, lowercase, numbers, and symbols."
        }
      ]
    };
    
    if (!questions[moduleId]) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    res.json(questions[moduleId]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch training questions' });
  }
});

module.exports = router;