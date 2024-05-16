'use client';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';

import { getAttributesWithValues } from '@/api/services/attributes';
import { getQuestionsWithAnswers } from '@/api/services/questions';
import { getRulesWithClausesAndEffects } from '@/api/services/rules';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import RuleField from '@/components/RuleField';
import Text from '@/components/Text';
import { ATTRIBUTES, OPERATOR, QUESTIONS, RULES } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import useRulePageStore from '@/store/rulePageStore';
import useUserStore from '@/store/userStore';
import { TClauseForForm, TClauseNew, TClauseUpdate } from '@/types/clauses';
import { TRuleAttributeAttributeValue } from '@/types/ruleAttributeAttributeValue';
import { TRuleQuestionAnswerNew } from '@/types/ruleQuestionAnswer';
import { TRuleForForm, TRuleForm, TRuleNew } from '@/types/rules';
import { classname } from '@/utils';
import { formRuleValidation } from '@/validation/rules';
import { systemIdValidation } from '@/validation/searchParams';

import classes from './page.module.scss';

const cnRules = classname(classes, 'editor-rules');

type PageProps = {
  params: { system_id: number };
};

const Page: React.FC<PageProps> = ({ params }) => {
  const queryClient = useQueryClient();
  const user = useUserStore((store) => store.user);
  const { setAttributes, setQuestions } = useRulePageStore((store) => store);
  const [toDelete, setToDelete] = useState({ rules: [] as number[], clauses: [] as number[] });

  const system_id = useMemo(() => systemIdValidation.safeParse(params).data?.system_id ?? -1, [params]);

  const { data: attributesData, isLoading: attributesIsLoading } = useSuspenseQuery({
    queryKey: [ATTRIBUTES.GET, { user: user?.id, system: system_id }],
    queryFn: async () => {
      const res = await getAttributesWithValues(system_id);
      setAttributes(res);
      return res;
    },
  });

  useEffect(() => setAttributes(attributesData), [attributesData, setAttributes]);

  const { data: questionsData, isLoading: questionsIsLoading } = useSuspenseQuery({
    queryKey: [QUESTIONS.GET, { user: user?.id, system: system_id }],
    queryFn: async () => {
      const res = await getQuestionsWithAnswers(system_id);
      setQuestions(res);
      return res;
    },
  });
  useEffect(() => setQuestions(questionsData), [questionsData, setQuestions]);

  const { data: rulesData, isLoading: rulesIsLoading } = useSuspenseQuery({
    queryKey: [RULES.GET, { user: user?.id, system: system_id }],
    queryFn: () => getRulesWithClausesAndEffects(system_id),
  });

  const isLoading = useMemo(
    () => attributesIsLoading || questionsIsLoading || rulesIsLoading,
    [attributesIsLoading, questionsIsLoading, rulesIsLoading],
  );

  const pageData = useMemo<TRuleForm>(() => {
    const res: TRuleForm = { formData: [] };
    rulesData.forEach((rule) => {
      const newRule: TRuleForForm = {
        ...rule,
        deleted: false,
        clauses: [],
        rule_question_answer_ids: rule.rule_question_answer_ids.map((ids) => ({ ...ids, deleted: false })),
        rule_attribute_attributevalue_ids: rule.rule_attribute_attributevalue_ids.map((ids) => ({
          ...ids,
          deleted: false,
        })),
      };
      const clausesMap: Map<string, TClauseForForm[]> = new Map();
      rule.clauses.forEach((clause) => {
        const logicGroup = clausesMap.get(clause.logical_group);
        if (logicGroup) {
          clausesMap.set(clause.logical_group, logicGroup.concat({ ...clause, deleted: false }));
        } else {
          clausesMap.set(clause.logical_group, [{ ...clause, deleted: false }]);
        }
      });
      newRule.clauses = Array.from(clausesMap, ([, clausesArray]) => clausesArray);
      // rule.rule_question_answer_ids.forEach((ids) => {
      //   const question = questionsData.find((question) => question.id === ids.question_id);
      //   const answer = question?.answers.find((answer) => answer.id === ids.answer_id);
      //   if (!!question && !!answer) {
      //     newObject.rule_question_answer_ids = newObject.rule_question_answer_ids.concat(answer);
      //   }
      // });
      // rule.rule_attribute_attributevalue_ids.forEach((ids) => {
      //   const attribute = attributesData.find((attribute) => attribute.id === ids.attribute_id);
      //   const attributeValue = attribute?.values.find((value) => value.id === ids.attribute_value_id);
      //   if (!!attribute && !!attributeValue) {
      //     newObject.rule_attribute_attributevalue_ids =
      //       newObject.rule_attribute_attributevalue_ids.concat(attributeValue);
      //   }
      // });
      res.formData.push(newRule);
    });
    return res;
  }, [rulesData]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields, isValid },
  } = useForm<TRuleForm>({
    defaultValues: pageData,
    resolver: zodResolver(formRuleValidation),
    mode: 'all',
  });

  const { isPending } = useMutation({
    mutationFn: (responseList: Promise<unknown>[]) => Promise.allSettled(responseList),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [RULES.GET, { user: user?.id, system: system_id }] }),
    onSettled: () => setToDelete({ rules: [], clauses: [] }),
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: 'formData', keyName: 'arrayId' });

  const isFormDirty = useCallback(() => {
    const isDirtyForm = dirtyFields.formData?.some((rule) => {
      if (rule.id || rule.system_id || rule.attribute_rule) {
        return true;
      }
      return (
        rule.clauses?.some((clause) => Object.values(clause).some((val) => val)) ||
        rule.rule_question_answer_ids?.some((clause) => Object.values(clause).some((val) => val)) ||
        rule.rule_attribute_attributevalue_ids?.some((clause) => Object.values(clause).some((val) => val))
      );
    });

    return isDirtyForm || !!toDelete.rules.length || !!toDelete.clauses.length;
  }, [dirtyFields, toDelete]);

  const handleFormSubmit = useCallback(
    (form: TRuleForm) => {
      console.log(form);
      const newRules: TRuleNew[] = [];
      const deleteRules: number[] = [];
      // const newClauses: TClauseNew[] = [];
      // const updateClauses: TClauseUpdate[] = [];
      // const deleteClauses: number[];
      // const newRuleQuestionAnsweIds: TRuleQuestionAnswerNew[] = [];
      // const deleteRuleQuestionAnsweIds: number[] = [];
      // const ruleAttributeAttributeValueIds: TRuleAttributeAttributeValue[] = [];
      // const deleteRuleAttributeAttributeValueIds: number[] = [];

      form.formData.forEach((rule) => {
        if (rule.deleted) {
          deleteRules.push(rule.id);
        } else {
          const newRule: TRuleNew = {
            system_id: rule.system_id,
            attribute_rule: rule.attribute_rule,
            clauses: [],
            rule_question_answer_ids: [],
            rule_attribute_attributevalue_ids: [],
          };
          const oldRule = pageData.formData.find((oldRule) => oldRule.id === rule.id);
          const newAttributes = rule.rule_attribute_attributevalue_ids.filter(
            (x) => !oldRule?.rule_attribute_attributevalue_ids.some((y) => x.id === y.id),
          );
          newRule.rule_attribute_attributevalue_ids = newAttributes.map((attr) => ({
            attribute_id: attr.attribute_id,
            rule_id: attr.rule_id,
            attribute_value_id: attr.attribute_value_id,
          }));
          const newQuestions = rule.rule_question_answer_ids.filter(
            (x) => !oldRule?.rule_question_answer_ids.some((y) => x.id === y.id),
          );
          newRule.rule_question_answer_ids = newQuestions.map((question) => ({
            question_id: question.question_id,
            rule_id: question.rule_id,
            answer_id: question.answer_id,
          }));
          newRules.push(newRule);
        }
      });
    },
    [pageData.formData],
  );

  const handleAddRule = useCallback(
    (attributeRule: boolean) => () =>
      append({
        id: -1,
        system_id,
        attribute_rule: attributeRule,
        deleted: false,
        clauses: [
          [
            {
              id: -1,
              rule_id: -1,
              compared_value: '',
              logical_group: uuidv4(),
              operator: OPERATOR.EQUAL,
              question_id: -1,
              deleted: false,
            },
          ],
        ],
        rule_question_answer_ids: [],
        rule_attribute_attributevalue_ids: [],
      }),
    [append, system_id],
  );

  const handleDeleteRule = useCallback(
    (rule: TRuleForForm, ruleIndex: number) => () => {
      if (rule.id === -1) {
        remove(ruleIndex);
      } else {
        update(ruleIndex, { ...rule, deleted: true });
      }
    },
    [remove, update],
  );

  useEffect(() => reset(pageData), [pageData, reset]);

  return (
    <main className={cnRules()}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cnRules('form')}>
        {fields.map((rule, ruleIndex) => (
          <>
            {!rule.deleted && (
              <RuleField
                key={rule.arrayId}
                ruleId={rule.id}
                control={control}
                ruleIndex={ruleIndex}
                allQuestions={questionsData}
                allAttributes={attributesData}
                attributeRule={rule.attribute_rule}
                handleDeleteRule={handleDeleteRule(rule, ruleIndex)}
              />
            )}
          </>
        ))}
        <div className={cnRules('newRule')}>
          <div className={cnRules('newRule-button')} onClick={handleAddRule(false)}>
            <AddIcon width={30} height={30} className={cnRules('newRule-addIcon')} />
            <Text>{'"Вопрос - Вопрос"'}</Text>
          </div>
          <div className={cnRules('newRule-button')} onClick={handleAddRule(true)}>
            <AddIcon width={30} height={30} className={cnRules('newRule-addIcon')} />
            <Text>{'"Вопрос - Атрибут"'}</Text>
          </div>
        </div>
        <div className={cnRules('loadingScreen', { enabled: isLoading || isPending })} />
        <Button
          className={cnRules('submitButton', { visible: isFormDirty() })}
          disabled={isLoading || isPending || !isValid}
          loading={isLoading || isPending}
        >
          Сохранить
        </Button>
      </form>
    </main>
  );
};

export default dynamic(() => Promise.resolve(memo(Page)), { ssr: false, loading: () => <Loader sizepx={116} /> });
