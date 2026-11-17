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
          { name: 'Vite',             desc: 'Сборщик и dev-сервер' },
          { name: 'Express.js',       desc: 'REST API backend' },
          { name: 'PostgreSQL',       desc: 'Реляционная СУБД' },
          { name: 'Sequelize ORM',    desc: 'Работа с базой данных' },
          { name: 'Swagger UI',       desc: 'Документация API' },
          { name: 'Node.js',          desc: 'Серверная платформа' },
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
        <li>Имитация авторизации с сохранением сессии</li>
      </ul>

      <div className="about-links">
        <a href="http://localhost:3001/api-docs" target="_blank" rel="noreferrer"
           className="btn btn-outline">Swagger API Docs</a>
        <a href="https://github.com/FallSpir/iTivP2/tree/pz23" target="_blank" rel="noreferrer"
           className="btn btn-outline">GitHub → pz23</a>
      </div>
    </div>
  );
}
