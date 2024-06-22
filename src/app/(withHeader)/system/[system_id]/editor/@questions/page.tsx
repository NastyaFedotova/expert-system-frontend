'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { createAnswers, deleteAnswers, updateAnswers } from '@/api/services/answers';
import {
  createQuestionsWithAnswers,
  deleteQuestions,
  getQuestionsWithAnswers,
  updateQuestions,
} from '@/api/services/questions';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import QuestionField from '@/components/QuestionField';
import { QUESTIONS } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import useUserStore from '@/store/userStore';
import { TAnswerNew, TAnswerUpdate } from '@/types/answers';
import { TQuestionUpdate, TQuestionWithAnswersForm, TQuestionWithAnswersNew } from '@/types/questions';
import { classname } from '@/utils';
import { formQuestionWithAnswersValidation } from '@/validation/questions';

import classes from './page.module.scss';

const cnQuestions = classname(classes, 'editor-questions');

type PageProps = {
  params: { system_id: number };
};

const Page: React.FC<PageProps> = ({ params }) => {
  const queryClient = useQueryClient();
  const user = useUserStore((store) => store.user);

  const [toDelete, setToDelete] = useState({ questions: [] as number[], answers: [] as number[] });

  const system_id = useMemo(() => Number(params.system_id) ?? -1, [params]);

  const { data, isLoading } = useSuspenseQuery({
    queryKey: [QUESTIONS.GET, { user: user?.id, system: system_id }],
    queryFn: () => getQuestionsWithAnswers(system_id),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields, isValid },
  } = useForm<TQuestionWithAnswersForm>({
    defaultValues: { formData: data },
    resolver: zodResolver(formQuestionWithAnswersValidation),
    mode: 'all',
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (responseList: Promise<unknown>[]) => Promise.allSettled(responseList),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUESTIONS.GET, { user: user?.id, system: system_id }] }),
    onSettled: () => setToDelete({ questions: [], answers: [] }),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'formData', keyName: 'arrayId' });

  const isFormDirty = useCallback(() => {
    const isDirtyForm = dirtyFields.formData?.some((question) => {
      if (question.id || question.body || question.system_id || question.with_chooses) {
        return true;
      }
      return question.answers?.some((answer) => Object.values(answer).some((val) => val));
    });
    return isDirtyForm || !!toDelete.answers.length || !!toDelete.questions.length;
  }, [dirtyFields.formData, toDelete]);

  const handleFormSubmit = useCallback(
    (form: TQuestionWithAnswersForm) => {
      const questionsUpdate: TQuestionUpdate[] = [];
      const answersUpdate: TAnswerUpdate[] = [];
      const questionsNew: TQuestionWithAnswersNew[] = [];
      const answersNew: TAnswerNew[] = [];
      const questionsDelete: number[] = [];
      const answersDelete: number[] = [];

      form.formData.forEach((question, questionIndex) => {
        const newAnswersNewQuestions: string[] = [];

        question.answers.forEach((answer, answerIndex) => {
          switch (true) {
            case toDelete.questions.includes(question.id):
              questionsDelete.push(question.id);
              return;
            case !question.with_chooses:
              answersDelete.push(answer.id);
              return;
            case !toDelete.answers.includes(answer.id):
              if (answer.id === -1) {
                if (answer.question_id === -1) {
                  newAnswersNewQuestions.push(answer.body);
                } else {
                  answersNew.push({ question_id: answer.question_id, body: answer.body });
                }
              }
              if (
                !dirtyFields.formData?.[questionIndex]?.answers?.[answerIndex]?.id &&
                dirtyFields.formData?.[questionIndex]?.answers?.[answerIndex]?.body
              ) {
                answersUpdate.push({ id: answer.id, body: answer.body });
              }
              return;
            default:
              answersDelete.push(answer.id);
              return;
          }
        });

        if (!toDelete.questions.includes(question.id)) {
          if (question.id === -1) {
            questionsNew.push({
              system_id: question.system_id,
              body: question.body,
              with_chooses: question.with_chooses,
              answers_body: newAnswersNewQuestions,
            });
          }
          if (
            !dirtyFields.formData?.[questionIndex]?.id &&
            (dirtyFields.formData?.[questionIndex]?.body || dirtyFields.formData?.[questionIndex]?.with_chooses)
          ) {
            questionsUpdate.push({ id: question.id, body: question.body, with_chooses: question.with_chooses });
          }
        }
      });

      const responses = [];
      if (questionsNew.length) {
        responses.push(createQuestionsWithAnswers(questionsNew));
      }
      if (questionsUpdate.length) {
        responses.push(updateQuestions(questionsUpdate));
      }
      if (answersNew.length) {
        responses.push(createAnswers(answersNew));
      }
      if (answersUpdate.length) {
        responses.push(updateAnswers(answersUpdate));
      }
      if (questionsDelete.length) {
        responses.push(deleteQuestions(questionsDelete));
      }
      if (answersDelete.length) {
        responses.push(deleteAnswers(answersDelete));
      }

      mutate(responses);
    },
    [dirtyFields, mutate, toDelete],
  );
  const handleAddQuestion = useCallback(
    () => append({ id: -1, system_id: system_id, body: '', with_chooses: true, answers: [] }),
    [append, system_id],
  );
  const handleDeleteQuestion = useCallback(
    (questionId: number, questionIndex: number) => () => {
      if (questionId === -1) {
        remove(questionIndex);
      } else {
        setToDelete((prev) => ({ questions: prev.questions.concat(questionId), answers: prev.answers }));
      }
    },
    [remove],
  );
  const handleDeleteAnswer = useCallback(
    (answerId: number) =>
      setToDelete((prev) => ({ questions: prev.questions, answers: prev.answers.concat(answerId) })),
    [],
  );

  useEffect(() => reset({ formData: data }), [data, reset]);

  return (
    <main className={cnQuestions()}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cnQuestions('form')}>
        {fields.map((question, questionIndex) => (
          <QuestionField
            key={question.arrayId}
            isVisible={!toDelete.questions.includes(question.id)}
            questionId={question.id}
            control={control}
            questionIndex={questionIndex}
            onDelete={handleDeleteQuestion(question.id, questionIndex)}
            onAnswerDelete={handleDeleteAnswer}
            deletedSubFieldIds={toDelete.answers}
          />
        ))}
        <div className={cnQuestions('newQuestion')}>
          <AddIcon width={30} height={30} className={cnQuestions('newQuestion-addIcon')} onClick={handleAddQuestion} />
          <Input className={cnQuestions('newQuestion-input')} onClick={handleAddQuestion} placeholder="Новый вопрос" />
        </div>
        <div className={cnQuestions('loadingScreen', { enabled: isLoading || isPending })} />
        <Button
          className={cnQuestions('submitButton', { visible: isFormDirty() })}
          disabled={isLoading || isPending || !isValid}
          loading={isLoading || isPending}
        >
          Сохранить
        </Button>
      </form>
    </main>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false, loading: () => <Loader sizepx={116} /> });
