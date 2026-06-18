import React, { useEffect, useMemo } from 'react'
import styles from './index.less'
import { useAppContext } from '@/hooks/useApp'
import defaultCoverUrl from '@/assets/default-live@2x.jpg'
// @ts-expect-error js 三方库
import MyPlay from '@/third/neplayer_v2.8.6'
// @ts-expect-error js 三方库
import MyPlayV2861 from '@/third/neplayer_v2.8.61'
import TCPlayer from '@/third/tcplayer/tcplayer.v4.8.0.min.js'
import '@/third/tcplayer/tcplayer.min.css'
import BulletScreenMessage from '@/components/BulletScreenMessage'
import { drawWatermark, stopDrawWatermark } from '@/utils/watermark'
import { useLocation } from 'umi'

const i18n = {
  living: '直播中',
  liveNotStart: '直播未开始',
  liveEnd: '直播已结束',
}

type Props = {
  isH5: boolean
}

const Live: React.FC<Props> = (props) => {
  const location = useLocation()
  const { isH5 } = props
  const { liveInfo, watermarkContent } = useAppContext()
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isTC = location.search.includes('tc')
  const isV2861 = location.search.includes('v2861')

  const nePlayerRef = React.useRef()
  const playCoverUrl = React.useMemo(() => {
    return liveInfo?.extraData.notStartCoverUrl || defaultCoverUrl
  }, [liveInfo])

  const isPlaying = React.useRef<boolean>(false)

  const chatRoomHidden = useMemo(() => {
    if (!isH5 && !liveInfo?.liveChatRoomEnable) {
      return true
    }

    return false
  }, [liveInfo?.liveChatRoomEnable, isH5])

  function checkUrl(url: string) {
    if (!url) return
    return url.replace(/(http)/g, 'https')
  }

  function play() {
    if (liveInfo && liveInfo.state === 2 && !isPlaying.current) {
      const iOS = isH5 && /iphone|ios/i.test(navigator.userAgent.toLowerCase())

      if (isTC) {
        // @ts-expect-error js 三方库
        nePlayerRef.current?.src(
          checkUrl(iOS ? liveInfo.pullHlsUrl : liveInfo.pullHttpUrl)
        )
      } else {
        if (iOS) {
          // @ts-expect-error js 三方库
          nePlayerRef.current?.setDataSource([
            {
              type: 'application/x-mpegURL',
              isLive: true,
              src: checkUrl(liveInfo.pullHlsUrl || liveInfo.pullHttpUrl),
            },
          ])
        } else {
          if (isV2861) {
            // @ts-expect-error js 三方库
            nePlayerRef.current?.setDataSource([
              {
                type: 'application/x-mpegURL',
                isLive: true,
                src: checkUrl(liveInfo.pullHlsUrl || liveInfo.pullHttpUrl),
              },
              {
                type: 'video/x-flv',
                isLive: true,
                src: checkUrl(liveInfo.pullHttpUrl),
                flvConf: {
                  liveDelayMaxDuration: 10,
                },
              },
            ])
          } else {
            // @ts-expect-error js 三方库
            nePlayerRef.current?.setDataSource([
              {
                type: 'application/x-mpegURL',
                isLive: true,
                src: checkUrl(liveInfo.pullHlsUrl || liveInfo.pullHttpUrl),
              },
              {
                type: 'video/x-flv',
                isLive: true,
                src: checkUrl(liveInfo.pullHttpUrl),
              },
            ])
          }
        }
      }

      isPlaying.current = true
    }
  }

  useEffect(() => {
    if (liveInfo && liveInfo.state === 2 && !nePlayerRef.current) {
      if (isTC) {
        nePlayerRef.current = new TCPlayer('meeting-play')
      } else {
        if (isV2861) {
          // @ts-expect-error js 三方库
          nePlayerRef.current = MyPlayV2861(
            'meeting-play',
            {
              techOrder: ['html5', 'flvjs', 'flash'],
              errMsg7: '拉流超时',
              enableStashBuffer: false,
              streamTimeoutTime: 30 * 1000,
            },
            function () {
              // @ts-expect-error js 三方库
              nePlayerRef.current?.corePlayer.autoplay(false)
            }
          )
        } else {
          // @ts-expect-error js 三方库
          nePlayerRef.current = MyPlay('meeting-play', {
            techOrder: ['html5', 'flvjs', 'flash'],
            errMsg7: '拉流超时',
            enableStashBuffer: false,
            streamTimeoutTime: 30 * 1000,
          })
        }
      }
    }

    if (liveInfo) {
      isPlaying.current = false
    }

    if (liveInfo && liveInfo.extraData.backgroundUrl) {
      const body = document.body

      body.style.background = `url("${liveInfo.extraData.backgroundUrl}") 0% 0% / cover no-repeat fixed`
    }
  }, [liveInfo])

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

  useEffect(() => {
    function resize() {
      const dom = containerRef.current

      if (dom) {
        if (!chatRoomHidden) {
          const height = (dom.clientWidth / 16) * 9

          dom.style.height = height + 78 + 'px'
          dom.style.width = isH5 ? '100vw' : 'calc(100vw - 460px)'
          dom.style.left = isH5 ? '0' : '40px'
        } else {
          // 获取浏览器高度
          const _height = window.innerHeight - 80 - 78
          const _width =
            window.innerWidth - 80 > 980 ? window.innerWidth - 80 : 980
          const _ratioHeight = (_width / 16) * 9
          const _ratioWidth = (_height / 9) * 16

          if (_ratioHeight < _height) {
            dom.style.width = _width + 'px'
            dom.style.height = _ratioHeight + 78 + 'px'
          } else {
            dom.style.height = _height + 78 + 'px'
            dom.style.width = _ratioWidth + 'px'
            dom.style.left = (window.innerWidth - _ratioWidth) / 2 + 'px'
          }
        }
      }
    }

    setTimeout(() => {
      resize()
    }, 100)

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [chatRoomHidden, isH5])

  return (
    <div
      id={'live-container'}
      className={
        isH5 ? styles['h5-live-container'] : styles['pc-live-container']
      }
      ref={containerRef}
    >
      <BulletScreenMessage />
      {liveInfo ? (
        <>
          {isH5 ? null : (
            <div className={styles.header}>
              <div className={styles.title}>{liveInfo?.title}</div>

              {liveInfo?.state === 2 && (
                <div className={styles['living-status']}>{i18n.living}</div>
              )}
            </div>
          )}
          <div
            className={styles['play-wrapper']}
            onClick={play}
            onTouchStart={play}
          >
            <video
              poster={playCoverUrl}
              className={`${styles['play-content']} video-js vjs-big-play-centered`}
              id="meeting-play"
              autoPlay
              preload="auto"
              playsInline
              controls
              onContextMenu={(e) => {
                // 拦截右键菜单
                e.stopPropagation()
                return false
              }}
            />
            {liveInfo?.state !== 2 ? (
              <div
                className={styles['play-cover']}
                style={{
                  background: `url(${playCoverUrl}) no-repeat center/cover`,
                }}
              >
                <div className={styles['play-cover-content']}>
                  {liveInfo.state === 1 && i18n.liveNotStart}
                  {liveInfo.state === 3 && i18n.liveEnd}
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Live
