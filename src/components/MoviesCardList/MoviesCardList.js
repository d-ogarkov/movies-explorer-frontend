import {useEffect, useState} from 'react';
import {viewSettings} from '../../utils/utils';
import MoviesCard from '../MoviesCard/MoviesCard';
import Preloader from '../Preloader/Preloader';

// cards - карточки для отображения
// savedCards - все сохраненные карточки, чтобы определять, какие из cards уже сохранены, и показывать кнопки Save/Unsave
// isViewingSavedCards - если true, значит, показываем сохраненные карточки из нашей базы, у всех будет кнопка Unsave; также передается в MoviesCard для отображения, т.к. структура карточек в базе немного отличается от структуры карточек из MoviesApi
export default function MoviesCardList({cards, savedCards, onCardButton, isSearchRunning, isSearchCompleted, isError, isViewingSavedCards}) {
  const [cardsShown, setCardsShown] = useState(0);
  const [cardsToAdd, setCardsToAdd] = useState(0);
  const {width, height} = useResizeListener();

  // Сбрасываем количество отображаемых карточек при обновлении массива cards
  useEffect(() => {
    renderCardList({width, height});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  // Обрабатывает нажатие кнопки «Еще» (добавляет карточки внизу из найденных)
  function handleMoreButtonClick() {
    setCardsShown(cardsShown + cardsToAdd);
  }

  // Выдает разметку кнопки «Еще», если показаны не все карточки
  function MoreButton() {
    if (cards.length > cardsShown) {
      return (
        <button className="movies__more-btn" onClick={handleMoreButtonClick}>Еще</button>
      )
    }
  }

  function getWindowSize() {
    const {
      innerWidth: width,
      innerHeight: height,
    } = window;
    return {width, height};
  }
  
  // Обработка ресайза окна и подстройка количества отображаемых/добавляемых по кнопке «Еще» карточек
  function useResizeListener() {
    const [windowSize, setWindowSize] = useState(
      getWindowSize()
    );
  
    useEffect(() => {
      var resizeTimeout;

      // Обеспечивает понижение частоты вызова обработчика ресайза окна
      function handleResizeThrottler() {
        if (!resizeTimeout) {
          resizeTimeout = setTimeout(function() {
            resizeTimeout = null;
            handleResize();
          }, 200); // handleResize будет вызываться не чаще, чем 1 раз в указанное количество миллисекунд
        }
      }

      // Реальный обработчик события ресайза окна
      function handleResize() {
        setWindowSize(getWindowSize());
        renderCardList(getWindowSize());
      }
  
      // handleResizeThrottler будет вызываться при ресайзе
      window.addEventListener("resize", handleResizeThrottler, false);
      // Запустим событие ресайза один раз при старте
      window.dispatchEvent(new Event('resize'));
      return () => window.removeEventListener("resize", handleResizeThrottler);
    }, []);
  
    return windowSize;
  }

  // Пересчитывает количество отображаемых и добавляемых карточек в зависимости от размера окна
  function renderCardList({width, height}) {
    if (width >= viewSettings.maxWidth.value) {
      setCardsShown(viewSettings.maxWidth.cardsShown);
      setCardsToAdd(viewSettings.maxWidth.cardsToAdd);
    } else if (width >= viewSettings.mediumWidth.value) {
      setCardsShown(viewSettings.mediumWidth.cardsShown);
      setCardsToAdd(viewSettings.mediumWidth.cardsToAdd);
    } else {
      setCardsShown(viewSettings.minWidth.cardsShown);
      setCardsToAdd(viewSettings.minWidth.cardsToAdd);
    }
  }

  // В карточках от MoviesApi идентификатор фильма - card.id, а у нас в базе - card._id.
  // Для Реакта в цикле надо использовать любой, лишь бы уникальный
  return (
    <>
      {
        cards && cards.length && !isSearchRunning ? (
          <>
          <ul className="movies__cardlist">
            {cards.slice(0, cardsShown).map((card) => (
              <MoviesCard
                card={card}
                key={card.id || card._id}
                onCardButton={onCardButton}
                isSaved={
                  isViewingSavedCards ? (
                    true
                  ) : (
                    savedCards.some(i => i.movieId === card.id)
                  )
                }
                isViewingSavedCards={isViewingSavedCards}
              />
            ))}
          </ul>
          <MoreButton />
          </>
        ) : (
          isSearchCompleted === true && <p className="movies__message">Ничего не найдено</p>
        )
      }
      {
        isError ? (
          <p className="movies__message">Во&nbsp;время запроса произошла ошибка. Возможно, проблема с&nbsp;соединением или сервер недоступен. Подождите немного и&nbsp;попробуйте ещё раз.</p>
        ) : (
          isSearchRunning && <Preloader />
        )
      }
    </>
  );
}
