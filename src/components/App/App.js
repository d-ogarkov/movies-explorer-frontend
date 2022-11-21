import {useState, useEffect} from 'react';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
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
import {moviesApiSettings, shortsDuration} from '../../utils/utils';
import {mainApi} from '../../utils/MainApi';

function App() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isSearchRunning, setIsSearchRunning] = useState(false);
  const [isSearchCompleted, setIsSearchCompleted] = useState(false);
  const [isSearchSavedCompleted, setIsSearchSavedCompleted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [currentUser, setCurrentUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState(JSON.parse(localStorage.getItem('searchQuery')) || '');
  const [searchSavedQuery, setSearchSavedQuery] = useState('');
  const [clearSignal, setClearSignal] = useState(0);
  const [searchShorts, setSearchShorts] = useState(JSON.parse(localStorage.getItem('searchShorts')) || '');
  const [cards, setCards] = useState([]); // Карточки для страницы "Фильмы", отфильтрованные поиском 
  const [savedCards, setSavedCards] = useState([]); // Карточки для "Сохраненных фильмов", отфильтрованные поиском
  const [savedCardsCache, setSavedCardsCache] = useState([]); // Все сохраненные карточки, не отфильтрованные поиском
  const [loggedIn, setLoggedIn] = useState(null); // В момент первого рендера значение еще не true и не false (для ProtectedRoute)
  const history = useHistory();

  useEffect(() => {
    // Проверяем, есть ли сохраненный токен пользователя
    const token = localStorage.getItem('token');
    if (token) {
      tokenCheck(token);
    } else {
      setLoggedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMenuBtnClick() {
    setIsNavigationOpen(true);
  }

  function closeNavigation() {
    setIsNavigationOpen(false);
  }

  function performSearch(newSearchQuery, newSearchShorts) {
    // Включаем показ прелоадера и запускаем поиск
    setIsSearchRunning(true);
    setIsError(false);
    setIsSearchCompleted(false);

    searchMovies(newSearchQuery).then((searchResult) => {
      // Если установлен переключатель «Короткометражки», то отфильтровывам массив:
      // оставляем только фильмы длительностью до 40 минут включительно
      if (newSearchShorts === true) {
        searchResult = searchResult.filter(function (movie) {
          return movie.duration <= shortsDuration;
        });
      }

      // По окончании поиска выключаем прелоадер и запоминаем, что поиск выполнен
      setIsSearchRunning(false);
      setIsSearchCompleted(true);

      // Отображаем карточки найденных фильмов
      setCards(searchResult);
    })
    .catch((err) => {
      console.log(err);
      setIsError(true);
    });
  }

  // Обрабатывает нажатие кнопки поиска фильмов
  function handleSearch(newSearchQuery, newSearchShorts) {
    // Сохраняем запрос и состояние переключателя "Короткометражки"
    setSearchQuery(newSearchQuery);
    setSearchShorts(newSearchShorts);
    localStorage.setItem('searchQuery', JSON.stringify(newSearchQuery));
    localStorage.setItem('searchShorts', JSON.stringify(newSearchShorts));

    performSearch(newSearchQuery, newSearchShorts);
  }

  // Обрабатывает нажатие кнопки поиска фильмов среди сохраненных
  function handleSavedSearch(newSearchQuery, newSearchShorts) {
    setSearchSavedQuery(newSearchQuery);
    setIsError(false);
    setIsSearchSavedCompleted(false);

    // Отфильтровываем все сохраненные фильмы (savedCardsCache) по поисковому запросу
    var searchResult = savedCardsCache.filter((movie) =>
      movie.nameRU.toLowerCase()
        .includes(newSearchQuery.toLowerCase())
    );

    // Если установлен переключатель «Короткометражки», то дополнительно фильтруем массив:
    // оставляем только фильмы длительностью до 40 минут включительно
    if (newSearchShorts === true) {
      searchResult = searchResult.filter(function (movie) {
        return movie.duration <= shortsDuration;
      });
    }

    setIsSearchSavedCompleted(true);
  
    // Отображаем карточки найденных фильмов
    setSavedCards(searchResult);
  }

  // Ищет в массиве фильмов из MoviesApi (загружая его или используя сохраненный) по заданному запросу
  function searchMovies(query) {
    // Загрузка фильмов - асинхронный запрос, поэтому возвращаем промис
    return new Promise(function(resolve, reject) {
      // Если уже загружали все фильмы, используем сохраненный массив
      const moviesCacheJSON = localStorage.getItem('moviesCache');
      if (moviesCacheJSON) {
        const moviesCache = JSON.parse(moviesCacheJSON);
        if (moviesCache.length) {
          resolve(moviesCache.filter((movie) =>
          movie.nameRU.toLowerCase()
            .includes(query.toLowerCase())
          ));
        } else {
          // Если что-то пошло не так с сохраненной базой фильмов, удаляем ее из хранилища
          localStorage.removeItem('moviesCache');
          reject();
        }
      } else {
        // Если еще не загружали базу фильмов, обращаемся к MoviesApi
        moviesApi.getMovies()
          .then(resMovies => {
            // Сохраняем фильмы для последующих поисков
            localStorage.setItem('moviesCache', JSON.stringify(resMovies));
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
      setSavedCardsCache(resMovies);
      setSavedCards(resMovies);
      setSearchSavedQuery('');
      localStorage.setItem('savedMoviesCache', JSON.stringify(resMovies));
    })
    .catch((err) => {
      console.log(err);
      openPopup('Что-то пошло не так! Попробуйте ещё раз.');
    });
  }

  // Сбрасывает состояние массива сохраненных карточек к полному варианту, без поисковой фильтрации
  function resetSavedCards() {
    setSavedCards(savedCardsCache);
    setSearchSavedQuery('');
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
      // Перезагрузим сохраненные карточки с сервера, чтобы правильно отображать кнопки добавления/удаления
      // и страницу "Сохраненные фильмы" с учетом добавленной карточки
      setSavedCards([...savedCards, res]);
      const newSavedCardsCache = [...savedCardsCache, res];
      setSavedCardsCache(newSavedCardsCache);
      localStorage.setItem('savedMoviesCache', JSON.stringify(newSavedCardsCache));
      setSearchSavedQuery('');
      setClearSignal(clearSignal + 1);
    })
    .catch((err) => {
      console.log(err);
      openPopup('Что-то пошло не так! Попробуйте ещё раз.');
      if (err.status === 401) {
        handleSignout();
      }
    });
  }

  // Удаляет карточку из сохраненных
  function cardUnsave(card) {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    mainApi.deleteMovie(card._id)
    .then(res => {
      // Перезагрузим сохраненные карточки с сервера, чтобы правильно отображать кнопки добавления/удаления
      // и страницу "Сохраненные фильмы" с учетом удаленной карточки
      setSavedCards(savedCards.filter(savedCard => savedCard._id !== card._id));
      const newSavedCardsCache = savedCardsCache.filter(savedCard => savedCard._id !== card._id);
      setSavedCardsCache(newSavedCardsCache);
      localStorage.setItem('savedMoviesCache', JSON.stringify(newSavedCardsCache));
      setSearchSavedQuery('');
      setClearSignal(clearSignal + 1);
    })
    .catch((err) => {
      console.log(err);
      openPopup('Что-то пошло не так! Попробуйте ещё раз.');
      if (err.status === 401) {
        handleSignout();
      }
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

  // Обрабатывает сохранение данных на странице "Профиль"
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

  // Выход из аккаунта: удаление данных из стейтов, локального хранилища и редирект на главную
  function handleSignout() {
    setIsNavigationOpen(false);
    setIsSearchRunning(false);
    setIsSearchCompleted(false);
    setIsSearchSavedCompleted(false);
    setIsError(false);
    setIsPopupOpen(false);
    setPopupMessage('');
    setCurrentUser([]);
    setCards([]);
    setSavedCards([]);
    setSavedCardsCache([]);
    setSearchQuery('');
    setSearchSavedQuery('');
    setSearchShorts(false);
    setLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('searchQuery');
    localStorage.removeItem('searchShorts');
    localStorage.removeItem('moviesCache');
    localStorage.removeItem('savedMoviesCache');
    history.push("/");
  }

  // Загружает информацию о пользователе и сохраненные карточки
  function loadUserData() {
    mainApi.getUserInfo()
      .then(resUserInfo => {
        // Загружаем имя и email
        setCurrentUser(resUserInfo);

        // Загружаем сохраненные фильмы, сначала пробуем из localStorage
        const savedMoviesCacheJSON = localStorage.getItem('savedMoviesCache');
        if (savedMoviesCacheJSON) {
          const savedMoviesCache = JSON.parse(savedMoviesCacheJSON);
          if (savedMoviesCache.length) {
            setSavedCards(savedMoviesCache);
            setSavedCardsCache(savedMoviesCache);
          } else {
            // Если проблема с JSON, то загружаем из API
            localStorage.removeItem('savedMoviesCache');
            loadSavedMovies();
          }
        } else {
          // Если нет в localStorage, то загружаем из API
          loadSavedMovies();
        }

        // Если есть непустой поисковый запрос, выполняем поиск для главной страницы
        if (searchQuery.length) {
          performSearch(searchQuery, searchShorts);
        }
      })
      .catch((err) => {
        console.log(err);
        openPopup('Что-то пошло не так! Попробуйте ещё раз.');
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
          handleSignout();
        }
      })
      .catch((err) => {
        console.log(err);
        handleSignout();
      });
    } else {
      handleSignout();
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
            searchQuery={searchQuery}
            searchShorts={searchShorts}
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
            onCardButton={handleCardButton}
            searchQuery={searchSavedQuery}
            handleSearch={handleSavedSearch}
            isSearchCompleted={isSearchSavedCompleted}
            isError={isError}
            onMount={resetSavedCards}
            clearSignal={clearSignal}
          />
          <ProtectedRoute
            loggedIn={loggedIn}
            path="/profile"
            component={Profile}
            handleUpdateUser={handleUpdateUser}
            handleSignout={handleSignout}
          />
          <Route path="/signin">
            {loggedIn === true ? (
              <Redirect to="/" />
            ) : (
              <Login handleLogin={handleLogin} />
            )}
          </Route>
          <Route path="/signup">
            {loggedIn === true ? (
              <Redirect to="/" />
            ) : (
              <Register handleRegister={handleRegister} />
            )}
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
