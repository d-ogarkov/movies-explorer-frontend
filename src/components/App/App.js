import {useState} from 'react';
import {Route, Switch} from 'react-router-dom';
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

function App() {
  const [isNavigationOpen, setNavigationOpen] = useState(false);

  function handleMenuBtnClick() {
    console.log('handleMenuBtnClick');
    setNavigationOpen(true);
  }

  function closeNavigation() {
    setNavigationOpen(false);
  }

  return (
    <div className="app">
      <Switch>
        <Route exact path="/">
          <Header onMenuBtnClick={handleMenuBtnClick}/>
          <Main />
          <Footer />
          <Navigation isOpen={isNavigationOpen} onClose={closeNavigation} />
        </Route>
        <Route path="/movies">
          <Header onMenuBtnClick={handleMenuBtnClick}/>
          <Movies />
          <Footer />
          <Navigation isOpen={isNavigationOpen} onClose={closeNavigation} />
        </Route>
        <Route path="/saved-movies">
          <Header onMenuBtnClick={handleMenuBtnClick}/>
          <SavedMovies />
          <Footer />
          <Navigation isOpen={isNavigationOpen} onClose={closeNavigation} />
        </Route>
        <Route path="/profile">
          <Header onMenuBtnClick={handleMenuBtnClick}/>
          <Profile />
          <Navigation isOpen={isNavigationOpen} onClose={closeNavigation} />
        </Route>
        <Route path="/signin">
          <Login />
        </Route>
        <Route path="/signup">
          <Register />
        </Route>
        <Route path='*'>
          <PageNotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
