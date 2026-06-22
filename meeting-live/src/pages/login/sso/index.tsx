import React, { useEffect } from 'react'
import Header from '@/components/Header'

import styles from './index.less'
import { message } from 'antd'
import { useNavigate, useSearchParams } from 'umi'
import request, { config, deviceId, EnterPriseInfo } from '@/utils/request'
import Step0 from './components/Step0'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'

const LOCALSTORAGE_USER_INFO = 'userinfoV2'

const i18n = {
  errorMsg: '登录失败，请稍后再试',
  checkErrorMsg: '请先阅读并同意《隐私政策》和《用户协议》',
}

export default function SSOLoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = React.useState(-1)

  const [ssoCode, setSsoCode] = React.useState('')
  const [isH5, setIsH5] = React.useState(false)
  const [checked, setChecked] = React.useState(false)
  const [enterPriseInfo, setEnterPriseInfo] = React.useState<EnterPriseInfo>()

  const entCode = searchParams.get('entCode')

  function getEnterPriseInfo() {
    if (!checked) {
      message.info(i18n.checkErrorMsg)
      return
    }

    request
      .getEnterPriseInfoApi({
        code: ssoCode,
      })
      .then((res) => {
        setEnterPriseInfo(res)
        const ipdInfo = res.idpList.find((item) => {
          return item.type === 1
        })

        if (ipdInfo && res.ssoLevel === 2) {
          const callback = encodeURIComponent(
            `${location.href}&appKey=${res.appKey}&deviceId=${deviceId}`
          )

          window.location.href = `${config.meetingServerDomain}/scene/meeting/v2/sso-authorize?callback=${callback}&idp=${ipdInfo.id}&key=${deviceId}&clientType=web&appKey=${res.appKey}`
        } else {
          setStep(3)
        }
      })
      .catch((error) => {
        message.error(error.msg ?? i18n.errorMsg)
      })
  }

  useEffect(() => {
    const param = searchParams.get('param')
    const appKey = searchParams.get('appKey')
    const deviceId = searchParams.get('deviceId')
    const meetingUniqueId = searchParams.get('meetingUniqueId')

    if (param && appKey && deviceId) {
      request.loginBySSOUrl({ param, appKey, deviceId }).then((res) => {
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
    } else {
      setStep(0)
    }
  }, [searchParams])

  useEffect(() => {
    entCode && setSsoCode(entCode)
  }, [entCode])

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

  return step === -1 ? null : (
    <div className={styles.root}>
      <Header />
      <div className={styles.container}>
        <div className={isH5 ? styles['content-h5'] : styles['content-pc']}>
          {step === 0 && <Step0 setStep={setStep} />}
          {step === 1 && (
            <Step1
              setStep={setStep}
              ssoCode={ssoCode}
              setSsoCode={setSsoCode}
              checked={checked}
              setChecked={setChecked}
              getEnterPriseInfo={getEnterPriseInfo}
            />
          )}
          {step === 2 && (
            <Step2
              setStep={setStep}
              ssoCode={ssoCode}
              setSsoCode={setSsoCode}
              checked={checked}
              setChecked={setChecked}
            />
          )}
          {step === 3 && enterPriseInfo && (
            <Step3
              enterPriseInfo={enterPriseInfo}
              setStep={setStep}
              checked={checked}
              setChecked={setChecked}
            />
          )}
        </div>
      </div>
    </div>
  )
}
