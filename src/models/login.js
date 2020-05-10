import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { message } from 'antd';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response.data,
      }); // Login successfully

      if (response.code === '0000') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        
        localStorage.token = response.data.token;
        localStorage.userName = response.data.userName;
        localStorage.userId = response.data.userId;
        localStorage.roleId = response.data.roleId;
        localStorage.mobilePhone = response.data.mobilePhone;
        localStorage.departmentId = response.data.depadepartmentId;
        history.replace(redirect || '/');
      }else{
        message.info(response.msg);
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      localStorage.clear();
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.role);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
