export type TSystemResponseParams = {
  user_id?: number;
  name?: string;
  username?: string;
  page?: number;
  per_page?: number;
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
