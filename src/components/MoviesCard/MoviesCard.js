export default function MoviesCard({title, duration, thumbnail, isOwn}) {
  const cardButtonClassName = (
    isOwn ? 'card__unsave-btn' : 'card__save-btn'
  );

  return (
    <li className="card">
      <div class="card__header">
        <div class="card__text">
          <h2 className="card__title">{title}</h2>
          <p className="card__duration">{duration}</p>
        </div>
        <button type="button" className={cardButtonClassName}></button>
      </div>
      <img className="card__thumbnail" src={thumbnail} alt={title} />
    </li>
  );
}
