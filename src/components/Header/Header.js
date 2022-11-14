import {Link, Route, Switch} from 'react-router-dom';
import logo from '../../images/header-logo.svg';

export default function Header({onMenuBtnClick}) {
  return (
    <header className="header">
      <Link to="/" className="header__logo-link"><img className="header__logo" src={logo} alt="Movies Explorer" lang="en" /></Link>
      <div className="header__links">
        <Switch>
          <Route exact path="/">
            <ul className="header__links_onboard">
              <li><Link to="/signup" className="header__link">Регистрация</Link></li>
              <li><Link to="/signin" className="header__link header__link_type_signin">Войти</Link></li>
            </ul>
          </Route>
          {["/movies", "/saved-movies", "/profile"].map(path =>
            <Route path={path}>
              <ul className="header__links_nav">
                <li><Link to="/movies" className="header__link">Фильмы</Link></li>
                <li><Link to="/saved-movies" className="header__link">Сохраненные фильмы</Link></li>
              </ul>
              <ul className="header__links_account">
                <li><Link to="/profile" className="header__link header__link_type_account">Аккаунт</Link></li>
              </ul>
              <button className="header__menu-btn" onClick={onMenuBtnClick}></button>
            </Route>
          )}
        </Switch>
      </div>
    </header>
  );
}
