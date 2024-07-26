import axios from "axios";

const service = axios.create({
  baseURL: "https://meta-backend.yuimeta.com",
});

declare module "axios" {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}

// 请求拦截
service.interceptors.request.use(
  (config: any) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    window.console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    window.console.log(error.response.data.message, "++++++"); // for debug
    window.console.log(error.response.data.code, "code"); // for debug
    if (error.response.data.code == 401) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default service;
