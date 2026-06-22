import React, { useEffect, useMemo } from 'react'
import styles from './index.less'
import { useChatroomContext } from '@/hooks/useChatroom'
import ArrowDownOutlined from '@ant-design/icons/ArrowDownOutlined'
import { Input, Button, message, Modal } from 'antd'
import dayjs from 'dayjs'
import SmileOutlined from '@ant-design/icons/SmileOutlined'
import MessageItem from '../MessageItem'
import EmojiPopover from '../EmojiPopover'
import FavoriteBox from '../FavoriteBox'
import ChatEmojiContent from '@/components/ChatRoom/ChatEmojiContent'
import { useAppContext } from '@/hooks/useApp'
import { drawWatermark, stopDrawWatermark } from '@/utils/watermark'

const i18n = {
  chatroomTitle: '互动聊天室',
  send: '发送',
  login: '登录',
  inputPlaceholder: '请输入文字',
  inputDisabledPlaceholder: '主播已关闭文字聊天',
  inputDisabledPlaceholderGuest: '游客状态无法进行交互',
  inputDisabledPlaceholderKicked: '多个页面重复打开直播，请刷新重试',
  loginTitle: '请登录以发送文字',
  loginBySSO: '企业账号登录',
  loginByMobile: '手机验证码登录',
  newMsg: '新消息',
}

type Props = {
  isH5: boolean
}

const ChatRoom: React.FC<Props> = (props) => {
  const { isH5 } = props
  const {
    liveConfig,
    isGuest,
    liveInfo,
    watermarkContent,
    redirectToSSO,
    redirectToLogin,
  } = useAppContext()
  const { messages, disabled, kicked, onSendTextMsg } = useChatroomContext()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const listDomRef = React.useRef<HTMLDivElement>(null)
  const isScrolledToBottomRef = React.useRef<boolean>(false)
  const [inputValue, setInputValue] = React.useState('')
  const [showToBottom, setShowToBottom] = React.useState(false)
  const [showEmoji, setShowEmoji] = React.useState(false)

  const hidden = useMemo(() => {
    if (!isH5 && !liveInfo?.liveChatRoomEnable) {
      return true
    }

    return false
  }, [liveInfo?.liveChatRoomEnable, isH5])

  useEffect(() => {
    const liveBox = document.querySelector('#live-container')

    function resize() {
      const dom = containerRef.current

      if (dom && liveBox) {
        dom.style.height = liveBox.clientHeight + 'px'
      }
    }

    if (!isH5) {
      resize()
      const observer = new MutationObserver(() => {
        resize()
      })

      liveBox &&
        observer.observe(liveBox, {
          attributes: true,
        })
    }
  }, [isH5])

  function onSend() {
    if (disabled) {
      message.error(
        kicked
          ? i18n.inputDisabledPlaceholderKicked
          : isGuest
          ? i18n.inputDisabledPlaceholderGuest
          : i18n.inputDisabledPlaceholder
      )
      return
    }

    setInputValue('')
    onSendTextMsg?.(inputValue)
  }

  function onLogin() {
    Modal.confirm({
      wrapClassName: styles['login-modal'],
      icon: null,
      maskClosable: true,
      title: i18n.loginTitle,
      footer: (
        <div className="ant-modal-confirm-btns">
          <Button onClick={() => redirectToLogin?.()}>
            {i18n.loginByMobile}
          </Button>
          <Button onClick={() => redirectToSSO?.()}>{i18n.loginBySSO}</Button>
        </div>
      ),
    })
  }

  function scrollToBottom() {
    const scrollTarget = listDomRef.current

    if (scrollTarget) {
      scrollTarget.scrollTop = scrollTarget.scrollHeight
    }

    setShowToBottom(false)
  }

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const scrollTarget = e.target as HTMLDivElement
    const { scrollHeight, clientHeight, scrollTop } = scrollTarget

    isScrolledToBottomRef.current = scrollHeight - clientHeight < scrollTop + 20

    if (isScrolledToBottomRef.current) {
      setShowToBottom(false)
    }
  }

  useEffect(() => {
    if (messages.length === 0) return

    const lastMsg = messages[messages.length - 1]

    if (lastMsg.isMe) {
      scrollToBottom()
    } else {
      if (isScrolledToBottomRef.current) {
        scrollToBottom()
      } else {
        setShowToBottom(true)
      }
    }
  }, [messages.length])

  useEffect(() => {
    setTimeout(() => {
      if (watermarkContent) {
        stopDrawWatermark(containerRef.current)
        drawWatermark({
          container: containerRef.current,
          content: watermarkContent,
        })
      }
    }, 500)
  }, [watermarkContent])

  return hidden ? null : (
    <div
      className={
        isH5 ? styles['h5-chatroom-container'] : styles['pc-chatroom-container']
      }
      ref={containerRef}
    >
      <div className={styles.header}>{i18n.chatroomTitle}</div>
      <div className={styles.content}>
        <div
          className={styles['message-list']}
          ref={listDomRef}
          onScroll={onScroll}
        >
          {messages.map((msg, index) => {
            let time = 0

            if (index === 0) {
              time = msg.time
            } else {
              const prevItem = messages[index - 1]

              if (msg.time - prevItem.time > 60 * 1000) {
                time = msg.time
              }
            }

            return (
              <div key={msg.idClient}>
                {time > 0 ? (
                  <div className={styles['message-item-time']}>
                    {dayjs(time).isSame(dayjs(), 'D')
                      ? dayjs(time).format('HH:mm')
                      : dayjs(time).format('YYYY-MM-DD HH:mm')}
                  </div>
                ) : null}
                <MessageItem msg={msg} />
              </div>
            )
          })}
        </div>
        {isGuest ? null : <FavoriteBox />}
        {showToBottom ? (
          <div className={styles['new-msg']} onClick={() => scrollToBottom()}>
            <ArrowDownOutlined />
            {i18n.newMsg}
          </div>
        ) : null}
      </div>
      {liveConfig ? (
        <div className={styles.footer}>
          <div className={styles['input-wrapper']}>
            <Input
              className={styles.input}
              placeholder={
                disabled
                  ? kicked
                    ? i18n.inputDisabledPlaceholderKicked
                    : isGuest
                    ? i18n.inputDisabledPlaceholderGuest
                    : i18n.inputDisabledPlaceholder
                  : i18n.inputPlaceholder
              }
              suffix={
                <EmojiPopover
                  disabled={isH5 || disabled}
                  onClick={(key) => {
                    setInputValue((prev) => (prev += key))
                  }}
                >
                  <SmileOutlined
                    className={styles['emoji-icon']}
                    onClick={(e) => {
                      if (!disabled) {
                        setShowEmoji((prev) => !prev)
                      }

                      e.stopPropagation()
                    }}
                  />
                </EmojiPopover>
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => {
                setShowEmoji(false)
              }}
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSend()
                }
              }}
            />
            {isGuest && (
              <Button
                className={styles['send-btn']}
                type="primary"
                autoInsertSpace={false}
                onClick={() => onLogin()}
              >
                {i18n.login}
              </Button>
            )}
            <Button
              className={styles['send-btn']}
              type="primary"
              autoInsertSpace={false}
              disabled={!inputValue}
              onClick={() => onSend()}
            >
              {i18n.send}
            </Button>
          </div>
          {isH5 && showEmoji && (
            <ChatEmojiContent
              onClick={(key) => {
                setInputValue((prev) => (prev += key))
              }}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}

export default ChatRoom
