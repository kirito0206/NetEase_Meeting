import {
  deviceId,
  getLiveConfig,
  getLiveInfo,
  getLiveWebLoginType,
  getLiveNoAuth,
  LiveConfig,
  LiveInfo,
  LiveWebLoginType,
  loginByToken,
  UserInfo,
} from '@/utils/request'
import { Button, Input, message, Modal } from 'antd'
import React, { useEffect, useMemo } from 'react'
import defaultCoverUrl from '@/assets/default-live@2x.jpg'
import styles from './index.less'
import { useNavigate } from 'umi'

const USER_INFO_STORAGE_KEY = 'userinfoV2'

const i18n = {
  getLiveConfigError: '获取直播配置失败',
  passwordTitle: '直播密码',
  passwordPlaceholder: '请输入直播密码',
  passwordConfirm: '确认',
  ssoErrorTitle:
    '当前已登录账号非本企业员工账号，需退出登录并重新认证。是否重新认证？',
  ssoConfirm: '重新认证',
  cancel: '取消',
}

type Props = {
  children: React.ReactNode
  meetingCode?: string
}

type AppContextType = {
  messages: []
  watermarkContent: string
  liveInfo?: LiveInfo
  liveConfig?: LiveConfig
  userInfo?: UserInfo
  isGuest: boolean
  updateLiveInfo?: (liveInfo: LiveInfo) => void
  redirectToSSO?: () => void
  redirectToLogin?: () => void
}

function replaceFormat(format: string, info: Record<string, string>) {
  const regex = /{([^}]+)}/g
  const result = format.replace(regex, (match, key) => {
    const value = info[key]

    return value || ''
  })

  return result
}

export const AppContext = React.createContext<AppContextType>({
  messages: [],
  watermarkContent: '',
  isGuest: true,
})

