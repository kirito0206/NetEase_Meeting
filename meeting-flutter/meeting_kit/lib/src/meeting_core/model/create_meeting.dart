// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

part of meeting_core;

/// 会议类型
enum NEMeetingType {
  /// 随机会议
  kRandom,

  /// 个人会议
  kPersonal,

  /// 预约会议
  kReservation,
}

extension MeetingTypeExtension on NEMeetingType {
  int get type {
    switch (this) {
      case NEMeetingType.kRandom:
        return 1;
      case NEMeetingType.kPersonal:
        return 2;
      case NEMeetingType.kReservation:
        return 3;
    }
  }

  static NEMeetingType fromType(int type) {
    switch (type) {
      case 2:
        return NEMeetingType.kPersonal;
      case 3:
        return NEMeetingType.kReservation;
      default:
        return NEMeetingType.kRandom;
    }
  }
}

/// 功能开关
class NEMeetingFeatureConfig {
  ///
  /// 是否开启录制
  ///
  final bool enableRecord;

  ///
  /// 是否开启直播
  ///
  final bool enableLive;

  ///
  /// 是否创建RTC房间
  ///
  final bool enableRtc;

  ///
  /// 是否创建聊天室
  ///
  final bool enableChatroom;

  ///
  /// 是否创建白板
  ///
  final bool enableWhiteboard;

  ///
  /// 是否开启Sip
  ///
  final bool enableSip;

  const NEMeetingFeatureConfig({
    this.enableRecord = false,
    this.enableChatroom = false,
    this.enableLive = false,
    this.enableRtc = true,
    this.enableWhiteboard = false,
    this.enableSip = false,
  });
}

/// 会议信息
class MeetingInfo {
  ///
  /// 会议ID
  ///
  late final int meetingId;

  ///
  /// 会议号
  ///
  late final String meetingNum;

  ///
  /// 对应 NERoom 房间ID
  ///
  late final String? roomArchiveId;

  ///
  /// 对应 NERoom 房间ID
  ///
  late final String roomUuid;

  ///
  /// 会议类型
  ///
  late final NEMeetingType type;

  ///
  /// 会议主题
  ///
  late final String subject;

  ///
  /// 会议邀请链接
  ///
  late final String? inviteUrl;

  ///
  /// 会议邀请码
  ///
  late final String? inviteCode;

  ///
  /// 开始时间，单位毫秒
  ///
  late final int startTime;

  ///
  /// 结束时间，单位毫秒
  ///
  late final int endTime;

  ///
  /// 会议状态
  ///
  late final NEMeetingItemStatus state;

  ///
  /// 会议短号
  ///
  late final String? shortMeetingNum;

  ///
  /// sip号
  ///
  late final String? sipCid;

  ///
  /// 跨appkey的鉴权信息
  ///
  late final MeetingAuthorization? authorization;

  ///
  /// meeting 配置相关
  ///
  late final MeetingSettings? settings;

  ///
  /// 房间拥有者的用户uuid
  ///
  late final String? ownerUserUuid;

  ///
  /// 时区Id
  ///
  late final String? timezoneId;

  ///
  /// 访客入会类型：
  /// * 0 不允许访客入会
  /// * 1 允许实名访客入会
  /// * 2 允许匿名访客入会
  ///
  // late final int guestJoinType;

  MeetingInfo({
    required this.meetingId,
    required this.meetingNum,
    required this.roomUuid,
    this.roomArchiveId,
    required this.type,
    required this.subject,
    this.inviteUrl,
    this.inviteCode,
    required this.startTime,
    required this.endTime,
    required this.state,
    this.shortMeetingNum,
    this.sipCid,
    this.authorization,
    this.settings,
    this.ownerUserUuid,
    this.timezoneId,
  });

  MeetingInfo.fromMap(Map map) {
    meetingId = map['meetingId'] as int;
    meetingNum = map['meetingNum'] as String;
    roomUuid = map['roomUuid'] as String;
    roomArchiveId = map['roomArchiveId'] as String?;
    type = MeetingTypeExtension.fromType(map['type'] as int);
    subject = map['subject'] as String;
    inviteUrl = map['meetingInviteUrl'] as String?;
    inviteCode = map['meetingCode'] as String?;
    startTime = map['startTime'] as int? ?? 0;
    endTime = map['endTime'] as int? ?? 0;
    state = _MeetingStateExtension.fromState(map['state'] as int);
    shortMeetingNum = map['shortMeetingNum'] as String?;
    sipCid = map['sipCid'] as String?;
    ownerUserUuid = map['ownerUserUuid'] as String?;

    final appKey = map['meetingAppKey'] as String?;
    final user = map['meetingUserUuid'] as String?;
    final token = map['meetingUserToken'] as String?;
    final authType = map['meetingAuthType'] as String?;
    if (appKey != null && user != null && token != null && authType != null) {
      authorization = MeetingAuthorization(
        appKey,
        user,
        token,
        authType,
      );
    } else {
      authorization = null;
    }

    settings = MeetingSettings.fromMap(map['settings'] as Map?);
    timezoneId = map['timezoneId'] as String?;
  }

  MeetingInfo copyWith({
    NEMeetingItemStatus? state,
  }) {
    return MeetingInfo(
      meetingId: meetingId,
      meetingNum: meetingNum,
      roomArchiveId: roomArchiveId,
      roomUuid: roomUuid,
      type: type,
      subject: subject,
      inviteUrl: inviteUrl,
      inviteCode: inviteCode,
      startTime: startTime,
      endTime: endTime,
      state: state ?? this.state,
      shortMeetingNum: shortMeetingNum,
      sipCid: sipCid,
      authorization: authorization,
      settings: settings,
      ownerUserUuid: ownerUserUuid,
      timezoneId: timezoneId,
    );
  }
}

class MeetingAuthorization {
  final String appKey;
  final String user;
  final String token;
  final String authType;

  MeetingAuthorization(
    this.appKey,
    this.user,
    this.token,
    this.authType,
  );
}

class MeetingSettings {
  LiveConfig? liveConfig; // 直播配置
  MeetingSettings.fromMap(Map? map) {
    liveConfig = LiveConfig.fromMap(map?['liveConfig'] as Map?);
  }
}

class LiveConfig {
  String? liveAddress; // 直播地址
  LiveConfig.fromMap(Map? map) {
    liveAddress = map?['liveAddress'];
  }
}
