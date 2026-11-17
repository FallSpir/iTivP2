import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { CATEGORIES } from '../utils/validate';

const TREND = (t) => t > 0 ? { icon: '↑', cls: 'trend-up' } : t < 0 ? { icon: '↓', cls: 'trend-down' } : { icon: '→', cls: 'trend-flat' };

export default function Metrics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort')     || '';
  const dir      = searchParams.get('dir')      || 'desc';
  const page     = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const LIMIT    = 8;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMetrics({ category, sort, dir, page, limit: LIMIT });
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [category, sort, dir, page]);

  useEffect(() => { load(); }, [load]);

  function set(key, val) {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  }

  function toggleDir() {
    set('dir', dir === 'asc' ? 'desc' : 'asc');
  }

  return (
    <div className="page-metrics">
      <div className="page-header">
        <h1>Каталог метрик</h1>
      </div>

      <div className="filters">
        <select value={category} onChange={e => set('category', e.target.value)} className="select">
          <option value="">Все категории</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={sort} onChange={e => set('sort', e.target.value)} className="select">
          <option value="">Сортировка: по дате</option>
          <option value="name">По названию</option>
          <option value="value">По значению</option>
          <option value="trend">По тренду</option>
        </select>

        <button className="btn btn-outline btn-sm" onClick={toggleDir}>
          {dir === 'asc' ? '↑ По возрастанию' : '↓ По убыванию'}
        </button>

        {(category || sort) && (
          <button className="btn btn-ghost btn-sm" onClick={() => setSearchParams({})}>✕ Сбросить</button>
        )}
      </div>

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {data && !loading && (
        <>
          <div className="metrics-grid">
            {data.data.length === 0 && <p className="empty">Метрики не найдены.</p>}
            {data.data.map(m => {
              const tr = TREND(m.trend);
              return (
                <Link key={m.id} to={`/metrics/${m.id}`} className="metric-card">
                  <div className="mc-header">
                    <span className="mc-name">{m.name}</span>
                    <span className={`mc-trend ${tr.cls}`}>{tr.icon} {m.trend}</span>
                  </div>
                  <div className="mc-value">{m.value.toLocaleString('ru')} <span className="mc-unit">{m.unit}</span></div>
                  <div className="mc-cat">{m.category}</div>
                </Link>
              );
            })}
          </div>

          {data.pages > 1 && (
            <div className="pagination">
              <button className="btn btn-outline btn-sm" disabled={page === 1}
                onClick={() => set('page', page - 1)}>← Назад</button>
              <span className="page-info">Страница {data.page} из {data.pages}</span>
              <button className="btn btn-outline btn-sm" disabled={page === data.pages}
                onClick={() => set('page', page + 1)}>Вперёд →</button>
            </div>
          )}
          <p className="total-info">Всего: {data.total} метрик</p>
        </>
      )}
    </div>
  );
}
