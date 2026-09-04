import { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import MetricForm from './MetricForm';
import * as api from '../api';
import socket from '../socket';

const EMPTY_FORM = { name: '', value: '', unit: '', category: 'finance', trend: '' };

export default function MetricList() {
  const [metrics, setMetrics] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Загрузка с сервера + AbortController (отмена при размонтировании)
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const delay = new Promise(r => setTimeout(r, 800));

    Promise.all([api.fetchMetrics(controller.signal), delay])
      .then(([res]) => setMetrics(res.data))
      .catch(err => {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          setError('Не удалось загрузить метрики. Проверьте соединение с сервером.');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Заголовок страницы
  useEffect(() => {
    document.title = `Метрики (${metrics.length}) — Dashboard`;
  }, [metrics]);

  // Реальное время: авто-обновление списка через WebSocket
  useEffect(() => {
    socket.on('metric_created', (m) => setMetrics(prev => [...prev, m]));
    socket.on('metric_updated', (m) => setMetrics(prev => prev.map(x => x.id === m.id ? m : x)));
    socket.on('metric_deleted', ({ id }) => setMetrics(prev => prev.filter(x => x.id !== id)));
    return () => {
      socket.off('metric_created');
      socket.off('metric_updated');
      socket.off('metric_deleted');
    };
  }, []);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      value: parseFloat(form.value),
      unit: form.unit,
      category: form.category,
      trend: form.trend !== '' ? parseFloat(form.trend) : 0,
    };

    if (editingId) {
      // Оптимистичное обновление
      const prev = metrics.find(m => m.id === editingId);
      setMetrics(ms => ms.map(m => m.id === editingId ? { ...m, ...payload } : m));
      setEditingId(null);
      setForm(EMPTY_FORM);
      setSaving(true);
      try {
        const res = await api.updateMetric(editingId, payload);
        setMetrics(ms => ms.map(m => m.id === editingId ? res.data : m));
      } catch {
        // Откат при ошибке
        setMetrics(ms => ms.map(m => m.id === editingId ? prev : m));
        setError('Ошибка при обновлении метрики');
      } finally {
        setSaving(false);
      }
    } else {
      // Оптимистичное добавление с временным ID
      const tempId = Date.now();
      const optimistic = { id: tempId, ...payload };
      setMetrics(ms => [...ms, optimistic]);
      setForm(EMPTY_FORM);
      setSaving(true);
      try {
        const res = await api.createMetric(payload);
        // Заменяем временный ID на реальный из ответа сервера
        setMetrics(ms => ms.map(m => m.id === tempId ? res.data : m));
      } catch {
        // Откат при ошибке
        setMetrics(ms => ms.filter(m => m.id !== tempId));
        setError('Ошибка при добавлении метрики');
      } finally {
        setSaving(false);
      }
    }
  }

  function handleEdit(metric) {
    setEditingId(metric.id);
    setForm({
      name: metric.name,
      value: metric.value,
      unit: metric.unit,
      category: metric.category,
      trend: metric.trend,
    });
  }

  async function handleDelete(id) {
    // Оптимистичное удаление
    const removed = metrics.find(m => m.id === id);
    setMetrics(ms => ms.filter(m => m.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
    }
    try {
      await api.deleteMetric(id);
    } catch {
      // Откат при ошибке
      setMetrics(ms => [...ms, removed].sort((a, b) => a.id - b.id));
      setError('Ошибка при удалении метрики');
    }
  }

  function handleCancel() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  const categories = ['all', ...new Set(metrics.map(m => m.category))];

  const filtered = metrics
    .filter(m => filterCategory === 'all' || m.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'trend') return b.trend - a.trend;
      return 0;
    });

  if (loading) {
    return <div className="loading">Загрузка метрик с сервера...</div>;
  }

  return (
    <div className="metric-list-container">
      <h1>Business Metrics Dashboard</h1>

      {error && (
        <div className="error-bar">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="stats-bar">
        <span>Всего метрик: <strong>{metrics.length}</strong></span>
        <span>Показано: <strong>{filtered.length}</strong></span>
        <span>Растут: <strong>{metrics.filter(m => m.trend > 0).length}</strong></span>
        <span>Падают: <strong>{metrics.filter(m => m.trend < 0).length}</strong></span>
        {saving && <span className="saved">Сохранение...</span>}
      </div>

      <MetricForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={!!editingId}
      />

      <div className="controls">
        <div className="filter-group">
          <label>Категория:</label>
          {categories.map(cat => (
            <button
              key={cat}
              className={filterCategory === cat ? 'active' : ''}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="sort-group">
          <label>Сортировка:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">По названию</option>
            <option value="value">По значению</option>
            <option value="trend">По тренду</option>
          </select>
        </div>
      </div>

      <div className="metrics-grid">
        {filtered.length === 0
          ? <p className="empty">Нет метрик в этой категории</p>
          : filtered.map(m => (
              <MetricCard
                key={m.id}
                metric={m}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
        }
      </div>
    </div>
  );
}
