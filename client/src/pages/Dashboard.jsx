import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { validateMetricForm, hasErrors, CATEGORIES } from '../utils/validate';

const EMPTY = { name: '', value: '', unit: '', category: '', trend: '' };

export default function Dashboard() {
  const { username, logout } = useAuth();
  const navigate             = useNavigate();

  const [form,      setForm]     = useState(EMPTY);
  const [errors,    setErrors]   = useState({});
  const [apiErrors, setApiErrors] = useState([]);
  const [success,   setSuccess]  = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [metrics,   setMetrics]  = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  async function loadRecent() {
    try {
      const res = await api.getMetrics({ limit: 5, sort: 'createdAt', dir: 'desc' });
      setMetrics(res.data);
    } catch {}
    finally { setLoadingList(false); }
  }

  useEffect(() => { loadRecent(); }, []);

  function handleChange(field) {
    return (e) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(errs => { const c = { ...errs }; delete c[field]; return c; });
      setApiErrors([]);
      setSuccess('');
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiErrors([]);
    setSuccess('');

    const errs = validateMetricForm(form);
    setErrors(errs);
    if (hasErrors(errs)) return;

    setSubmitting(true);
    try {
      await api.createMetric({
        name:     form.name.trim(),
        value:    parseFloat(form.value),
        unit:     form.unit.trim(),
        category: form.category,
        trend:    form.trend === '' ? 0 : parseFloat(form.trend),
      });
      setSuccess(`Метрика «${form.name.trim()}» успешно добавлена.`);
      setForm(EMPTY);
      loadRecent();
    } catch (err) {
      if (err.errors) setApiErrors(err.errors);
      else setApiErrors([err.message]);
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="page-dashboard">
      <div className="dash-header">
        <h1>Личный кабинет</h1>
        <div className="dash-user">
          <span>👤 {username}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      <div className="dash-grid">
        {/* Форма добавления */}
        <div className="card">
          <h2 className="card-title">Добавить метрику</h2>

          {success   && <div className="alert alert-success">{success}</div>}
          {apiErrors.length > 0 && (
            <div className="alert alert-error">
              {apiErrors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label>Название <span className="hint">(1–10 символов)</span></label>
              <input type="text" maxLength={10} value={form.name} onChange={handleChange('name')}
                className={errors.name ? 'input input-error' : 'input'} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field-row">
              <div className="field">
                <label>Значение <span className="hint">(0–999 999)</span></label>
                <input type="number" min={0} max={999999} step="any" value={form.value}
                  onChange={handleChange('value')}
                  className={errors.value ? 'input input-error' : 'input'} />
                {errors.value && <span className="field-error">{errors.value}</span>}
              </div>
              <div className="field">
                <label>Единица <span className="hint">(буквы/%)</span></label>
                <input type="text" maxLength={10} value={form.unit}
                  onChange={handleChange('unit')}
                  className={errors.unit ? 'input input-error' : 'input'} />
                {errors.unit && <span className="field-error">{errors.unit}</span>}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Категория</label>
                <select value={form.category} onChange={handleChange('category')}
                  className={errors.category ? 'select input-error' : 'select'}>
                  <option value="">— выберите —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>
              <div className="field">
                <label>Тренд <span className="hint">(−9999…9999)</span></label>
                <input type="number" min={-9999} max={9999} step="any" value={form.trend}
                  onChange={handleChange('trend')}
                  className={errors.trend ? 'input input-error' : 'input'} />
                {errors.trend && <span className="field-error">{errors.trend}</span>}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Сохранение…' : 'Добавить'}
            </button>
          </form>
        </div>

        {/* Последние метрики */}
        <div className="card">
          <h2 className="card-title">Последние добавленные</h2>
          {loadingList
            ? <div className="spinner-wrap"><div className="spinner" /></div>
            : metrics.length === 0
              ? <p className="empty">Нет данных.</p>
              : (
                <table className="data-table">
                  <thead><tr><th>Название</th><th>Значение</th><th>Категория</th></tr></thead>
                  <tbody>
                    {metrics.map(m => (
                      <tr key={m.id}>
                        <td><a href={`/metrics/${m.id}`}>{m.name}</a></td>
                        <td>{m.value.toLocaleString('ru')} {m.unit}</td>
                        <td>{m.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
          }
        </div>
      </div>
    </div>
  );
}
