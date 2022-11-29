import {moviesApiSettings} from '../../utils/utils';

export default function MoviesCard({card, onCardButton, isSaved, isViewingSavedCards}) {
  const cardButtonClassName = (
    // Кнопка сохранения выглядит по-разному для сохраненных и несохраненных карточек,
    // для сохраненных есть два варианта для страниц "Фильмы" и "Сохраненные фильмы"
    isSaved ? (
      isViewingSavedCards ? (
        'card__unsave-btn'
      ) : (
        'card__save-btn card__save-btn_active'
      )
    ) : (
      'card__save-btn'
    )
  );

  function formatDuration(duration) {
    return Math.floor(duration / 60) + 'ч ' + (duration % 60) + 'м';
  }

  function handleCardButton() {
    onCardButton(card);
  }

  // В карточках от MoviesApi адрес картинки относительный, а в сохраненных уже абсолютный,
  // поэтому img src ниже генерится по-разному для разных типов карточек
  return (
    <li className="card">
      <div className="card__header">
        <div className="card__text">
          <h2 className="card__title">{card.nameRU}</h2>
          <p className="card__duration">{formatDuration(card.duration)}</p>
        </div>
        <button type="button" className={cardButtonClassName} onClick={handleCardButton}></button>
      </div>
      <a href={card.trailerLink} target="_blank" rel="noreferrer">
        <img
          className="card__thumbnail" src={
            isViewingSavedCards ? (
              card.image
            ) : (
              moviesApiSettings.baseUrl + card.image.url
            )
          }
          alt={card.nameRU}
        />
      </a>
    </li>
  );
}
