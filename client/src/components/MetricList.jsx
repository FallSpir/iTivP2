import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MetricCard from './MetricCard';
import MetricForm from './MetricForm';

const INITIAL_METRICS = [
  { id: 1, name: 'Revenue', value: 125000, unit: 'USD', category: 'finance', trend: 8.3 },
  { id: 2, name: 'DAU', value: 4320, unit: 'users', category: 'engagement', trend: 2.1 },
  { id: 3, name: 'Conversion Rate', value: 3.7, unit: '%', category: 'sales', trend: -0.5 },
  { id: 4, name: 'Avg Order Value', value: 89.5, unit: 'USD', category: 'finance', trend: 4.2 },
  { id: 5, name: 'Support Tickets', value: 142, unit: 'tickets', category: 'support', trend: -12 },
];

const EMPTY_FORM = { name: '', value: '', unit: '', category: 'finance', trend: '' };

export default function MetricList() {
  const [metrics, setMetrics] = useLocalStorage('metrics', INITIAL_METRICS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useLocalStorage('filterCategory', 'all');
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'name');
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Имитация загрузки при старте
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Заголовок страницы
  useEffect(() => {
    document.title = `Метрики (${metrics.length}) — Dashboard`;
  }, [metrics]);

  // Автосохранение с debounce
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      setLastSaved(new Date().toLocaleTimeString());
    }, 500);
    return () => clearTimeout(timer);
  }, [metrics, loading]);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const metric = {
      id: editingId ?? Date.now(),
      name: form.name,
      value: parseFloat(form.value),
      unit: form.unit,
      category: form.category,
      trend: form.trend !== '' ? parseFloat(form.trend) : 0,
    };
    if (editingId) {
      setMetrics(prev => prev.map(m => m.id === editingId ? metric : m));
      setEditingId(null);
    } else {
      setMetrics(prev => [...prev, metric]);
    }
    setForm(EMPTY_FORM);
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

  function handleDelete(id) {
    setMetrics(prev => prev.filter(m => m.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
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
    return <div className="loading">Загрузка метрик...</div>;
  }

  return (
    <div className="metric-list-container">
      <h1>Business Metrics Dashboard</h1>

      <div className="stats-bar">
        <span>Всего метрик: <strong>{metrics.length}</strong></span>
        <span>Показано: <strong>{filtered.length}</strong></span>
        <span>Растут: <strong>{metrics.filter(m => m.trend > 0).length}</strong></span>
        <span>Падают: <strong>{metrics.filter(m => m.trend < 0).length}</strong></span>
        {lastSaved && <span className="saved">Сохранено в {lastSaved}</span>}
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
