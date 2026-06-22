import React from 'react'
import footerAgreementLogoUrl from '@/assets/mob-logo@2x.png'

import classNames from 'classnames'
import { Checkbox } from 'antd'
import styles from './index.less'

interface FooterAgreementProps {
  className?: string
  hideIcon?: boolean
  onCheck: (checked: boolean) => void
  checked: boolean
}
const i18n = {
  agreementText: '已阅读并同意网易会议',
  and: '和',
  privacyPolicy: '隐私政策',
  userAgreement: '用户协议',
}

const privacyPolicyLink =
  'https://meeting.163.com/privacy/agreement_mobile_ysbh_wap.shtml'
const userAgreementLink = 'https://netease.im/meeting/clauses?serviceType=0'

export default function FooterAgreement({
  className,
  onCheck,
  checked,
  hideIcon = false,
}: FooterAgreementProps) {
  return (
    <div className={classNames(styles.footerAgreement, className)}>
      <div className={styles.footerAgreementContent}>
        <Checkbox
          className={styles.checkbox}
          checked={checked}
          onChange={() => onCheck(!checked)}
        />
        <span>
          {i18n.agreementText}
          <a href={privacyPolicyLink} target="_blank" rel="noreferrer">
            {i18n.privacyPolicy}
          </a>
          {i18n.and}
          <a href={userAgreementLink} target="_blank" rel="noreferrer">
            {i18n.userAgreement}
          </a>
        </span>
      </div>
      {!hideIcon && (
        <img
          src={footerAgreementLogoUrl}
          alt="footerAgreementLogo"
          className={styles.footerAgreementLogo}
        />
      )}
    </div>
  )
}
