import {Link} from 'react-router-dom';
import logo from '../../images/header-logo.svg';

export default function Register() {
  return (
    <div class="dialog__align">
      <main className="dialog">
        <form className="dialog__form" action="/" method="post">
          <div className="dialog__head">
            <Link to="/" className="dialog__logo-link"><img className="dialog__logo" src={logo} alt="Movies Explorer" lang="en" /></Link>
            <h1 className="dialog__title">Добро пожаловать!</h1>
          </div>
          <div className="dialog__data">
            <fieldset className="dialog__fieldset">
              <label className="dialog__label">Имя
                <input className="dialog__field" type="text" id="name-input" name="name" placeholder="Виталий" required />
                <span className="dialog__error"></span>
              </label>
              <label className="dialog__label">Email
                <input className="dialog__field" type="text" id="email-input" name="email" placeholder="pochta@yandex.ru|" required />
                <span className="dialog__error"></span>
              </label>
              <label className="dialog__label">Пароль
                <input className="dialog__field dialog__field_type_error" type="password" id="password-input" name="password" placeholder="Пароль" required />
                <span className="dialog__error">Что-то пошло не так...</span>
              </label>
            </fieldset>
          </div>
          <div className="dialog__actions">
            <input className="dialog__submit-btn" type="submit" value="Зарегистрироваться" />
            <p className="dialog__paragraph">Уже зарегистрированы? <Link to="/signin" className="dialog__link">Войти</Link></p>
          </div>
        </form>
      </main>
    </div>
  );
}
