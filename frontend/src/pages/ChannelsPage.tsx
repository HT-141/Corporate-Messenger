import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface Channel {
  id: string;
  name: string;
  description?: string;
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannelName, setNewChannelName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadChannels = async () => {
    try {
      const response = await api.get('/channels');
      setChannels(response.data);
    } catch {
      setError('Не удалось загрузить каналы');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    loadChannels();
  }, []);

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      await api.post('/channels', { name: newChannelName });
      setNewChannelName('');
      loadChannels();
    } catch {
      setError('Не удалось создать канал');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Каналы</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user.name}</span>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>

      <form onSubmit={handleCreateChannel} style={styles.createForm}>
        <input
          style={styles.input}
          type="text"
          placeholder="Название нового канала"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
        />
        <button type="submit" style={styles.createButton}>
          Создать канал
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.channelList}>
        {channels.length === 0 && (
          <p style={styles.emptyText}>Пока нет каналов. Создайте первый!</p>
        )}
        {channels.map((channel) => (
          <div
            key={channel.id}
            style={styles.channelItem}
            onClick={() => navigate(`/channels/${channel.id}`)}
          >
            <span style={styles.channelHash}>#</span>
            <span style={styles.channelName}>{channel.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '30px 40px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '26px',
    margin: 0,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    color: '#aaa',
  },
  logoutButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer',
  },
  createForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#2a2a40',
    color: '#fff',
    fontSize: '14px',
  },
  createButton: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#5865f2',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: '#ff6b6b',
    marginBottom: '16px',
  },
  channelList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emptyText: {
    color: '#666',
  },
  channelItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    backgroundColor: '#2a2a40',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  channelHash: {
    color: '#5865f2',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  channelName: {
    fontSize: '16px',
  },
};
