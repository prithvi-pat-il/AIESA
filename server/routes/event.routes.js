const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Settings = require('../models/Settings');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get Main Event Name (Public)
router.get('/main-event', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({ main_event_name: 'AIESA Annual Event' });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Main Event Name (Committee/Admin)
router.put('/main-event', authMiddleware, roleMiddleware(['member', 'admin']), async (req, res) => {
    try {
        const { main_event_name } = req.body;
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        settings.main_event_name = main_event_name;
        await settings.save();
        res.json({ message: 'Main event name updated', settings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Events (Public)
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Event (Committee/Admin)
router.post('/', authMiddleware, roleMiddleware(['member', 'admin']), upload.single('image'), async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const event = await Event.create({ title, description, image, date });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Event
router.put('/:id', authMiddleware, roleMiddleware(['member', 'admin']), upload.single('image'), async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (req.file) event.image = `/uploads/${req.file.filename}`;
        if (title) event.title = title;
        if (description) event.description = description; // Allow partial updates
        if (date) event.date = date;

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Event
router.delete('/:id', authMiddleware, roleMiddleware(['member', 'admin']), async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.destroy();
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
