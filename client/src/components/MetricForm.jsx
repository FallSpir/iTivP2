export default function MetricForm({ form, onChange, onSubmit, onCancel, isEditing }) {
  return (
    <form className="metric-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Название"
        value={form.name}
        onChange={e => onChange('name', e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Значение"
        value={form.value}
        onChange={e => onChange('value', e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Единица (USD, %, users...)"
        value={form.unit}
        onChange={e => onChange('unit', e.target.value)}
        required
      />
      <select value={form.category} onChange={e => onChange('category', e.target.value)}>
        <option value="finance">Finance</option>
        <option value="engagement">Engagement</option>
        <option value="sales">Sales</option>
        <option value="support">Support</option>
      </select>
      <input
        type="number"
        placeholder="Тренд (%)"
        value={form.trend}
        onChange={e => onChange('trend', e.target.value)}
        step="0.1"
      />
      <div className="form-buttons">
        <button type="submit">{isEditing ? 'Сохранить' : 'Добавить'}</button>
        {isEditing && <button type="button" onClick={onCancel}>Отмена</button>}
      </div>
    </form>
  );
}
