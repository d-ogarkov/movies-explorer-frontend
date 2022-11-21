import {mainApiSettings} from './utils';

class MainApi {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._authUrl = options.authUrl;
  }

  _sendRequest(path, options = {}) {
    // Объект с опциями запроса нужно объединить с заголовками авторизации для дальнейшей передачи в fetch
    // По умолчанию опции запроса пустые (для обычного GET-запроса без body)
    let optionsWithHeaders = {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    };
    optionsWithHeaders = Object.assign(options, optionsWithHeaders);

    return fetch(`${this._baseUrl}/${path}`, optionsWithHeaders)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res);
        // Если ошибка, отклоняем промис
        return Promise.reject(res);
      }
    })
  }

  // Регистрация пользователя
  // В случае ошибки здесь ее не ловим, возвращаем только Promise.reject
  register(email, name, password) {
    return fetch(`${this._authUrl}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, name, password})
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((res) => {
      return res;
    })
  }

  // Авторизация пользователя
  // В случае ошибки здесь ее не ловим, возвращаем только Promise.reject
  authorize(email, password) {
    return fetch(`${this._authUrl}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        return data;
      } else {
        return Promise.reject(`Ошибка: нет токена`);
      }
    })
  }

  // Проверка токена пользователя
  getContent(token) {
    return fetch(`${this._authUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then(data => data)
  }

  // Получает информацию о пользователе
  getUserInfo() {
    return this._sendRequest('users/me');
  }

  // Обновляет информацию о пользователе (почту и имя)
  setUserInfo({ email, name }) {
    return this._sendRequest('users/me', {
      method: 'PATCH',
      body: JSON.stringify({
        email: email,
        name: name,
      })
    });
  }

  // Загружает сохраненные фильмы
  getMovies() {
    return this._sendRequest('movies');
  }

  // Сохраняет фильм, переданный в соответствии с нашим форматом БД
  addMovie({ country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN }) {
    return this._sendRequest('movies', {
      method: 'POST',
      body: JSON.stringify({
        country: country,
        director: director,
        duration: duration,
        year: year,
        description: description,
        image: image,
        trailerLink: trailerLink,
        thumbnail: thumbnail,
        movieId: movieId,
        nameRU: nameRU,
        nameEN: nameEN,
      })
    });
  }

  deleteMovie(id) {
    return this._sendRequest(`movies/${id}`, {
      method: 'DELETE'
    });
  }
}

// Экспортируем сразу экземпляр класса MainApi с нужными параметрами
export const mainApi = new MainApi({
  baseUrl: mainApiSettings.baseUrl,
  authUrl: mainApiSettings.authUrl,
});
