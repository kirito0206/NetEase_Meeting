import axios from 'axios'
import getConfig from './config'
import { getUuid, md5Password } from './help'

const config = getConfig()

const deviceId = getUuid()

let axiosInstance = axios.create({
  baseURL: config.meetingServerDomain,
  timeout: 10000,
  headers: {
    deviceId,
    versionCode: '0.1.1',
    clientType: 'web',
  },
})

axiosInstance.interceptors.response.use(
  (response) => {
    const code = response.data.code

    if (code === 0) {
      return response.data.data
    } else {
      return Promise.reject(response.data)
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)

function createAxiosInstance(headers: Record<string, string>) {
  axiosInstance = axios.create({
    baseURL: config.meetingServerDomain,
    timeout: 10000,
    headers: {
      deviceId,
      versionCode: '0.1.1',
      clientType: 'web',
      ...headers,
    },
  })

  axiosInstance.interceptors.response.use(
    (response) => {
      const code = response.data.code

      if (code === 0) {
        return response.data.data
      } else {
        return Promise.reject(response.data)
      }
    },
    function (error) {
      return Promise.reject(error)
    }
  )
}

export type LiveConfig = {
  meetingAppKey: string
  onlyEmployeesAllow: boolean
  ssoInfo: {
    appName: string
    entCode: string
  }
  supportSms: boolean
}

export function getLiveConfig(meetingCode: string): Promise<LiveConfig> {
  const url = '/scene/meeting/v1/live-config'

  return axiosInstance
    .get<unknown, LiveConfig>(url, {
      params: {
        meetingCode,
      },
    })
    .then((res) => {
      return res
    })
}

export type LiveWebLoginType = {
  type: string
  data: {
    enterpriseName: string
  }
}

export function getLiveWebLoginType(
  meetingNum: string,
  appKey: string
): Promise<LiveWebLoginType> {
  const url = `/scene/meeting/${appKey}/v1/getLiveWebLoginType`

  return axiosInstance.get(url, {
    params: {
      meetingNum,
    },
  })
}

export type UserInfo = {
  appKey: string
  loginType: string
  userUuid: string
  userToken: string
  id: number
  serviceBundle: {
    name: string
    meetingMaxMinutes: number
    meetingMaxMembers: number
    expireTimeStamp: number
    expireTip: string
  }
  username: string
  userName: string
  corpName: string
  nickname: string
  privateMeetingNum: string
  phoneNumber: string
  initialPassword: boolean
  authType: string
  imToken: string
  imKey: string
}

export function loginByToken(opt: UserInfo): Promise<UserInfo> {
  config.appKey = opt.appKey
  const url = `/scene/apps/${config.appKey}/v1/login`

  createAxiosInstance({
    user: opt.userUuid,
    token: opt.userToken,
    appKey: config.appKey,
  })

  return axiosInstance
    .post<unknown, UserInfo>(
      url,
      {},
      {
        headers: {
          authType: opt.authType,
        },
      }
    )
    .then((res) => {
      createAxiosInstance({
        user: opt.userUuid,
        token: res.userToken,
        appKey: config.appKey,
      })

      return {
        ...opt,
        ...res,
      }
    })
}

export type LiveInfo = {
  chatRoomId: string
  chatroomMute: boolean
  extraData: {
    backgroundUrl: string
    notStartCoverUrl: string
  }
  liveChatRoomEnable: boolean
  liveChatRoomIndependent: boolean
  pullHlsUrl: string
  pullHttpUrl: string
  pullRtmpUrl: string
  state: number
  title: string
  watermarkConfig: {
    videoFormat: string
    videoStrategy: number
    videoStyle: number
  }
}

export function getLiveInfo(opt: {
  meetingNum: string
  password: string
  token: string
  user: string
}): Promise<LiveInfo> {
  const { meetingNum, password, token, user } = opt

  const url = `/scene/meeting/${config.appKey}/v2/live`

  return axiosInstance.post(
    url,
    {
      meetingNum,
      password,
    },
    {
      headers: {
        user,
        token,
      },
    }
  )
}

type LikeCount = {
  count: number
}

export function getLikeCount(meetingCode: string): Promise<LikeCount> {
  const url = `/scene/meeting/${config.appKey}/v1/live/${meetingCode}/likeCount`
  const sessionPassword = sessionStorage.getItem('meeting-live-password') ?? ''

  return axiosInstance.post(url, {
    password: sessionPassword,
  })
}

export function postLike(meetingCode: string): Promise<LikeCount> {
  const url = `/scene/meeting/${config.appKey}/v1/live/${meetingCode}/like`

  return axiosInstance.post(url, {})
}

export function getChatroomAddr(opt: {
  meetingNum: string
  chatRoomId: string
}): Promise<string[]> {
  const { meetingNum, chatRoomId } = opt
  const url = `/scene/meeting/${config.appKey}/v1/linkUrl`

  return axiosInstance.get(url, {
    params: {
      meetingNum,
      chatRoomId,
    },
  })
}

export function loginByGuest(meetingCode: string): Promise<LikeCount> {
  const url = `/scene/meeting/v1/live-viewer-account`

  return axiosInstance.get(url, {
    params: {
      meetingCode,
    },
  })
}

export function getLiveNoAuth(opt: {
  appKey: string
  meetingNum: string
  password: string
}): Promise<LiveInfo> {
  const { appKey, meetingNum, password } = opt
  const url = `/scene/meeting/${appKey}/v2/live-no-auth`

  return axiosInstance.post(url, {
    meetingNum,
    password,
  })
}

export function sendVerifyCodeApiLiveGuest(params: {
  meetingCode: string
  phoneNum: string
}) {
  return axiosInstance.get('/scene/meeting/v1/send-sms-for-live-guest', {
    params: {
      meetingCode: params.meetingCode,
      phoneNum: params.phoneNum,
    },
  })
}

export function getLiveGuestByPhone(params: {
  meetingCode: string
  phoneNum: string
  verifyCode: string
}) {
  return axiosInstance.get('/scene/meeting/v2/live-guest-by-phone', {
    params: {
      meetingCode: params.meetingCode,
      phoneNum: params.phoneNum,
      verifyCode: params.verifyCode,
    },
  })
}

export interface EnterPriseInfo {
  appKey: string
  appName: string
  idpList: Array<IdpInfo>
  ssoLevel: number
}
export interface IdpInfo {
  id: number
  name: string
  type: number
}

export function getEnterPriseInfoApi(params: {
  code?: string
  email?: string
}): Promise<EnterPriseInfo> {
  return axiosInstance.get('scene/meeting/v2/app-info', {
    params,
  })
}

export function loginBySSOUrl(params: {
  param: string
  appKey: string
  deviceId: string
}) {
  return axiosInstance.get('/scene/meeting/v2/sso-account-info', {
    params: {
      param: params.param,
      key: params.deviceId,
    },
    headers: {
      appKey: params.appKey,
      deviceId,
    },
  })
}

export async function loginApiNew(params: {
  password: string
  appKey: string
  username?: string
  phone?: string
  email?: string
}): Promise<UserInfo> {
  let url: string = '/scene/meeting/v1/login-username'

  if (params.username) {
    url = `/scene/meeting/v1/login-username` // 账号密码登录
  }

  if (params.phone) {
    url = `/scene/meeting/v1/login-phone` // 手机号登录
  }

  if (params.email) {
    url = `/scene/meeting/v1/login-email` // 邮箱登录
  }

  params.password = md5Password(params.password)

  return axiosInstance.post(url, params, {
    headers: {
      appKey: params.appKey,
      deviceId,
    },
  })
}

const request = {
  getLiveConfig,
  getLiveWebLoginType,
  getLiveInfo,
  getLikeCount,
  postLike,
  getChatroomAddr,
  loginByToken,
  loginByGuest,
  getLiveNoAuth,
  getEnterPriseInfoApi,
  sendVerifyCodeApiLiveGuest,
  getLiveGuestByPhone,
  loginBySSOUrl,
}

export { config, deviceId }

export default request
