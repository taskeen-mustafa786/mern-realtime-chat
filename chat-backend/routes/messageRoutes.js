const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Save message
router.post("/", async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    const newMsg = await Message.create({ sender, receiver, message });
    res.status(201).json(newMsg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages between two users
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
