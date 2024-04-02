// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

import 'package:cached_network_image/cached_network_image.dart';
import 'package:connectivity/connectivity.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nemeeting/service/model/history_meeting.dart';
import 'package:nemeeting/service/repo/history_repo.dart';
import 'package:netease_meeting_ui/meeting_ui.dart';
import '../language/localizations.dart';
import '../meeting/history_meeting_detail.dart';
import '../uikit/state/meeting_base_state.dart';
import '../uikit/values/asset_name.dart';
import '../uikit/values/colors.dart';
import '../uikit/values/fonts.dart';
import '../uikit/values/strings.dart';
import 'package:intl/intl.dart';

class MeetingNotifyMessage extends StatefulWidget {
  final String sessionId;
  final void Function()? onClearAllMessage;

  MeetingNotifyMessage({required this.sessionId, this.onClearAllMessage});

  @override
  State<StatefulWidget> createState() {
    return MeetingNotifyMessageState();
  }
}

class MeetingNotifyMessageState extends MeetingBaseState<MeetingNotifyMessage> {
  ValueNotifier<List<NEMeetingCustomSessionMessage>> _messageListListenable =
      ValueNotifier([]);

  ValueListenable<List<NEMeetingCustomSessionMessage>>
      get messageListListenable => _messageListListenable;
  bool isShowClearDialogDialog = false;
  ScrollController _scrollController = ScrollController();
  int toTime = 0;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        _loadMoreData(toTime);
      }
    });
    lifecycleExecuteUI(NEMeetingKit.instance
        .clearUnreadCount(widget.sessionId)
        .then((result) async {
      if (await Connectivity().checkConnectivity() == ConnectivityResult.none) {
        ToastUtils.showToast(
            context,
            NEMeetingUIKitLocalizations.of(context)!
                .networkAbnormalityPleaseCheckYourNetwork);
        return;
      }
      if (result.isSuccess()) {
        widget.onClearAllMessage?.call();
      }
    }));
    _loadMoreData(toTime);
  }

  @override
  Widget buildBody() {
    double appBarHeight = AppBar().preferredSize.height;
    double statusBarHeight = MediaQuery.of(context).padding.top;
    return NotificationListener<ScrollNotification>(
        child: SafeValueListenableBuilder(
            valueListenable: messageListListenable,
            builder: (BuildContext context,
                List<NEMeetingCustomSessionMessage> value, Widget? child) {
              return value.length > 0
                  ? Container(
                      padding: EdgeInsets.all(16),
                      child: SingleChildScrollView(
                          controller: _scrollController,
                          child: ListView.separated(
                              separatorBuilder: (context, index) =>
                                  SizedBox(height: 6),
                              itemBuilder: (context, index) {
                                return GestureDetector(
                                  child: buildNotifyMessageItem(context, index),
                                  onTap: () {
                                    pushPage(index);
                                  },
                                );
                              },
                              itemCount: value.length,
                              shrinkWrap: true,
                              physics: NeverScrollableScrollPhysics())),
                    )
                  : Container(
                      padding: EdgeInsets.only(
                          bottom: appBarHeight + statusBarHeight),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Image(
                              image:
                                  AssetImage(AssetName.iconNotificationEmpty),
                            ),
                            SizedBox(
                              height: 16,
                            ),
                            Text(
                              NEMeetingUIKitLocalizations.of(context)!
                                  .notifyCenterNoMessage,
                              style: TextStyle(
                                  fontSize: 14, color: AppColors.color_222222),
                            )
                          ],
                        ),
                      ));
            }));
  }

  @override
  String getTitle() {
    return NEMeetingUIKitLocalizations.of(context)!.notifyCenter;
  }

  @override
  List<Widget> buildActions() {
    return <Widget>[
      _messageListListenable.value.isNotEmpty
          ? TextButton(
              child: Image(
                  image: AssetImage(
                    AssetName.iconNotificationDelete,
                  ),
                  width: 24,
                  height: 24),
              onPressed: _messageListListenable.value.isNotEmpty
                  ? showClearDialog
                  : null,
            )
          : Container()
    ];
  }

  /// 显示清空对话框
  Future<void> showClearDialog() async {
    /// 会议中不支持操作
    if (NEMeetingUIKit().getCurrentMeetingInfo() != null) {
      ToastUtils.showToast(context,
          NEMeetingUIKitLocalizations.of(context)!.globalOperationFail);
      return;
    }

    if (isShowClearDialogDialog) return;
    if (await Connectivity().checkConnectivity() == ConnectivityResult.none) {
      ToastUtils.showToast(
          context, NEMeetingUIKitLocalizations.of(context)!.networkAbnormality);
      return;
    }
    isShowClearDialogDialog = true;
    showCupertinoDialog(
        context: context,
        builder: (BuildContext buildContext) => CupertinoAlertDialog(
              content: Text(Strings.clearAllNotify),
              actions: <Widget>[
                CupertinoDialogAction(
                    child: Text(
                        NEMeetingUIKitLocalizations.of(context)!.globalCancel),
                    onPressed: () {
                      Navigator.of(context).pop();
                      isShowClearDialogDialog = false;
                    }),
                CupertinoDialogAction(
                    child: Text(
                        NEMeetingUIKitLocalizations.of(context)!.globalSure),
                    onPressed: () {
                      lifecycleExecuteUI(NEMeetingKit.instance
                          .deleteAllSessionMessage(widget.sessionId)
                          .then((result) {
                        if (!mounted) return;
                        if (result.isSuccess()) {
                          setState(() {
                            _messageListListenable.value.clear();
                          });
                        }
                        Navigator.of(context).pop();
                        isShowClearDialogDialog = false;
                      }));
                    })
              ],
            ));
  }

  /// 构建通知消息item
  /// [index] index 对应的数据
  /// [context] context 对应的上下文
  /// [notifyData] notifyData 对应通知的数据
  Widget buildNotifyMessageItem(BuildContext context, int index) {
    var notifyData = _messageListListenable.value[index].data;
    int? timeStamp = notifyData?.data?.timestamp;
    var header = notifyData?.data?.notifyCard?.header;
    String? icon = header?.icon;
    var notifyCenterCardClickAction =
        notifyData?.data?.notifyCard?.notifyCenterCardClickAction;
    var body = notifyData?.data?.notifyCard?.body;
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.max,
        children: [
          buildHeader(icon, header, timeStamp),
          Container(
            alignment: Alignment.centerLeft,
            padding: EdgeInsets.only(left: 16, top: 6, bottom: 2, right: 16),
            child: Text(
              '${body?.title}',
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: 14,
                  color: AppColors.black_333333,
                  fontWeight: FontWeight.bold),
            ),
          ),
          Container(
            alignment: Alignment.centerLeft,
            padding: EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 8),
            child: Text(
              '${body?.content}',
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 14,
                color: AppColors.color_666666,
              ),
            ),
          ),
          if (notifyCenterCardClickAction != null)
            Container(
              height: 0.5,
              margin: EdgeInsets.only(left: 16, top: 8, bottom: 8),
              color: AppColors.colorE8E9EB,
            ),
          if (notifyCenterCardClickAction != null)
            buildDetailItem(
                NEMeetingUIKitLocalizations.of(context)!
                    .notifyCenterViewingDetails, () {
              pushPage(index);
            })
        ],
      ),
    );
  }

  Widget buildDetailItem(String title, VoidCallback voidCallback,
      {String iconTip = ''}) {
    return GestureDetector(
      child: Container(
        padding: EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 8),
        child: Row(
          children: <Widget>[
            Text(title,
                style: TextStyle(
                    fontSize: 14,
                    color: AppColors.black_222222,
                    fontWeight: FontWeight.normal)),
            Spacer(),
            iconTip == ''
                ? Container()
                : Text(iconTip,
                    style:
                        TextStyle(fontSize: 14, color: AppColors.color_999999)),
            Container(
              width: 10,
            ),
            Icon(IconFont.iconyx_allowx, size: 12, color: AppColors.greyCCCCCC)
          ],
        ),
      ),
      onTap: voidCallback,
    );
  }

  void _loadMoreData(int time) {
    var param = NEMeetingGetMessagesHistoryParam(
      sessionId: widget.sessionId,
      limit: 20,
      toTime: time,
    );
    lifecycleExecuteUI(
        NEMeetingKit.instance.getSessionMessagesHistory(param).then((value) {
      if (value.isSuccess() && value.data != null && value.data!.isNotEmpty) {
        setState(() {
          toTime = value.data?.last.time ?? 0;
          _messageListListenable.value.addAll(value.data!);
        });
      }
    }));
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _messageListListenable.value.clear();
    super.dispose();
  }

  void pushPage(int index) {
    var data = _messageListListenable.value[index].data?.data;
    var action = data?.notifyCard?.notifyCenterCardClickAction;
    if (action != null &&
        action.contains(MeetingNotifyCenterActionUtil.action_meeting_history) &&
        data?.meetingId != null) {
      HistoryRepo()
          .getHistoryMeetingDetailsByMeetingId(data!.meetingId!)
          .then((value) {
        if (value.isSuccess() && value.data != null) {
          Navigator.of(context).push(MaterialMeetingAppPageRoute(
              builder: (context) =>
                  HistoryMeetingDetailRoute(value.data as HistoryMeeting)));
        } else {
          ToastUtils.showToast(context, Strings.viewDetailsUnSupported);
        }
      });
    }
  }

  /// 构建头部
  /// [icon] icon 对应的url
  /// [header] header 对应的数据
  /// [timeStamp] 时间戳
  ///
  Widget buildHeader(String? icon, Header? header, int? timeStamp) {
    return GestureDetector(
      child: Container(
        height: 48,
        padding: EdgeInsets.only(left: 16, top: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (icon != null && icon.isNotEmpty)
              Container(
                padding: EdgeInsets.only(right: 8),
                child: CachedNetworkImage(
                  width: 28,
                  height: 28,
                  imageUrl: icon,
                  fit: BoxFit.cover,
                ),
              ),
            Expanded(
              child: Text(
                '${header?.subject}',
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    fontSize: 16,
                    color: AppColors.color_999999,
                    fontWeight: FontWeight.normal),
              ),
            ),
            Container(
              padding: EdgeInsets.only(right: 16),
              child: Text(
                timeStamp != null
                    ? DateFormat(Strings.meetingInfoNotifyMessageDateFormat)
                        .format(DateTime.fromMillisecondsSinceEpoch(timeStamp))
                    : Strings.unKnown,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    fontSize: 14,
                    color: AppColors.color_999999,
                    fontWeight: FontWeight.normal),
              ),
            )
          ],
        ),
      ),
    );
  }
}