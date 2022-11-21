import {useState, useEffect} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Main from '../Main/Main';
import Movies from '../Movies/Movies';
import SavedMovies from '../SavedMovies/SavedMovies';
import Profile from '../Profile/Profile';
import Register from '../Register/Register';
import Login from '../Login/Login';
import PageNotFound from '../PageNotFound/PageNotFound';
import Popup from '../Popup/Popup';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import {CurrentUserContext} from '../../contexts/CurrentUserContext';
import {moviesApi} from '../../utils/MoviesApi';
import {moviesApiSettings} from '../../utils/utils';
import {mainApi} from '../../utils/MainApi';

function App() {
  const [isNavigationOpen, setNavigationOpen] = useState(false);
  const [isSearchRunning, setIsSearchRunning] = useState(false);
  const [isSearchCompleted, setIsSearchCompleted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [currentUser, setCurrentUser] = useState([]);
  const [cards, setCards] = useState([]);
  const [savedCards, setSavedCards] = useState([]); // savedCards фильтруется поиском для отображения
  const [savedCardsCache, setSavedCardsCache] = useState([]); // Копия savedCards (все сохраненные карточки) для локального поиска
  const [allMovies, setAllMovies] = useState([]);
  const [loggedIn, setLoggedIn] = useState(null); // В момент первого рендера значение еще не true и не false (для ProtectedRoute)
  //const [email, setEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Проверяем, есть ли сохраненный токен пользователя
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      tokenCheck(token);
    } else {
      setLoggedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMenuBtnClick() {
    setNavigationOpen(true);
  }

  function closeNavigation() {
    setNavigationOpen(false);
  }

  // Обрабатывает нажатие кнопки поиска фильмов
  function handleSearch(searchQuery, searchShorts, useCache = false) {
    var searchResult = {};
    const searchResultCache = localStorage.getItem('searchResult');

    // Если запрос не изменился, сначала проверим, есть ли уже загруженные из MoviesApi фильмы
    if (useCache && searchResultCache) {
      searchResult = JSON.parse(searchResultCache);

      if (searchShorts === true) {
        searchResult = searchResult.filter(function (movie) {
          return movie.duration <= 40;
        });
      }

      // Отображаем карточки найденных фильмов
      setCards(searchResult);
    } else {
      // Включаем показ прелоадера и запускаем поиск
      setIsSearchRunning(true);
      setIsError(false);
      setIsSearchCompleted(false);
      // Сохраненного массива фильмов нет, тогда загружаем
      loadMovies(searchQuery).then((searchResult) => {
        // Сохраняем найденные фильмы
        localStorage.setItem('searchResult', JSON.stringify(searchResult));

        // Если установлен переключатель «Короткометражки», то отфильтровывам массив:
        // оставляем только фильмы длительностью до 40 минут включительно
        if (searchShorts === true) {
          searchResult = searchResult.filter(function (movie) {
            return movie.duration <= 40;
          });
        }

        // По окончании поиска выключаем прелоадер и запоминаем, что поиск выполнен
        setIsSearchRunning(false);
        setIsSearchCompleted(true);

        // Отображаем карточки найденных фильмов
        setCards(searchResult);
      })
      .catch((err) => setIsError(true));
    }
  }

  // Обрабатывает нажатие кнопки поиска фильмов среди сохраненных
  function handleSavedSearch(searchQuery, searchShorts) {
    // Включаем показ прелоадера и запускаем поиск
    setIsSearchRunning(true);
    setIsError(false);
    setIsSearchCompleted(false);

    // Отфильтровываем все сохраненные фильмы (savedCardsCache) по поисковому запросу
    var searchResult = savedCardsCache.filter((movie) =>
      movie.nameRU.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    // Если установлен переключатель «Короткометражки», то дополнительно фильтруем массив:
    // оставляем только фильмы длительностью до 40 минут включительно
    if (searchShorts === true) {
      searchResult = searchResult.filter(function (movie) {
        return movie.duration <= 40;
      });
    }

    // По окончании поиска выключаем прелоадер и запоминаем, что поиск выполнен
    setIsSearchRunning(false);
    setIsSearchCompleted(true);
  
    // Отображаем карточки найденных фильмов
    setSavedCards(searchResult);
  }

  // Получает массив фильмов и ищет в нем по заданному запросу
  function loadMovies(query) {
    // Загрузка фильмов - асинхронный запрос, поэтому возвращаем промис
    return new Promise(function(resolve, reject) {
      // Если уже загружали все фильмы, используем сохраненный массив
      if (allMovies.length) {
        resolve(allMovies.filter((movie) =>
        movie.nameRU.toLowerCase()
          .includes(query.toLowerCase())
        ));
      } else {
        moviesApi.getMovies()
          .then(resMovies => {
            // Сохраняем фильмы для последующих поисков
            setAllMovies(resMovies);
            // MoviesApi отдает все фильмы, поэтому отфильтровываем только те, название которых содержит поисковый запрос
            // (сначала приводим и название, и запрос к нижнему регистру)
            resolve(resMovies.filter((movie) =>
              movie.nameRU.toLowerCase()
                .includes(query.toLowerCase())
            ));
          })
          .catch((err) => reject(err));
      }
    })
  }

  // Загружает сохраненные фильмы
  function loadSavedMovies() {
    mainApi.getMovies()
    .then(resMovies => {
      setSavedCards(resMovies);
      setSavedCardsCache(resMovies);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // Регистрация пользователя
  function handleRegister(email, name, password) {
    mainApi.register(email, name, password)
    .then((res) => {
      if (res) {
        // После регистрации сразу авторизуемся
        mainApi.authorize(email, password)
        .then((res) => {
          if (res.token) {
            // Проверим токен, чтобы загрузить email пользователя после логина.
            // Второй параметр true - редирект на /movies после проверки
            tokenCheck(res.token, true);
          }
        })
      }
    })
    .catch((err) => {
      console.log(err);
      openPopup('Что-то пошло не так! Попробуйте ещё раз.');
    });
  }

  // Авторизация пользователя, проверка токена и редирект
  function handleLogin(email, password) {
    mainApi.authorize(email, password)
    .then((res) => {
      if (res.token) {
        // Проверим токен, чтобы загрузить email пользователя после логина
        // Второй параметр true - редирект на /movies после проверки
        tokenCheck(res.token, true);
      }
    })
    .catch((err) => {
      console.log(err);
      openPopup('Что-то пошло не так! Попробуйте ещё раз.');
    });
  }

  // Добавляет карточку в сохраненные
  function cardSave({ country, director, duration, year, description, image, trailerLink, id, nameRU, nameEN }) {
    mainApi.addMovie({
      country: country,
      director: director,
      duration: duration,
      year: year,
      description: description,
      image: moviesApiSettings.baseUrl + image.url, // MoviesApi отдает только относительный путь
      trailerLink: trailerLink,
      thumbnail: moviesApiSettings.baseUrl + image.formats.thumbnail.url, // MoviesApi отдает только относительный путь
      movieId: id,
      nameRU: nameRU,
      nameEN: nameEN,      
    })
    .then(res => {
      loadUserData();
    })
    .catch((err) => {
      console.log(err);
      openPopup('Что-то пошло не так! Попробуйте ещё раз.');
    });
  }

  // Удаляет карточку из сохраненных
  function cardUnsave(card) {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    mainApi.deleteMovie(card._id)
    .then(res => {
      loadUserData();
    })
    .catch((err) => {
      console.log(err);
      openPopup('Что-то пошло не так! Попробуйте ещё раз.');
    });
  }

  // Обрабатывает нажатие кнопки на карточке и вызывает сохранение или удаление из сохраненных
  function handleCardButton(card) {
    // В сохраненных карточках id фильма лежит в card.movieId, а в полученных от MoviesApi - в card.id
    const movieId = card.movieId || card.id;

    // Проверяем, сохранена ли уже данная карточка
    const savedCard = savedCardsCache.find(i => i.movieId === movieId);
    // Если сохранена, то find вернет сразу нужный объект из массива savedCardsCache
    if (savedCard && savedCard._id) {
      cardUnsave(savedCard);
    } else {
      cardSave(card);
    }
  }

  function handleUpdateUser(newUserInfo) {
    openPopup('Информация обновлена.');
    mainApi.setUserInfo(newUserInfo)
    .then((res) => {
      if (res) {
        setCurrentUser(res);
        openPopup('Информация обновлена.');
      }
    })
    .catch((err) => {
      console.log(err);
      openPopup('Что-то пошло не так! Попробуйте ещё раз.');
    });
  }

  // Выход из аккаунта: удаление токена из хранилища и редирект на главную
  function handleSignout() {
    localStorage.removeItem('token');
    localStorage.removeItem('savedQuery');
    localStorage.removeItem('savedShorts');
    localStorage.removeItem('searchResult');
    setLoggedIn(false);
    history.push("/");
  }

  // Загружаем информацию о пользователе и сохраненные карточки
  function loadUserData() {
    mainApi.getUserInfo()
      .then(resUserInfo => {
        setCurrentUser(resUserInfo);
        loadSavedMovies();
      })
      .catch((err) => {
        console.log(err);
        setLoggedIn(false);
      });
  }
  
  // Проверяет, действующий токен или нет
  function tokenCheck(jwt, redirect = false) {
    if (jwt) {
      mainApi.getContent(jwt).then((res) => {
        if (res) {
          // Авторизуем пользователя
          setLoggedIn(true);
          // Загрузим информацию для главной страницы
          loadUserData();
          // Перенаправим
          if (redirect) {
            history.push("/movies");
          }
        } else {
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoggedIn(false);
      });
    } else {
      setLoggedIn(false);
    }
  }

  function openPopup(message) {
    setPopupMessage(message);
    setIsPopupOpen(true);
  }

  function closeAllPopups() {
    setIsPopupOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Header loggedIn={loggedIn} onMenuBtnClick={handleMenuBtnClick}/>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <ProtectedRoute
            loggedIn={loggedIn}
            path="/movies"
            component={Movies}
            cards={cards}
            savedCards={savedCardsCache}
            onCardButton={handleCardButton}
            handleSearch={handleSearch}
            isSearchRunning={isSearchRunning}
            isSearchCompleted={isSearchCompleted}
            isError={isError}
          />
          <ProtectedRoute
            loggedIn={loggedIn}
            path="/saved-movies"
            component={SavedMovies}
            cards={savedCards}
            savedCards={savedCardsCache}
            onCardButton={handleCardButton}
            handleSearch={handleSavedSearch}
            isSearchRunning={isSearchRunning}
            isSearchCompleted={isSearchCompleted}
            isError={isError}
          />
          <ProtectedRoute
            loggedIn={loggedIn}
            path="/profile"
            component={Profile}
            handleUpdateUser={handleUpdateUser}
            handleSignout={handleSignout}
          />
          <Route path="/signin">
            <Login handleLogin={handleLogin}/>
          </Route>
          <Route path="/signup">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path='*'>
            <PageNotFound />
          </Route>
        </Switch>
        <Footer />
        <Navigation isOpen={isNavigationOpen} onClose={closeNavigation} />
        <Popup message={popupMessage} isOpen={isPopupOpen} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
