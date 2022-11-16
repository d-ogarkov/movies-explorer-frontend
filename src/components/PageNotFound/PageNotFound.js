import {Link} from 'react-router-dom';

export default function PageNotFound() {
  return (
    <main className="not-found">
      <section className="not-found__content">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__description">Страница не найдена</p>
      </section>
      <Link to="/" className="not-found__link">Назад</Link>
    </main>
  );
}