// const express = require('express');
// const Chat = require('../models/Chat');
// const { auth } = require('../middlewares/auth');

// const router = express.Router();

// // Get chat messages between users
// router.get('/:userId', auth, async (req, res) => {
//   try {
//     const messages = await Chat.find({
//       $or: [
//         { sender: req.user._id, receiver: req.params.userId },
//         { sender: req.params.userId, receiver: req.user._id }
//       ]
//     })
//     .populate('sender', 'name role')
//     .populate('receiver', 'name role')
//     .sort({ timestamp: 1 });

//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Send message
// router.post('/', auth, async (req, res) => {
//   try {
//     const { receiver, message } = req.body;

//     const chat = new Chat({
//       sender: req.user._id,
//       receiver,
//       message
//     });

//     await chat.save();
//     await chat.populate('sender', 'name role');
//     await chat.populate('receiver', 'name role');

//     res.status(201).json(chat);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Mark messages as read
// router.put('/read/:senderId', auth, async (req, res) => {
//   try {
//     await Chat.updateMany(
//       {
//         sender: req.params.senderId,
//         receiver: req.user._id,
//         read: false
//       },
//       { read: true }
//     );

//     res.json({ message: 'Messages marked as read' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Get chat messages between users
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name role employeeId')
    .populate('receiver', 'name role employeeId')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiver, message, messageType = 'text', fileUrl } = req.body;

    const chat = new Chat({
      sender: req.user._id,
      receiver,
      message,
      messageType,
      fileUrl,
      roomId: `${req.user._id}_${receiver}`.split('_').sort().join('_')
    });

    await chat.save();
    await chat.populate('sender', 'name role employeeId');
    await chat.populate('receiver', 'name role employeeId');

    res.status(201).json(chat);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:senderId', auth, async (req, res) => {
  try {
    await Chat.updateMany(
      {
        sender: req.params.senderId,
        receiver: req.user._id,
        read: false
      },
      { 
        read: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversations list
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiver', req.user._id] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user.password': 0,
          'user.__v': 0
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;