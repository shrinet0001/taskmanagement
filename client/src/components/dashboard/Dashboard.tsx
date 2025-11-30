import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { TaskList } from '../tasks/TaskList';
import { LogOut, User } from 'lucide-react';
import { useState } from 'react';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreateTask = async (title: string, description: string) => {
    setActionLoading(true);
    await createTask({ title, description });
    setActionLoading(false);
  };

  const handleUpdateTask = async (
    id: string,
    updates: { title?: string; description?: string; status?: 'pending' | 'completed' }
  ) => {
    setActionLoading(true);
    await updateTask(id, updates);
    setActionLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    setActionLoading(true);
    await deleteTask(id);
    setActionLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <TaskList
          tasks={tasks}
          loading={loading || actionLoading}
          error={error}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>
    </div>
  );
}
