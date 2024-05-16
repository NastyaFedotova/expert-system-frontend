'use client';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getSystemTest } from '@/api/services/systems';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Text, { TEXT_VIEW } from '@/components/Text';
import { SYSTEMS } from '@/constants';
import useUserStore from '@/store/userStore';
import { classname } from '@/utils';
import { systemIdValidation } from '@/validation/searchParams';

import classes from './page.module.scss';

const cnSystemCreatePage = classname(classes, 'systemTestPage');

type SystemTestPageProps = {
  params: { system_id: number };
};

const Page: React.FC<SystemTestPageProps> = ({ params }) => {
  const router = useRouter();
  //const user = useUserStore((store) => store.user);
  const system_id = useMemo(() => systemIdValidation.safeParse(params).data?.system_id ?? -1, [params]);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [collectedAnswers, setCollectedAnswers] = useState<{ question_id: number; answer: string }[]>();

  const { data, isSuccess, isLoading } = useSuspenseQuery({
    queryKey: [SYSTEMS.TEST, { system_id: system_id }],
    queryFn: async () => await getSystemTest(system_id),
  });

  const currentQuestion = useMemo(() => data.questions[currentQuestionNumber], [currentQuestionNumber, data.questions]);

  console.log(router, system_id);

  const handleNextQuestion = useCallback(() => setCurrentQuestionNumber((prev) => prev + 1), []);

  return (
    <div className={cnSystemCreatePage()}>
      <header className={cnSystemCreatePage('header')}>
        <Text view={TEXT_VIEW.title} className={cnSystemCreatePage('title')}>
          Прохождение системы
        </Text>
      </header>
      <main>
        <Text view={TEXT_VIEW.p20}>{currentQuestion?.body}</Text>
        {currentQuestion?.with_chooses ? (
          currentQuestion.answers.map((answer) => <div key={answer.id}>{answer.body}</div>)
        ) : (
          <Input />
        )}
        <Button onClick={handleNextQuestion}>Пропустить вопрос</Button>
      </main>
    </div>
  );
};

export default memo(Page);
