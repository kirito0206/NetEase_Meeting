import React, { useMemo, useState } from 'react'

import { Button, Input, message } from 'antd'
import FooterAgreement from '@/components/FooterAgreement'
import MyIcon from '@/components/MyIcon'
import request, { deviceId, config } from '@/utils/request'

import styles from './index.less'

const i18n = {
  sso: 'SSO登录',
  ssoEmailLogin: '企业邮箱登录',
  ssoPlaceholder: '请输入企业代码',
  ssoEmailPlaceholder: '请输入邮箱',
  ssoLoginCodeModeHelp: '可与企业管理员咨询您的企业代码',
  ssoLoginCodeModeHelpBtn: '我不知道企业代码',
  ssoLoginEmailModeHelpBtn: '我知道企业代码',
  loginBtnText: '登录',
  ssoLevelErrorMsg: '您的企业不支持SSO登录，请联系管理员',
  checkErrorMsg: '请先阅读并同意《隐私政策》和《用户协议》',
  errorMsg: '登录失败，请稍后再试',
}

interface Step2Props {
  setStep: (step: number) => void
  ssoCode: string
  setSsoCode: (ssoCode: string) => void
  checked: boolean
  setChecked: (checked: boolean) => void
}

export default function Step2({
  setStep,
  ssoCode,
  setSsoCode,
  checked,
  setChecked,
}: Step2Props) {
  const [ssoMode, setSsoMode] = useState<'code' | 'email'>('code')
  const [ssoEmail, setSsoEmail] = useState('')

  const loginBtnDisabled = useMemo(() => {
    if (ssoMode === 'code') {
      return !ssoCode
    } else {
      return !ssoEmail
    }
  }, [ssoMode, ssoCode, ssoEmail])

  function ssoLogin() {
    if (!checked) {
      message.info(i18n.checkErrorMsg)
      return
    }

    let code = undefined
    let email = undefined

    if (ssoMode === 'code') {
      code = ssoCode
    } else {
      email = ssoEmail
    }

    request
      .getEnterPriseInfoApi({
        code,
        email,
      })
      .then((res) => {
        const ipdInfo = res.idpList.find((item) => {
          return item.type === 1
        })

        if (ipdInfo) {
          const callback = encodeURIComponent(
            `${location.href}&appKey=${res.appKey}&deviceId=${deviceId}`
          )

          window.location.href = `${config.meetingServerDomain}/scene/meeting/v2/sso-authorize?callback=${callback}&idp=${ipdInfo.id}&key=${deviceId}&clientType=web&appKey=${res.appKey}`
        } else {
          message.error(i18n.ssoLevelErrorMsg)
        }
      })
      .catch((error) => {
        message.error(error.msg ?? i18n.errorMsg)
      })
  }

  return (
    <>
      <MyIcon
        className={styles.returnIcon}
        type="iconyx-returnx"
        onClick={() => setStep(1)}
      />
      <div className={styles.loginTitle}>
        {ssoMode === 'code' ? i18n.sso : i18n.ssoEmailLogin}
      </div>
      <Input
        className={styles.ssoInput}
        placeholder={
          ssoMode === 'code' ? i18n.ssoPlaceholder : i18n.ssoEmailPlaceholder
        }
        value={ssoMode === 'code' ? ssoCode : ssoEmail}
        onChange={(e) => {
          if (ssoMode === 'code') {
            setSsoCode(e.target.value)
          } else {
            setSsoEmail(e.target.value)
          }
        }}
        allowClear
        prefix={<MyIcon className={styles.ssoPrefix} type="iconqiyedaima" />}
      />
      <div className={styles.inputHelpWrapper}>
        <div>{ssoMode === 'code' ? i18n.ssoLoginCodeModeHelp : ''}</div>
        <a
          onClick={() =>
            ssoMode === 'code' ? setSsoMode('email') : setSsoMode('code')
          }
        >
          {ssoMode === 'code'
            ? i18n.ssoLoginCodeModeHelpBtn
            : i18n.ssoLoginEmailModeHelpBtn}
        </a>
      </div>
      <Button
        disabled={loginBtnDisabled}
        className={styles.nextBtn}
        type="primary"
        onClick={() => ssoLogin()}
      >
        {i18n.loginBtnText}
      </Button>
      <FooterAgreement
        className={styles.footerAgreementMargin}
        checked={checked}
        onCheck={setChecked}
      />
    </>
  )
}
