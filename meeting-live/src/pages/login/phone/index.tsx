import React, { useEffect, useMemo } from 'react'
import Header from '@/components/Header'

import styles from './index.less'
import { Button, Input, message } from 'antd'
import FooterAgreement from '@/components/FooterAgreement'
import {
  getLiveGuestByPhone,
  sendVerifyCodeApiLiveGuest,
} from '@/utils/request'
import { useNavigate, useSearchParams } from 'umi'

const LOCALSTORAGE_USER_INFO = 'userinfoV2'

const i18n = {
  phoneLoginTitle: '手机验证码登录',
  phonePlaceholder: '请输入手机号',
  codePlaceholder: '请输入验证码',
  codeBtnText: '获取验证码',
  loginBtnText: '登录',
  countdownText: 's 后重新获取验证码',
  errorMsg: '登录失败，请稍后再试',
  checkErrorMsg: '请先阅读并同意《隐私政策》和《用户协议》',
  codeSendSuccessMsg: '验证码已发送',
}

export default function PhoneLoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isH5, setIsH5] = React.useState(false)
  const [phone, setPhone] = React.useState('')
  const [code, setCode] = React.useState('')
  const [checked, setChecked] = React.useState(false)
  const [countdown, setCountdown] = React.useState(0)

  const codeBtnDisabled = useMemo(() => {
    // 手机号格式校验
    return phone.length !== 11 || countdown > 0
  }, [phone, countdown])

  const loginBtnDisabled = useMemo(() => {
    return phone.length !== 11 || code.length !== 6
  }, [phone, code])

  function sendVerifyCode() {
    const meetingUniqueId = searchParams.get('meetingUniqueId')

    if (!meetingUniqueId) {
      return
    }

    sendVerifyCodeApiLiveGuest({
      meetingCode: meetingUniqueId,
      phoneNum: phone,
    }).then(() => {
      message.success(i18n.codeSendSuccessMsg)
      setCountdown(60)
    })
  }

  function onLiveGuestByPhone() {
    if (!checked) {
      message.info(i18n.checkErrorMsg)
      return
    }

    const meetingUniqueId = searchParams.get('meetingUniqueId')

    if (!meetingUniqueId) {
      return
    }

    getLiveGuestByPhone({
      meetingCode: meetingUniqueId,
      phoneNum: phone,
      verifyCode: code,
    })
      .then((res) => {
        sessionStorage.setItem(LOCALSTORAGE_USER_INFO, JSON.stringify(res))
        navigate(`/${meetingUniqueId}`)
        window.location.reload()
      })
      .catch((error) => {
        message.error(error.msg ?? i18n.errorMsg)
      })
  }

  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }
  }, [countdown])

  useEffect(() => {
    document.body.style.background = `#F2F3F5`

    function onResize() {
      const innerWidth = window.innerWidth

      setIsH5(innerWidth < 800)
    }

    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.container}>
        <div className={isH5 ? styles['content-h5'] : styles['content-pc']}>
          <div className={styles.title}>{i18n.phoneLoginTitle}</div>
          <Input
            className={styles.phoneInput}
            placeholder={i18n.phonePlaceholder}
            value={phone}
            maxLength={11}
            onChange={(e) => setPhone(e.target.value)}
            prefix={
              <span className={styles.prefix}>
                +86 <div className={styles.line} />
              </span>
            }
          />
          <Input
            className={styles.codeInput}
            placeholder={i18n.codePlaceholder}
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value)}
            suffix={
              <span className={styles.suffix}>
                <Button
                  disabled={codeBtnDisabled}
                  type="link"
                  className={styles.codeBtn}
                  onClick={sendVerifyCode}
                >
                  {countdown > 0
                    ? `${countdown}${i18n.countdownText}`
                    : i18n.codeBtnText}
                </Button>
              </span>
            }
          />

          <Button
            type="primary"
            disabled={loginBtnDisabled}
            className={styles.loginBtn}
            onClick={onLiveGuestByPhone}
          >
            {i18n.loginBtnText}
          </Button>
          <FooterAgreement
            className={styles.footerAgreement}
            checked={checked}
            onCheck={setChecked}
          />
        </div>
      </div>
    </div>
  )
}
