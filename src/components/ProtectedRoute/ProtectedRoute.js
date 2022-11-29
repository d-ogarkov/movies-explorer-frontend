import React from 'react';
import {Route, Redirect} from 'react-router-dom';

// Этот компонент принимает другой компонент в качестве пропса.
// Также может взять неограниченное число пропсов и передать их новому компоненту
const ProtectedRoute = ({ component: Component, ...props }) => {
  // Если loggedIn === true, значит, пользователь залогинен, а если null - мы еще не знаем.
  // Во втором случае компонент рендерится, а данные для него могут прийти позже.
  if (props.loggedIn === true || props.loggedIn === null) {
    return (
      <Route>
        {() =>
          <Component {...props} />
        }
      </Route>
    );
  } else if (props.loggedIn === false) {
    // А если loggedIn === false, значит, пользователь точно не залогинен (нет токена или ошибка).
    // В этом (и только в этом) случае делаем редирект на страницу входа
    return (
      <Route>
        {() =>
          <Redirect to="/" />
        }
      </Route>
    );
  }
};

export default ProtectedRoute;
