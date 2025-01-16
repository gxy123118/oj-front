import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    console.log("响应", response);
    return response;
  },
  (error) => {
    console.log("响应错误", error);
    return Promise.reject(error);
  }
);
