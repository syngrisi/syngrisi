import { FilterQuery, Model, Document } from 'mongoose';

export type PaginateOptions = {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
  field?: string;
  countStrategy?: 'exact' | 'estimated';
};

interface PaginatedResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  timestamp: number;
}

export type QueryResult = {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  timestamp: number;
};

export interface ExtededModelMembers<T> {
  paginate(filter: FilterQuery<T>, options: PaginateOptions): Promise<PaginatedResponse<T>>;
  paginateDistinct(filter: FilterQuery<T>, options: PaginateOptions): Promise<PaginatedResponse<T>>;
}

export type PluginExtededModel<T> = Model<T> & ExtededModelMembers<T>;
