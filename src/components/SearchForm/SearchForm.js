import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

export default function SearchForm() {
  return (
    <section className="search-form">
      <form className="search-form__combined">
        <div className="search-form__main-block">
          <div className="search-form__icon"></div>
          <input type="text" className="search-form__input" id="input" name="input" placeholder="Фильм" required></input>
          <button type="submit" className="search-form__button" value=""></button>
        </div>
        <div className="search-form__aux-block">
          <FilterCheckbox text="Короткометражки" />
        </div>
      </form>
    </section>
  );
}