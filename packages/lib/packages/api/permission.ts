import request from '../utils/request';
import settings from '../config';

// 获取用户详细信息
export function getRouters() {
  return request({
    url: '/getRouters',
    params: { appCode: settings.appCode },
    method: 'get',
  })
}
