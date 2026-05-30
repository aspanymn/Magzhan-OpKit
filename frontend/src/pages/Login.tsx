import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <div className="card" style={{ padding: '40px' }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Вход</h1>
        {error && <p style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '20px' }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '30px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '15px' }}>
            Войти
          </button>
        </form>
        <p style={{ marginTop: '30px', textAlign: 'center' }}>
          Нет аккаунта?{' '}
          <a href="/register" style={{ color: '#007bff' }}>
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
}
