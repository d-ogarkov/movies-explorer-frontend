import {useState} from 'react';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

export default function SearchForm({handleSearch, isSearchCompleted}) {
  // Не выносим загрузку значений из localStorage сюда (т.к. это асинхронный процесс),
  // а делаем это в useEffect ниже
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [searchShorts, setSearchShorts] = useState(JSON.parse(localStorage.getItem('searchShorts')) || false);
  const [isEmptyQuery, setIsEmptyQuery] = useState(false);

  // Обрабатывает нажатие кнопки поиска
  function handleSubmit(e) {
    e.preventDefault();
    // Сохраняем поисковый запрос и положение переключателя «Короткометражки»,
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.setItem('searchShorts', JSON.stringify(searchShorts));

    if (searchQuery.length) {
      setIsEmptyQuery(false);
      // Запускаем внешний обработчик поиска
      handleSearch(searchQuery, searchShorts);
    } else {
      setIsEmptyQuery(true);
    }
  }

  // Обрабатывает нажатие переключателя «Короткометражки»
  function handleShortsChange(newValue) {
    setSearchShorts(newValue);

    // Если поиск уже выполнен, запускаем его снова с учетом нового состояния переключателя
    if (isSearchCompleted) {
      localStorage.setItem('searchQuery', searchQuery);
      localStorage.setItem('searchShorts', JSON.stringify(newValue));

      if (searchQuery.length) {
        // Запускаем внешний обработчик поиска, useCache=true для использования кэша
        handleSearch(searchQuery, newValue, true);
      }
    }
  }

  return (
    <section className="search-form">
      <form className="search-form__combined" action="/" method="post" onSubmit={handleSubmit}>
        <div className="search-form__main-block">
          <div className="search-form__icon"></div>
          <input type="text" className="search-form__input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} id="input" name="input" placeholder="Фильм"></input>
          { isEmptyQuery && (
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
