// routes/notifications.js - Notification management
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData, updateData, appendToArray } = require('../middleware/dataStorage');
const router = express.Router();

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const data = await readData('notifications.json');
    res.json(data.notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Create new notification
router.post('/', async (req, res) => {
  try {
    const { type, message, priority = 'medium' } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ error: 'Type and message are required' });
    }

    const notification = {
      id: uuidv4(),
      type,
      message,
      priority,
      timestamp: new Date().toISOString(),
      time: 'Just now',
      read: false
    };

    await appendToArray('notifications.json', 'notifications', notification);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData('notifications.json');
    
    const notificationIndex = data.notifications.findIndex(n => n.id === parseInt(id));
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    data.notifications[notificationIndex].read = true;
    await writeData('notifications.json', data);
    
    res.json(data.notifications[notificationIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const data = await readData('notifications.json');
    
    data.notifications.forEach(notification => {
      notification.read = true;
    });
    
    await writeData('notifications.json', data);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData('notifications.json');
    
    const notificationIndex = data.notifications.findIndex(n => n.id === parseInt(id));
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    data.notifications.splice(notificationIndex, 1);
    await writeData('notifications.json', data);
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get notification settings
router.get('/settings', async (req, res) => {
  try {
    const data = await readData('notifications.json');
    res.json(data.settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
});

// Update notification settings
router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;
    const data = await updateData('notifications.json', { settings });
    res.json(data.settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
});

// Get unread count
router.get('/unread-count', async (req, res) => {
  try {
    const data = await readData('notifications.json');
    const unreadCount = data.notifications.filter(n => !n.read).length;
    res.json({ count: unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

module.exports = router;