import { Dayjs } from 'dayjs';

export interface PropertyData {
  title: string;
  size: string;
  price: string;
  handoverDate: Dayjs | null;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PropertyFormData {
  title: string;
  size: number;
  price: number;
  handoverDate: string;
  projectId: string;
}