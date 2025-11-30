import { useState, useEffect } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, tasksAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const createTask = async (input: CreateTaskInput) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const newTask = await tasksAPI.create(input);
      setTasks([newTask, ...tasks]);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.message || 'Failed to create task' };
    }
  };

  const updateTask = async (id: string, input: UpdateTaskInput) => {
    try {
      const updatedTask = await tasksAPI.update(id, input);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.message || 'Failed to update task' };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksAPI.delete(id);
      setTasks(tasks.filter((task) => task.id !== id));
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.message || 'Failed to delete task' };
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
