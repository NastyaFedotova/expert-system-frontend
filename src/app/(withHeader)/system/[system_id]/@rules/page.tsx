'use client';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { getAttributesWithValues } from '@/api/services/attributes';
import { getQuestionsWithAnswers } from '@/api/services/questions';
import { getRulesWithClausesAndEffects } from '@/api/services/rules';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import RuleField from '@/components/RuleField';
import { ATTRIBUTES, QUESTIONS, RULES } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import useUserStore from '@/store/userStore';
import { TClauseForForm } from '@/types/clauses';
import { TRuleForForm, TRuleForm } from '@/types/rules';
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

  const [toDelete, setToDelete] = useState({ rules: [] as number[], clauses: [] as number[] });

  const system_id = useMemo(() => systemIdValidation.safeParse(params).data?.system_id ?? -1, [params]);

  const { data: attributesData, isLoading: attributesIsLoading } = useSuspenseQuery({
    queryKey: [ATTRIBUTES.GET, { user: user?.id, system: system_id }],
    queryFn: () => getAttributesWithValues(system_id),
  });

  const { data: questionsData, isLoading: questionsIsLoading } = useSuspenseQuery({
    queryKey: [QUESTIONS.GET, { user: user?.id, system: system_id }],
    queryFn: () => getQuestionsWithAnswers(system_id),
  });

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
      const newObject: TRuleForForm = {
        id: rule.id,
        system_id: rule.system_id,
        attribute_rule: rule.attribute_rule,
        deleted: false,
        clauses: [],
        rule_question_answer_ids: [],
        rule_attribute_attributevalue_ids: [],
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
      newObject.clauses = Array.from(clausesMap, ([, clausesArray]) => clausesArray);
      rule.rule_question_answer_ids.forEach((ids) => {
        const question = questionsData.find((question) => question.id === ids.question_id);
        const answer = question?.answers.find((answer) => answer.id === ids.answer_id);
        if (!!question && !!answer) {
          newObject.rule_question_answer_ids = newObject.rule_question_answer_ids.concat(answer);
        }
      });
      rule.rule_attribute_attributevalue_ids.forEach((ids) => {
        const attribute = attributesData.find((attribute) => attribute.id === ids.attribute_id);
        const attributeValue = attribute?.values.find((value) => value.id === ids.attribute_value_id);
        if (!!attribute && !!attributeValue) {
          newObject.rule_attribute_attributevalue_ids =
            newObject.rule_attribute_attributevalue_ids.concat(attributeValue);
        }
      });
      res.formData.push(newObject);
    });
    return res;
  }, [attributesData, questionsData, rulesData]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { dirtyFields },
  } = useForm<TRuleForm>({
    defaultValues: pageData,
    resolver: zodResolver(formRuleValidation),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (responseList: Promise<unknown>[]) => Promise.allSettled(responseList),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [RULES.GET, { user: user?.id, system: system_id }] }),
    onSettled: () => setToDelete({ rules: [], clauses: [] }),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'formData', keyName: 'arrayId' });

  const isFormDirty = useMemo(() => {
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

  const handleFormSubmit = useCallback((form: TRuleForm) => console.log(form), []);

  const handleAddRule = useCallback(
    () =>
      append({
        id: -1,
        system_id,
        attribute_rule: true,
        deleted: false,
        clauses: [],
        rule_question_answer_ids: [],
        rule_attribute_attributevalue_ids: [],
      }),
    [append, system_id],
  );

  const handleDeleteRule = useCallback(
    (ruleId: number, ruleIndex: number) => () => {
      if (ruleId === -1) {
        remove(ruleIndex);
      } else {
        setValue(`formData.${ruleIndex}.deleted`, true);
      }
    },
    [remove, setValue],
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
                setValue={setValue}
                handleDeleteRule={handleDeleteRule(rule.id, ruleIndex)}
              />
            )}
          </>
        ))}
        <div className={cnRules('newRule')}>
          <AddIcon width={30} height={30} className={cnRules('newRule-addIcon')} onClick={handleAddRule} />
          <Input className={cnRules('newRule-input')} onClick={handleAddRule} placeholder="Новое правило" />
        </div>
        <div className={cnRules('loadingScreen', { enabled: isLoading || isPending })} />
        <Button
          className={cnRules('submitButton', { visible: isFormDirty })}
          disabled={isLoading || isPending}
          loading={isLoading || isPending}
        >
          Сохранить
        </Button>
      </form>
    </main>
  );
};

export default dynamic(() => Promise.resolve(memo(Page)), { ssr: false, loading: () => <Loader sizepx={116} /> });
