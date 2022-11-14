import MoviesCard from '../MoviesCard/MoviesCard';

import thumbnail1 from '../../images/movie1.jpg';
import thumbnail2 from '../../images/movie2.jpg';
import thumbnail3 from '../../images/movie3.jpg';
import thumbnail4 from '../../images/movie4.jpg';
import thumbnail5 from '../../images/movie5.jpg';
import thumbnail6 from '../../images/movie6.jpg';

export default function MoviesCardList({isOwn}) {
  return (
    <>
    <ul className="movies__cardlist">
      <MoviesCard title="33 слова о дизайне" duration="1ч 47м" thumbnail={thumbnail1} isOwn={isOwn} />
      <MoviesCard title="33 слова о дизайне" duration="1ч 47м" thumbnail={thumbnail2} isOwn={isOwn} />
      <MoviesCard title="33 слова о дизайне" duration="1ч 47м" thumbnail={thumbnail3} isOwn={isOwn} />
      <MoviesCard title="33 слова о дизайне" duration="1ч 47м" thumbnail={thumbnail4} isOwn={isOwn} />
      <MoviesCard title="33 слова о дизайне" duration="1ч 47м" thumbnail={thumbnail5} isOwn={isOwn} />
      <MoviesCard title="33 слова о дизайне" duration="1ч 47м" thumbnail={thumbnail6} isOwn={isOwn} />
    </ul>
    <button class="movies__more-btn">Еще</button>
    </>
  );
}