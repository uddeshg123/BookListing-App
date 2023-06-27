import axios, { AxiosError } from "axios";

export const base_url = {
  dev: "https://nodejs-project-391016.df.r.appspot.com/api/",
  live: "https://nodejs-project-391016.df.r.appspot.com/api/",
};

type API_METHOD = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export const _baseRequest = (
  url: string,
  method: API_METHOD = "GET",
  data?: object,
  headers?: { [key: string]: string }
): Promise<any> => {   
  return apiClient
    .request({
      method,
      url,
      headers,
      data,
    })
    .then((response) => response.data)
    .catch((err: AxiosError | Error) =>
      Promise.reject({
        name: err.name,
        message: err.message,
        status: (err as AxiosError).response?.status || -1,
        data: (err as AxiosError).response?.data,
      })
    );
};

const apiClient = axios.create({
  baseURL: base_url.live,
  headers: {
    "Content-type": "application/json",
  },
  //60 sec timeout
  timeout: 60000,
  //follow up to 10 HTTP 3xx redirects
  maxRedirects: 10,
  //cap the maximum content length we'll accept to 50MBs, just in case
  maxContentLength: 50 * 1000 * 1000,
});
