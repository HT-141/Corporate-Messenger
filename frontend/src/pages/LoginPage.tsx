import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegisterMode) {
        await api.post('/users', { email, password, name });
        setIsRegisterMode(false);
        setError('Регистрация успешна! Теперь войдите.');
      } else {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/channels');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Произошла ошибка');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Corporate Messenger</h1>
        <h2 style={styles.subtitle}>{isRegisterMode ? 'Регистрация' : 'Вход'}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegisterMode && (
            <input
              style={styles.input}
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <p style={styles.switchText}>
          {isRegisterMode ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
          <span
            style={styles.switchLink}
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
          >
            {isRegisterMode ? 'Войти' : 'Зарегистрироваться'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1e1e2f',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#2a2a40',
    padding: '40px',
    borderRadius: '12px',
    width: '350px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '22px',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: '16px',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#5865f2',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '13px',
    textAlign: 'center',
    margin: 0,
  },
  switchText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '13px',
  },
  switchLink: {
    color: '#5865f2',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
