import { create } from 'zustand';

import { getSystemBackupUrl, postSystemRestore } from '@/api/services/systems';
import { TSystem } from '@/types/systems';

type SystemStates = {
  isLoading: boolean;
};

type SystemActions = {
  downloadSystemBackup: (system_id: number, systemName?: string) => void;
  importSystem: (system: File) => Promise<TSystem>;
};

const initialState: SystemStates = {
  isLoading: false,
};

export type SystemStore = SystemStates & SystemActions;

const useSystemStore = create<SystemStore>(() => ({
  ...initialState,
  downloadSystemBackup: async (system_id, systemName) => {
    try {
      const url = await getSystemBackupUrl(system_id, systemName);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', systemName ? systemName + '.ipopes' : `backup.ipopes`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  },
  importSystem: async (system) => {
    try {
      const systemText = await system.text();
      const systemVec = systemText.split(' ').map((byte) => Number(byte));
      const data = await postSystemRestore(systemVec);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
      //return errorParser(error);
    }
  },
}));

export default useSystemStore;
