import {useEffect} from 'react';
import SearchForm from '../SearchForm/SearchForm';
import MoviesCardList from '../MoviesCardList/MoviesCardList';

// Сюда не передается savedCards, т.к. все cards являются сохраненными.
// Но в MoviesCardList мы должны обязательно передать isViewingSavedCards={true}, чтобы он не обращался к savedCards
export default function SavedMovies({cards, onCardButton, searchQuery, handleSearch, isSearchCompleted, isError, onMount, clearSignal}) {

  // При открытии страницы "Сохраненные фильмы" сбрасываем поиск, если он был, и показываем все сохраненные карточки
  useEffect(() => {
    onMount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="saved-movies">
      <SearchForm handleSearch={handleSearch} searchQuery={searchQuery} searchShorts={false} isSearchCompleted={isSearchCompleted} isClearedOnMount={true} clearSearchForm={clearSignal} />
      <MoviesCardList cards={cards} onCardButton={onCardButton} isSearchRunning={false} isSearchCompleted={isSearchCompleted} isError={isError} isViewingSavedCards={true} />
    </main>
  );
}
