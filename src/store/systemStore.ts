import { create } from 'zustand';

import { getSystemBackupUrl, getSystemOne } from '@/api/services/systems';
import { TSystem } from '@/types/systems';

type SystemStates = {
  isLoading: boolean;
};

type SystemActions = {
  downloadSystemBackup: (system_id: number) => void;
  getSystem: (system_id: number) => Promise<TSystem | Error>;
};

const initialState: SystemStates = {
  isLoading: false,
};

export type SystemStore = SystemStates & SystemActions;

const useSystemStore = create<SystemStore>((set) => ({
  ...initialState,
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
  getSystem: async (system_id) => {
    set({ isLoading: true });
    try {
      const res = await getSystemOne(system_id);
      set({ isLoading: false });
      return res;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },
}));

export default useSystemStore;
