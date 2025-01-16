import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 600000 // request timeout,
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["token"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 0) {
      if (res.status === 400) {
        // to re-login
        MessageBox.confirm(
          "登录已超时，可以取消以停留在此页面上，或重新登录!",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "confirmTop"
          }
        ).then(() => {
          location.reload();
        });
      }
      Message({
        message: res.msg,
        type: "warning",
        duration: 2 * 1000
      });
      return Promise.reject(res.msg || "error");
    } else {
      return res;
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 404:
          error.message = "请求出错(404)";
          break;

        case 500:
          error.message = "服务器错误(500)";
          break;

        default:
          error.message = `连接出错(${error.response.status})!`;
      }
    }
    if (process.env.NODE_ENV == "development") {
      Message({
        message: error.message || error,
        type: "error",
        duration: 2 * 1000
      });
    } else {
      console.error(error.message);
    }
    return Promise.reject(error.message);
  }
);

export default service;
