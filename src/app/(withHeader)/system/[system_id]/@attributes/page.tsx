'use client';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import {
  createAttributesWithValues,
  deleteAttributes,
  getAttributesWithValues,
  updateAttributes,
} from '@/api/services/attributes';
import { createAttributesValues, deleteAttributesValues, updateAttributesValues } from '@/api/services/attributeValues';
import AttributeField from '@/components/AttributeField';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import { ATTRIBUTES } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import useUserStore from '@/store/userStore';
import { TAttributeUpdate, TAttributeWithAttributeValues, TAttributeWithAttributeValuesNew } from '@/types/attributes';
import { TAttributeValueNew, TAttributeValueUpdate } from '@/types/attributeValues';
import { classname } from '@/utils';
import { formAttrWithValuesValidation } from '@/validation/attributes';
import { systemIdValidation } from '@/validation/searchParams';

import classes from './page.module.scss';

const cnAttributes = classname(classes, 'editor-attributes');

type PageProps = {
  params: { system_id: number };
};

const Page: React.FC<PageProps> = ({ params }) => {
  const queryClient = useQueryClient();
  const user = useUserStore((store) => store.user);

  const [toDelete, setToDelete] = useState({ attributes: [] as number[], attrValues: [] as number[] });

  const system_id = useMemo(() => systemIdValidation.safeParse(params).data?.system_id ?? -1, [params]);

  const { data, isLoading } = useSuspenseQuery({
    queryKey: [ATTRIBUTES.GET, { user: user?.id, system: system_id }],
    queryFn: () => getAttributesWithValues(system_id),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, dirtyFields },
  } = useForm<{ formData: TAttributeWithAttributeValues[] }>({
    defaultValues: { formData: data },
    resolver: zodResolver(formAttrWithValuesValidation),
    mode: 'all',
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (responseList: Promise<unknown>[]) => Promise.allSettled(responseList),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [ATTRIBUTES.GET, { user: user?.id, system: system_id }] }),
    onSettled: () => setToDelete({ attributes: [], attrValues: [] }),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'formData', keyName: 'arrayId' });

  const isFormDirty = useCallback(() => {
    const isDirtyForm = dirtyFields.formData?.some((attribute) => {
      if (attribute.id || attribute.name || attribute.system_id) {
        return true;
      }
      return attribute.values?.some((value) => Object.values(value).some((val) => val));
    });

    return isDirtyForm || !!toDelete.attrValues.length || !!toDelete.attributes.length;
  }, [dirtyFields, toDelete.attrValues.length, toDelete.attributes.length]);

  const handleFormSubmit = useCallback(
    (form: { formData: TAttributeWithAttributeValues[] }) => {
      const attrUpdate: TAttributeUpdate[] = [];
      const attrValueUpdate: TAttributeValueUpdate[] = [];
      const attrNew: TAttributeWithAttributeValuesNew[] = [];
      const attrValueNew: TAttributeValueNew[] = [];
      const attrValueDelete: number[] = [];

      form.formData.forEach((attribute, attrIndex) => {
        const newValuesNewAttribute: string[] = [];
        attribute.values.forEach((attrValue, attrValueIndex) => {
          if (!toDelete.attrValues.includes(attrValue.id)) {
            if (attrValue.id === -1) {
              if (attrValue.attribute_id === -1) {
                newValuesNewAttribute.push(attrValue.value);
              } else {
                attrValueNew.push({ attribute_id: attrValue.attribute_id, value: attrValue.value });
              }
            }
            if (
              !dirtyFields.formData?.[attrIndex]?.values?.[attrValueIndex]?.id &&
              dirtyFields.formData?.[attrIndex]?.values?.[attrValueIndex]?.value
            ) {
              attrValueUpdate.push({ id: attrValue.id, value: attrValue.value });
            }
          } else if (!toDelete.attributes.includes(attribute.id)) {
            attrValueDelete.push(attrValue.id);
          }
        });
        if (!toDelete.attributes.includes(attribute.id)) {
          if (attribute.id === -1) {
            attrNew.push({ system_id: attribute.system_id, name: attribute.name, values_name: newValuesNewAttribute });
          }
          if (!dirtyFields.formData?.[attrIndex]?.id && dirtyFields.formData?.[attrIndex]?.name) {
            attrUpdate.push({ id: attribute.id, name: attribute.name });
          }
        }
      });

      const responses = [];
      if (attrNew.length) {
        responses.push(createAttributesWithValues(attrNew));
      }
      if (attrUpdate.length) {
        responses.push(updateAttributes(attrUpdate));
      }
      if (attrValueNew.length) {
        responses.push(createAttributesValues(attrValueNew));
      }
      if (attrValueUpdate.length) {
        responses.push(updateAttributesValues(attrValueUpdate));
      }
      if (toDelete.attributes.length) {
        responses.push(deleteAttributes(toDelete.attributes));
      }
      if (attrValueDelete.length) {
        responses.push(deleteAttributesValues(attrValueDelete));
      }

      mutate(responses);
    },
    [dirtyFields, mutate, toDelete],
  );
  const handleAddAttr = useCallback(
    () => append({ id: -1, system_id: system_id, name: '', values: [] }),
    [append, system_id],
  );
  const handleDeleteAttr = useCallback(
    (attrId: number, attrIndex: number) => () => {
      if (attrId === -1) {
        remove(attrIndex);
      } else {
        setToDelete((prev) => ({ attributes: prev.attributes.concat(attrId), attrValues: prev.attrValues }));
      }
    },
    [remove],
  );
  const handleDeleteAttrValue = useCallback(
    (attrValueId: number) =>
      setToDelete((prev) => ({ attributes: prev.attributes, attrValues: prev.attrValues.concat(attrValueId) })),
    [],
  );

  useEffect(() => reset({ formData: data }), [data, reset]);

  return (
    <main className={cnAttributes()}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cnAttributes('form')}>
        {fields.map((attribute, attrIndex) => (
          <>
            {toDelete.attributes.includes(attribute.id) ? (
              <span key={attribute.arrayId} style={{ display: 'none' }} />
            ) : (
              <AttributeField
                key={attribute.arrayId}
                attributeId={attribute.id}
                control={control}
                index={attrIndex}
                onDelete={handleDeleteAttr(attribute.id, attrIndex)}
                onAttributeValueDelete={handleDeleteAttrValue}
                deletedSubFieldIds={toDelete.attrValues}
              />
            )}
          </>
        ))}
        <div className={cnAttributes('newAttr')}>
          <AddIcon width={30} height={30} className={cnAttributes('newAttr-addIcon')} onClick={handleAddAttr} />
          <Input className={cnAttributes('newAttr-input')} onClick={handleAddAttr} placeholder="Новый атрибут" />
        </div>
        <div className={cnAttributes('loadingScreen', { enabled: isLoading || isPending })} />
        <Button
          className={cnAttributes('submitButton', { visible: isFormDirty() })}
          disabled={isLoading || isPending || !isValid}
          loading={isLoading || isPending}
        >
          Сохранить
        </Button>
      </form>
    </main>
  );
};
// я люблю никиту гордеева сииииииииииииииииииииииииильно!!
export default dynamic(() => Promise.resolve(memo(Page)), { ssr: false, loading: () => <Loader sizepx={116} /> });
