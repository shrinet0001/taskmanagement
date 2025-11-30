import { useState } from 'react';
import { Task } from '../../lib/supabase';
import { TaskItem } from './TaskItem';
import { CreateTaskForm } from './CreateTaskForm';
import { Plus, ListTodo, Loader2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onCreateTask: (title: string, description: string) => Promise<void>;
  onUpdateTask: (id: string, updates: { title?: string; description?: string; status?: 'pending' | 'completed' }) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
}

export function TaskList({ tasks, loading, error, onCreateTask, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ListTodo className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          New Task
        </button>
      </div>

      {showCreateForm && (
        <CreateTaskForm
          onSubmit={async (title, description) => {
            await onCreateTask(title, description);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tasks yet</p>
          <p className="text-gray-400 mt-2">Create your first task to get started!</p>
        </div>
      ) : (
        <>
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Pending ({pendingTasks.length})
              </h3>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
