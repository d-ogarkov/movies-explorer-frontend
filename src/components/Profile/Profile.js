import {Link} from 'react-router-dom';

export default function Profile() {
  return (
    <div class="profile__align">
      <main className="profile">
        <div className="profile__content">
          <div className="profile__head">
            <h1 className="profile__title">Привет, Виталий!</h1>
          </div>
          <div className="profile__data">
            <div className="profile__data-line">
              <div>Имя</div>
              <div>Виталий</div>
            </div>
            <div className="profile__data-line">
              <div>Почта</div>
              <div>pochta@yandex.ru</div>
            </div>
          </div>
          <div className="profile__actions">
            <Link to="#" className="profile__link">Редактировать</Link>
            <Link to="#" className="profile__link profile__link_type_hot">Выйти из аккаунта</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
