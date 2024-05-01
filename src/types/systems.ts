export type TSystemRequestParams = {
  user_id?: number;
  name?: string;
  username?: string;
  page?: number;
  per_page?: number;
  all_types?: boolean;
};

export type TSystem = {
  id: number;
  user_id: number;
  about?: string;
  created_at: string;
  updated_at: string;
  name: string;
  private: boolean;
  image_uri: string;
};

export type TSystemNew = {
  about?: string;
  name: string;
  private: boolean;
  image?: FileList;
};

export type TSystemDeleteResponseParams = {
  system_id: number;
  password: string;
};

export type TSystemsWithPage = {
  systems: TSystem[];
  pages: number;
};
