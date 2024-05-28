'use client';
import React, { memo, useCallback, useState } from 'react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { deleteSystem, getSystems } from '@/api/services/systems';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { CardSkeleton } from '@/components/CardSkeleton';
import Loader from '@/components/Loader';
import Text, { TEXT_VIEW } from '@/components/Text';
import { SYSTEMS } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import FileCheck from '@/icons/FileCheck';
import useSystemStore from '@/store/systemStore';
import useUserStore from '@/store/userStore';
import { TSystemsWithPage } from '@/types/systems';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnUserProfile = classname(classes, 'user-systems');

export const Page: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore((store) => store);
  const { downloadSystemBackup, importSystem } = useSystemStore((store) => store);
  const queryClient = useQueryClient();

  const [systemFile, setSystemFile] = useState<File>();

  const { data, isSuccess, isLoading } = useSuspenseQuery({
    queryKey: [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
    queryFn: async () => await getSystems({ user_id: user?.id, all_types: true }),
  });
  console.log(systemFile);
  const addMutate = useMutation({
    mutationFn: importSystem,
    onSuccess: (newSystem) => {
      queryClient.setQueryData<TSystemsWithPage>(
        [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
        (old?: TSystemsWithPage) => ({
          pages: old?.pages ?? 1,
          systems: [newSystem].concat(data.systems),
        }),
      );
    },
    onSettled: () => setSystemFile(undefined),
  });
  const mutate = useMutation({
    mutationFn: deleteSystem,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }] });
      const previousTodos = queryClient.getQueryData<TSystemsWithPage>([
        SYSTEMS.GET_USER,
        { user_id: user?.id, all_types: true },
      ]);
      queryClient.setQueryData<TSystemsWithPage>(
        [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
        (old?: TSystemsWithPage) => ({
          pages: old?.pages ?? 1,
          systems: old?.systems.filter((system) => system.id !== data.system_id) ?? [],
        }),
      );
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData<TSystemsWithPage>(
        [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
        context?.previousTodos,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }] });
    },
  });

  const handleEdit = useCallback((id: number) => () => router.push(`/system/${id}/editor`), [router]);
  const handleClick = useCallback((id: number) => () => router.push(`/system/${id}/test`), [router]);
  const handleDelete = useCallback(
    (id: number, password: string) => mutate.mutate({ system_id: id, password }),
    [mutate],
  );
  const handleDownload = useCallback(
    (systemId: number, systemName: string) => () => downloadSystemBackup(systemId, systemName),
    [downloadSystemBackup],
  );
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSystemFile(event.currentTarget.files?.item(0) ?? undefined);
  }, []);

  const handleSaveButtonCLick = useCallback(() => {
    if (systemFile) {
      addMutate.mutate(systemFile);
    }
  }, [addMutate, systemFile]);

  return (
    <div className={cnUserProfile()}>
      <label className={cnUserProfile('importSystem', { isUpload: !!systemFile })}>
        <input type="file" accept=".ipopes" className={cnUserProfile('input')} onChange={handleFileUpload} />
        {!systemFile && !addMutate.isPending ? (
          <>
            <AddIcon width={30} height={30} />
            <Text>Загрузить систему</Text>
          </>
        ) : (
          <>
            <FileCheck width={30} height={30} />
            <Text>{systemFile?.name}</Text>
            <Button onClick={handleSaveButtonCLick} loading={addMutate.isPending}>
              Сохранить
            </Button>
          </>
        )}
      </label>

      {!!data.systems.length &&
        isSuccess &&
        data.systems.map((system) => (
          <Card
            key={system.id}
            id={system.id}
            image={system.image_uri}
            title={system.name}
            subtitle={system.about}
            modifiable
            onEditClick={handleEdit(system.id)}
            onDeleteClick={handleDelete}
            onClick={handleClick(system.id)}
            onDownloadClick={handleDownload(system.id, system.name)}
          />
        ))}
      {!isLoading && !data.systems.length && <Text view={TEXT_VIEW.p20}>Нет созданных систем</Text>}
      {isLoading && [...Array(6).keys()].map((index) => <CardSkeleton key={index} />)}
    </div>
  );
};

export default dynamic(() => Promise.resolve(memo(Page)), { ssr: false, loading: () => <Loader sizepx={116} /> });
