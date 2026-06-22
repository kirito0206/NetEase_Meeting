import React, { useMemo, useState } from 'react'

import { Button, Divider, Input, message } from 'antd'
import FooterAgreement from '@/components/FooterAgreement'
import MyIcon from '@/components/MyIcon'

import styles from './index.less'
import { EnterPriseInfo, loginApiNew } from '@/utils/request'
import { useNavigate, useSearchParams } from 'umi'

const i18n = {
  usernameLogin: '账号密码登录',
  usernamePlaceholder: '请输入账号',
  passwordPlaceholder: '请输入密码',
  phoneLogin: '手机号密码登录',
  phonePlaceholder: '请输入手机号',
  emailLogin: '邮箱密码登录',
  emailPlaceholder: '请输入邮箱',
  loginBtnText: '登录',
  otherLogin: '其他登录方式',
  phone: '手机号',
  email: '邮箱',
  sso: 'SSO登录',
  username: '账号密码',
  checkErrorMsg: '请先阅读并同意《隐私政策》和《用户协议》',
  errorMsg: '登录失败，请稍后再试',
}

const LOCALSTORAGE_USER_INFO = 'userinfoV2'

interface Step3Props {
  enterPriseInfo: EnterPriseInfo
  setStep: (step: number) => void
  checked: boolean
  setChecked: (checked: boolean) => void
}

export default function Step3({
  enterPriseInfo,
  setStep,
  checked,
  setChecked,
}: Step3Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [loginType, setLoginType] = useState(0) // 0: 账号密码登录 1: 手机号密码登录 2: 邮箱密码登录
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginBtnDisabled = useMemo(() => {
    return ![username, phone, email][loginType] || !password
  }, [username, phone, email, password])

  function onLogin() {
    if (!checked) {
      message.info(i18n.checkErrorMsg)
      return
    }

    let _username = undefined
    let _email = undefined
    let _phone = undefined

    if (loginType === 0) {
      _username = username
    } else if (loginType === 1) {
      _phone = phone
    } else {
      _email = email
    }

    const appKey = enterPriseInfo.appKey
    const meetingUniqueId = searchParams.get('meetingUniqueId')

    if (appKey && meetingUniqueId) {
      loginApiNew({
        appKey,
        username: _username,
        phone: _phone,
        email: _email,
        password,
      })
        .then((res) => {
          localStorage.setItem(
            LOCALSTORAGE_USER_INFO,
            JSON.stringify({
              ...res,
              appKey,
            })
          )
          navigate(`/${meetingUniqueId}`)
          window.location.reload()
        })
        .catch((error) => {
          message.error(error.msg ?? i18n.errorMsg)
        })
    }
  }

  return (
    <>
      <MyIcon
        className={styles.returnIcon}
        type="iconyx-returnx"
        onClick={() => setStep(1)}
      />
      <div className={styles.companyName}>{enterPriseInfo?.appName}</div>
      <div className={styles.loginTitle}>
        {[i18n.usernameLogin, i18n.phoneLogin, i18n.emailLogin][loginType]}
      </div>
      <Input
        className={styles.ssoInput}
        placeholder={
          [
            i18n.usernamePlaceholder,
            i18n.phonePlaceholder,
            i18n.emailPlaceholder,
          ][loginType]
        }
        value={[username, phone, email][loginType]}
        onChange={(e) => {
          ;[setUsername, setPhone, setEmail][loginType](e.target.value)
        }}
        allowClear
        prefix={
          <MyIcon
            className={styles.ssoPrefix}
            type={['iconzhanghao', 'iconshouji', 'iconqiyeyouxiang'][loginType]}
          />
        }
      />
      <Input.Password
        className={styles.passwordInput}
        placeholder={i18n.passwordPlaceholder}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        iconRender={(visible) =>
          visible ? (
            <MyIcon type="iconpassword-displayx" />
          ) : (
            <MyIcon type="iconpassword-hidex" />
          )
        }
        prefix={<MyIcon className={styles.ssoPrefix} type="iconmima" />}
      />
      <Button
        className={styles.nextBtn}
        type="primary"
        disabled={loginBtnDisabled}
        onClick={() => onLogin()}
      >
        {i18n.loginBtnText}
      </Button>
      <FooterAgreement
        className={styles.footerAgreement}
        checked={checked}
        onCheck={setChecked}
        hideIcon
      />

      <Divider plain className={styles.otherLogin}>
        {i18n.otherLogin}
      </Divider>
      <div className={styles.ssoFooter}>
        <div
          className={styles.ssoBoxWrapper}
          onClick={() => {
            if (loginType === 1) {
              setLoginType(0)
            } else {
              setLoginType(1)
            }
          }}
        >
          <MyIcon className={styles.ssoBox} type="iconshouji" />
          <span>{loginType === 1 ? i18n.username : i18n.phone}</span>
        </div>
        <div
          className={styles.ssoBoxWrapper}
          onClick={() => {
            if (loginType === 2) {
              setLoginType(0)
            } else {
              setLoginType(2)
            }
          }}
        >
          <MyIcon className={styles.ssoBox} type="iconqiyeyouxiang" />
          <span>{loginType === 2 ? i18n.username : i18n.email}</span>
        </div>
        <div className={styles.ssoBoxWrapper} onClick={() => setStep(2)}>
          <MyIcon className={styles.ssoBox} type="iconSSO1" />
          <span>{i18n.sso}</span>
        </div>
      </div>
    </>
  )
}
