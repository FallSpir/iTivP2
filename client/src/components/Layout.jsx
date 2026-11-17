import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { isAuth, username, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <NavLink to="/" className="logo">MetricsHub</NavLink>
          <nav className="nav">
            <NavLink to="/"        end   className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Главная</NavLink>
            <NavLink to="/metrics"       className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Метрики</NavLink>
            <NavLink to="/about"         className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>О проекте</NavLink>
            {isAuth && (
              <NavLink to="/dashboard"   className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Кабинет</NavLink>
            )}
          </nav>
          <div className="header-auth">
            {isAuth ? (
              <>
                <span className="username">👤 {username}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Выйти</button>
              </>
            ) : (
              <NavLink to="/login" className="btn btn-primary btn-sm">Войти</NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="main container">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">MetricsHub © 2026 — ПЗ №3 · React Router v6</div>
      </footer>
    </>
  );
}
