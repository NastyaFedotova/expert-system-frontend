'use client';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getObjectsWithAttrValues } from '@/api/services/objects';
import { getSystemTest } from '@/api/services/systems';
import Button from '@/components/Button';
import CheckBox from '@/components/CheckBox';
import Input from '@/components/Input';
import Text, { TEXT_VIEW } from '@/components/Text';
import { OBJECTS, SYSTEMS } from '@/constants';
import { TAnswer } from '@/types/answers';
import { TRule } from '@/types/rules';
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
  const [collectedAnswers, setCollectedAnswers] = useState<{ question_id: number; answer: string }[]>([]);
  const [currentOption, setCurrentOption] = useState<TAnswer | undefined>();
  const [rules, setRules] = useState<TRule[]>();

  const { data: systemTestData } = useSuspenseQuery({
    queryKey: [SYSTEMS.TEST, { system_id: system_id }],
    queryFn: async () => {
      const res = await getSystemTest(system_id);
      setRules(res.rules);
      return res;
    },
  });

  const { data: objectsData } = useSuspenseQuery({
    queryKey: [OBJECTS.GET, { system_id: system_id }],
    queryFn: async () => await getObjectsWithAttrValues(system_id),
  });

  const currentQuestion = useMemo(
    () => systemTestData.questions[currentQuestionNumber],
    [currentQuestionNumber, systemTestData.questions],
  );

  const handleNextQuestion = useCallback(() => setCurrentQuestionNumber((prev) => prev + 1), []);

  const handleOptionClick = useCallback(
    (option: TAnswer) => () => {
      setCurrentOption(option);
    },
    [],
  );

  const handleInputChange = useCallback(
    (question_id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentOption({ id: -1, question_id, body: event.currentTarget.value });
    },
    [],
  );

  const handleAccept = useCallback(() => {
    if (currentOption) {
      setCollectedAnswers((prev) =>
        prev.concat({ question_id: currentOption.question_id, answer: currentOption.body }),
      );
      setCurrentQuestionNumber((prev) => prev + 1);
      setCurrentOption(undefined);

      
    }
  }, [currentOption]);

  return (
    <div className={cnSystemCreatePage()}>
      <header className={cnSystemCreatePage('header')}>
        <Text view={TEXT_VIEW.title} className={cnSystemCreatePage('title')}>
          Прохождение системы
        </Text>
        <Text view={TEXT_VIEW.p20} className={cnSystemCreatePage('subtitle')}>
          {`Вопрос ${currentQuestionNumber + 1} из ${systemTestData.questions.length}`}
        </Text>
      </header>
      <main className={cnSystemCreatePage('main')}>
        <div className={cnSystemCreatePage('answersField')}>
          <Text view={TEXT_VIEW.p20} className={cnSystemCreatePage('questionTitle')}>
            {currentQuestion?.body}
          </Text>
          {currentQuestion?.with_chooses ? (
            currentQuestion.answers.map((answer) => (
              <div key={answer.id} className={cnSystemCreatePage('option')} onClick={handleOptionClick(answer)}>
                <CheckBox value={answer.body} checked={currentOption?.id === answer.id} />
                <Text>{answer.body}</Text>
              </div>
            ))
          ) : (
            <Input type="number" placeholder="Введите ответ" onChange={handleInputChange(currentQuestion.id)} />
          )}
        </div>
        <div className={cnSystemCreatePage('buttons')}>
          <Button className={cnSystemCreatePage('button-abort')}>Завершить тестирование</Button>
          <Button onClick={handleNextQuestion} className={cnSystemCreatePage('button-pass')}>
            Пропустить вопрос
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!currentOption}
            className={cnSystemCreatePage('button-accept', { disabled: !currentOption })}
          >
            Далее
          </Button>
        </div>
      </main>
    </div>
  );
};

export default memo(Page);
