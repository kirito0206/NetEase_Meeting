import React, { useEffect } from 'react'
import Chatroom from '@/components/ChatRoom/ChatRoom'
import Live from '@/components/Live/Live'

import styles from './index.less'
import { useAppContext } from '@/hooks/useApp'

export default function HomePage() {
  const [isH5, setIsH5] = React.useState(false)
  const { liveInfo } = useAppContext()

  useEffect(() => {
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

  return liveInfo ? (
    <div className={isH5 ? styles['h5-container'] : styles['pc-container']}>
      <Live isH5={isH5} />
      <Chatroom isH5={isH5} />
    </div>
  ) : null
}
