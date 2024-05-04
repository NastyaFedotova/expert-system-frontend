import { create } from 'zustand';

import { getSystemBackupUrl } from '@/api/services/systems';

type SystemActions = {
  downloadSystemBackup: (system_id: number) => void;
};

export type SystemStore = SystemActions;

const useSystemStore = create<SystemStore>(() => ({
  downloadSystemBackup: async (system_id) => {
    try {
      const url = await getSystemBackupUrl(system_id);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup.isbes`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useSystemStore;
