'use client';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getAttributesWithValues } from '@/api/services/attributes';
import {
  createObjectAttributeAttributeValueValidation,
  deleteObjectAttributeAttributeValueValidation,
} from '@/api/services/objectAttributeAttributeValue';
import {
  createObjectWithAttrValues,
  deleteObjects,
  getObjectsWithAttrValues,
  updateObjects,
} from '@/api/services/objects';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ObjectField from '@/components/ObjectField';
import { ATTRIBUTES, OBJECTS } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import useUserStore from '@/store/userStore';
import { TObjectAttributeAttributeValueNewValidation } from '@/types/objectAttributeAttributeValue';
import { TObjectUpdate, TObjectWithAttrValues, TObjectWithAttrValuesForm, TObjectWithIdsNew } from '@/types/objects';
import { classname } from '@/utils';
import { formObjectWithAttrValuesValidation } from '@/validation/objects';
import { systemIdValidation } from '@/validation/searchParams';

import classes from './page.module.scss';

const cnObjects = classname(classes, 'editor-objects');

type PageProps = {
  params: { system_id: number };
};

const Page: React.FC<PageProps> = ({ params }) => {
  const queryClient = useQueryClient();
  const user = useUserStore((store) => store.user);

  const [toDelete, setToDelete] = useState<number[]>([]);

  const system_id = useMemo(() => systemIdValidation.safeParse(params).data?.system_id ?? -1, [params]);

  const { data: objectsData, isLoading: objectsIsLoading } = useSuspenseQuery({
    queryKey: [OBJECTS.GET, { user: user?.id, system: system_id }],
    queryFn: () => getObjectsWithAttrValues(system_id),
  });

  const { data: attributesData, isLoading: attributesIsLoading } = useSuspenseQuery({
    queryKey: [ATTRIBUTES.GET, { user: user?.id, system: system_id }],
    queryFn: () => getAttributesWithValues(system_id),
  });

  const isLoading = useMemo(() => objectsIsLoading || attributesIsLoading, [attributesIsLoading, objectsIsLoading]);

  const pageData = useMemo<TObjectWithAttrValuesForm>(() => {
    const res: TObjectWithAttrValuesForm = { formData: [] };
    objectsData.forEach((object) => {
      const newObject: TObjectWithAttrValues = {
        id: object.id,
        system_id: object.system_id,
        name: object.name,
        attributesValues: [],
      };
      object.attributes_ids.forEach((ids) => {
        const attribute = attributesData.find((attribute) => attribute.id === ids.attribute_id);
        const attributeValue = attribute?.values.find((value) => value.id === ids.attribute_value_id);
        if (!!attribute && !!attributeValue) {
          newObject.attributesValues = newObject.attributesValues.concat(attributeValue);
        }
      });
      res.formData.push(newObject);
    });
    return res;
  }, [attributesData, objectsData]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<TObjectWithAttrValuesForm>({
    defaultValues: pageData,
    resolver: zodResolver(formObjectWithAttrValuesValidation),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (responseList: Promise<unknown>[]) => Promise.allSettled(responseList),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [OBJECTS.GET, { user: user?.id, system: system_id }] }),
    onSettled: () => setToDelete([]),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'formData', keyName: 'arrayId' });

  const isFormDirty = useMemo(() => {
    const isDirtyForm = dirtyFields.formData?.some((object) => {
      if (object.id || object.name || object.system_id) {
        return true;
      }

      return object.attributesValues?.some((attrValue) => Object.values(attrValue).some((val) => val));
    });

    return isDirtyForm || !!toDelete.length;
  }, [dirtyFields, toDelete]);

  const handleFormSubmit = useCallback(
    (form: TObjectWithAttrValuesForm) => {
      const objectNew: TObjectWithIdsNew[] = [];
      const objectUpdate: TObjectUpdate[] = [];
      const idsNew: TObjectAttributeAttributeValueNewValidation[] = [];
      const idsDelete: number[] = [];

      form.formData.forEach((object, objectIndex) => {
        if (!toDelete.includes(object.id)) {
          const oldObject = pageData.formData.find((obj) => obj.id === object.id);
          const newAttribute = object.attributesValues.filter(
            (x) => !oldObject?.attributesValues.some((y) => x.id === y.id),
          );

          const newIds: Omit<TObjectAttributeAttributeValueNewValidation, 'object_id'>[] = [];
          newAttribute.forEach((val) => {
            if (object.id === -1) {
              newIds.push({ attribute_id: val.attribute_id, attribute_value_id: val.id });
            } else {
              idsNew.push({ object_id: object.id, attribute_id: val.attribute_id, attribute_value_id: val.id });
            }
          });

          const deleteAttributeValues = oldObject?.attributesValues.filter(
            (x) => !object.attributesValues.some((y) => x.id === y.id),
          );

          deleteAttributeValues?.forEach((attrValue) => {
            const idsId = objectsData
              .find((obj) => obj.id === object.id)
              ?.attributes_ids.find(
                (ids) => ids.attribute_value_id === attrValue.id && ids.attribute_id === attrValue.attribute_id,
              )?.id;
            if (idsId) {
              idsDelete.push(idsId);
            }
          });
          if (object.id === -1) {
            objectNew.push({ system_id: object.system_id, name: object.name, attributes_ids: newIds });
          }

          if (!dirtyFields.formData?.[objectIndex]?.id && dirtyFields.formData?.[objectIndex]?.name) {
            objectUpdate.push({ id: object.id, name: object.name });
          }
        }
      });
      const responses = [];
      console.log(objectNew, objectUpdate, idsNew, idsDelete, toDelete);
      if (objectNew.length) {
        responses.push(createObjectWithAttrValues(objectNew));
      }
      if (objectUpdate.length) {
        responses.push(updateObjects(objectUpdate));
      }
      if (idsNew.length) {
        responses.push(createObjectAttributeAttributeValueValidation(idsNew));
      }
      if (idsDelete.length) {
        responses.push(deleteObjectAttributeAttributeValueValidation(idsDelete));
      }
      if (toDelete.length) {
        responses.push(deleteObjects(toDelete));
      }

      mutate(responses);
    },
    [dirtyFields.formData, mutate, objectsData, pageData.formData, toDelete],
  );
  const handleAddObject = useCallback(
    () => append({ id: -1, system_id: system_id, name: '', attributesValues: [] }),
    [append, system_id],
  );
  const handleDeleteObject = useCallback(
    (objectId: number, objectIndex: number) => () => {
      if (objectId === -1) {
        remove(objectIndex);
      } else {
        setToDelete((prev) => prev.concat(objectId));
      }
    },
    [remove],
  );

  useEffect(() => reset(pageData), [pageData, reset]);

  return (
    <main className={cnObjects()}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cnObjects('form')}>
        {fields.map((object, objectIndex) => (
          <>
            {toDelete.includes(object.id) ? (
              <span key={object.arrayId} style={{ display: 'none' }} />
            ) : (
              <ObjectField
                key={object.arrayId}
                objectId={object.id}
                control={control}
                objectIndex={objectIndex}
                onDelete={handleDeleteObject(object.id, objectIndex)}
                allAttributes={attributesData}
              />
            )}
          </>
        ))}
        <div className={cnObjects('newObject')}>
          <AddIcon width={30} height={30} className={cnObjects('newObject-addIcon')} onClick={handleAddObject} />
          <Input className={cnObjects('newObject-input')} onClick={handleAddObject} placeholder="Новый обьект" />
        </div>
        <div className={cnObjects('loadingScreen', { enabled: isLoading || isPending })} />
        <Button
          className={cnObjects('submitButton', { visible: isFormDirty })}
          disabled={isLoading || isPending}
          loading={isLoading || isPending}
        >
          Сохранить
        </Button>
      </form>
    </main>
  );
};

export default memo(Page);
