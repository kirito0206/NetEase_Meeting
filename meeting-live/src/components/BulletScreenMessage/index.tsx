import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import reactStringReplace from 'react-string-replace'
import styles from './index.less'
import { Message, useChatroomContext } from '@/hooks/useChatroom'
import Emoji from '../ChatRoom/Emoji'

type BulletMessage = Message & { opacity: number }

const i18n = {
  buttonText: '弹幕',
}

const BulletScreenMessage: React.FC = () => {
  const { messages } = useChatroomContext()
  const timerRef = useRef<NodeJS.Timeout>()
  const [bulletMessages, setBulletMessages] = useState<BulletMessage[]>([])
  const [bulletMessageHidden, setBulletMessageHidden] = useState<boolean>(false)

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      const nowTime = new Date().getTime()
      const val = messages
        .filter((item) => item.time > nowTime - 8000)
        .slice(-10)
        .reverse()

      if (!val.length) {
        setBulletMessages([])
        clearInterval(timerRef.current)
      } else {
        setBulletMessages(
          val.map((item) => {
            let opacity = 1
            const count = 8 - (nowTime - item.time) / 1000

            if (count <= 4) {
              opacity = count > 0 ? count / 4 : 0
            }

            return {
              ...item,
              opacity,
            }
          })
        )
      }
    }, 100)
  }, [messages])

  useEffect(() => {
    if (!bulletMessages.length) return
    const videoDom = document.querySelector('.video-js') as HTMLDivElement

    if (videoDom) {
      videoDom.style.position = 'relative'
      const bulletMessageList = document.getElementById(
        'bullet-screen-message-list-dom'
      )
      const isExist = videoDom.querySelector('#bullet-screen-message-list-dom')

      if (!isExist) {
        bulletMessageList && videoDom.appendChild(bulletMessageList)
      }
    }
  }, [bulletMessages.length])

  useEffect(() => {
    function addBulletSwitchButton() {
      if (document.getElementById('bullet-screen-message-button-dom')) {
        return
      }

      const videoControlBarDom = document.querySelector('.vjs-control-bar')

      if (videoControlBarDom) {
        const lastChild = videoControlBarDom.lastChild
        const buttonDom = document.createElement('div')

        buttonDom.id = 'bullet-screen-message-button-dom'
        buttonDom.className = styles['bullet-screen-message-button']
        const bulletButtonStr = `
        <span class="${styles['button-text']}">${i18n.buttonText}</span>
        <div class="${styles['button-circle-indicator']}"></div>
      `

        buttonDom.innerHTML = bulletButtonStr

        buttonDom.addEventListener('click', () => {
          const closeCls = styles['bullet-screen-message-button-close']

          if (buttonDom.className.includes(closeCls)) {
            setBulletMessageHidden(false)
            buttonDom.className = classNames(
              styles['bullet-screen-message-button']
            )
          } else {
            setBulletMessageHidden(true)
            buttonDom.className = classNames(
              styles['bullet-screen-message-button'],
              closeCls
            )
          }
        })

        videoControlBarDom.insertBefore(buttonDom, lastChild)
      }
    }

    const timer = setInterval(() => {
      addBulletSwitchButton()
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div
      id="bullet-screen-message-list-dom"
      className={classNames(styles['bullet-screen-message-list'], {
        [styles['bullet-screen-message-list-hidden']]: bulletMessageHidden,
      })}
    >
      {bulletMessages.map((message) => (
        <div
          key={message.idClient}
          className={styles['bullet-screen-message-item-wrapper']}
        >
          <div
            className={styles['bullet-screen-message-item']}
            style={{ opacity: message.opacity }}
          >
            <div className={styles['bullet-screen-message-item-box']}>
              <span className={styles['bullet-screen-message-item-nickname']}>
                {message.fromNick}：
              </span>
              {reactStringReplace(message.text, /(\[.*?\])/gi, (match, i) => {
                return <Emoji key={i} emojiKey={match} size={20} />
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BulletScreenMessage
