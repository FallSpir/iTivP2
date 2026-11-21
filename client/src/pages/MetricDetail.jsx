import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useFavorites } from '../context/FavoritesContext';

export default function MetricDetail() {
  const { id }              = useParams();
  const navigate            = useNavigate();
  const [metric, setMetric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      navigate('/not-found', { replace: true });
      return;
    }
    let alive = true;
    async function load() {
      try {
        const m = await api.getMetric(id);
        if (alive) setMetric(m);
      } catch (e) {
        if (!alive) return;
        if (e.status === 404) navigate('/not-found', { replace: true });
        else setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [id, navigate]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error)   return <div className="alert alert-error">{error}</div>;
  if (!metric) return null;

  const trend    = metric.trend;
  const trendCls = trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-flat';
  const trendIcon= trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
  const fav      = isFavorite(metric.id);

  function toggleFav() {
    if (fav) {
      removeFavorite(metric.id);
    } else {
      addFavorite({
        id:       metric.id,
        name:     metric.name,
        value:    metric.value,
        unit:     metric.unit,
        category: metric.category,
        trend:    metric.trend,
      });
    }
  }

  return (
    <div className="page-detail">
      <div className="detail-nav">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Назад</button>
        <Link to="/metrics" className="btn btn-ghost btn-sm">Все метрики</Link>
        <button
          className={`btn btn-sm${fav ? ' btn-fav-active' : ' btn-outline'}`}
          onClick={toggleFav}
        >
          {fav ? '★ В избранном' : '☆ В избранное'}
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <h1 className="detail-name">{metric.name}</h1>
          <span className="badge">{metric.category}</span>
        </div>

        <div className="detail-value">
          {metric.value.toLocaleString('ru')}
          <span className="detail-unit"> {metric.unit}</span>
        </div>

        <div className={`detail-trend ${trendCls}`}>
          {trendIcon} Тренд: {metric.trend > 0 ? '+' : ''}{metric.trend}
        </div>

        <table className="detail-table">
          <tbody>
            <tr><td>ID</td><td>{metric.id}</td></tr>
            <tr><td>Категория</td><td>{metric.category}</td></tr>
            <tr><td>Единица</td><td>{metric.unit}</td></tr>
            <tr><td>Создана</td><td>{new Date(metric.createdAt).toLocaleString('ru')}</td></tr>
            <tr><td>Обновлена</td><td>{new Date(metric.updatedAt).toLocaleString('ru')}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
