import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface Message {
  id: string;
  text: string;
  author: { id: string; name: string };
  createdAt: string;
}

export default function ChatPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadMessages = async () => {
    try {
      const response = await api.get(`/messages/channel/${channelId}`);
      setMessages(response.data);
    } catch {
      setError('Не удалось загрузить сообщения');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [channelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post('/messages', {
        text,
        authorId: user.id,
        channelId,
      });
      setText('');
      loadMessages();
    } catch {
      setError('Не удалось отправить сообщение');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/channels')}>
          ← Каналы
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.messagesArea}>
        {messages.length === 0 && (
          <p style={styles.emptyText}>Пока нет сообщений. Напишите первое!</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageItem}>
            <div style={styles.messageHeader}>
              <span style={styles.authorName}>{msg.author.name}</span>
              <span style={styles.timestamp}>
                {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p style={styles.messageText}>{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={styles.sendForm}>
        <input
          style={styles.input}
          type="text"
          placeholder="Написать сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" style={styles.sendButton}>
          Отправить
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid #333',
  },
  backButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    color: '#ff6b6b',
    padding: '0 24px',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  emptyText: {
    color: '#666',
  },
  messageItem: {
    backgroundColor: '#2a2a40',
    borderRadius: '8px',
    padding: '10px 14px',
    maxWidth: '70%',
  },
  messageHeader: {
    display: 'flex',
    gap: '10px',
    marginBottom: '4px',
  },
  authorName: {
    color: '#5865f2',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  timestamp: {
    color: '#666',
    fontSize: '12px',
  },
  messageText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.4,
  },
  sendForm: {
    display: 'flex',
    gap: '10px',
    padding: '16px 24px',
    borderTop: '1px solid #333',
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
  sendButton: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#5865f2',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
