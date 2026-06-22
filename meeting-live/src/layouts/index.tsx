import React from 'react'
import { AppContextProvider } from '@/hooks/useApp'
import { Outlet, useParams } from 'umi'
import { ChatroomContextProvider } from '@/hooks/useChatroom'
import './index.less'

export default function Layout() {
  const params = useParams()

  return (
    <AppContextProvider meetingCode={params.meetingCode}>
      <ChatroomContextProvider meetingCode={params.meetingCode}>
        <Outlet />
      </ChatroomContextProvider>
    </AppContextProvider>
  )
}
