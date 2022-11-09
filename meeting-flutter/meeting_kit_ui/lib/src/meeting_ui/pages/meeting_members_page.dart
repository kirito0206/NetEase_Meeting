// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

part of meeting_ui;

/// 参会者界面
class MeetMemberPage extends StatefulWidget {
  final MembersArguments arguments;

  MeetMemberPage(this.arguments);

  @override
  State<StatefulWidget> createState() {
    return MeetMemberPageState(arguments);
  }
}

class MeetMemberPageState extends LifecycleBaseState<MeetMemberPage>
    with EventTrackMixin {
  MeetMemberPageState(this.arguments);

  final MembersArguments arguments;

  late Radius _radius;

  bool isLock = true;

  final FocusNode _focusNode = FocusNode();

  String? _searchKey;
  late TextEditingController _searchTextEditingController;

  bool allowSelfAudioOn = false;
  bool allowSelfVideoOn = false;

  late final NERoomContext roomContext;
  late final NERoomWhiteboardController whiteboardController;
  late final NERoomRtcController rtcController;

  late final String roomId;

  late final int maxCount;

  late final NERoomEventCallback roomEventCallback;

  final String _tag = 'MeetMemberPage';

  bool moreDialogIsShow = false; // 更多菜单对话框是都展示

  void onRoomLockStateChanged(bool isLocked) {
    if (mounted) {
      setState(() {
        isLock = isLocked;
      });
    }
  }

  void onMemberRoleChanged(
      NERoomMember member, NERoomRole before, NERoomRole after) {
    if (member.uuid == roomContext.localMember.uuid) {
      if (moreDialogIsShow) {
        Navigator.pop(context);
        moreDialogIsShow = false;
      }
    }
  }

  int parseMaxCountByContract(String? data) {
    if (data != null) {
      try {
        final json = jsonDecode(data);
        if (json is Map) {
          return (json['maxCount'] as int?) ?? 0;
        }
      } catch (e) {}
    }
    return 0;
  }

  @override
  void initState() {
    super.initState();
    roomContext = arguments.roomContext;
    roomContext.addEventCallback(roomEventCallback = NERoomEventCallback(
      roomLockStateChanged: onRoomLockStateChanged,
      memberRoleChanged: onMemberRoleChanged,
    ));
    whiteboardController = roomContext.whiteboardController;
    rtcController = roomContext.rtcController;
    roomId = roomContext.roomUuid;
    maxCount = parseMaxCountByContract(roomContext.extraData);
    _searchTextEditingController = TextEditingController();
    isLock = roomContext.isRoomLocked;
    _radius = Radius.circular(8);
    lifecycleListen(arguments.roomInfoUpdatedEventStream, (_) {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    _searchTextEditingController.dispose();
    roomContext.removeEventCallback(roomEventCallback);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final data = MediaQuery.of(context);
    var padding = data.size.height * 0.15;
    return WillPopScope(
      child: Padding(
        padding: EdgeInsets.only(top: padding),
        child: Container(
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.only(topLeft: _radius, topRight: _radius)),
            child: SafeArea(top: false, child: buildContent())),
      ),
      onWillPop: () async {
        return onWillPop();
      },
    );
  }

  Widget buildContent() {
    final userList = roomContext
        .getAllUsers()
        .where((user) => _searchKey == null || user.name.contains(_searchKey!))
        .toList()
      ..sort(compareUser);

    return StreamBuilder(
      //stream: arguments.,
      builder: (context, snapshot) {
        return Column(
          children: <Widget>[
            title(userList.length, maxCount),
            buildSearch(),
            Expanded(
                child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () {
                if (_focusNode.hasFocus) {
                  _focusNode.unfocus();
                }
              },
              child: buildMembers(userList),
            )),
            if (isSelfHostOrCoHost()) ...buildHost(),
          ],
        );
      },
    );
  }

  /// 自己是否是主持人或者联席主持人
  bool isSelfHostOrCoHost() {
    return roomContext.isMySelfHost() || isSelfCoHost();
  }

  /// 自己是否是联席主持人
  bool isSelfCoHost() {
    return roomContext.isMySelfCoHost();
  }

  /// [uuid] 是否是主持人或者联席主持人
  bool isHostOrCoHost(String? uuid) {
    return roomContext.isHostOrCoHost(uuid);
  }

  bool onWillPop() {
    if (_focusNode.hasFocus) {
      _focusNode.unfocus();
      return false;
    }
    return true;
  }

  Widget buildSearch() {
    return Material(
      color: Colors.white,
      child: Container(
          margin: EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 10),
          padding: EdgeInsets.only(right: 16),
          decoration: BoxDecoration(
              color: _UIColors.colorF7F8FA,
              borderRadius: BorderRadius.all(Radius.circular(20)),
              border: Border.all(width: 1, color: _UIColors.colorF2F3F5)),
          height: 36,
          alignment: Alignment.center,
          child: TextField(
            focusNode: _focusNode,
            controller: _searchTextEditingController,
            cursorColor: _UIColors.blue_337eff,
            keyboardAppearance: Brightness.light,
            textAlignVertical: TextAlignVertical.center,
            onChanged: (String value) {
              setState(() {
                _searchKey = value;
              });
            },
            decoration: InputDecoration(
                isDense: true,
                filled: true,
                fillColor: Colors.transparent,
                hintText: _Strings.searchMember,
                hintStyle: TextStyle(
                    fontSize: 15,
                    color: _UIColors.colorD8D8D8,
                    decoration: TextDecoration.none),
                border: InputBorder.none,
                prefixIcon: Icon(
                  NEMeetingIconFont.icon_search2_line1x,
                  size: 16,
                  color: _UIColors.colorD8D8D8,
                ),
                prefixIconConstraints: BoxConstraints(
                    minWidth: 32, minHeight: 32, maxHeight: 32, maxWidth: 32),
                suffixIcon: TextUtils.isEmpty(_searchTextEditingController.text)
                    ? null
                    : ClearIconButton(
                        onPressed: () {
                          _searchTextEditingController.clear();
                          setState(() {
                            _searchKey = null;
                          });
                        },
                      )),
          )),
    );
  }

  Widget shadow() {
    return Container(
      height: 4,
      decoration: BoxDecoration(
        color: _UIColors.white,
        boxShadow: [
          BoxShadow(
              color: _UIColors.color_19242744,
              offset: Offset(4, 0),
              blurRadius: 8),
        ],
      ),
    );
  }

  ///成员列表展示顺序：
  /// 主持人->联席主持人->自己->举手->屏幕共享（白板）->音视频->视频->音频->昵称排序
  ///
  int compareUser(NERoomMember lhs, NERoomMember rhs) {
    if (roomContext.isHost(lhs.uuid)) {
      return -1;
    }
    if (roomContext.isHost(rhs.uuid)) {
      return 1;
    }
    if (roomContext.isCoHost(lhs.uuid)) {
      return -1;
    }
    if (roomContext.isCoHost(rhs.uuid)) {
      return 1;
    }
    if (roomContext.isMySelf(lhs.uuid)) {
      return -1;
    }
    if (roomContext.isMySelf(rhs.uuid)) {
      return 1;
    }
    if (lhs.isRaisingHand) {
      return -1;
    }
    if (rhs.isRaisingHand) {
      return 1;
    }
    if (lhs.isSharingScreen) {
      return -1;
    }
    if (rhs.isSharingScreen) {
      return 1;
    }
    if (lhs.isSharingWhiteboard) {
      return -1;
    }
    if (rhs.isSharingWhiteboard) {
      return 1;
    }
    if (lhs.isVideoOn && lhs.isAudioOn) {
      return -1;
    }
    if (rhs.isVideoOn && rhs.isAudioOn) {
      return 1;
    }
    if (lhs.isVideoOn) {
      return -1;
    }
    if (rhs.isVideoOn) {
      return 1;
    }
    if (lhs.isAudioOn) {
      return -1;
    }
    if (rhs.isAudioOn) {
      return 1;
    }
    return lhs.name.compareTo(rhs.name);
  }

  Widget buildMembers(List<NERoomMember> userList) {
    final len = userList.length;

    return ListView.separated(
        padding: EdgeInsets.zero,
        shrinkWrap: true,
        primary: false,
        cacheExtent: 48,
        itemCount: len + 1,
        itemBuilder: (context, index) {
          if (index == len) {
            return SizedBox(height: 1);
          }
          return buildMemberItem(userList[index]);
        },
        separatorBuilder: (context, index) {
          return buildDivider();
        });
  }

  List<Widget> buildHost() {
    return [
      buildLockItem(),
      buildDivider(isShow: !arguments.options.noMuteAllAudio),
      buildMuteAllAudioActions(),
      buildDivider(isShow: !arguments.options.noMuteAllVideo),
      buildMuteAllVideoActions(),
    ];
  }

  ///构建分割线
  Widget buildDivider({bool isShow = true}) {
    return Visibility(
      visible: isShow,
      child: Divider(height: 1, color: _UIColors.globalBg),
    );
  }

  Widget buildLockItem() {
    return Container(
      height: 48,
      decoration: BoxDecoration(
          color: Colors.white,
          border:
              Border(top: BorderSide(color: _UIColors.globalBg, width: 0.5))),
      padding: EdgeInsets.only(left: 30, right: 24),
      child: Row(
        children: <Widget>[
          Expanded(
            child: Text(_Strings.lockMeeting,
                style: TextStyle(
                    color: _UIColors.black_222222,
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    decoration: TextDecoration.none)),
          ),
          MeetingUIValueKeys.addTextWidgetTest(
              valueKey: MeetingUIValueKeys.meetingMembersLockSwitchBtn,
              value: isLock),
          CupertinoSwitch(
            key: MeetingUIValueKeys.meetingMembersLockSwitchBtn,
            value: isLock,
            onChanged: (bool value) {
              setState(() {
                updateLockState(value);
              });
            },
            activeColor: _UIColors.blue_337eff,
          )
        ],
      ),
    );
  }

  /// 锁定状态， 失败回退
  void updateLockState(bool lock) {
    isLock = lock;
    lifecycleExecute(lock ? roomContext.lockRoom() : roomContext.unlockRoom())
        .then((result) {
      if (!mounted) return;
      if (result?.isSuccess() ?? false) {
        ToastUtils.showToast(context,
            lock ? _Strings.lockMeetingByHost : _Strings.unLockMeetingByHost);
      } else {
        ToastUtils.showToast(
          context,
          lock
              ? _Strings.lockMeetingByHostFail
              : _Strings.unLockMeetingByHostFail,
        );
      }
    });
  }

  /// 创建"全体视频关闭/打开widget"
  Widget buildMuteAllVideoActions() {
    return Visibility(
      visible: !arguments.options.noMuteAllVideo,
      child: Container(
        height: 49,
        color: _UIColors.colorF7F9FBF0,
        child: Row(
          children: <Widget>[
            Expanded(
                child: TextButton(
              child: Text(_Strings.muteAllVideo),
              onPressed: _onMuteAllVideo,
              style: ButtonStyle(
                  textStyle: MaterialStateProperty.all(TextStyle(fontSize: 16)),
                  foregroundColor:
                      MaterialStateProperty.all(_UIColors.blue_337eff)),
            )),
            Center(
              child:
                  Container(height: 24, width: 1, color: _UIColors.colorE9E9E9),
            ),
            Expanded(
                child: TextButton(
              child: Text(_Strings.unmuteAllVideo),
              onPressed: unMuteAllVideo2Server,
              style: ButtonStyle(
                  textStyle: MaterialStateProperty.all(TextStyle(fontSize: 16)),
                  foregroundColor:
                      MaterialStateProperty.all(_UIColors.blue_337eff)),
            )),
          ],
        ),
      ),
    );
  }

  /// 管理会议成员弹窗下的 全体静音相关操作ui
  Widget buildMuteAllAudioActions() {
    return Visibility(
      visible: !arguments.options.noMuteAllAudio,
      child: Container(
        height: 49,
        color: _UIColors.colorF7F9FBF0,
        child: Row(
          children: <Widget>[
            Expanded(
                child: TextButton(
              child: Text(_Strings.muteAudioAll),
              onPressed: _onMuteAllAudio,
              style: ButtonStyle(
                  textStyle: MaterialStateProperty.all(TextStyle(fontSize: 16)),
                  foregroundColor:
                      MaterialStateProperty.all(_UIColors.blue_337eff)),
            )),
            Center(
              child:
                  Container(height: 24, width: 1, color: _UIColors.colorE9E9E9),
            ),
            Expanded(
                child: TextButton(
              child: Text(_Strings.unMuteAudioAll),
              onPressed: unMuteAllAudio2Server,
              style: ButtonStyle(
                  textStyle: MaterialStateProperty.all(TextStyle(fontSize: 16)),
                  foregroundColor:
                      MaterialStateProperty.all(_UIColors.blue_337eff)),
            )),
          ],
        ),
      ),
    );
  }

  void _onMuteAllAudio() {
    trackPeriodicEvent(TrackEventName.muteAllAudio,
        extra: {'meeting_id': roomId});
    DialogUtils.showChildNavigatorDialog(context, StatefulBuilder(
      builder: (context, setState) {
        return CupertinoAlertDialog(
          title: Text(_Strings.muteAudioAllDialogTips,
              style: TextStyle(color: Colors.black, fontSize: 17)),
          content: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: () {
              setState(() {
                allowSelfAudioOn = !allowSelfAudioOn;
              });
            },
            child: Text.rich(
              TextSpan(children: [
                WidgetSpan(
                  child: Icon(Icons.check_box,
                      size: 14,
                      color: allowSelfAudioOn
                          ? _UIColors.blue_337eff
                          : _UIColors.colorB3B3B3),
                ),
                TextSpan(text: _Strings.muteAllAudioTip)
              ]),
              style: TextStyle(fontSize: 13, color: _UIColors.color_333333),
            ),
          ),
          actions: <Widget>[
            CupertinoDialogAction(
              child: Text(_Strings.cancel),
              onPressed: () {
                Navigator.of(context).pop();
              },
              textStyle: TextStyle(color: _UIColors.color_666666),
            ),
            CupertinoDialogAction(
              key: MeetingUIValueKeys.muteAudioAll,
              child: Text(_Strings.muteAudioAll),
              onPressed: () {
                Navigator.of(context).pop();
                muteAllAudio2Server();
              },
              textStyle: TextStyle(color: _UIColors.color_337eff),
            ),
          ],
        );
      },
    ));
  }

  void muteAllAudio2Server() {
    lifecycleExecute(rtcController.muteAllParticipantsAudio(allowSelfAudioOn))
        .then((result) {
      if (!mounted || result == null) return;
      if (result.isSuccess()) {
        ToastUtils.showToast(context, _Strings.muteAllAudioSuccess);
      } else {
        ToastUtils.showToast(context, result.msg ?? _Strings.muteAllAudioFail);
      }
    });
  }

  void unMuteAllAudio2Server() {
    trackPeriodicEvent(TrackEventName.unMuteAllAudio,
        extra: {'meeting_id': roomId});
    lifecycleExecute(rtcController.unmuteAllParticipantsAudio()).then((result) {
      if (!mounted || result == null) return;
      if (result.isSuccess()) {
        ToastUtils.showToast(context, _Strings.unMuteAllAudioSuccess);
      } else {
        ToastUtils.showToast(
            context, result.msg ?? _Strings.unMuteAllAudioFail);
      }
    });
  }

  void _onMuteAllVideo() {
    trackPeriodicEvent(TrackEventName.muteAllVideo,
        extra: {'meeting_id': roomId});
    DialogUtils.showChildNavigatorDialog(context, StatefulBuilder(
      builder: (context, setState) {
        return CupertinoAlertDialog(
          title: Text(_Strings.muteVideoAllDialogTips,
              style: TextStyle(color: Colors.black, fontSize: 17)),
          content: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: () {
              setState(() {
                allowSelfVideoOn = !allowSelfVideoOn;
              });
            },
            child: Text.rich(
              TextSpan(children: [
                WidgetSpan(
                  child: Icon(Icons.check_box,
                      size: 14,
                      color: allowSelfVideoOn
                          ? _UIColors.blue_337eff
                          : _UIColors.colorB3B3B3),
                ),
                TextSpan(text: _Strings.muteAllVideoTip)
              ]),
              style: TextStyle(fontSize: 13, color: _UIColors.color_333333),
            ),
          ),
          actions: <Widget>[
            CupertinoDialogAction(
              child: Text(_Strings.cancel),
              onPressed: () {
                Navigator.of(context).pop();
              },
              textStyle: TextStyle(color: _UIColors.color_666666),
            ),
            CupertinoDialogAction(
              child: Text(_Strings.muteAllVideo),
              onPressed: () {
                Navigator.of(context).pop();
                muteAllVideo2Server();
              },
              textStyle: TextStyle(color: _UIColors.color_337eff),
            ),
          ],
        );
      },
    ));
  }

  void muteAllVideo2Server() {
    lifecycleExecute(rtcController.muteAllParticipantsVideo(allowSelfVideoOn))
        .then((result) {
      if (!mounted || result == null) return;
      if (result.isSuccess()) {
        ToastUtils.showToast(context, _Strings.muteAllVideoSuccess);
      } else {
        ToastUtils.showToast(context, result.msg ?? _Strings.muteAllVideoFail);
      }
    });
  }

  void unMuteAllVideo2Server() {
    trackPeriodicEvent(TrackEventName.unMuteAllVideo,
        extra: {'meeting_id': roomId});
    lifecycleExecute(rtcController.unmuteAllParticipantsVideo()).then((result) {
      if (!mounted || result == null) return;
      if (result.isSuccess()) {
        ToastUtils.showToast(context, _Strings.unMuteAllVideoSuccess);
      } else {
        ToastUtils.showToast(
            context, result.msg ?? _Strings.unMuteAllVideoFail);
      }
    });
  }

  Widget title(int userCount, [int maxCount = 0]) {
    return Container(
      height: 48,
      decoration: ShapeDecoration(
          shape: RoundedRectangleBorder(
              side: BorderSide(color: _UIColors.globalBg),
              borderRadius:
                  BorderRadius.only(topLeft: _radius, topRight: _radius))),
      child: Stack(
        children: <Widget>[
          Center(
            child: Text(
              '${_Strings.memberlistTitle}($userCount${maxCount > 0 ? '/$maxCount' : ''})',
              style: TextStyle(
                  color: _UIColors.black_333333,
                  fontWeight: FontWeight.bold,
                  fontSize: 16.0,
                  decoration: TextDecoration.none),
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: RawMaterialButton(
              constraints:
                  const BoxConstraints(minWidth: 40.0, minHeight: 48.0),
              child: Icon(
                NEMeetingIconFont.icon_yx_tv_duankaix,
                color: _UIColors.color_666666,
                size: 15,
                key: MeetingUIValueKeys.close,
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
          )
        ],
      ),
    );
  }

  Widget buildMemberItem(NERoomMember user) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => _onTap(user),
      child: Container(
        height: 48,
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Row(
          children: <Widget>[
            Expanded(
              child: _memberItemNick(user),
            ),
            MeetingUIValueKeys.addTextWidgetTest(
                valueKey: ValueKey('${user.tag}'), value: true),
            if (user.isSharingScreen)
              Icon(NEMeetingIconFont.icon_yx_tv_sharescreen,
                  color: _UIColors.color_337eff, size: 20),
            if (user.isSharingWhiteboard)
              Icon(NEMeetingIconFont.icon_whiteboard,
                  color: _UIColors.color_337eff, size: 20),
            if (user.isSharingScreen || user.isSharingWhiteboard)
              SizedBox(width: 20),
            if (isSelfHostOrCoHost() && user.isRaisingHand)

              /// 主持人才显示
              Icon(NEMeetingIconFont.icon_raisehands,
                  color: _UIColors.color_337eff, size: 20),
            SizedBox(width: 20),
            Icon(
                !user.isVideoOn
                    ? NEMeetingIconFont.icon_yx_tv_video_offx
                    : NEMeetingIconFont.icon_yx_tv_video_onx,
                color: !user.isVideoOn ? Colors.red : Color(0xFF49494d),
                size: 20),
            SizedBox(width: 20),
            SizedBox(
              width: 20,
              height: 20,
              child: buildRoomUserVolumeIndicator(user),
            ),
          ],
        ),
      ),
    );
  }

  Widget buildRoomUserVolumeIndicator(NERoomMember user, [double? opacity]) {
    if (!arguments.audioVolumeStreams.containsKey(user.uuid) ||
        !user.isAudioOn) {
      return Icon(
        NEMeetingIconFont.icon_yx_tv_voice_offx,
        color: Colors.red,
        size: 20,
      );
    } else {
      return AnimatedMicphoneVolume.dark(
        volume: arguments.audioVolumeStreams[user.uuid]!.stream,
      );
    }
  }

  Widget buildPopupText(String text) {
    return Text(text,
        style: TextStyle(color: _UIColors.color_007AFF, fontSize: 20));
  }

  Widget buildActionSheet(
      String text, NERoomMember user, MemberActionType memberActionType) {
    return CupertinoActionSheetAction(
      child: buildPopupText(text),
      onPressed: () {
        Navigator.pop(context, _ActionData(memberActionType, user));
      },
    );
  }

  void _onTap(NERoomMember user) {
    final isHost = roomContext.isMySelfHost();
    final isSelf = roomContext.isMySelf(user.uuid);
    final isCoHost = roomContext.isCoHost(user.uuid);
    final isPinned = roomContext.getFocusUuid() == user.uuid;
    final hasScreenSharing =
        roomContext.rtcController.getScreenSharingUserUuid() != null;
    final hasInteract =
        whiteboardController.isDrawWhiteboardEnabledWithUserId(user.uuid);
    final isCurrentSharingWhiteboard =
        whiteboardController.isWhiteboardSharing(user.uuid);
    final isSelfSharingWhiteboard = whiteboardController.isSharingWhiteboard();

    final actions = <Widget>[
      if (!arguments.options.noRename && isSelf)
        buildActionSheet(_Strings.rename, user, MemberActionType.updateNick),
      if (isSelfHostOrCoHost() && user.isRaisingHand)
        buildActionSheet(
            _Strings.handsUpDown, user, MemberActionType.hostRejectHandsUp),
      if (isSelfHostOrCoHost() && user.isAudioOn)
        buildActionSheet(
            _Strings.muteAudio, user, MemberActionType.hostMuteAudio),
      if (isSelfHostOrCoHost() && !user.isAudioOn)
        buildActionSheet(
            _Strings.unMuteAudio, user, MemberActionType.hostUnMuteAudio),
      if (isSelfHostOrCoHost() && user.isVideoOn)
        buildActionSheet(
            _Strings.muteVideo, user, MemberActionType.hostMuteVideo),
      if (isSelfHostOrCoHost() && !user.isVideoOn)
        buildActionSheet(
            _Strings.unMuteVideo, user, MemberActionType.hostUnMuteVideo),
      if (isSelfHostOrCoHost() && (!user.isVideoOn || !user.isAudioOn))
        buildActionSheet(_Strings.unmuteAudioAndVideo, user,
            MemberActionType.hostUnmuteAudioAndVideo),
      if (isSelfHostOrCoHost() && user.isVideoOn && user.isAudioOn)
        buildActionSheet(_Strings.muteAudioAndVideo, user,
            MemberActionType.hostMuteAudioAndVideo),
      if (isSelfHostOrCoHost() && !hasScreenSharing && !isPinned)
        buildActionSheet(
            _Strings.focusVideo, user, MemberActionType.setFocusVideo),
      if (isSelfHostOrCoHost() && !hasScreenSharing && isPinned)
        buildActionSheet(
            _Strings.unFocusVideo, user, MemberActionType.cancelFocusVideo),
      if (isHost && !isSelf && !isCoHost && user.clientType != NEClientType.sip)
        buildActionSheet(
            _Strings.makeCoHost, user, MemberActionType.makeCoHost),
      if (isHost && !isSelf && isCoHost && user.clientType != NEClientType.sip)
        buildActionSheet(
            _Strings.cancelCoHost, user, MemberActionType.cancelCoHost),
      if (isHost &&
          !isSelf &&
          user.clientType !=
              NEClientType
                  .sip) // todo sunjian 暂时去掉   user.clientType != ClientType.sip
        buildActionSheet(
            _Strings.changeHost, user, MemberActionType.changeHost),
      if (isSelfHostOrCoHost() && user.isSharingScreen && !isSelf)
        buildActionSheet(
            _Strings.unScreenShare, user, MemberActionType.hostStopScreenShare),
      if (isSelfHostOrCoHost() && isCurrentSharingWhiteboard)
        buildActionSheet(_Strings.closeWhiteBoard, user,
            MemberActionType.hostStopWhiteBoardShare),
      if (!isSelf && isSelfSharingWhiteboard && hasInteract)
        buildActionSheet(_Strings.undoWhiteBoardInteract, user,
            MemberActionType.undoMemberWhiteboardInteraction),
      if (!isSelf && isSelfSharingWhiteboard && !hasInteract)
        buildActionSheet(_Strings.whiteBoardInteract, user,
            MemberActionType.awardedMemberWhiteboardInteraction),
      if (isHost && !isSelf)
        buildActionSheet(_Strings.remove, user, MemberActionType.removeMember),
      if (isSelfCoHost() && !isSelf && !roomContext.isHost(user.uuid))
        buildActionSheet(_Strings.remove, user, MemberActionType.removeMember),
    ];
    if (actions.isEmpty) return;

    DialogUtils.showChildNavigatorPopup<_ActionData>(
        context,
        CupertinoActionSheet(
          title: Text(
            '${user.name}',
            style: TextStyle(color: _UIColors.grey_8F8F8F, fontSize: 13),
          ),
          actions: actions,
          cancelButton: CupertinoActionSheetAction(
            isDefaultAction: true,
            child: buildPopupText(_Strings.cancel),
            onPressed: () {
              Navigator.pop(context);
              moreDialogIsShow = false;
            },
          ),
        )).then<void>((_ActionData? value) {
      if (value != null && value.action.index != -1) {
        handleAction(value.action, value.user);
      }
    });
    moreDialogIsShow = true;
  }

  void handleAction(MemberActionType action, NERoomMember user) {
    switch (action) {
      case MemberActionType.hostMuteAudio:
        muteMemberAudio(user, true);
        break;
      case MemberActionType.hostUnMuteAudio:
        muteMemberAudio(user, false);
        break;
      case MemberActionType.hostMuteVideo:
        muteMemberVideo(user, true);
        break;
      case MemberActionType.hostUnMuteVideo:
        muteMemberVideo(user, false);
        break;
      case MemberActionType.setFocusVideo:
        setFocusVideo(user, true);
        break;
      case MemberActionType.cancelFocusVideo:
        setFocusVideo(user, false);
        break;
      case MemberActionType.changeHost:
        changeHost(user);
        break;
      case MemberActionType.removeMember:
        removeMember(user);
        break;
      case MemberActionType.hostRejectHandsUp:
        hostRejectHandsUp(user);
        break;
      case MemberActionType.awardedMemberWhiteboardInteraction:
        _awardedWhiteboardInteraction(user);
        break;
      case MemberActionType.undoMemberWhiteboardInteraction:
        _undoWhiteboardInteraction(user);
        break;
      case MemberActionType.hostStopScreenShare:
        _hostStopScreenShare(user);
        break;
      case MemberActionType.hostStopWhiteBoardShare:
        _hostStopWhiteBoard(user);
        break;
      case MemberActionType.updateNick:
        _rename(user);
        break;
      case MemberActionType.hostMuteAudioAndVideo:
        muteMemberAudioAndVideo(user, true);
        break;
      case MemberActionType.hostUnmuteAudioAndVideo:
        muteMemberAudioAndVideo(user, false);
        break;
      case MemberActionType.makeCoHost:
        roomContext.makeCoHost(user.uuid).then((result) {
          if (result.isSuccess()) {
            ToastUtils.showToast(
                context, '${roomContext.getMember(user.uuid)?.name}已被设为联席主持人');
          } else {
            if (result.code == NEErrorCode.overRoleLimitCount) {
              /// 达到分配角色的上限
              showToast(_Strings.overRoleLimitCount);
            }
            Alog.i(
                tag: _tag,
                moduleName: _moduleName,
                content:
                    'makeCoHost code: ${result.code}, msg:${result.msg ?? ''}');
          }
        });
        break;
      case MemberActionType.cancelCoHost:
        roomContext.cancelCoHost(user.uuid).then((result) {
          if (result.isSuccess()) {
            ToastUtils.showToast(
                context, '${roomContext.getMember(user.uuid)?.name}已被取消联席主持人');
          } else {
            Alog.i(
                tag: _tag,
                moduleName: _moduleName,
                content:
                    'cancelCoHost code: ${result.code}, msg:${result.msg ?? ''}');
          }
        });
        break;
    }
    setState(() {});
  }

  Future<void> _hostStopWhiteBoard(NERoomMember member) async {
    var result =
        await whiteboardController.stopMemberWhiteboardShare(member.uuid);
    if (!result.isSuccess() && mounted) {
      ToastUtils.showToast(
          context, result.msg ?? _Strings.whiteBoardShareStopFail);
    }
  }

  Future<void> _hostStopScreenShare(NERoomMember user) async {
    await lifecycleExecute(
        roomContext.rtcController.stopMemberScreenShare(user.uuid)
            // .stopParticipantScreenShare(user.uuid)
            .then((NEResult? result) {
      if (!mounted || result == null) return;
      if (!result.isSuccess()) {
        ToastUtils.showToast(
            context, result.msg ?? _Strings.screenShareStopFail);
      }
    }));
  }

  Future<void> _awardedWhiteboardInteraction(NERoomMember user) async {
    var result = await whiteboardController.grantPermission(user.uuid);
    if (!result.isSuccess() && mounted) {
      ToastUtils.showToast(
          context, result.msg ?? _Strings.whiteBoardInteractFail);
    }
  }

  Future<void> _undoWhiteboardInteraction(NERoomMember user) async {
    var result = await whiteboardController.revokePermission(user.uuid);
    if (!result.isSuccess() && mounted) {
      ToastUtils.showToast(
          context, result.msg ?? _Strings.undoWhiteBoardInteractFail);
    }
  }

  void hostRejectHandsUp(NERoomMember user) {
    trackPeriodicEvent(TrackEventName.handsUpDown,
        extra: {'value': 0, 'member_uid': user.uuid, 'meeting_id': roomId});
    lifecycleExecute(roomContext.lowerUserHand(user.uuid))
        .then((NEResult? result) {
      if (mounted && result != null && !result.isSuccess()) {
        ToastUtils.showToast(context, result.msg ?? _Strings.handsUpDownFail);
      }
    });
  }

  void removeMember(NERoomMember user) {
    trackPeriodicEvent(TrackEventName.removeMember,
        extra: {'member_uid': user.uuid, 'meeting_id': roomId});
    if (roomContext.isMySelf(user.uuid)) {
      ToastUtils.showToast(context, _Strings.cannotRemoveSelf);
      return;
    }
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return CupertinoAlertDialog(
            title: Text(_Strings.remove),
            content: Text(_Strings.removeTips + '${user.name}?'),
            actions: <Widget>[
              CupertinoDialogAction(
                child: Text(_Strings.no),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              CupertinoDialogAction(
                child: Text(_Strings.yes),
                onPressed: () {
                  Navigator.of(context).pop();
                  removeMember2Server(user);
                },
              ),
            ],
          );
        });
  }

  void removeMember2Server(NERoomMember user) {
    lifecycleExecute(roomContext.kickMemberOut(user.uuid))
        .then((NEResult? result) {
      if (mounted && result != null && !result.isSuccess()) {
        ToastUtils.showToast(context, result.msg ?? _Strings.removeMemberFail);
      }
    });
  }

  void muteMemberAudio(NERoomMember user, bool mute) async {
    trackPeriodicEvent(TrackEventName.switchAudioMember, extra: {
      'value': mute ? 0 : 1,
      'member_uid': user.uuid,
      'meeting_id': roomId
    });
    if (user.uuid == roomContext.myUuid) {
      mute
          ? rtcController.muteMyAudio()
          : rtcController.unmuteMyAudioWithCheckPermission(
              context, arguments.meetingTitle);
      return;
    }
    var future = mute
        ? roomContext.rtcController.muteMemberAudio(user.uuid)
        : roomContext.rtcController.inviteParticipantTurnOnAudio(user.uuid);
    lifecycleExecute(future).then((NEResult? result) {
      if (result != null && mounted && !result.isSuccess()) {
        ToastUtils.showToast(
            context,
            result.msg ??
                (mute ? _Strings.muteAudioFail : _Strings.unMuteAudioFail));
      }
    });
  }

  void muteMemberVideo(NERoomMember user, bool mute) async {
    trackPeriodicEvent(TrackEventName.switchCameraMember, extra: {
      'value': mute ? 0 : 1,
      'member_uid': user.uuid,
      'meeting_id': roomId
    });
    if (user.uuid == roomContext.myUuid) {
      mute
          ? rtcController.muteMyVideo()
          : rtcController.unmuteMyVideoWithCheckPermission(
              context, arguments.meetingTitle);
      return;
    }
    final result = mute
        ? roomContext.rtcController.muteMemberVideo(user.uuid)
        : roomContext.rtcController.inviteParticipantTurnOnVideo(user.uuid);
    lifecycleExecute(result).then((NEResult? result) {
      if (mounted && result != null && !result.isSuccess()) {
        ToastUtils.showToast(
            context,
            result.msg ??
                (mute ? _Strings.muteVideoFail : _Strings.unMuteVideoFail));
      }
    });
  }

  void muteMemberAudioAndVideo(NERoomMember user, bool mute) async {
    trackPeriodicEvent(TrackEventName.muteAudioAndVideo, extra: {
      'value': mute ? 0 : 1,
      'member_uid': user.uuid,
      'meeting_id': roomId
    });
    if (user.uuid == roomContext.myUuid) {
      mute
          ? rtcController.muteMyAudio()
          : rtcController.unmuteMyAudioWithCheckPermission(
              context, arguments.meetingTitle);
      mute
          ? rtcController.muteMyVideo()
          : rtcController.unmuteMyVideoWithCheckPermission(
              context, arguments.meetingTitle);
      return;
    }
    if (mute) {
      muteMemberAudio(user, true);
      muteMemberVideo(user, true);
    } else {
      final result =
          rtcController.inviteParticipantTurnOnAudioAndVideo(user.uuid);
      lifecycleExecute(result).then((NEResult? result) {
        if (mounted && result != null && !result.isSuccess()) {
          ToastUtils.showToast(
              context,
              result.msg ??
                  '${(mute ? _Strings.muteAudioAndVideo : _Strings.unmuteAudioAndVideo)}${_Strings.fail}');
        }
      });
    }
  }

  void setFocusVideo(NERoomMember user, bool focus) {
    trackPeriodicEvent(TrackEventName.focusMember, extra: {
      'value': focus ? 1 : 0,
      'member_uid': user.uuid,
      'meeting_id': roomId
    });
    lifecycleExecute(rtcController.pinVideo(user.uuid, focus))
        .then((NEResult? result) {
      if (mounted && result != null && !result.isSuccess()) {
        ToastUtils.showToast(
            context,
            result.msg ??
                (focus ? _Strings.focusVideoFail : _Strings.unFocusVideoFail));
      }
    });
  }

  void changeHost(NERoomMember user) {
    trackPeriodicEvent(TrackEventName.changeHost,
        extra: {'member_uid': user.uuid, 'meeting_id': roomId});
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return CupertinoAlertDialog(
            title: Text(_Strings.changeHost),
            content: Text('${_Strings.changeHostTips}${user.name}?'),
            actions: <Widget>[
              CupertinoDialogAction(
                child: Text(_Strings.no),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              CupertinoDialogAction(
                child: Text(_Strings.yes),
                onPressed: () {
                  Navigator.of(context).pop();
                  changeHost2Server(user);
                },
              ),
            ],
          );
        });
  }

  void changeHost2Server(NERoomMember user) {
    if (roomContext.getMember(user.uuid) == null) {
      /// 执行移交主持人时，check 用户是否还在会议中，不在的话直接提示 移交主持人失败
      ToastUtils.showToast(context, _Strings.changeHostFail);
      return;
    }
    lifecycleExecute(roomContext.handOverHost(user.uuid))
        .then((NEResult? result) {
      if (mounted && result != null && !result.isSuccess()) {
        ToastUtils.showToast(context, result.msg ?? _Strings.changeHostFail);
      }
    });
  }

  Widget _memberItemNick(NERoomMember user) {
    var subtitle = <String>[];
    if (roomContext.isHost(user.uuid)) {
      subtitle.add(_Strings.host);
    }
    if (roomContext.isCoHost(user.uuid)) {
      subtitle.add(_Strings.coHost);
    }
    if (roomContext.isMySelf(user.uuid)) {
      subtitle.add(_Strings.me);
    }
    if (user.clientType == NEClientType.sip) {
      subtitle.add(_Strings.sipTip);
    }
    if (arguments.options.showMemberTag &&
        user.tag != null &&
        user.tag!.isNotEmpty) {
      subtitle.add(user.tag!);
    }
    final subTitleTextStyle = TextStyle(
      fontSize: 13,
      fontWeight: FontWeight.normal,
      color: _UIColors.color_999999,
      decoration: TextDecoration.none,
    );
    if (subtitle.isNotEmpty) {
      return Column(
        children: [
          Text(
            user.name,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.normal,
              color: _UIColors.color_333333,
              decoration: TextDecoration.none,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            '(${subtitle.join('，')})',
            style: subTitleTextStyle,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
      );
    } else {
      return Text(
        user.name,
        style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.normal,
            color: _UIColors.color_333333,
            decoration: TextDecoration.none),
      );
    }
  }

  final TextEditingController _textFieldController = TextEditingController();
  void _rename(NERoomMember user) {
    _textFieldController.text = user.name;
    _textFieldController.selection = TextSelection.fromPosition(
        TextPosition(offset: _textFieldController.text.length));
    showCupertinoDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) => CupertinoAlertDialog(
            title: Text(_Strings.rename),
            content: Container(
                margin: EdgeInsets.only(top: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CupertinoTextField(
                      autofocus: true,
                      controller: _textFieldController,
                      placeholder: _Strings.renameTips,
                      placeholderStyle: const TextStyle(
                        fontSize: 13,
                        color: CupertinoColors.placeholderText,
                      ),
                      onChanged: (_) => setState(() {}),
                      keyboardType: TextInputType.text,
                      textInputAction: TextInputAction.done,
                      onEditingComplete: _nicknameValid()
                          ? () => _doRename(context, user)
                          : null,
                      clearButtonMode: OverlayVisibilityMode.editing,
                      inputFormatters: [
                        LengthLimitingTextInputFormatter(20),
                      ],
                    ),
                  ],
                )),
            actions: <Widget>[
              CupertinoDialogAction(
                child: Text(_Strings.cancel),
                onPressed: () => Navigator.of(context).pop(),
              ),
              CupertinoDialogAction(
                child: Text(_Strings.done),
                onPressed:
                    _nicknameValid() ? () => _doRename(context, user) : null,
              ),
            ],
          ),
        );
      },
    );
  }

  bool _nicknameValid() => _textFieldController.text.isNotEmpty;

  void _doRename(BuildContext dialogContext, NERoomMember user) {
    final nickname = _textFieldController.text;

    if (nickname == user.name) return;

    Navigator.of(dialogContext).pop();

    lifecycleExecute(roomContext.changeMyName(nickname))
        .then((NEResult? result) {
      if (mounted && result != null) {
        if (result.isSuccess()) {
          ToastUtils.showToast(context, _Strings.renameSuccess);
        } else {
          ToastUtils.showToast(context, result.msg ?? _Strings.renameFail);
        }
      }
    });
  }
}

class _ActionData {
  final MemberActionType action;
  final NERoomMember user;

  _ActionData(this.action, this.user);
}

enum MemberActionType {
  hostMuteAudio,
  hostUnMuteAudio,
  hostMuteVideo,
  hostUnMuteVideo,
  setFocusVideo,
  cancelFocusVideo,
  changeHost,
  removeMember,
  hostRejectHandsUp,
  awardedMemberWhiteboardInteraction,
  undoMemberWhiteboardInteraction,
  hostStopScreenShare,
  hostStopWhiteBoardShare,
  updateNick,
  hostMuteAudioAndVideo,
  hostUnmuteAudioAndVideo,
  makeCoHost,
  cancelCoHost,
}