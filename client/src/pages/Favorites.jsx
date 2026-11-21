import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

const TREND = (t) =>
  t > 0 ? { icon: '↑', cls: 'trend-up' } :
  t < 0 ? { icon: '↓', cls: 'trend-down' } :
           { icon: '→', cls: 'trend-flat' };

export default function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="page-favorites">
      <div className="page-header">
        <h1>Избранное</h1>
        {favorites.length > 0 && (
          <button className="btn btn-ghost btn-sm btn-del" onClick={clearFavorites}>
            Очистить всё
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty-icon">☆</div>
          <p>Вы ещё не добавили ни одной метрики в избранное.</p>
          <button className="btn btn-primary" onClick={() => navigate('/metrics')}>
            Перейти к метрикам
          </button>
        </div>
      ) : (
        <>
          <p className="total-info" style={{ marginBottom: 16 }}>
            Сохранено: {favorites.length} {favorites.length === 1 ? 'метрика' : favorites.length < 5 ? 'метрики' : 'метрик'}
          </p>
          <div className="metrics-grid">
            {favorites.map(m => {
              const tr = TREND(m.trend ?? 0);
              return (
                <div key={m.id} className="metric-card fav-card">
                  <div
                    className="fav-card-body"
                    onClick={() => navigate(`/metrics/${m.id}`)}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/metrics/${m.id}`)}
                  >
                    <div className="mc-header">
                      <span className="mc-name">{m.name}</span>
                      <span className={`mc-trend ${tr.cls}`}>{tr.icon} {m.trend ?? 0}</span>
                    </div>
                    <div className="mc-value">
                      {Number(m.value).toLocaleString('ru')} <span className="mc-unit">{m.unit}</span>
                    </div>
                    <div className="mc-cat">{m.category}</div>
                  </div>
                  <button
                    className="fav-remove-btn"
                    onClick={() => removeFavorite(m.id)}
                    title="Убрать из избранного"
                  >
                    ★ Убрать
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
