import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksService } from '../services/api';
import {
  connectSocket,
  disconnectSocket,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  removeTaskListeners,
} from '../services/socket';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    loadTasks();
    connectSocket();

    onTaskCreated((task) => {
      setTasks((prev) => [...prev, task]);
    });

    onTaskUpdated((task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? task : t))
      );
    });

    onTaskDeleted((task) => {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    });

    return () => {
      disconnectSocket();
      removeTaskListeners();
    };
  }, []);

  const loadTasks = async () => {
    try {
      const response = await tasksService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await tasksService.createTask(title, description);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await tasksService.updateTask(id, { status: newStatus });
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    // ← ДОБАВЛЯЕМ ПОДТВЕРЖДЕНИЕ
    const confirmed = window.confirm('Вы уверены что хотите удалить эту задачу?');
    if (!confirmed) return;

    try {
      await tasksService.deleteTask(id);
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
    }
  };

  const handleLogout = () => {
    // ← ДОБАВЛЯЕМ ПОДТВЕРЖДЕНИЕ
    const confirmed = window.confirm('Вы уверены что хотите выйти из аккаунта?');
    if (!confirmed) return;

    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return '#999';
      case 'IN_PROGRESS':
        return '#ff9800';
      case 'DONE':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      {/* ЗАГОЛОВОК */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Мои задачи</h1>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545' }}>
          Выход
        </button>
      </div>

      {/* ФОРМА СОЗДАНИЯ */}
      <div className="card" style={{ marginBottom: '30px', padding: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Создать задачу</h2>
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Название задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ marginBottom: '15px' }}
          />
          <input
            type="text"
            placeholder="Описание (опционально)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <button type="submit" style={{ width: '100%' }}>Добавить задачу</button>
        </form>
      </div>

      {/* ФИЛЬТР */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            backgroundColor: filter === 'all' ? '#007bff' : '#ddd',
            color: filter === 'all' ? 'white' : '#333',
            padding: '10px 15px',
            fontSize: '14px',
          }}
        >
          Все ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('TODO')}
          style={{
            backgroundColor: filter === 'TODO' ? '#999' : '#ddd',
            color: filter === 'TODO' ? 'white' : '#333',
            padding: '10px 15px',
            fontSize: '14px',
          }}
        >
          TODO ({tasks.filter(t => t.status === 'TODO').length})
        </button>
        <button
          onClick={() => setFilter('IN_PROGRESS')}
          style={{
            backgroundColor: filter === 'IN_PROGRESS' ? '#ff9800' : '#ddd',
            color: filter === 'IN_PROGRESS' ? 'white' : '#333',
            padding: '10px 15px',
            fontSize: '14px',
          }}
        >
          IN_PROGRESS ({tasks.filter(t => t.status === 'IN_PROGRESS').length})
        </button>
        <button
          onClick={() => setFilter('DONE')}
          style={{
            backgroundColor: filter === 'DONE' ? '#4caf50' : '#ddd',
            color: filter === 'DONE' ? 'white' : '#333',
            padding: '10px 15px',
            fontSize: '14px',
          }}
        >
          DONE ({tasks.filter(t => t.status === 'DONE').length})
        </button>
      </div>

      {/* СПИСОК ЗАДАЧ */}
      <div>
        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '16px' }}>
            {filter === 'all' ? 'Нет задач' : `Нет задач со статусом ${filter}`}
          </p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="card" style={{ marginBottom: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '10px' }}>{task.title}</h3>
                  {task.description && (
                    <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>{task.description}</p>
                  )}
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: getStatusColor(task.status),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {task.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', fontSize: '12px' }}
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ backgroundColor: '#dc3545', padding: '6px 12px', fontSize: '12px' }}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