export const AppContextProvider: React.FC<Props> = ({
  children,
  meetingCode,
}) => {
  const navigate = useNavigate()
  const [isGuest, setIsGuest] = React.useState<boolean>(true)
  const [liveConfig, setLiveConfig] = React.useState<LiveConfig>()
  const [userInfo, setUserInfo] = React.useState<UserInfo>()
  const [liveInfo, setLiveInfo] = React.useState<LiveInfo>()
  const [liveWebLoginType, setLiveWebLoginType] =
    React.useState<LiveWebLoginType>()

  function updateLiveInfo(liveInfo: LiveInfo) {
    setLiveInfo((prev) => {
      return {
        ...prev,
        ...liveInfo,
      }
    })
  }

  function redirectToSSO() {
    if (liveConfig && liveWebLoginType) {
      navigate(
        `/login/sso?meetingUniqueId=${meetingCode}&enterpriseName=${encodeURI(
          liveWebLoginType.data.enterpriseName
        )}&loginAppNameSpace=${liveConfig.ssoInfo.appName}&entCode=${
          liveConfig.ssoInfo.entCode
        }`
      )
      window.location.reload()
    }
  }

  function redirectToLogin() {
    if (meetingCode) {
      navigate(`/login/phone?meetingUniqueId=${meetingCode}`)
      window.location.reload()
    }
  }

  async function getLiveInfoByPassword(noAuth: boolean = false) {
    if (meetingCode && liveConfig) {
      const sessionPassword =
        sessionStorage.getItem('meeting-live-password') ?? ''

      try {
        let liveInfo: LiveInfo | undefined = undefined

        if (noAuth) {
          liveInfo = await getLiveNoAuth({
            appKey: liveConfig.meetingAppKey,
            meetingNum: meetingCode,
            password: sessionPassword,
          })
        } else {
          if (userInfo) {
            liveInfo = await getLiveInfo({
              meetingNum: meetingCode,
              password: sessionPassword,
              token: userInfo.userToken,
              user: userInfo.userUuid,
            })
          }
        }

        if (liveInfo) {
          setLiveInfo(liveInfo)
          document.title = liveInfo.title
          return liveInfo
        }
      } catch (error) {
        const e = error as { code: number; msg: string }

        document.body.style.background = `url(${defaultCoverUrl}) 0% 0% / cover no-repeat fixed`
        document.body.style.height = '100vh'

        if (e.code === 1020) {
          sessionPassword && message.error(e.msg)
          let password = ''

          const FooterComponent = (inputValue: string) => {
            return (
              <div className="ant-modal-confirm-btns">
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    sessionStorage.setItem('meeting-live-password', inputValue)
                    window.location.reload()
                  }}
                  disabled={inputValue.length !== 6}
                >
                  {i18n.passwordConfirm}
                </Button>
              </div>
            )
          }

          const InputComponent = (inputValue: string) => {
            return (
              <Input
                maxLength={6}
                placeholder={i18n.passwordPlaceholder}
                value={inputValue}
                allowClear
                onChange={(event) => {
                  password = event.target.value.replace(/[^0-9]/g, '')
                  modal.update({
                    content: <>{InputComponent(password)}</>,
                    footer: FooterComponent(password),
                  })
                }}
              />
            )
          }

          const modal = Modal.confirm({
            wrapClassName: styles['password-modal'],
            icon: null,
            width: 300,
            centered: true,
            title: i18n.passwordTitle,
            content: InputComponent(''),
            footer: FooterComponent(''),
          })
        } else if (e.code === 662) {
          Modal.confirm({
            wrapClassName: styles['sso-modal'],
            icon: null,
            maskClosable: false,
            title: i18n.ssoErrorTitle,
            footer: (
              <div className="ant-modal-confirm-btns">
                <Button onClick={() => redirectToSSO?.()}>{i18n.cancel}</Button>
                <Button onClick={() => redirectToSSO?.()}>
                  {i18n.ssoConfirm}
                </Button>
              </div>
            ),
          })
        } else {
          message.error(e.msg || i18n.getLiveConfigError)
        }
      }
    }
  }

  const watermarkContent = useMemo(() => {
    let content = ''

    if (liveInfo?.watermarkConfig) {
      if (liveInfo.watermarkConfig.videoStrategy) {
        content = deviceId
        if (userInfo) {
          content = replaceFormat(liveInfo.watermarkConfig.videoFormat, {
            name: userInfo.username ?? userInfo.userName,
            id: userInfo.userUuid,
            phone: userInfo.phoneNumber,
          })
        }
      }
    }

    return content
  }, [liveInfo, userInfo])

  useEffect(() => {
    if (meetingCode) {
      getLiveConfig(meetingCode)
        .then((liveConfig) => {
          getLiveWebLoginType(meetingCode, liveConfig.meetingAppKey).then(
            (liveWebLoginType) => {
              setLiveWebLoginType(liveWebLoginType)
              setLiveConfig(liveConfig)
            }
          )
        })
        .catch((e) => {
          document.body.style.background = `url(${defaultCoverUrl}) 0% 0% / cover no-repeat fixed`
          document.body.style.height = '100vh'
          message.error(e.msg || i18n.getLiveConfigError, 1000)
        })
    }
  }, [meetingCode])

  useEffect(() => {
    if (liveConfig) {
      const userInfoStr =
        localStorage.getItem(USER_INFO_STORAGE_KEY) ||
        sessionStorage.getItem(USER_INFO_STORAGE_KEY)

      // 如果如果没有登录信息
      if (!userInfoStr) {
        // 只允许员工观看
        if (liveConfig.onlyEmployeesAllow) {
          redirectToSSO()
        } else {
          getLiveInfoByPassword(true)
        }

        return
      }

      setIsGuest(false)

      console.log(userInfoStr)

      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr || '')
          const { userToken, userUuid, appKey } = userInfo

          if (userToken && userUuid && appKey) {
            // 登录账号
            loginByToken(userInfo)
              .then(setUserInfo)
              .catch(() => {
                // 登录失败，清空 sessionStorage 中的用户信息
                sessionStorage.removeItem(USER_INFO_STORAGE_KEY)
                localStorage.removeItem(USER_INFO_STORAGE_KEY)
                window.location.reload()
              })
          } else {
            //
          }
        } catch {
          //
        }
      } else {
        // 本地没有用户信息
        // 只允许员工观看
        if (liveConfig.onlyEmployeesAllow && liveWebLoginType) {
          redirectToSSO()
        }
      }
    }
  }, [liveConfig])

  useEffect(() => {
    if (userInfo && meetingCode) {
      getLiveInfoByPassword()
    }
  }, [userInfo])

  useEffect(() => {
    // 监听直播状态变化, 如果为 2 则表示直播开始，再获取一次直播信息
    if (liveInfo?.state === 2 && meetingCode && userInfo) {
      getLiveInfoByPassword()
    }
  }, [liveInfo?.state])

  return (
    <AppContext.Provider
      value={{
        messages: [],
        watermarkContent,
        liveInfo,
        userInfo,
        liveConfig,
        isGuest,
        updateLiveInfo,
        redirectToSSO,
        redirectToLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType =>
  React.useContext<AppContextType>(AppContext)
