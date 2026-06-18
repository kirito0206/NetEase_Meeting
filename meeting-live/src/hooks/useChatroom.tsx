import {
  getChatroomAddr,
  getLikeCount,
  LiveInfo,
  postLike,
} from '@/utils/request'
import React, { useEffect, useMemo } from 'react'
import { Chatroom } from '@yxim/nim-web-sdk'
import { useAppContext } from './useApp'
import { NIMChatroomMessage } from '@yxim/nim-web-sdk/dist/types/chatroom/NIMChatroomMessageInterface'

type Props = {
  children: React.ReactNode
  meetingCode?: string
}

export type Message = NIMChatroomMessage & { isMe: boolean }

type ChatroomContextType = {
  messages: Message[]
  onlineMemberNum: number
  likeCount: number
  disabled: boolean
  kicked: boolean
  onSendTextMsg?: (msg: string) => Promise<Message>
  onLike?: () => void
}

export const ChatroomContext = React.createContext<ChatroomContextType>({
  messages: [],
  onlineMemberNum: 0,
  likeCount: 0,
  disabled: true,
  kicked: false,
})

export const ChatroomContextProvider: React.FC<Props> = (props) => {
  const { meetingCode, children } = props
  const { liveInfo, userInfo, liveConfig, updateLiveInfo, isGuest } =
    useAppContext()
  const chatroomRef = React.useRef<Chatroom>()
  const liveInfoRef = React.useRef<LiveInfo>()

  liveInfoRef.current = liveInfo

  const [onlineMemberNum, setOnlineMemberNum] = React.useState<number>(0)
  const [likeCount, setLikeCount] = React.useState<number>(0)
  const [kicked, setKicked] = React.useState<boolean>(false)
  const [messages, setMessages] = React.useState<Message[]>([])

  const disabled = useMemo(() => {
    if (kicked) {
      return true
    }

    if (isGuest) {
      return true
    }

    if (liveInfo) {
      if (liveInfo.chatroomMute) {
        return true
      }

      if (!liveInfo.liveChatRoomEnable) {
        return true
      }

      return false
    }

    return true
  }, [liveInfo, isGuest, kicked])

  function onSendTextMsg(text: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      chatroomRef.current?.sendText({
        resend: false,
        text: text,
        done(err, data) {
          if (err) {
            reject(err)
          } else {
            const msg = {
              ...data,
              isMe: true,
            }

            resolve(msg)
            setMessages((prev) => [...prev, msg])
          }
        },
      })
    })
  }

  function onLike() {
    if (userInfo && meetingCode) {
      postLike(meetingCode).then((res) => {
        setLikeCount(res.count)
      })
    }
  }

  useEffect(() => {
    if (isGuest) {
      return
    }

    if (userInfo && meetingCode) {
      getLikeCount(meetingCode).then((res) => {
        setLikeCount(res.count)
      })
    }
  }, [userInfo, meetingCode, isGuest])

  useEffect(() => {
    if (isGuest) {
      return
    }

    if (liveInfo && userInfo && meetingCode && liveConfig) {
      getChatroomAddr({
        meetingNum: meetingCode,
        chatRoomId: liveInfo.chatRoomId,
      }).then((addresses) => {
        // 聊天室相关监听
        chatroomRef.current = Chatroom.getInstance({
          appKey: userInfo.imKey,
          chatroomId: liveInfo.chatRoomId,
          account: userInfo.userUuid,
          token: userInfo.imToken,
          chatroomAddresses: addresses,
          chatroomNick:
            userInfo.nickname ??
            userInfo.username ??
            userInfo.userName ??
            userInfo.phoneNumber?.slice(0, 3) +
              '****' +
              userInfo.phoneNumber?.slice(7),
          isAnonymous: false,
          secure: true,
          onconnect: (data) => {
            // @ts-expect-error im 定义错误
            setOnlineMemberNum(data.chatroom?.onlineMemberNum ?? 0)
          },
          onmsgs(msgs) {
            console.log('chatroom onmsgs', msgs)
            msgs.forEach((item) => {
              if (
                item.attach &&
                // @ts-expect-error im 定义错误
                item.attach.type === 'memberEnter' &&
                // @ts-expect-error im 定义错误
                item.attach.from !== userInfo.userUuid
              ) {
                setOnlineMemberNum((prev) => prev + 1)
              } else if (
                item.attach &&
                // @ts-expect-error im 定义错误
                item.attach.type === 'memberExit'
              ) {
                setOnlineMemberNum((prev) => prev - 1)
              } else if (item.type === 'text') {
                // 文本消息
                const msg = {
                  ...item,
                  isMe: false,
                }

                setMessages((prev) => [...prev, msg])
              } else if (item.type === 'custom') {
                if (item.content) {
                  try {
                    const { type, data } = JSON.parse(item.content)

                    switch (type) {
                      case 1: {
                        // 会议直播结束
                        if (data.cmd === 51) {
                          // 直播结束

                          updateLiveInfo?.(data)
                        } else if (data.cmd === 98) {
                          // 点赞数量更新
                          setLikeCount(data.data.count)
                        }

                        break
                      }

                      case 11: {
                        // 更新直播信息

                        updateLiveInfo?.(data)
                        break
                      }

                      case 12: {
                        // 聊天室禁言状态更新

                        updateLiveInfo?.(data)
                        break
                      }

                      case 13: {
                        // 水印状态更新
                        const liveInfo = liveInfoRef.current

                        if (liveInfo && liveInfo.watermarkConfig) {
                          if (data.watermark) {
                            liveInfo.watermarkConfig.videoStrategy = 1
                          } else if (data.watermark === false) {
                            liveInfo.watermarkConfig.videoStrategy = 0
                          }

                          updateLiveInfo?.(liveInfo)
                        }

                        break
                      }

                      default: {
                        break
                      }
                    }
                  } catch {
                    //
                  }
                }
              }
            })
          },
          ondisconnect: (data) => {
            console.log('ondisconnect', data)
            if (data.code === 'kicked') {
              setKicked(true)
            }
          },
        })

        chatroomRef.current.connect()
      })
    }
  }, [userInfo, liveInfo, liveConfig, meetingCode, isGuest])

  return (
    <ChatroomContext.Provider
      value={{
        messages: messages,
        onlineMemberNum,
        likeCount,
        disabled,
        kicked,
        onLike,
        onSendTextMsg,
      }}
    >
      {children}
    </ChatroomContext.Provider>
  )
}

export const useChatroomContext = (): ChatroomContextType =>
  React.useContext<ChatroomContextType>(ChatroomContext)
