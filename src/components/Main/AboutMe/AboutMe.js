import portrait from '../../../images/student.jpg';

export default function AboutMe() {
  return (
    <section className="about-me">
      <h2 className="main__header">Студент</h2>
      <div className="about-me__bio">
        <img className="about-me__portrait" src={portrait} alt="Портрет" />
        <div className="about-me__text">
          <h3 className="about-me__title">Дмитрий</h3>
          <p className="about-me__description">Веб-разработчик, 44 года</p>
          <p className="about-me__paragraph">Родился и&nbsp;живу в&nbsp;Вологде, закончил электроэнергетический факультет ВоГТУ (сейчас ВоГУ). Занимался системным администрированием в&nbsp;коммерческом банке, постепенно взялся за&nbsp;поддержку сайта и&nbsp;разработку ПО. В&nbsp;2013 году ушел заниматься своими проектами на&nbsp;PHP/JavaScript. В&nbsp;2021&mdash;2022&nbsp;гг прошел курс &laquo;Веб-разработчик&raquo; в&nbsp;Яндекс.Практикуме, чтобы продолжать профессиональный рост.</p>
          <ul className="about-me__links">
            <li className="about-me__link">Facebook</li>
            <li className="about-me__link">Github</li>
          </ul>
        </div>
      </div>
    </section>
  );
}