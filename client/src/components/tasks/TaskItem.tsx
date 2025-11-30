import { useState } from 'react';
import { Task } from '../../lib/supabase';
import { Check, Trash2, Edit2, X, Save } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: { title?: string; description?: string; status?: 'pending' | 'completed' }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    await onUpdate(task.id, {
      status: task.status === 'pending' ? 'completed' : 'pending',
    });
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setLoading(true);
    await onUpdate(task.id, { title, description });
    setLoading(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      await onDelete(task.id);
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4 border-2 border-blue-300">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Task title"
          disabled={loading}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Task description (optional)"
          rows={3}
          disabled={loading}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading || !title.trim()}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition disabled:opacity-50"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 transition-all ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleStatus}
          disabled={loading}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
            task.status === 'completed'
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-blue-500'
          } disabled:opacity-50`}
        >
          {task.status === 'completed' && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-800 ${task.status === 'completed' ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm text-gray-600 mt-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
