export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type TagFilters = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

export type TagsResponse = {
  success: boolean;
  time: string;
  message: string;
  total: number;
  offset: number;
  limit: number;
  tags: Tag[];
};

export type TagByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  tag: Tag;
};

export type TagMutationPayload = {
  name: string;
  slug?: string;
};
