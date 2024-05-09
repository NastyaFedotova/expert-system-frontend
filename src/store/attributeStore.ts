import { create } from 'zustand';

import { getAttributesWithValues } from '@/api/services/attributes';
import { TAttributeWithAttributeValues } from '@/types/attributes';
import { TErrorResponse } from '@/types/error';
import { errorParser } from '@/utils';

type AttributeStates = {
  attributesWithValues: TAttributeWithAttributeValues[];
  fetchError?: TErrorResponse;
  fetchLoading: boolean;
};

type AttributeActions = {
  getAttributesWithValues: (system_id: number) => void;
};

const initialState: AttributeStates = {
  attributesWithValues: [],
  fetchError: undefined,
  fetchLoading: false,
};

type AttributeStore = AttributeStates & AttributeActions;

const useAttributeStore = create<AttributeStore>((set) => ({
  ...initialState,
  getAttributesWithValues: async (system_id) => {
    set({ fetchLoading: true });
    try {
      const data = await getAttributesWithValues(system_id);
      set({ attributesWithValues: data });
    } catch (error) {
      console.log(error);
      set({ fetchError: errorParser(error) });
    } finally {
      set({ fetchLoading: false });
    }
  },
}));

export default useAttributeStore;
