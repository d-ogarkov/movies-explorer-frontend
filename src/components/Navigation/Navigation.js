import {Link} from 'react-router-dom';

export default function Navigation({isOpen, onClose}) {
  return (
    <div className={`navigation ${isOpen && 'navigation_opened'}`}>
    <div className="navigation__container">
      <div className="navigation__links">
        <ul className="navigation__links_nav">
          <li><Link to="#" className="navigation__link">Главная</Link></li>
          <li><Link to="#" className="navigation__link navigation__link_type_active">Фильмы</Link></li>
          <li><Link to="#" className="navigation__link">Сохраненные фильмы</Link></li>
        </ul>
        <ul className="navigation__links_account">
          <li><Link to="#" className="navigation__link navigation__link_type_account">Аккаунт</Link></li>
        </ul>
      </div>
      <button type="button" className="navigation__close-btn" onClick={onClose}></button>
    </div>
    </div>
  );
}
