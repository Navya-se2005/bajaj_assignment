export interface ApiResponse {
  is_success: boolean;
  official_email?: string;
  data?: any;
  error?: string;
}

export interface SimulatedResponse {
  status: number;
  statusText: string;
  body: ApiResponse;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST'
}
