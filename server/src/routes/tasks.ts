import express from 'express';
import { body } from 'express-validator';
import { Task } from '../models/Task.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all tasks for the current user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const tasks = await Task.find({ user_id: req.userId }).sort({ createdAt: -1 });
    
    // Format response to match frontend expectations
    const formattedTasks = tasks.map(task => ({
      id: task._id,
      user_id: task.user_id,
      title: task.title,
      description: task.description,
      status: task.status,
      created_at: task.createdAt,
      updated_at: task.updatedAt,
    }));
    
    res.json(formattedTasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post(
  '/',
  [
    body('title').trim().notEmpty(),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'completed']),
  ],
  async (req: AuthRequest, res) => {
    try {
      const { title, description, status } = req.body;

      const task = await Task.create({
        user_id: req.userId,
        title,
        description: description || '',
        status: status || 'pending',
      });

      res.status(201).json({
        id: task._id,
        user_id: task.user_id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.createdAt,
        updated_at: task.updatedAt,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update a task
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'completed']),
  ],
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const task = await Task.findOneAndUpdate(
        { _id: id, user_id: req.userId },
        updates,
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json({
        id: task._id,
        user_id: task.user_id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.createdAt,
        updated_at: task.updatedAt,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete a task
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user_id: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
