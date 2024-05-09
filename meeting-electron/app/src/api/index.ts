import request from './request';
import { APP_KEY } from '../config';
import { EnterPriseInfo, LoginUserInfo } from '../types';

// 发送短信验证码-新接口
export function sendVerifyCodeApi(params: { mobile?: string; scene?: number }) {
  return request({
    method: 'GET',
    url: `/scene/meeting/${APP_KEY}/v1/sms/${params.mobile}/${params.scene}`,
  });
}

export function loginApi(params: {
  verifyCode?: string;
  username?: string;
  mobile?: string;
  appKey?: string;
}) {
  console.log(params, ' doLoginNew params');
  const appKey = params.appKey || APP_KEY;
  const url = params.verifyCode
    ? `/scene/meeting/${appKey}/v1/mobile/${params.mobile}/login` // 验证码登录
    : `/scene/meeting/${appKey}/v1/login/${params.username}`; // 账号密码登录
  return request({
    url,
    method: 'POST',
    data: params,
  }) as unknown as Promise<LoginUserInfo>;
}

export function getEnterPriseInfoApi(params: {
  code?: string;
  email?: string;
}): Promise<EnterPriseInfo> {
  return request({
    url: `/scene/meeting/v2/app-info`,
    params,
    method: 'GET',
  }) as unknown as Promise<EnterPriseInfo>;
}

export function modifyPasswordApi(params: {
  password: string;
  newPassword: string;
  appKey?: string;
  username: string;
}): Promise<LoginUserInfo> {
  const { password, username, appKey, newPassword } = params;
  return request({
    url: `/scene/meeting/v2/password`,
    data: {
      username,
      password,
      newPassword,
    },
    headers: {
      AppKey: appKey || (APP_KEY as string),
    },
    method: 'POST',
  }) as unknown as Promise<LoginUserInfo>;
}