import React from 'react'
import styles from './index.less'
import classNames from 'classnames'
import reactStringReplace from 'react-string-replace'
import Emoji from '../Emoji'
import { Message } from '@/hooks/useChatroom'

type MessageItemProps = {
  msg: Message
}

const MessageItem: React.FC<MessageItemProps> = (props) => {
  const { msg } = props

  return (
    <div
      className={classNames(styles['message-item-box'], {
        [styles['is-me']]: msg.isMe,
      })}
    >
      <div className={styles['message-item-name']}>{msg.fromNick}</div>
      <div className={styles['message-item-content-wrapper']}>
        <div className={styles['message-item-content']}>
          {reactStringReplace(msg.text, /(\[.*?\])/gi, (match, i) => {
            return <Emoji key={i} emojiKey={match} size={20} />
          })}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
