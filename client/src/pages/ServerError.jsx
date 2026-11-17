import { Link, useNavigate } from 'react-router-dom';

export default function ServerError() {
  const navigate = useNavigate();
  return (
    <div className="error-page">
      <div className="error-code">500</div>
      <h1 className="error-title">Ошибка сервера</h1>
      <p className="error-desc">На сервере произошла непредвиденная ошибка. Попробуйте позже.</p>
      <div className="error-actions">
        <button className="btn btn-outline" onClick={() => navigate(0)}>Обновить страницу</button>
        <Link to="/" className="btn btn-primary">На главную</Link>
      </div>
    </div>
  );
}
