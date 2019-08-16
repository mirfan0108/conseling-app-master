import { Categories } from './categories';

export interface CategoriesResponse {
    success: boolean;
    data: Categories[];
    status: string;
  }