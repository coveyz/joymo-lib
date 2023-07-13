import axios from 'axios';
import { getToken, getAdminWebUrl, requestCodeEnum } from '@coveyz/utils'
import settings from '../config';


const request = axios.create({
  // baseURL: (import.meta as any).env.VITE_APP_BASE_API,
  baseURL: '',
  timeout: 10000
})

// 更新 request 实例的 baseURL
function updateRequestBaseURL(config: any) {
  // const baseURL = settings.baseURL || (import.meta as any).env.VITE_APP_BASE_API;
  // request.defaults.baseURL = baseURL;
  const baseURL = settings.baseURL || (import.meta as any).env.VITE_APP_BASE_API;
  config.baseURL = baseURL;
}

// 调用更新 baseURL 的函数

request.interceptors.request.use(
  (config) => {

    updateRequestBaseURL(config);

    console.log('request=>', request.defaults.baseURL);

    const isToken = (config.headers || {}).isToken === false;


    if (getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers["token"] = getToken();
    }

    config.headers["Request-Ajax"] = "true";
    settings.brandMdCode && (config.headers['brandMdCode'] = settings.brandMdCode)
    config.headers['terminalCode'] = 1

    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?";
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof value !== "undefined") {
          if (typeof value === "object") {
            for (const key of Object.keys(value)) {
              let params = propName + "[" + key + "]";
              var subPart = encodeURIComponent(params) + "=";
              url += subPart + encodeURIComponent(value[key]) + "&";
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }

    return config
  },
  (error) => {
    console.log('request-error->', error);
    const baseUrl = (import.meta as any).env.VITE_APP_BASE_API
    console.log('lib-request-error-baseUrl=>', baseUrl, 'settings===>', settings);
    Promise.reject(error);
  }
)

request.interceptors.response.use(
  (res) => {
    const baseUrl = (import.meta as any).env.VITE_APP_BASE_API
    console.log('lib-response-baseUrl=>', baseUrl, 'settings===>', settings);
    // alert(`interceptors.response0: ${JSON.stringify(res.data)}`)
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    let status = res.data.status;
    if (typeof status == "undefined") {
      console.log(
        `${res.config.url}接口：请改造后台业务Result包装类,参考文档：https://i7drsi3tvf.feishu.cn/docs/doccn1dObN82KpIKVseKQjcSXth#pTyZhL`
      );
      if (code == "401") {
        status = -1;
      }
      if (code == "200") {
        status = 0;
      }
    }
    // 获取错误信息  
    //@ts-ignore
    const msg = requestCodeEnum[code] || res.data.msg || requestCodeEnum["default"];


    if (code === "401" && status === -1) {
      if (window != top && location.href.includes("from=admin")) {
        let targetOrigin = getAdminWebUrl();
        // alert(`targetOrigin: ${targetOrigin}`);
        //@ts-ignore
        window.top.postMessage({ action: "logout" }, targetOrigin);
      } else { // 11111111
        // alert(`window.location.hash rm: ${window.location.hash}`);
        // alert(`res.data.data.loginUrl: ${res.data.data.loginUrl}`);
        // localStorage.setItem("hash", window.location.hash);
        localStorage.removeItem("hash");

        sessionStorage.removeItem("FROM_URL");
        localStorage.removeItem("REFRESH_INFO");
        window.location.href = res.data.data.loginUrl
      }
      return Promise.reject(new Error(msg));
    } else if (status === 0) {
      return res.data;
    } else {
      console.error('response-msg', msg)
      return Promise.reject(new Error(msg));
    }
  },
  (error) => {
    console.log("err" + error);

    const baseUrl = (import.meta as any).env.VITE_APP_BASE_API
    console.log('lib-response-error-baseUrl=>', baseUrl, 'settings===>', settings);

    let { message } = error;
    if (message == "Network Error") {
      message = "啊哦！你网断了！";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    console.error('response-error-msg', message)
    return Promise.reject(error);
  }
);

export default request