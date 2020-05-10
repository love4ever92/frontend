import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/base/staff/login', {
    method: 'POST',
    data: params,
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/base/sys-user/sendVerMsg?mobilePhone=${mobile}`);
}
