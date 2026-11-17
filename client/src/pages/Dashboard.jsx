import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { validateMetricForm, hasErrors, CATEGORIES } from '../utils/validate';

const EMPTY = { name: '', value: '', unit: '', category: '', trend: '' };

export default function Dashboard() {
  const { username, role, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === 'admin';

  const [metrics,     setMetrics]     = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [form,       setForm]       = useState(EMPTY);
  const [editId,     setEditId]     = useState(null);
  const [errors,     setErrors]     = useState({});
  const [apiErrors,  setApiErrors]  = useState([]);
  const [success,    setSuccess]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadRecent() {
    try {
      const res = await api.getMetrics({ limit: 10, sort: 'createdAt', dir: 'desc' });
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

  function startEdit(metric) {
    setEditId(metric.id);
    setForm({
      name:     metric.name,
      value:    String(metric.value),
      unit:     metric.unit,
      category: metric.category,
      trend:    String(metric.trend ?? 0),
    });
    setErrors({});
    setApiErrors([]);
    setSuccess('');
    setDeletingId(null);
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY);
    setErrors({});
    setApiErrors([]);
    setSuccess('');
  }

  async function handleDelete(id) {
    if (deletingId !== id) { setDeletingId(id); return; }
    setDeletingId(null);
    try {
      await api.deleteMetric(id);
      setMetrics(ms => ms.filter(m => m.id !== id));
      if (editId === id) cancelEdit();
    } catch (err) {
      setApiErrors([err.message]);
    }
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
      const payload = {
        name:     form.name.trim(),
        value:    parseFloat(form.value),
        unit:     form.unit.trim(),
        category: form.category,
        trend:    form.trend === '' ? 0 : parseFloat(form.trend),
      };
      if (editId !== null) {
        await api.patchMetric(editId, payload);
        setSuccess(`Метрика «${payload.name}» обновлена.`);
        cancelEdit();
      } else {
        await api.createMetric(payload);
        setSuccess(`Метрика «${payload.name}» добавлена.`);
        setForm(EMPTY);
      }
      loadRecent();
    } catch (err) {
      if (err.errors) setApiErrors(err.errors);
      else setApiErrors([err.message]);
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() { logout(); navigate('/'); }

  return (
    <div className="page-dashboard">
      <div className="dash-header">
        <h1>Личный кабинет</h1>
        <div className="dash-user">
          <span className={`role-badge role-${role}`}>
            {role === 'admin' ? 'Администратор' : 'Пользователь'}
          </span>
          <span>{username}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      <div className="dash-grid">
        {/* Левая карточка */}
        <div className="card">
          {isAdmin ? (
            <>
              <h2 className="card-title">
                {editId !== null ? 'Редактировать метрику' : 'Добавить метрику'}
              </h2>

              {success && <div className="alert alert-success">{success}</div>}
              {apiErrors.length > 0 && (
                <div className="alert alert-error">
                  {apiErrors.map((e, i) => <div key={i}>{e}</div>)}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label>Название <span className="hint">(1–10 символов)</span></label>
                  <input type="text" maxLength={10} value={form.name}
                    onChange={handleChange('name')}
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

                <div className="form-actions">
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Сохранение…' : editId !== null ? 'Сохранить' : 'Добавить'}
                  </button>
                  {editId !== null && (
                    <button type="button" className="btn btn-ghost" onClick={cancelEdit}>
                      Отмена
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="card-title">Мой профиль</h2>
              <p className="role-info">
                Вы вошли как <strong>{username}</strong> с правами пользователя.
                Просмотр метрик доступен — добавление и редактирование требуют прав администратора.
              </p>
            </>
          )}
        </div>

        {/* Правая карточка — таблица */}
        <div className="card">
          <h2 className="card-title">Последние метрики</h2>
          {loadingList
            ? <div className="spinner-wrap"><div className="spinner" /></div>
            : metrics.length === 0
              ? <p className="empty">Нет данных.</p>
              : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Значение</th>
                      <th>Категория</th>
                      {isAdmin && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map(m => (
                      <tr key={m.id} className={editId === m.id ? 'row-editing' : ''}>
                        <td><Link to={`/metrics/${m.id}`}>{m.name}</Link></td>
                        <td>{m.value.toLocaleString('ru')} {m.unit}</td>
                        <td>{m.category}</td>
                        {isAdmin && (
                          <td className="td-actions">
                            <button className="btn btn-ghost btn-sm"
                              onClick={() => startEdit(m)}>
                              Изм.
                            </button>
                            {deletingId === m.id ? (
                              <>
                                <button className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(m.id)}>
                                  Да
                                </button>
                                <button className="btn btn-ghost btn-sm"
                                  onClick={() => setDeletingId(null)}>
                                  Нет
                                </button>
                              </>
                            ) : (
                              <button className="btn btn-ghost btn-sm btn-del"
                                onClick={() => handleDelete(m.id)}>
                                Удал.
                              </button>
                            )}
                          </td>
                        )}
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
