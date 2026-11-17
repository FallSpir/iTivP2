export const CATEGORIES = ['Finance', 'Marketing', 'Sales', 'Operations', 'HR'];

export function validateMetricForm(fields) {
  const errors = {};
  const { name, value, unit, category, trend } = fields;

  const cleanName = String(name ?? '').trim();
  if (!cleanName)             errors.name = 'Поле обязательно.';
  else if (cleanName.length > 10) errors.name = 'Не более 10 символов.';

  const rawVal = String(value ?? '').trim();
  if (rawVal === '')          errors.value = 'Поле обязательно.';
  else {
    const v = parseFloat(rawVal);
    if (!isFinite(v) || v < 0 || v > 999999)
      errors.value = 'Число от 0 до 999 999.';
  }

  const cleanUnit = String(unit ?? '').trim();
  if (!cleanUnit)             errors.unit = 'Поле обязательно.';
  else if (cleanUnit.length > 10) errors.unit = 'Не более 10 символов.';
  else if (!/^[A-Za-zА-Яа-яЁё%]+$/.test(cleanUnit))
    errors.unit = 'Только буквы и %.';

  if (!CATEGORIES.includes(category)) errors.category = 'Выберите категорию.';

  const rawTrend = String(trend ?? '').trim();
  if (rawTrend !== '') {
    const t = parseFloat(rawTrend);
    if (!isFinite(t) || t < -9999 || t > 9999)
      errors.trend = 'Число от −9999 до 9999.';
  }

  return errors;
}

export const hasErrors = (errs) => Object.keys(errs).length > 0;
