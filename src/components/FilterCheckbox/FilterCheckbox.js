export default function FilterCheckbox({text}) {
  return (
    <label className="filter-checkbox">
      <input className="filter-checkbox__hidden" type="checkbox"></input>
      <span className="filter-checkbox__slider"></span>
      <span className="filter-checkbox__text">{text}</span>
    </label>
  );
}
