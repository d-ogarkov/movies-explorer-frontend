import {Link} from 'react-router-dom';
import logo from '../../images/header-logo.svg';

export default function Login() {
  return (
    <div class="dialog__align">
      <main className="dialog">
        <form className="dialog__form" action="/" method="post">
          <div className="dialog__head">
            <Link to="/" className="dialog__logo-link"><img className="dialog__logo" src={logo} alt="Movies Explorer" /></Link>
            <h1 className="dialog__title">Рады видеть!</h1>
          </div>
          <div className="dialog__data">
            <fieldset className="dialog__fieldset">
              <label className="dialog__label">Email
                <input className="dialog__field" type="text" id="email-input" name="email" placeholder="pochta@yandex.ru|" required />
                <span className="dialog__error"></span>
              </label>
              <label className="dialog__label">Пароль
                <input className="dialog__field" type="password" id="password-input" name="password" placeholder="Пароль" required />
                <span className="dialog__error"></span>
              </label>
            </fieldset>
          </div>
          <div className="dialog__actions">
            <input className="dialog__submit-btn" type="submit" value="Войти" />
            <p className="dialog__paragraph">Ещё не зарегистрированы? <Link to="/signup" className="dialog__link">Регистрация</Link></p>
          </div>
        </form>
      </main>
    </div>
  );
}
