export type WithPagination<T> = {
  page: number;
  perPage: number;
} & T;
