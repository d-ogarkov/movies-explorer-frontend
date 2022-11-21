import {useEffect, useState} from 'react';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

export default function SearchForm({searchQuery, searchShorts, handleSearch, isSearchCompleted, isClearedOnMount, clearSearchForm}) {
/*  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [searchShorts, setSearchShorts] = useState(JSON.parse(localStorage.getItem('searchShorts')) || false); */
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery || '');
  const [isEmptyQuery, setIsEmptyQuery] = useState(false); // Если true, значит, запрос не введен, сабмит нужно блокировать

  // Если isClearedOnMount === true и меняется состояние clearSearchForm, поисковая строка
  useEffect(() => {
    if (isClearedOnMount) {
      setCurrentSearchQuery('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSearchForm]);

  // Обрабатывает нажатие кнопки поиска
  function handleSubmit(e) {
    e.preventDefault();
    // Сохраняем поисковый запрос и положение переключателя «Короткометражки»
    /*localStorage.setItem('searchQuery', searchQuery);
    localStorage.setItem('searchShorts', JSON.stringify(searchShorts));*/

    if (currentSearchQuery.length) {
      setIsEmptyQuery(false);
      // Запускаем внешний обработчик поиска
      handleSearch(currentSearchQuery, searchShorts);
    } else {
      setIsEmptyQuery(true);
    }
  }

  // Обрабатывает нажатие переключателя «Короткометражки»
  function handleShortsChange(newShortsValue) {
    //setSearchShorts(newValue);

    // Если поиск уже выполнен, запускаем его снова с учетом нового состояния переключателя
    if (isSearchCompleted) {
      /*localStorage.setItem('searchQuery', searchQuery);
      localStorage.setItem('searchShorts', JSON.stringify(newShortsValue));*/

      if (currentSearchQuery.length) {
        // Запускаем внешний обработчик поиска
        handleSearch(currentSearchQuery, newShortsValue);
      }
    }
  }

  return (
    <section className="search-form">
      <form className="search-form__combined" action="/" method="post" onSubmit={handleSubmit}>
        <div className="search-form__main-block">
          <div className="search-form__icon"></div>
          <input type="text" className="search-form__input" value={currentSearchQuery} onChange={e => setCurrentSearchQuery(e.target.value)} id="input" name="input" placeholder="Фильм"></input>
          {isEmptyQuery && (
            <div className="search-form__error">Нужно ввести ключевое слово</div>
          )}
          <button type="submit" className="search-form__button" value=""></button>
        </div>
        <div className="search-form__aux-block">
          <FilterCheckbox text="Короткометражки" сheckedInitial={searchShorts} handleClick={handleShortsChange} />
        </div>
      </form>
    </section>
  );
}
