import Link from 'next/link';

import { classname } from '@/utils';

import classes from './styles.module.scss';

const cnRegistrationPage = classname(classes, 'registrationPage');

const Page = () => {
  return (
    <div className={cnRegistrationPage()}>
      Регистрация
      <Link href={'/'}>Главная</Link>
    </div>
  );
};

export default Page;
