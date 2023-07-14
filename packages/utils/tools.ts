export const throttleAndDebounce = (fn: any, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>
  let called = false;

  return () => {
    if (timeout) clearTimeout(timeout);
    if (!called) {
      fn();
      called = true;
      setTimeout(() => {
        called = false
      }, delay);
    } else {
      timeout = setTimeout(fn, delay)
    }
  }
}


/**
 * 
 * @description 判断当前数据类型
 */
export const currentDataType = (item: any) => {
  return Object.prototype.toString.call(item).slice(8, -1)
}

/**
 * 判断是否为空
 * @param data 
 * @returns 
 */
export const isEmptyObject = (data: Object) => {
  for (const _key in data) {
    return false
  }
  
  return true
}



export function getAdminWebUrl() {
  let adminWebUrl = '*';
  let env = '';
  //拼凑adminweb地址
  return adminWebUrl + env;
}

export const requestCodeEnum = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  'default': '系统未知错误，请反馈给管理员'
}

/** 解析重新登录前的 url */
export const parseOriginUrl = () => {
  let hash = localStorage.getItem("hash");
  if (!hash) {
    return;
  }

  let tmp = hash.replace(/#/, "").split("?");
  let path = tmp[0];
  let queryStr = tmp[1];
  let query = {};

  if (queryStr) {
    let queryArr = queryStr.split("&");
    queryArr.forEach(v => {
      let item = v.split("=");
      const key = item[0];
      if (key !== "token") {
        //@ts-ignore
        query[key] = item[1];
      }
    });
  }

  localStorage.removeItem("hash");

  return {
    path,
    query
  };
};