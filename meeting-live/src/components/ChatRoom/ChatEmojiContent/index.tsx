import React from 'react'
import EmojiItem, { emojiMap } from '../Emoji'
import styles from './index.less'

type ChatEmojiContentProps = {
  onClick: (emojiKey: string) => void
}

const ChatEmojiContent: React.FC<ChatEmojiContentProps> = (props) => {
  const { onClick } = props

  const emojiKeys = Object.keys(emojiMap)

  return (
    <div className={styles['chat-input-emoji-content']}>
      {emojiKeys.map((emojiKey) => {
        return (
          <div
            className={styles['chat-input-emoji-item-wrapper']}
            key={emojiKey}
          >
            <EmojiItem
              size={30}
              emojiKey={emojiKey}
              onClick={(emojiKey) => {
                onClick?.(emojiKey)
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ChatEmojiContent
