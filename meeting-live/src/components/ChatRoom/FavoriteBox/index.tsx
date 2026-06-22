import React from 'react'
import { useChatroomContext } from '@/hooks/useChatroom'

import { animateParticles } from './favoriteAnimation'

import './index.less'

const FavoriteBox: React.FC = () => {
  const { likeCount, onLike } = useChatroomContext()
  const favoriteRef = React.useRef<HTMLDivElement>(null)

  function onClick() {
    // 这次点击是否特殊
    const isEspecial = Math.floor(Math.random() * 10) === 3

    favoriteRef.current &&
      animateParticles({
        total: isEspecial ? 30 : 20,
        parent: favoriteRef.current,
        isEspecial,
      })

    onLike?.()
  }

  return (
    <div className="favorite-box">
      <div className="favorite-content" ref={favoriteRef}>
        <div className="favorite-btn" onClick={onClick}>
          <svg
            className="favorite-btn-svg"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
          >
            <path d="M64 483.04V872c0 37.216 30.144 67.36 67.36 67.36H192V416.32l-60.64-0.64A67.36 67.36 0 0 0 64 483.04zM857.28 344.992l-267.808 1.696c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-68.832-155.488-137.568-145.504-60.608 8.8-67.264 61.184-67.264 126.816v59.264c0 76.064-63.84 140.864-137.856 148L256 416.96v522.4h527.552a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824z"></path>
          </svg>
        </div>
        <div className="favorite-count">{likeCount}</div>
      </div>
    </div>
  )
}

export default FavoriteBox
