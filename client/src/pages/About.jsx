import PropDrillingDemo from '../components/PropDrillingDemo';

export default function About() {
  return (
    <div className="page-about">
      <h1>О проекте</h1>

      <div className="about-card">
        <p>
          <strong>MetricsHub</strong> — веб-приложение для мониторинга и анализа
          бизнес-метрик. Позволяет отслеживать ключевые показатели эффективности
          по категориям: Finance, Marketing, Sales, Operations и HR.
        </p>
      </div>

      <h2>Технологии</h2>
      <div className="tech-grid">
        {[
          { name: 'React 18',         desc: 'UI-библиотека' },
          { name: 'React Router v6',  desc: 'Клиентская маршрутизация' },
          { name: 'Context API',      desc: 'Глобальное состояние' },
          { name: 'useReducer',       desc: 'Управление сложным state' },
          { name: 'Vite',             desc: 'Сборщик и dev-сервер' },
          { name: 'Express.js',       desc: 'REST API backend' },
          { name: 'PostgreSQL',       desc: 'Реляционная СУБД' },
          { name: 'Sequelize ORM',    desc: 'Работа с базой данных' },
        ].map(t => (
          <div key={t.name} className="tech-card">
            <div className="tech-name">{t.name}</div>
            <div className="tech-desc">{t.desc}</div>
          </div>
        ))}
      </div>

      <h2>Возможности</h2>
      <ul className="feature-list">
        <li>Просмотр метрик с пагинацией, фильтрацией и сортировкой</li>
        <li>Детальная страница каждой метрики с трендом</li>
        <li>Добавление метрик через защищённый личный кабинет</li>
        <li>Полная валидация форм на фронтенде и бэкенде</li>
        <li>Страницы ошибок: 403, 404, 500</li>
        <li>Глобальное управление избранным через Context + useReducer</li>
        <li>Сохранение избранного в localStorage между сессиями</li>
        <li>Переключение светлой / тёмной темы через ThemeContext</li>
      </ul>

      <h2>Демонстрация: Prop Drilling vs Context API</h2>
      <p className="about-demo-desc">
        Проблема prop drilling возникает, когда данные передаются через промежуточные компоненты,
        которые их не используют. Context API решает эту проблему, предоставляя данные напрямую любому
        компоненту дерева. Нажмите <strong>«сменить»</strong>, чтобы увидеть оба подхода в действии:
      </p>
      <PropDrillingDemo />

      <div className="about-links">
        <a href="http://localhost:3001/api-docs" target="_blank" rel="noreferrer"
           className="btn btn-outline">Swagger API Docs</a>
        <a href="https://github.com/FallSpir/iTivP2/tree/pz24" target="_blank" rel="noreferrer"
           className="btn btn-outline">GitHub → pz24</a>
      </div>
    </div>
  );
}
