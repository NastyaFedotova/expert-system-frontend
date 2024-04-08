import axios, { AxiosHeaderValue, AxiosRequestConfig, AxiosResponseHeaders } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

export const getApiRequest = <ResponseType>(
  link: string,
  config?: AxiosRequestConfig,
): Promise<{
  data: ResponseType;
  headers: AxiosResponseHeaders | Partial<Record<string, AxiosHeaderValue>>;
}> => api.get<ResponseType>(link, config).then((res) => ({ data: res.data, headers: res.headers }));

export const postApiRequest = <ResponseType, BodyType>(
  link: string,
  body?: BodyType,
  config?: AxiosRequestConfig,
): Promise<{
  data: ResponseType;
  headers: AxiosResponseHeaders | Partial<Record<string, AxiosHeaderValue>>;
}> => api.post<ResponseType>(link, body, config).then((res) => ({ data: res.data, headers: res.headers }));
