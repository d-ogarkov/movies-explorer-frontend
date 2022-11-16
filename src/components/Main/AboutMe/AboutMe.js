import portrait from '../../../images/student.jpg';

export default function AboutMe() {
  return (
    <section className="about-me">
      <h2 className="main__header">Студент</h2>
      <div className="about-me__bio">
        <img className="about-me__portrait" src={portrait} alt="Портрет" />
        <div className="about-me__text">
          <h3 className="about-me__title">Виталий</h3>
          <p className="about-me__description">Фронтенд-разработчик, 30 лет</p>
          <p className="about-me__paragraph">Я родился и&nbsp;живу в&nbsp;Саратове, закончил факультет экономики СГУ. У&nbsp;меня есть жена и&nbsp;дочь. Я&nbsp;люблю слушать музыку, а&nbsp;ещё увлекаюсь бегом. Недавно начал кодить. С&nbsp;2015 года работал в&nbsp;компании «СКБ Контур». После того, как прошёл курс по&nbsp;веб-разработке, начал заниматься фриланс-заказами и&nbsp;ушёл с&nbsp;постоянной работы.</p>
          <ul className="about-me__links">
            <li className="about-me__link">Facebook</li>
            <li className="about-me__link">Github</li>
          </ul>
        </div>
      </div>
    </section>
  );
}