import React, { useState } from 'react'
import { Popover } from 'antd'
import EmojiItem, { emojiMap } from '../Emoji'

import './index.less'

type ChatEmojiPopoverProps = {
  disabled?: boolean
  children: React.ReactNode
  onClick: (emojiKey: string) => void
}

const EmojiPopover: React.FC<ChatEmojiPopoverProps> = (props) => {
  const { onClick, disabled } = props
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false)

  function renderContent() {
    const emojiKeys = Object.keys(emojiMap)

    return (
      <div className="meeting-living-chat-emoji-wrapper">
        {emojiKeys.map((emojiKey) => {
          return (
            <EmojiItem
              key={emojiKey}
              emojiKey={emojiKey}
              onClick={(emojiKey) => {
                setEmojiPopoverOpen(false)
                onClick(emojiKey)
              }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Popover
      trigger={['click']}
      placement="top"
      align={{ offset: [-80, -15] }}
      overlayClassName="meeting-living-chat-emoji-popover"
      content={renderContent()}
      arrow={false}
      open={!disabled && emojiPopoverOpen}
      onOpenChange={(open) => {
        setEmojiPopoverOpen(open)
      }}
      getPopupContainer={(node) => node}
    >
      {props.children}
    </Popover>
  )
}

export default EmojiPopover
