import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="error-page">
      <div className="error-code">404</div>
      <h1 className="error-title">Страница не найдена</h1>
      <p className="error-desc">Запрашиваемая страница не существует или была удалена.</p>
      <div className="error-actions">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>← Назад</button>
        <Link to="/" className="btn btn-primary">На главную</Link>
      </div>
    </div>
  );
}
