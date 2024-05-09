'use client';
import React, { memo, useCallback, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAttributesWithValues } from '@/api/services/attributes';
import AttributeField from '@/components/AttributeField';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { ATTRIBUTES } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import useUserStore from '@/store/userStore';
import { TAttributeWithAttributeValues } from '@/types/attributes';
import { classname } from '@/utils';
import { formAttrWithValuesValidation } from '@/validation/attributes';
import { systemIdValidation } from '@/validation/searchParams';

import classes from './page.module.scss';

const cnAttributes = classname(classes, 'editor-attributes');

type PageProps = {
  params: { system_id: number };
};

const Page: React.FC<PageProps> = ({ params }) => {
  const validateParams = systemIdValidation.safeParse(params);
  const system_id = useMemo(() => validateParams.data?.system_id ?? -1, [validateParams.data?.system_id]);

  const user = useUserStore((store) => store.user);
  const { data } = useSuspenseQuery({
    queryKey: [ATTRIBUTES.GET, { user: user?.id, system: system_id }],
    queryFn: () => getAttributesWithValues(system_id),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<{ formData: TAttributeWithAttributeValues[] }>({
    defaultValues: { formData: data },
    resolver: zodResolver(formAttrWithValuesValidation),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'formData', keyName: 'arrayId' });

  const handleFormSubmit = useCallback(
    (formData: { formData: TAttributeWithAttributeValues[] }) => console.log(formData),
    [],
  );

  const formWatch = watch();
  console.log(data, errors, dirtyFields, formWatch);
  const handleAddAttr = useCallback(
    () => append({ id: -1, system_id: system_id, name: '', values: [] }),
    [append, system_id],
  );

  const handleDeleteAttr = useCallback((attrIndex: number) => () => remove(attrIndex), [remove]);

  return (
    <main className={cnAttributes()}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cnAttributes('form')}>
        {fields.map((attribute, index) => (
          <AttributeField
            key={attribute.arrayId}
            attributeId={attribute.id}
            control={control}
            index={index}
            onDelete={handleDeleteAttr(index)}
          />
        ))}
        <div className={cnAttributes('newAttr')}>
          <AddIcon width={30} height={30} className={cnAttributes('newAttr-addIcon')} onClick={handleAddAttr} />
          <Input className={cnAttributes('newAttr-input')} onClick={handleAddAttr} placeholder="Новый атрибут" />
        </div>
        <Button className={cnAttributes('submitButton')}>Сохранить</Button>
      </form>
    </main>
  );
};
// я юблю никиту гордеева сииииииииииииииииииииииииильно!!
export default memo(Page);
