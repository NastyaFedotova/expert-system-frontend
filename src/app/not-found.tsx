import Link from 'next/link';

import Text, { TEXT_VIEW } from '@/components/Text';
import classname from '@/utils/classname';

import classes from './not-found.module.scss';

const cnNotFound = classname(classes, 'not-found');

export default function NotFound() {
  return (
    <div className={cnNotFound()}>
      <Text view={TEXT_VIEW.title} className={cnNotFound('404')}>
        404
      </Text>
      <h2>Not Found</h2>
      <p>Извините! Страница, которую Вы ищете, не может быть найдена</p>
      <Link href="/" className={cnNotFound('button-back')}>
        Вернуться на главную страницу
      </Link>
    </div>
  );
}
