'use client';
import { memo } from 'react';

import useSystemStore from '@/store/systemStore';

const Page = ({ params }: { params: { system_id?: string } }) => {
  const { system } = useSystemStore((store) => store);
  console.log(system);
  return <h1>{params.system_id ?? 'new system'}</h1>;
};

export default memo(Page);
