import React from 'react'

import { Button, Input } from 'antd'
import FooterAgreement from '@/components/FooterAgreement'
import MyIcon from '@/components/MyIcon'

import styles from './index.less'

const i18n = {
  ssoLoginNextBtnText: '下一步',
  ssoPlaceholder: '请输入企业代码',
  ssoHelpText: '如何获取企业代码？',
  sso: 'SSO登录',
}

interface Step1Props {
  setStep: (step: number) => void
  ssoCode: string
  setSsoCode: (ssoCode: string) => void
  checked: boolean
  setChecked: (checked: boolean) => void
  getEnterPriseInfo: () => void
}

export default function Step1({
  setStep,
  ssoCode,
  setSsoCode,
  checked,
  setChecked,
  getEnterPriseInfo,
}: Step1Props) {
  return (
    <>
      <MyIcon
        className={styles.returnIcon}
        type="iconyx-returnx"
        onClick={() => setStep(0)}
      />
      <img
        className={styles.logo}
        src="https://yiyong-static.nosdn.127.net/meeting-web-management-prod/static/app-about-logo.98afde52.png"
        alt=""
      />
      <Input
        className={styles.ssoInput}
        placeholder={i18n.ssoPlaceholder}
        value={ssoCode}
        onChange={(e) => setSsoCode(e.target.value)}
        allowClear
        prefix={<MyIcon className={styles.ssoPrefix} type="iconqiyedaima" />}
      />
      <a
        href="https://doc.yunxin.163.com/meeting/concept/DI1MDY1ODg?platform=client"
        target="_blank"
        className={styles.ssoHelp}
        rel="noreferrer"
      >
        {i18n.ssoHelpText}
      </a>
      <Button
        className={styles.nextBtn}
        type="primary"
        onClick={() => getEnterPriseInfo()}
      >
        {i18n.ssoLoginNextBtnText}
      </Button>
      <div className={styles.ssoFooter}>
        <div className={styles.ssoBoxWrapper} onClick={() => setStep(2)}>
          <MyIcon className={styles.ssoBox} type="iconSSO1" />
          <span>{i18n.sso}</span>
        </div>
      </div>
      <FooterAgreement
        className={styles.footerAgreement}
        checked={checked}
        onCheck={setChecked}
      />
    </>
  )
}
