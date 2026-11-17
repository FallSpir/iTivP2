import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isAuth, login }     = useAuth();
  const navigate              = useNavigate();
  const location              = useLocation();
  const from                  = location.state?.from?.pathname || '/dashboard';

  const [form,     setForm]   = useState({ username: '', password: '' });
  const [errors,   setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading] = useState(false);

  if (isAuth) return <Navigate to="/dashboard" replace />;

  function validate() {
    const e = {};
    const u = form.username.trim();
    const p = form.password;
    if (!u)           e.username = 'Введите имя пользователя.';
    else if (u.length > 50) e.username = 'Не более 50 символов.';
    if (!p)           e.password = 'Введите пароль.';
    else if (p.length > 100) e.password = 'Слишком длинный пароль.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    // Имитация проверки: admin / admin123
    await new Promise(r => setTimeout(r, 300));
    const ok = login(form.username.trim(), form.password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setApiError('Неверное имя пользователя или пароль.');
    }
    setLoading(false);
  }

  function handleChange(field) {
    return (e) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(errs => { const copy = { ...errs }; delete copy[field]; return copy; });
    };
  }

  return (
    <div className="page-auth">
      <div className="auth-card">
        <h1 className="auth-title">Вход в систему</h1>
        <p className="auth-hint"><code>admin</code> / <code>admin123</code> или <code>user</code> / <code>user123</code></p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Имя пользователя</label>
            <input id="username" type="text" maxLength={50} autoComplete="username"
              value={form.username} onChange={handleChange('username')}
              className={errors.username ? 'input input-error' : 'input'} />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input id="password" type="password" maxLength={100} autoComplete="current-password"
              value={form.password} onChange={handleChange('password')}
              className={errors.password ? 'input input-error' : 'input'} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? 'Вход…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
