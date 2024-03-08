const [meeting, host, coHost, attendee] = [
  '会议',
  '主持人',
  '联席主持人',
  '参会者',
]

export default {
  meeting,
  host,
  coHost,
  attendee,
  appName: '网易会议', // 顶部UI展示
  joinMeeting: `加入会议`, // 入会时密码弹窗输入文本
  leaveMeeting: `离开会议`, // 离开会议二次确认弹窗菜单按钮文本
  quitMeeting: `结束会议`, // “结束会议”二次确认弹窗菜单按钮文本
  finish: '结束会议', // 结束会议菜单按钮文本
  leave: '离开会议', // 离开会议菜单按钮文本
  hostExitTips: `您确定要离开这个${meeting}吗？`, // 结束会议二次确认弹窗消息
  leaveTips: `您确定要离开这个${meeting}吗？`, // 离开会议二次确认弹窗消息
  changePresenterTips: `是否移交主持人权限？`,
  networkUnavailableCloseFail: `网络异常，结束${meeting}失败`, //  结束会议失败提示
  cancel: '取消', //通用
  ok: '确定', //通用
  beauty: `美颜`, // 美颜功能名称
  beautyLevel: `美颜等级`, // 美颜等级
  joiningTips: `正在进入${meeting}...`, // 加入会议Loading提示信息
  close: `关闭`, // 通用
  open: `打开`, // 通用
  networkUnavailable: `网络连接失败，请稍后重试！`, // 通用网络连接失败提示1
  networkUnavailableCheck: `网络连接失败，请检查你的网络连接！`, // 通用网络连接失败提示2
  memberListTitle: `${attendee}`, // 会议成员列表标题
  joinMeetingFail: `加入${meeting}失败`, //  加入会议失败提示
  reJoinMeetingFail: `重新加入${meeting}失败`, // 重试加入会议失败提示
  youBecomeTheHost: `您已经成为${host}`, // 被移交主持人的提示
  youBecomeTheCoHost: `您已经成为${coHost}`, // 被移交主持人的提示
  youBesetTheCoHost: `您已被设置${coHost}`, // 被移交主持人的提示
  becomeTheCoHost: `已经成为${coHost}`, // 被移交主持人的提示
  looseTheCoHost: `已被取消设为${coHost}`, // 被取消焦点视频提示
  getVideoFocus: '您已被设置为焦点视频', // 被设置为焦点视频提示
  looseVideoFocus: '您已被取消焦点视频', // 被取消焦点视频提示
  muteAudioAll: '全体静音', // 全体静音功能
  muteAudioAllDialogTips: '所有以及新加入成员将被静音', // 全体静音弹窗标题
  muteAllAudioTip: `允许${attendee}自行解除静音`, // 操作全体静音弹窗可选项
  muteAllAudioSuccess: '您已进行全体静音', //主持人端全体静音成功提示消息
  meetingHostMuteAllAudio: `${host}设置了全体静音`, //全体静音时成员端提示消息
  muteAllAudioFail: '全体静音失败', //全体静音失败提示消息
  unMuteAudioAll: '解除全体静音', //解除全体静音功能
  unMuteAllAudioSuccess: '您已请求解除全体静音', //解除全体静音成功提示消息
  unMuteAllAudioFail: '解除全体静音失败', //解除全体静音失败提示消息
  leaveByHost: `您已被${host}移出会议`,
  leaveBySelf: `您已在其他设备登录`,

  muteVideoAll: '全体关闭视频',
  muteVideoAllDialogTips: '所有以及新加入成员将被关闭视频',
  muteAllVideoTip: `允许${attendee}自行开启视频`,
  muteAllVideoSuccess: '您已进行全体关闭视频',
  meetingHostMuteAllVideo: `${host}设置了全体关闭视频`,
  muteAllVideoFail: '全体关闭视频失败',
  unMuteVideoAll: '开启全体视频',
  unMuteAllVideoSuccess: '您已请求开启全体视频',
  unMuteAllVideoFail: '开启全体视频失败',
  muteVideoAndAudio: '关闭音视频',
  unmuteVideoAndAudio: '开启音视频',
  hostAgreeVideoHandsUp: `${host}已将您开启视频`,

  muteAudio: '静音', //主持人操作成员静音功能菜单
  unMuteAudio: '解除静音', //主持人操作成员解除静音功能菜单
  muteVideo: '停止视频', //主持人操作成员停止视频功能菜单
  unMuteVideo: '开启视频', // 主持人操作成员开启视频功能菜单
  unScreenShare: '结束共享', // 主持人操作成员结束共享功能菜单
  pauseScreenShare: '共享已暂停，请将窗口至于最上方',
  shareComputerAudio: '同时共享电脑声音',
  hostStopShare: `${host}已终止了您的共享`, //主持人终止共享提示
  focusVideo: '设为焦点视频', //主持人操作成员设置焦点视频菜单项
  unFocusVideo: '取消焦点视频', //主持人操作成员取消焦点视频菜单项
  handOverHost: `移交${host}`, //主持人操作成员移交主持人菜单项
  handSetCoHost: `设为${coHost}`, // 主持人操作设置联席主持人
  handUnSetCoHost: `取消设为${coHost}`, // 主持人操作取消联席主持人
  handOverHostTips: `确认将${host}移交给`, //移交主持人确认弹窗消息
  removeMember: '移除', //主持人操作成员移除成员菜单项
  removeMemberTips: '确认移除', //移除成员确认弹窗消息
  yes: '是', //弹窗通用确认按钮文本静音
  no: '否', //弹窗通用否定按钮文本
  cannotRemoveSelf: '不能移除自己', // 不能移除自己提示消息
  muteAudioFail: '静音失败', //静音失败提示
  unMuteAudioFail: '解除静音失败', //解除静音失败提示
  muteVideoFail: '停止视频失败', //停止视频失败提示
  unMuteVideoFail: '开启视频失败', //开启视频失败提示
  focusVideoFail: '设为焦点视频失败', //设为焦点视频失败提示
  unFocusVideoFail: '取消焦点视频失败', //取消焦点视频失败提示
  putMemberHandsDownFail: '放下成员举手失败', //放下成员举手失败提示
  handOverHostFail: `移交${host}失败`, //移交主持人失败提示
  removeMemberSuccess: '移除成功', //移除成员成功提示
  removeMemberFail: '移除失败', //移除成员失败提示
  save: '保存', //通用功能按钮
  done: '完成', //通用功能按钮
  notify: '通知', //弹窗通用标题
  hostKickedYou: `因被${host}移出或切换至其他设备，您已退出${meeting}`, //从会议中被移除提示
  sure: '确定', //通用
  // forbiddenByHostVideo: `${host}已将您停止视频`, //本地重新打开摄像头失败，原因为被主持人禁用
  openCamera: '打开摄像头', //主持人申请打开成员视频弹窗标题
  hostOpenCameraTips: `${host}已重新打开您的摄像头，确认打开？`, //主持人申请打开成员视频弹窗消息
  openMicro: '打开麦克风', //主持人申请打开成员音频弹窗标题
  hostOpenMicroTips: `${host}已重新打开您的麦克风，确认打开？`, //主持人申请打开成员音频弹窗消息
  meetingHostMuteVideo: '您已被停止视频', //主持人关闭成员视频提示消息
  meetingHostMuteAudio: '您已被静音', //主持人关闭成员音频提示消息
  screenShare: '共享屏幕', //共享屏幕功能菜单文本
  screenShareTips: '将开始截取您的屏幕上显示的所有内容。', //屏幕共享弹窗消息
  shareOverLimit: '已有人在共享，您无法共享', //超出共享人数限制提示消息
  screenShareStartFail: '发起共享屏幕失败', // 屏幕共享失败提示
  hasWhiteBoardShare: '共享白板时暂不支持屏幕共享',
  hasScreenShareShare: '屏幕共享时暂不支持白板共享',
  screenShareStopFail: '关闭共享屏幕失败', //屏幕共享失败提示
  whiteBoard: '共享白板', //共享白板功能菜单
  closeWhiteBoard: '退出白板', //退出白板功能菜单
  whiteBoardShareStopFail: '停止共享白板失败',
  whiteBoardShareStartFail: '发起白板共享失败',
  functionalityLimitedByTheNumberOfPeople: '该功能允许的同时使用人数达到上限',
  noScreenSharePermission: '没有屏幕共享权限',
  screenShareLocalTips: '正在共享屏幕', //共享端“正在共享屏幕”提示
  screenShareSuffix: '的共享屏幕', //共享端画面名称后缀
  screenShareInteractionTip: '双指分开放大画面', // 操作共享屏幕的画面提示
  whiteBoardInteractionTip: '您已获得白板互动权限限',
  undoWhiteBoardInteractionTip: '您已被收回白板互动权限',
  speakingPrefix: '正在讲话: ', //成员正在讲话前缀，后面会拼接用户昵称
  screenShareModeForbiddenOp: '共享屏幕时不能开启/停止视频', //共享屏幕时操作打开/关闭摄像头失败提示
  me: '我',
  audioStateError: '当前音频被其他应用占用，请关闭后重试', //打开音频设备失败提示
  lockMeeting: `锁定${meeting}`, //锁定会议功能
  lockMeetingByHost: `${meeting}已锁定，新${attendee}将无法加入${meeting}`, //锁定会议成功主持人端提示消息
  lockMeetingByHostFail: `${meeting}锁定失败`, //锁定失败提示
  unLockMeetingByHost: `${meeting}已解锁，新${attendee}将可以加入${meeting}`, //解锁会议成功主持人端提示
  unLockMeetingByHostFail: `${meeting}解锁失败`, //解锁会议失败提示
  coHostLimit: `${coHost}已达到上限`,
  // 聊天室相关
  // send: '发送', //通用
  // inputMessageHint: '输入消息...', //聊天室输入框hint
  // newMessage: '新消息', //新消息提示
  // chatRoomMessageSendFail: '聊天室消息发送失败', // 聊天室消息发送失败提示
  // cannotSendBlankLetter: '不支持发送空格', //聊天室消息发送失败提示
  chat: '聊天', //聊天功能菜单文本
  // more: '更多', //更多功能菜单文本
  // searchMember: '搜索成员', //成员搜索输入框提示文本
  // enterChatRoomFail: '聊天室进入失败!', //聊天室初始化失败提示
  meetingPassword: `${meeting}密码`, //会议密码弹窗标题
  inputMeetingPassword: `请输入${meeting}密码`, // 会议密码弹窗输入框提示
  wrongPassword: '密码错误', // 会议密码验证失败提示
  headsetState: '您正在使用耳机',
  meetingId: `${meeting}ID`, // 会议ID
  meetingNumber: `${meeting}号`, // 会议号
  shortMeetingId: `${meeting}短号`, // 会议短号
  copy: '复制邀请', //复制菜单文本
  copyLink: '复制',
  meetingUrl: '入会链接',
  copySuccess: '复制成功', //复制成功提示消息
  defaultMeetingInfoTitle: `邀请您参加会议`, //会议信息标题
  meetingInfoDesc: `${meeting}正在加密保护中`, //会议描述文本
  muteAllAudioHandsUpTips: `${host}已将全体静音，您可以举手申请发言`, //全体静音时打开音频弹窗提示消息
  muteAllVideoHandsUpTips: `${host}已将全体关闭视频，您可以举手申请开启视频`, //全体关闭视频时打开音频弹窗提示消息
  handsUpApply: '举手申请', //举手弹窗确认按钮文本
  cancelHandsUp: '取消举手',
  handsUpDown: '手放下', //主持人操作成员“手放下”菜单
  inHandsUp: '举手中', //举手中状态描述
  handsUpFail: '举手失败',
  handsUpSuccessAlready: `您已举手，等待${host}处理`,
  handsUpSuccess: `举手成功，等待${host}处理`,
  cancelHandsUpFail: '取消举手失败',
  hostRejectAudioHandsUp: `${host}已将您的手放下`,
  hostAgreeAudioHandsUp: `${host}已将您解除静音，您可以自由发言`,
  audioAlreadyOpen: '音频已打开，无需申请举手',
  whiteBoardInteract: '授权白板互动', //主持人操作成员授权白板功能菜单
  whiteBoardInteractFail: '授权白板互动失败', //主持人操作成员授权白板成功提示
  undoWhiteBoardInteract: '取消白板互动', //主持人操作成员撤回白板功能菜单
  undoWhiteBoardInteractFail: '取消白板互动失败', //主持人操作成员撤回白板失败提示
  sip: 'SIP电话/终端入会',
  sipTip: 'sip',
  // 直播相关
  live: '直播', //直播功能
  liveUrl: '直播观看地址', //直播功能
  liveLink: '直播链接',
  enableLivePassword: '开启直播密码',
  enableChat: '开启观众互动',
  enableChatTip: '开启后，会议室和直播间消息相互可见',
  liveView: '直播画面（用户开启视频后可出现在列表中）',
  livePreview: '直播画面预览',
  liveViewPageBackgroundImage: '观看页背景图',
  liveCoverPicture: '直播封面图',
  liveCoverPictureTip: '建议 16:9 的图，不超过 5 M',
  liveSelectTip: '请从左侧选择直播画面',
  livePasswordTip: '请输入6位数字密码',
  liveStatusChange: '直播状态发生变化',
  refreshLiveLayout: '刷新直播布局',
  liveUpdateSetting: '更新直播设置',
  pleaseClick: '请点击',
  onlyEmployeesAllow: '仅本企业员工可观看',
  onlyEmployeesAllowTip: '开启后，非本企业员工无法观看直播',
  living: '直播中',
  memberNotInMeeting: `成员不在${meeting}中`,
  cannotSubscribeSelfAudio: '不能订阅自己的音频',
  partMemberNotInMeeting: `部分成员不在${meeting}中`,
  //补充
  commonTitle: '提示', // 通用二次提示title
  inviteBtn: '会议邀请', // 邀请按钮
  sipBtn: 'sip', // sip按钮
  inviteSubject: '会议主题', // 邀请弹窗-会议主题
  inviteTime: '会议时间', // 预约会议时间
  openCameraFailByHost: '已被主持人关闭画面，无法自行打开', // 主持人关闭摄像头成员打开视频提示
  noRename: '改名', // 改名按钮
  addSipMember: '添加参会者', // 改名按钮
  pleaseInputRename: '请输入想要修改的名字', // 改名input占位提示
  placeholderSipMember: 'SIP号码', // 改名input占位提示
  placeholderSipAddr: 'SIP地址', // 改名input占位提示
  reNameSuccessToast: '昵称修改成功', // 修改昵称成功提示
  reNameFailureToast: '昵称修改失败', // 修改昵称成功提示
  closeCommonTips: '确定关闭', // 白板、屏幕共享二次提示前置文案
  closeWhiteShareTips: '白板共享吗？', // 白板共享二次提示
  closeScreenShareTips: '屏幕共享吗？', // 屏幕共享二次提示
  galleryBtn: '视图布局', // 视图布局按钮
  layout: '布局', // 视图布局按钮
  galleryLayout: '画廊模式',
  speakerLayout: '演讲者模式',
  galleryLayoutGrid: '宫格',
  speakerLayoutTop: '顶部列表',
  speakerLayoutRight: '右侧列表',
  memberListBtnForHost: '管理参会者', // 底部成员列表按钮-主持人
  memberListBtnForNormal: '参会者', // 底部成员列表按钮-参会者
  moreBtn: '更多', // 更多按钮-底部控制栏
  hostEndMeetingToast: '主持人已结束会议', // 主持人结束会议后全局提示
  UNKNOWN: '未知异常', // 未知异常
  LOGIN_STATE_ERROR: '账号异常', // 账号异常
  CLOSE_BY_BACKEND: '后台关闭房间', // 后台关闭
  ALL_MEMBERS_OUT: '所有成员退出房间', // 所有成员退出
  END_OF_LIFE: '房间时间到期', // 房间到期
  CLOSE_BY_MEMBER: '房间被关闭', // 房间被关闭
  meetingLive: `${meeting}直播`,
  meetingLiveTitle: '直播主题',
  meetingLiveUrl: '直播地址',
  pleaseInputLivePassword: '请输入直播密码',
  pleaseInputLivePasswordHint: '请输入6位数字密码',
  liveInteraction: '直播互动',
  liveInteractionTips: `开启后，${meeting}和直播间消息互相可见`,
  liveViewSetting: '直播视图设置',
  liveViewSettingChange: '主播发生变更',
  liveViewPreviewTips: '当前直播视图预览',
  liveViewPreviewDesc: '请先进行直播视图设置',
  liveStart: '开始直播',
  liveUpdate: '更新直播设置',
  liveStop: '停止直播',
  liveGalleryView: '画廊视图',
  liveFocusView: '焦点视图',
  shareView: '屏幕共享视图',
  liveChooseView: '选择视图样式',
  liveChooseCountTips: `选择${attendee}作为主播，最多选择4人`,
  liveStartFail: '直播开始失败,请稍后重试',
  liveStartSuccess: '直播开始成功',
  livePickerCount: '已选择',
  livePickerCountPrefix: '人',
  liveUpdateFail: '直播更新失败,请稍后重试',
  liveUpdateSuccess: '直播更新成功',
  liveNeedMemberHint: '请重新选择成员',
  liveStopFail: '直播停止失败,请稍后重试',
  liveStopSuccess: '直播停止成功',
  livePassword: '直播密码',
  liveSubjectTip: '直播主题不能为空',
  liveTitlePlaceholder: '请输入直播主题',
  KICK_OUT: `您已被${host}移出会议`, // 被管理员踢出
  SYNC_DATA_ERROR: '数据同步错误', // 数据同步错误
  LEAVE_BY_SELF: '您已离开房间', // 成员主动离开房间
  kICK_BY_SELF: '您已在其他设备登录',
  OTHER: 'OTHER', // 其他
  hostCloseWhiteShareToast: '主持人已终止了您的共享', // 主持人关闭屏幕共享，参会者提示
  enterMeetingToast: '加入会议', // xxx加入会议提示
  more: '更多', // 成员列表-更多操作按钮
  cancelHandUpTips: '确认取消举手申请吗？', // 取消举手申请二次提示
  cancelHandUpSuccess: ' 取消举手成功', // 取消举手成功提示
  meetingRecording: '会议录制中', // 开启录制时提示
  securityInfo: '会议正在加密保护中',
  speaking: '正在说话',
  notJoinedMeeting: '成员尚未加入',
  disconnected: '网络已断开，正在尝试重新连接…',
  unmute: '暂时取消静音',
  searchName: '输入姓名进行搜索',
  lowerHand: '手放下',
  speaker: '扬声器',
  testSpeaker: '检测扬声器',
  outputLevel: '输出级别',
  outputVolume: '输出音量',
  microphone: '麦克风',
  testMicrophone: '检测麦克风',
  selectSpeaker: '请选择扬声器',
  selectMicrophone: '请选择麦克风',
  selectVideoSource: '请选择视频来源',
  camera: '摄像头',
  general: '常规',
  settings: '设置',
  internalOnly: '内部专用',
  meetingExist: '房间已存在',
  joinTheExistMeeting: '该房间已存在，请确认是否直接加入？',
  notSupportScreenShareChange: '共享屏幕时暂不支持切换视图',
  notSupportWhiteboardShareChange: '共享白板时暂不支持切换视图',
  notSupportOperateLayout: '正在进行屏幕分享，无法操作布局',
  screenShareLimit: '共享屏幕数量已达上限',
  cancelScreenShare: '取消开启屏幕共享',
  screenShareFailed: '共享屏幕失败',
  paramsError: '参数缺失',
  leaveFailed: '离开会议失败',
  endFailed: '结束会议失败',
  setSIPFailed: '无法设置SIP设备为主持人',
  requestFailed: '请求失败',
  screenShareNotAllow: '已经有人在共享，您无法共享',
  closeMemberWhiteboard: '关闭成员白板共享：',
  closeMemberScreenShare: '关闭成员屏幕共享：',
  changeFailed: '移交失败',
  removeFailed: '移除失败',
  closeWhiteFailed: '关闭白板失败',
  currentMicDevice: '当前麦克风设备',
  currentSpeakerDevice: '当前扬声器设备',
  currentCameraDevice: '当前视频设备',
  operateFailed: '操作失败',
  setVideoFailed: '设置视频失败',
  video: '视频',
  shortId: `会议短号`, // 会议短号
  networkStateGood: '网络连接良好',
  networkStateGeneral: '网络连接一般',
  networkStatePoor: '网络连接较差',
  latency: '延迟',
  packetLossRate: '丢包率',
  answeringPhone: '正在接听系统电话',
  chatRoomTitle: '消息',
  disconnectAudio: '断开电脑音频',
  connectAudio: '连接电脑音频',
  disconnectAudioFailed: '断开电脑音频失败',
  connectAudioFailed: '连接电脑音频失败',
  connectAudioShort: '连接音频',
  audioSetting: '音频选项',
  videoSetting: '视频选项',
  beautySetting: '美颜和虚拟背景选项',
  imageMsg: '[图片]',
  fileMsg: '[文件]',
  internal: '内部专用',
  openVideoDisable: '您已被停止视频',
  endMeetingTip: '距离会议关闭仅剩',
  min: '分钟',
  networkAbnormalityAndCheck: '网络异常，请检查您的网络',
  networkAbnormality: '网络异常',
  networkDisconnected: '网络已断开，请检查您的网络情况，或尝试重新入会',
  rejoin: '重新入会',
  audioMuteOpenTips:
    '无法使用麦克风，检测到您正在讲话，如需发言，请点击“解除静音”按钮后再次发言',
  networkError: '网络错误',
  startCloudRecord: '云录制',
  stopCloudRecord: '停止录制',
  recording: '录制中',
  isStartCloudRecord: '是否开始云录制？',
  startRecordTip:
    '开启后，将录制会议过程中的音视频与共享屏幕内容到云端，同时告知所有参会成员',
  startRecordTipNoNotify:
    '开启后，将录制会议过程中的音视频与共享屏幕内容到云端',
  beingMeetingRecorded: '该会议正在录制中',
  startRecordTipByMember:
    '主持人开启了会议云录制，会议的创建者可以观看云录制文件，你可以在会议结束后联系会议创建者获取查看链接。',
  agreeInRecordMeeting: '如果留在会议中，表示你同意录制',
  gotIt: '知道了',
  startingRecording: '正在开启录制...',
  endCloudRecording: '是否结束云录制',
  syncRecordFileAfterMeetingEnd:
    '录制文件将在会议结束后同步至“历史会议-会议详情”中。',
  cloudRecordingHasEnded: '云录制已结束',
  viewingLinkAfterMeetingEnd: '你可以在会议结束后联系会议创建者获取查看链接',
  meetingDetails: '会议详情',
  startTime: '开始时间',
  creator: '创建者',
  cloudRecordingLink: '云录制链接',
  generatingCloudRecordingFile: '云录制文件生成中',
  stopRecordFailed: '停止录制失败',
  startRecordFailed: '开启录制失败',
  messageRecalled: '消息已被撤回',
  microphonePermission: '开启麦克风权限',
  microphonePermissionTips:
    '由于 macOS 系统安全控制，开启麦克风之前需要先开启系统麦克风权限',
  microphonePermissionTipsStep: '打开 系统偏好设置 > 安全性与隐私 授予访问权限',
  cameraPermission: '开启摄像头权限',
  cameraPermissionTips:
    '由于 macOS 系统安全控制，开启摄像头之前需要先开启系统摄像头权限',
  cameraPermissionTipsStep: '打开 系统偏好设置 > 安全性与隐私 授予访问权限',
  openSystemPreferences: '打开系统偏好设置',
  meetingTime1Tips: '距离会议关闭仅剩1分钟！',
  meetingTime5Tips: '距离会议关闭仅剩5分钟！',
  meetingTime10Tips: '距离会议关闭仅剩10分钟！',
  alreadyInMeeting: '已经在会议中',
  debug: '调试',
  admit: '准入',
  attendees: '成员管理',
  notJoined: '未入会',
  inMeeting: '会议中',
  confirmLeave: '确定要离开会议吗?',
  waitingForHost: '请等待，主持人即将拉您进入会议',
  closeAutomatically: '点击确定，该页面自动关闭',
  removedFromMeeting: '被移除会议',
  removeFromMeetingByHost: '主持人已将您从会议中移除',
  meetingWatermark: '会议水印',
  waitingRoom: '等候室',
  meetingManagement: '会议管理',
  security: '安全',
  securitySettings: '安全设置',
  waitingMemberCount1: '当前等候室已有',
  waitingMemberCount2: '人等候',
  notRemindMeAgain: '不再提醒',
  viewMessage: '查看消息',
  closeWaitingRoomTip: '等候室关闭后，新成员将直接进入会议室',
  closeWaitingRoom: '关闭等候室',
  enabledWaitingRoom: '等候室已开启',
  disabledWaitingRoom: '等候室已关闭',
  enabledWatermark: '水印已开启',
  disabledWatermark: '水印已关闭',
  sendTo: '发送至',
  closeRightRow: '立即关闭',
  closeWaitingRoomCheck: '允许现有等候室成员全部进入会议',
  waiting: '已等待',
  days: '天',
  hours: '小时',
  minutes: '分钟',
  meetingWillBeginSoon: '请等待，会议尚未开始',
  meetingEnded: '会议已结束',
  chatMessage: '聊天信息',
  joining: '正在进入会议...',
  notAllowJoin: '不允许用户再次加入该会议',
  removeWaitingRoomMember: '移除等候成员',
  moveToWaitingRoom: '移至等候室',

  networkReconnectSuccess: '网络重连成功',
  networkErrorAndCheck: '网络异常,请检查网络设置',
  noMediaPermission: '没有摄像头/麦克风权限',
  getMediaPermission: '请在浏览器设置中打开摄像头/麦克风权限，并刷新页面',
  'errorCodes.10001': '10001 浏览器不支持，请使用HTTPS环境或者localhost环境',
  'errorCodes.10119': '10119 服务器认证失败',
  'errorCodes.10229': '10229 关闭麦克风失败',
  'errorCodes.10231': '10231 关闭摄像头失败',
  'errorCodes.10212': '10212 没有有摄像头/麦克风权限',
  meetingNickname: '会议昵称',
  imageSizeLimit5: '图片大小不能超过5MB',
  openCameraInMeeting: '入会时打开摄像头',
  openMicInMeeting: '入会时打开麦克风',
  showMeetingTime: '显示会议持续时间',
  showCurrentSpeaker: '显示当前说话者',
  alwaysDisplayToolbar: '始终显示工具栏',
  setWhiteboardTransparency: '设置白板透明',
  alwaysDisplayToolbarTip: '开启后，在会议中始终保持下方工具栏常驻',
  setWhiteboardTransparencyTip: '当设置白板透明时，将直接批注视频画面',
  mirrorVideo: '视频镜像',
  HDMode: '高清模式',
  HDModeTip: '网络与其他情况允许时，拉取高清视频画面',
  stopTest: '停止检测',
  inputVolume: '输入音量',
  autoAdjustMicVolume: '自动调节麦克风音量',
  pressSpaceBarToMute: '静音时长按空格键暂时开启麦克风',
  InputLevel: '输入级别',
  audio: '音频',
  downloadPath: '聊天室文件保存路径',
  chosePath: '选择路径',
  language: '选择语言',
  file: '文件',

  // 会前
  appTitle: '网易会议',
  immediateMeeting: '即刻会议',
  scheduleMeeting: '预约会议',
  scheduleMeetingSuccess: '预约会议成功',
  scheduleMeetingFail: '预约会议失败',
  editScheduleMeetingSuccess: '编辑预约会议成功',
  editScheduleMeetingFail: '编辑预约会议失败',
  cancelScheduleMeetingSuccess: '取消预约会议成功',
  tokenExpired: '登录状态已过期，请重新登录',
  cancelScheduleMeetingFail: '取消预约会议失败',
  updateUserNicknameSuccess: '修改昵称成功',
  updateUserNicknameFail: '修改昵称失败',
  emptyScheduleMeeting: '当前暂无即将召开的会议',
  Monday: '周一',
  Tuesday: '周二',
  Wednesday: '周三',
  Thursday: '周四',
  Friday: '周五',
  Saturday: '周六',
  Sunday: '周日',
  month: '月',
  historyMeeting: '历史会议',
  currentVersion: '当前版本',
  personalMeetingNum: '个人会议号',
  personalShortMeetingNum: '个人会议短号',
  feedback: '意见反馈',
  about: '关于我们',
  logout: '退出登录',
  logoutConfirm: '你确定要退出登录吗？',
  today: '今天',
  tomorrow: '明天',
  join: '加入',
  notStarted: '待开始',
  inProgress: '进行中',
  ended: '已结束',
  restoreMeetingTips: '检测到您上次异常退出，是否要恢复会议',
  restore: '恢复',
  uploadLoadingText: '您的反馈正在上传中，请稍后...',
  privacyAgreement: '隐私协议',
  userAgreement: '用户协议',
  copyRight: 'Copyright ©1997-{{year}} NetEase Inc.\nAll Rights Reserved.',
  chatHistory: '聊天记录',
  allMeeting: '全部会议',
  app: '应用',
  collectMeeting: '收藏会议',
  operations: '操作',
  collect: '收藏',
  cancelCollect: '取消收藏',
  collectSuccess: '收藏成功',
  collectFail: '收藏失败',
  cancelCollectSuccess: '取消收藏成功',
  cancelCollectFail: '取消收藏失败',
  noHistory: '暂无历史会议',
  noCollect: '暂无收藏会议',
  scrollEnd: '已经滚动到最底部了',
  openMeetingPassword: '开启会议密码',
  usePersonalMeetingID: '使用个人会议号：',
  meetingIDInputPlaceholder: '请输入会议ID',
  clearAll: '清除全部',
  clearAllSuccess: '历史记录已清空',
  waitingRoomTip: '开启后新成员加入会议时会先加入等候室',
  subjectTitlePlaceholder: '请输入会议主题',
  meetingInviteUrl: '会议邀请链接',
  endTime: '结束时间',
  meetingSetting: '会议设置',
  autoMute: '参会者加入会议时自动静音',
  openMeetingLive: '开启会议直播',
  cancelScheduleMeetingTips: '取消会议后，其他参会者将无法加入会议。',
  noCancelScheduleMeeting: '暂不取消',
  cancelScheduleMeeting: '取消会议',
  editScheduleMeeting: '编辑会议',
  autoMuteAllowOpen: '自动静音且允许自主开麦',
  autoMuteNotAllowOpen: '自动静音且不允许自主开麦',
  reName: '修改昵称',
  reNamePlaceholder: '请输入新的昵称',
  reNameTips: '不超过10个汉字或20个字母/数字/符号',
  // 美颜设置
  beautySettingTitle: '美颜与虚拟背景',
  beautyEffect: '美颜效果',
  virtualBackground: '虚拟背景',
  addLocalImage: '添加本地图片',
  emptyVirtualBackground: '无',
  virtualBackgroundError1: '自定义背景图片不存在',
  virtualBackgroundError2: '自定义背景图片的图片格式无效',
  virtualBackgroundError3: '自定义背景图片的颜色格式无效',
  virtualBackgroundError4: '该设备不支持使用虚拟背景',
  virtualBackgroundError5: '虚拟背景开启失败',
  // 共享
  selectSharedContent: '选择共享内容',
  startShare: '开始共享',
  desktop: '桌面',
  applicationWindow: '应用窗口',
  shareLocalComputerSound: '同时共享本地电脑声音',
  getScreenCaptureSourceListError: '获取共享列表失败，请给予权限后重试',
  // 意见反馈
  audioProblem: '音频问题',
  aLargeDelay: '对方说话声音延迟很大',
  mechanicalSound: '播放机械音',
  stuck: '对方说话声音很卡',
  noise: '杂音',
  echo: '有回声',
  notHear: '听不到对方声音',
  notHearMe: '对方听不到我的声音',
  lowVolume: '音量小',
  videoProblem: '视频问题',
  longTimeStuck: '对方视频卡顿时间较长',
  videoIsIntermittent: '视频断断续续',
  tearing: '画面撕裂',
  tooBrightTooDark: '画面太亮/太暗',
  blurredImage: '画面模糊',
  obviousNoise: '画面明显噪点',
  notSynchronized: '音画不同步',
  other: '其他',
  unexpectedExit: '意外退出',
  otherProblems: '其他问题',
  otherProblemsTips:
    '请描述您的问题，（当您选中"存在其他问题"时），需填写具体描述才可进行提交',
  thankYourFeedback: '感谢您的反馈',
  uploadFailed: '上传失败',
  submit: '提交',
  // NPS
  npsTitle: '您有多大的可能向同事或合作伙伴推荐网易会议？',
  nps0: '0-肯定不会',
  nps10: '10-非常乐意',
  npsTips1: '0-6：让您不满意或者失望的点有哪些？（选填）',
  npsTips2: '7-8：您觉得哪些方面能做的更好？（选填）',
  npsTips3: '9-10：欢迎分享您体验最好的功能或感受（选填）',
  supportedMeetings: '您可召开：',
  meetingLimit: '{{maxCount}}人、限时{{maxMinutes}}分钟会议',
  meetingNoLimit: '{maxCount}人、单场不限时会议',
  accountAndSecurity: '账户与安全',
  newPwdNotMath: '新密码格式不符，请重新输入',
  newPwdNotMathReEnter: '新密码不一致，请重新输入',
  // 设置音频
  advancedSettings: '高级设置',
  audioNoiseReduction: '音频降噪',
  musicModeAndProfessionalMode: '音乐模式与专业模式',
  musicModeAndProfessionalModeTips:
    '音频降噪开启时，无法使用音乐模式与专业模式',
  echoCancellation: '回声消除',
  activateStereo: '启动立体声',
  defaultDevice: '默认设备',
  authPrivacyCheckedTips: '请先勾选同意《隐私协议》和《用户服务协议》',
  authNoCorpCode: '没有企业代码？',
  authCreateNow: '立即创建',
  authLoginToTrialEdition: '前往体验版',
  authNextStep: '下一步',
  authHasCorpCode: '已有企业代码？',
  authLoginToCorpEdition: '前往正式版',
  authLoginBySSO: 'SSO登录',
  authPrivacy: '隐私政策',
  authUserProtocol: '用户协议',
  authEnterCorpCode: '请输入企业代码',
  authSSOTip: '暂无所属企业',
  authAnd: '和',
  authRegisterAndLogin: '注册/登录',
  authHasReadAndAgreeMeeting: '已阅读并同意网易会议',
  authLoggingIn: '正在登录会议',
  authLoginByMobile: '手机验证码登录',
  authLogin: '登录',
  authEnterMobile: '请输入手机号',
  authEnterAccount: '请输入账号',
  authEnterPassword: '请输入密码',
  authLoginByCorpCode: '企业代码登录',
  authLoginByCorpMail: '企业邮箱登录',
  authEnterCorpMail: '请输入企业邮箱',
  authResetInitialPasswordDialogTitle: '设置新密码',
  authResetInitialPasswordDialogMessage:
    '当前密码为初始密码，为了安全考虑，建议您前往设置新密码',
  authResetInitialPasswordDialogCancelLabel: '暂不设置',
  authResetInitialPasswordDialogOKLabel: '前往设置',
  authResetInitialPasswordTitle: '设置你的新密码',
  authModifyPasswordSuccess: '密码修改成功',
  authUnavailable: '暂无',
  authMobileNum: '手机号',
  authEnterCheckCode: '请输入验证码',
  authGetCheckCode: '获取验证码',
  authResendCode: '后重新发送验证码',
  authSuggestChrome: '推荐使用Chrome浏览器',
  settingEnterNewPasswordTips: '请输入新密码',
  settingEnterPasswordConfirm: '请再次输入新密码',
  settingValidatorPwdTip: '长度6-18个字符，需要包含大小写字母与数字',
  settingPasswordDifferent: '两次输入的新密码不一致，请重新输入',
  settingPasswordSameToOld: '新密码与现有密码重复，请重新输入',
  settingPasswordFormatError: '密码格式错误，请重新输入',
  settingAccountInfo: '账号信息',
  settingConnectAdmin: '如需修改，请联系管理员后台修改',
  settingUserName: '名称：',
  settingEmail: '邮箱：',
  settingAccountSecurity: '账号安全',
  settingChangePassword: '修改密码',
  settingChangePasswordTip: '修改后您需要重新登录',
  settingEnterOldPassword: '请输入旧密码',
  settingEnterNewPassword: '请输入新密码',
  settingEnterNewPasswordConfirm: '请再次输入新密码',

  settingFindNewVersion: '发现新版本',
  settingUpdateFailed: '更新失败',
  settingTryAgainLater: '下次再试',
  settingRetryNow: '立即重试',
  settingUpdating: '更新中',
  settingCancelUpdate: '取消更新',
  settingExitApp: '退出应用',
  settingNotUpdate: '暂不更新',
  settingUPdateNow: '立即更新',
  settingComfirmExitApp: '定退出应用',
}