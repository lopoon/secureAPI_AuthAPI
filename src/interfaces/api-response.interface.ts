export interface ApiResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
  errors?: any;
}