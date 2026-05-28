export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type CategoryFilters = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

export type CategoriesResponse = {
  success: boolean;
  time: string;
  message: string;
  total: number;
  offset: number;
  limit: number;
  categories: Category[];
};

export type CategoryByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  category: Category;
};

export type CategoryMutationPayload = {
  name: string;
  slug?: string;
};
