// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

part of meeting_ui;

/// 会议页面参数
class MeetingArguments extends MeetingBaseArguments {
  final MeetingInfo meetingInfo;

  final NERoomContext roomContext;

  late int requestTimeStamp;

  final NEEncryptionConfig? encryptionConfig;

  final NEWatermarkConfig? watermarkConfig;

  IntervalEvent? trackingEvent;

  MeetingArguments({
    required this.roomContext,
    required this.meetingInfo,
    String? displayName,
    String? password,
    required NEMeetingOptions options,
    this.encryptionConfig,
    Widget? backgroundWidget,
    bool? initialAudioMute,
    bool? initialVideoMute,
    bool? initialIsInPIPView,
    this.watermarkConfig,
  }) : super(
          meetingNum: roomContext.roomUuid,
          displayName: displayName,
          password: password,
          backgroundWidget: backgroundWidget,
          options: options,
          initialAudioMute: initialAudioMute ?? options.noAudio,
          initialVideoMute: initialVideoMute ?? options.noVideo,
          initialIsInPIPView: initialIsInPIPView ?? false,
        ) {
    requestTimeStamp = DateTime.now().millisecondsSinceEpoch;
    _isWhiteboardTransparent =
        ValueNotifier(options.enableTransparentWhiteboard ?? false);
    _isLeaveTheMeetingRequiresConfirmationEnable = ValueNotifier(
        options.enableLeaveTheMeetingRequiresConfirmation ?? true);
  }

  MeetingArguments copyWith({
    bool? initialAudioMute,
    bool? initialVideoMute,
    NERoomContext? roomContext,
    bool? initialIsInPIPView,
    MeetingInfo? meetingInfo,
  }) {
    return MeetingArguments(
      roomContext: roomContext ?? this.roomContext,
      meetingInfo: meetingInfo ?? roomContext?.meetingInfo ?? this.meetingInfo,
      displayName: displayName,
      password: password,
      options: options,
      encryptionConfig: this.encryptionConfig,
      watermarkConfig: this.watermarkConfig,
      backgroundWidget: this.backgroundWidget,
      initialAudioMute: initialAudioMute ?? this.initialAudioMute,
      initialVideoMute: initialVideoMute ?? this.initialVideoMute,
      initialIsInPIPView: initialIsInPIPView ?? this.initialIsInPIPView,
    );
  }

  @override
  String get meetingNum => roomContext.roomUuid;

  String? getOptionExtraValue(String key) {
    return options.extras[key] as String?;
  }

  late final ValueNotifier<bool> _isWhiteboardTransparent;

  bool get isWhiteboardTransparent => _isWhiteboardTransparent.value;

  set isWhiteboardTransparent(value) => _isWhiteboardTransparent.value = value;

  late final ValueNotifier<bool> _isLeaveTheMeetingRequiresConfirmationEnable;

  bool get isLeaveTheMeetingRequiresConfirmationEnable =>
      _isLeaveTheMeetingRequiresConfirmationEnable.value;

  set isLeaveTheMeetingRequiresConfirmationEnable(value) =>
      _isLeaveTheMeetingRequiresConfirmationEnable.value = value;
}
