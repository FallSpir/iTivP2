import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

const CAT_COLOR = {
  Finance: '#2563eb', Marketing: '#8b5cf6',
  Sales: '#22c55e', Operations: '#f59e0b', HR: '#ec4899',
};

export default function Home() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const [metricsRes, cats] = await Promise.all([
          api.getMetrics({ limit: 1 }),
          api.getCategories(),
        ]);
        if (alive) setStats({ total: metricsRes.total, cats });
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <div className="page-home">
      <section className="hero">
        <h1 className="hero-title">MetricsHub</h1>
        <p className="hero-sub">Дашборд для мониторинга бизнес-метрик. Просматривай, добавляй и анализируй ключевые показатели эффективности.</p>
        <div className="hero-actions">
          <Link to="/metrics" className="btn btn-primary">Смотреть метрики</Link>
          <Link to="/about"   className="btn btn-outline">О проекте</Link>
        </div>
      </section>

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
      {error   && <div className="alert alert-error">Не удалось загрузить статистику: {error}</div>}

      {stats && (
        <>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-label">Всего метрик</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{stats.cats.length}</div>
              <div className="stat-label">Категорий</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{stats.cats.reduce((s, c) => s + c.count, 0)}</div>
              <div className="stat-label">Записей в базе</div>
            </div>
          </div>

          <h2 className="section-title">Категории</h2>
          <div className="cat-grid">
            {stats.cats.map(c => (
              <Link key={c.name} to={`/metrics?category=${c.name}`} className="cat-card">
                <div className="cat-dot" style={{ background: CAT_COLOR[c.name] || '#94a3b8' }} />
                <div className="cat-name">{c.name}</div>
                <div className="cat-count">{c.count} метрик</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
