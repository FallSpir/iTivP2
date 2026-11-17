import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="error-page">
      <div className="error-code">403</div>
      <h1 className="error-title">Доступ запрещён</h1>
      <p className="error-desc">У вас нет прав для просмотра этой страницы. Войдите в систему.</p>
      <div className="error-actions">
        <Link to="/login" className="btn btn-primary">Войти</Link>
        <Link to="/"      className="btn btn-outline">На главную</Link>
      </div>
    </div>
  );
}
