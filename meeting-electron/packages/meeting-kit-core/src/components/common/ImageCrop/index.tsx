import 'cropperjs/dist/cropper.css'
import React, { createRef, MouseEventHandler, useState } from 'react'
import Cropper, { ReactCropperElement } from 'react-cropper'

import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import Toast from '../toast'
import './index.less'
import NEMeetingAccountService from '../../../kit/interface/service/meeting_account_service'

interface ImageCropProps {
  className?: string
  accountService?: NEMeetingAccountService
  image: string
  onOk?: () => void
  onCancel?: MouseEventHandler<HTMLElement>
}

const ImageCrop: React.FC<ImageCropProps> = (props) => {
  const { image, accountService } = props
  const { t } = useTranslation()
  const cropperRef = createRef<ReactCropperElement>()

  const [loading, setLoading] = useState(false)

  // 获取裁剪后的头像，并上传
  const getCropData = () => {
    setLoading(true)
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      if (window.isElectronNative) {
        const base64 = cropperRef.current?.cropper
          .getCroppedCanvas()
          .toDataURL()

        window.ipcRenderer
          ?.invoke('saveAvatarToPath', base64)
          .then(({ filePath }) => {
            accountService
              ?.updateAvatar(filePath)
              .then(() => {
                props.onOk?.()
              })
              .catch(() => {
                Toast.fail(t('settingAvatarUpdateFail'))
              })
              .finally(() => {
                setLoading(false)
              })
          })
      } else {
        cropperRef.current?.cropper.getCroppedCanvas().toBlob((blob) => {
          if (blob) {
            accountService
              ?.updateAvatar(blob)
              .then(() => {
                props.onOk?.()
              })
              .catch(() => {
                Toast.fail(t('settingAvatarUpdateFail'))
              })
              .finally(() => {
                setLoading(false)
              })
          }
        })
      }
    }
  }

  return (
    <div className="image-crop-wrapper">
      <Cropper
        ref={cropperRef}
        style={{ height: 270, width: '100%' }}
        aspectRatio={1}
        initialAspectRatio={1}
        preview=".img-preview"
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        guides={true}
      />
      <div className="image-crop-footer">
        <Button className="image-crop-footer-button" onClick={props.onCancel}>
          {t('globalCancel')}
        </Button>
        <Button
          className="image-crop-footer-button"
          type="primary"
          loading={loading}
          onClick={getCropData}
        >
          {t('save')}
        </Button>
      </div>
    </div>
  )
}

export default ImageCrop
