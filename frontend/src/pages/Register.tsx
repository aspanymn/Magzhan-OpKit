import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.register(email, password);
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <div className="card" style={{ padding: '40px' }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Регистрация</h1>
        {error && <p style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleRegister}>
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
            Зарегистрироваться
          </button>
        </form>
        <p style={{ marginTop: '30px', textAlign: 'center' }}>
          Уже есть аккаунт?{' '}
          <a href="/login" style={{ color: '#007bff' }}>
            Войти
          </a>
        </p>
      </div>
    </div>
  );
}
