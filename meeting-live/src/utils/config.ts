type CustomConf = {
  meetingServerDomain?: string
  appKey: string
  meetingNum: string
  chatRoomId: string
}

const env = process.env.RUN_ENV ?? 'prod'

function getConfig(customConf?: CustomConf) {
  const dev = {
    appKey: customConf?.appKey ?? '',
    meetingServerDomain:
      customConf?.meetingServerDomain ?? 'https://roomkit-dev.netease.im',
    chatroomAddr: `/scene/meeting/${customConf?.appKey}/v1/linkUrl?meetingNum=${customConf?.meetingNum}&chatRoomId=${customConf?.chatRoomId}`,
    webSiteUrl: 'https://yiyong-qa.netease.im',
    publicPath: 'appLive',
  }

  const prod = {
    appKey: customConf?.appKey ?? '',
    meetingServerDomain:
      customConf?.meetingServerDomain ?? 'https://roomkit.netease.im',
    chatroomAddr: `/scene/meeting/${customConf?.appKey}/v1/linkUrl?meetingNum=${customConf?.meetingNum}&chatRoomId=${customConf?.chatRoomId}`,
    webSiteUrl: 'https://meeting.163.com',
    publicPath: 'live',
  }

  return (
    {
      dev,
      prod,
    }[env] ?? prod
  )
}

export default getConfig
