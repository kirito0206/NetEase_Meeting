import React from 'react'
import styles from './index.less'
import { Button } from 'antd'
import { useSearchParams } from 'umi'

const i18n = {
  ssoLoginTitle: '登录认证提示',
  companyName: '企业',
  ssoLoginDesc:
    '本场直播仅支持{{companyName}}内部员工观看，如果您是本企业员工，请点击【下一步】进行企业认证',
  ssoLoginSubDesc: '如您非本企业员工，您将无法认证和观看',
  ssoLoginNextBtnText: '下一步',
}

interface Step0Props {
  setStep: (step: number) => void
}

export default function Step0({ setStep }: Step0Props) {
  const [searchParams] = useSearchParams()

  const enterpriseName = searchParams.get('enterpriseName') ?? i18n.companyName

  return (
    <>
      <div className={styles.title}>{i18n.ssoLoginTitle}</div>
      <div
        className={styles.desc}
        dangerouslySetInnerHTML={{
          __html: i18n.ssoLoginDesc.replace(
            '{{companyName}}',
            `<span style="color: #0077FF">${enterpriseName}</span>`
          ),
        }}
      />
      <div className={styles.subDesc}>{i18n.ssoLoginSubDesc}</div>
      <Button
        className={styles.nextBtn}
        type="primary"
        onClick={() => setStep(1)}
      >
        {i18n.ssoLoginNextBtnText}
      </Button>
    </>
  )
}
