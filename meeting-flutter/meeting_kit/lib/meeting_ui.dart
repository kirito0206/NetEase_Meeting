// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

library meeting_ui;

import 'dart:async';
import 'dart:collection';
import 'dart:convert';
import 'dart:io';
import 'dart:ui';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:extended_text/extended_text.dart';
import 'package:extended_text_field/extended_text_field.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:intl/intl.dart' as MeetingDateFormat show DateFormat;
import 'package:netease_common/netease_common.dart';
import 'package:netease_meeting_kit/meeting_feedback.dart';
import 'package:netease_meeting_kit/meeting_kit.dart';
import 'package:netease_meeting_kit/meeting_core.dart';
import 'dart:math';
import 'package:netease_meeting_kit/meeting_plugin.dart';
import 'package:netease_meeting_kit/meeting_assets.dart';
import 'package:netease_meeting_kit/meeting_localization.dart';
import 'package:uuid/uuid.dart';
import 'package:image_size_getter/file_input.dart';
import 'package:image_size_getter/image_size_getter.dart' as isg;
import 'package:open_file/open_file.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

import 'package:netease_roomkit/netease_roomkit.dart';
import 'package:netease_roomkit_interface/netease_roomkit_interface.dart';
import 'package:path_provider/path_provider.dart';
import 'package:file_picker/file_picker.dart';
import 'package:bot_toast/bot_toast.dart';
import 'package:async/async.dart';
import 'package:path/path.dart' as path;
import 'package:crypto/crypto.dart' show md5;
import 'package:convert/convert.dart' as meetingHex show hex;
import 'package:cached_network_image/cached_network_image.dart'
    as MeetingCachedNetworkImage show CachedNetworkImage;
import 'package:flutter_contacts/flutter_contacts.dart';
import 'package:azlistview_plus/azlistview_plus.dart';
import 'package:lpinyin/lpinyin.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:vibration/vibration.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:sqflite/sqflite.dart';

export 'package:netease_meeting_kit/meeting_kit.dart';
export 'package:netease_meeting_kit/meeting_plugin.dart'
    show NEForegroundServiceConfig;
export 'package:netease_meeting_kit/meeting_localization.dart';
export 'package:netease_meeting_kit/meeting_assets.dart';
export 'dart:math' show max, min;
export 'package:flutter/services.dart';

part 'src/meeting_ui/arguments/meeting_arguments.dart';
part 'src/meeting_ui/arguments/meeting_options.dart';
part 'src/meeting_ui/arguments/members_arguments.dart';
part 'src/meeting_ui/arguments/security_arguments.dart';
part 'src/meeting_ui/arguments/chatroom_arguments.dart';
part 'src/meeting_ui/option/meeting_options.dart';
part 'src/meeting_ui/pages/meeting_members_page.dart';
part 'src/meeting_ui/pages/meeting_chatroom_members_page.dart';
part 'src/meeting_ui/pages/meeting_select_host_page.dart';
part 'src/meeting_ui/pages/meeting_page.dart';
part 'src/meeting_ui/pages/meeting_security_page.dart';
part 'src/meeting_ui/pages/meeting_setting_page.dart';
part 'src/meeting_ui/pages/meeting_chat_permission_page.dart';
part 'src/meeting_ui/pages/meeting_chatroom_page.dart';
part 'src/meeting_ui/pages/meeting_info_page.dart';
part 'src/meeting_ui/pages/meeting_notify_message.dart';
part 'src/meeting_ui/pages/meeting_local_contacts_page.dart';
part 'src/meeting_ui/helper/meeting_barrage_helper.dart';
part 'src/meeting_ui/helper/emoji_response_helper.dart';
part 'src/meeting_ui/helper/hands_up_helper.dart';
part 'src/meeting_ui/helper/select_host_helper.dart';
part 'src/meeting_ui/manager/waiting_room_manager.dart';
part 'src/meeting_ui/manager/active_speaker_manager.dart';
part 'src/meeting_ui/manager/chatroom_manager.dart';
part 'src/meeting_ui/manager/chatroom_instance_manager.dart';
part 'src/meeting_ui/manager/local_settings.dart';
part 'src/meeting_ui/manager/interpretation_controller.dart';
part 'src/meeting_ui/manager/transcription_controller.dart';
part 'src/meeting_ui/manager/sip_call_record_dao.dart';
part 'src/meeting_ui/manager/sip_call_out_room_record_dao.dart';
part 'src/meeting_ui/manager/database_helper.dart';
part 'src/meeting_ui/manager/ai_summary_controller.dart';
part 'src/meeting_ui/pages/transcription_ui.dart';
part 'src/meeting_ui/state/meeting_state.dart';
part 'src/meeting_ui/values/colors.dart';
part 'src/meeting_ui/widget/text_watermark.dart';
part 'src/meeting_ui/widget/meeting_duration.dart';
part 'src/meeting_ui/widget/slider_widget.dart';
part 'src/meeting_ui/widget/round_slider_trackshape.dart';
part 'src/meeting_ui/widget/meeting_card.dart';
part 'src/meeting_ui/widget/meeting_barrage.dart';
part 'src/meeting_ui/widget/popup_contacts.dart';
part 'src/meeting_ui/widget/popup_contacts_add.dart';
part 'src/meeting_ui/widget/dots_indicator.dart';
part 'src/meeting_ui/widget/contact_list.dart';
part 'src/meeting_ui/widget/pointer_event_aware.dart';
part 'src/meeting_ui/widget/list_tiles.dart';
part 'src/meeting_ui/widget/cloud_recording_biz.dart';
part 'src/meeting_ui/service/meeting_ui_kit.dart';
part 'src/meeting_ui/service/meeting_ui_kit_invite_service.dart';
part 'src/meeting_ui/service/meeting_ui_kit_screensharing_service.dart';
part 'src/meeting_ui/utils/meeting_ui_service_helper.dart';
part 'src/meeting_ui/pages/meeting_verify_password_page.dart';
part 'src/meeting_ui/pages/meeting_waiting_room_page.dart';
part 'src/meeting_ui/arguments/meeting_waiting_arguments.dart';
part 'src/meeting_ui/arguments/meeting_base_arguments.dart';
part 'src/meeting_ui/arguments/sip_call_arguments.dart';
part 'src/meeting_ui/const/consts.dart';
part 'src/meeting_ui/values/integration_core_test.dart';
part 'src/meeting_ui/pages/meeting_beauty_setting_page.dart';
part 'src/meeting_ui/pages/meeting_live_page.dart';
part 'src/meeting_ui/pages/meeting_live_setting_page.dart';
part 'src/meeting_ui/pages/meeting_pre_virtual_background_page.dart';
part 'src/meeting_ui/pages/meeting_chat_message_detail.dart';
part 'src/meeting_ui/pages/meeting_sip_call_page.dart';
part 'src/meeting_ui/pages/meeting_sip_call_room_page.dart';
part 'src/meeting_ui/pages/meeting_interpretation.dart';
part 'src/meeting_ui/pages/meeting_notification_manager.dart';
part 'src/meeting_ui/arguments/live_arguments.dart';
part 'src/meeting_ui/menu/meeting_menus.dart';
part 'src/meeting_ui/menu/base_widgets.dart';
part 'src/meeting_ui/widget/popup_menu_widget.dart';
part 'src/meeting_ui/widget/chat_menu_widget.dart';
part 'src/meeting_ui/widget/triangle_painter.dart';
part 'src/meeting_ui/widget/localizations.dart';
part 'src/meeting_ui/widget/draggable_positioned.dart';
part 'src/meeting_ui/widget/emojis_panel.dart';
part 'src/meeting_ui/widget/meeting_kit_config.dart';
part 'src/meeting_ui/widget/meeting_page_route.dart';
part 'src/meeting_ui/widget/meeting_avatar.dart';
part 'src/meeting_ui/widget/meeting_biz_widgets.dart';
part 'src/meeting_ui/widget/invite/meeting_app_inviting.dart';
part 'src/meeting_ui/widget/emoji_response_panel.dart';
part 'src/meeting_ui/widget/ripple_animation.dart';
part 'src/meeting_ui/widget/meeting_member_page_view.dart';
part 'src/meeting_ui/widget/meeting_popup_page.dart';
part 'src/meeting_ui/module_name.dart';
part 'src/meeting_ui/option/window_mode.dart';
part 'src/meeting_ui/pages/meeting_whiteboard_page.dart';
part 'src/meeting_ui/pages/meeting_virtual_background_page.dart';
part 'src/meeting_ui/service/in_meeting_service.dart';
part 'src/meeting_ui/service/meeting_context.dart';
part 'src/meeting_ui/widget/animated_micphone_volume.dart';
part 'src/meeting_ui/service/menu/menu_item.dart';
part 'src/meeting_ui/service/menu/menu_action_items.dart';
part 'src/meeting_ui/service/menu/menu_item_util.dart';
part 'src/meeting_ui/service/menu/menu_items.dart';
part 'src/meeting_ui/service/model/meeting_status.dart';
part 'src/meeting_ui/pages/meeting_web_app_page.dart';
part 'src/meeting_ui/uikit/lifecycle/state_lifecycle.dart';
part 'src/meeting_ui/uikit/state/lifecycle_base_state.dart';
part 'src/meeting_ui/uikit/state/popup_base_state.dart';
part 'src/meeting_ui/uikit/state/base_state.dart';
part 'src/meeting_ui/uikit/loading.dart';
part 'src/meeting_ui/uikit/nav_utils.dart';
part 'src/meeting_ui/uikit/dialog_utils.dart';
part 'src/meeting_ui/uikit/clear_icon_button.dart';
part 'src/meeting_ui/uikit/dropdown_icon_button.dart';
part 'src/meeting_ui/uikit/toast_utils.dart';
part 'src/meeting_ui/uikit/bottom_sheet_utils.dart';
part 'src/meeting_ui/uikit/invite_dialog.dart';
part 'src/meeting_ui/values/event_name.dart';
part 'src/meeting_ui/uikit/style/app_style_util.dart';
part 'src/meeting_ui/uikit/permission/permission_helper.dart';
part 'src/meeting_ui/uikit/helpers.dart';
part 'src/meeting_ui/uikit/timer_button.dart';
part 'src/meeting_ui/uikit/state/platform_aware_lifecycle_base_state.dart';
part 'src/meeting_ui/widget/meeting_base_widget.dart';
part 'src/meeting_ui/widget/invite/meeting_invite_overlay.dart';
part 'src/meeting_ui/widget/invite/meeting_invite_wrapper.dart';

part 'src/meeting_ui/utils/image_size_getter.dart';
part 'src/meeting_ui/widget/floating/native_pip_switcher.dart';
part 'src/meeting_ui/widget/floating/pip_view.dart';
part 'src/meeting_ui/widget/floating/raw_pip_view.dart';
part 'src/meeting_ui/widget/floating/gesture_zoombox.dart';
part 'src/meeting_ui/utils/utils.dart';
part 'src/meeting_ui/utils/meeting_time_util.dart';
part 'src/meeting_ui/utils/meeting_string_util.dart';
part 'src/meeting_ui/utils/rtc_utils.dart';
part 'src/meeting_ui/utils/timezone_util.dart';
part 'src/meeting_ui/utils/length_text_input_formatter.dart';
part 'src/meeting_ui/utils/meeting_notify_center_action.dart';
part 'src/meeting_ui/widget/auto_pop_scope.dart';
part 'src/meeting_ui/widget/pop_scope_builder.dart';
part 'src/meeting_ui/widget/auto_hide_keyboard.dart';
part 'src/meeting_ui/widget/text_span/builder/meeting_text_span_builder.dart';
part 'src/meeting_ui/widget/text_span/image_text.dart';
part 'src/meeting_ui/widget/text_span/leading_text.dart';
part 'src/meeting_ui/widget/action_sheet.dart';

part 'src/meeting_ui/router/meeting_ui_state.dart';
part 'src/meeting_ui/router/meeting_ui_router.dart';

class MeetingCore {
  static MeetingCore? _instance;
  static const _tag = 'MeetingCore';

  factory MeetingCore() {
    return _instance ??= MeetingCore._internal();
  }

  MeetingCore._internal();

  Future<NEForegroundServiceConfig?> getForegroundConfig() async {
    final foregroundConfig =
        CoreRepository().initedConfig?.foregroundServiceConfig;
    if (foregroundConfig != null) return foregroundConfig;
    if (Platform.isAndroid) {
      final sdkInt = await DeviceInfoPlugin()
          .androidInfo
          .then((value) => value.version.sdkInt);
      // // Android Q以上屏幕共享需要一个前台Service
      if (sdkInt >= 29) {
        var localizations = NEMeetingUIKit.instance.getUIKitLocalizations();
        return NEForegroundServiceConfig(
          contentTitle: localizations.meetingNotificationContentTitle,
          contentText: localizations.meetingNotificationContentText,
          ticker: localizations.meetingNotificationContentTicker,
          channelId: localizations.meetingNotificationChannelId,
          channelName: localizations.meetingNotificationChannelName,
          channelDesc: localizations.meetingNotificationChannelDesc,
        );
      }
    }
    return null;
  }

  NEMeetingEvent _meetingStatus = NEMeetingEvent(NEMeetingStatus.idle);

  NEMeetingEvent get meetingStatus => _meetingStatus;

  final StreamController<NEMeetingEvent> _meetingStatusController =
      StreamController<NEMeetingEvent>.broadcast();

  Stream<NEMeetingEvent> get meetingStatusStream =>
      _meetingStatusController.stream;

  void notifyStatusChange(NEMeetingEvent status) {
    Alog.i(
        tag: _tag,
        moduleName: _moduleName,
        content: 'meeting sdk notifyStatusChange status = ${status.status}');
    _meetingStatus = status;
    _meetingStatusController.add(status);
  }
}

NEResult<void> handleMeetingResultCode(int code, [String? msg]) {
  final localizations = NEMeetingUIKit.instance.getUIKitLocalizations();
  if (code == MeetingErrorCode.success) {
    return NEResult<void>(code: NEMeetingErrorCode.success, msg: msg);
  } else if (code == MeetingErrorCode.meetingAlreadyExists ||
      code == MeetingErrorCode.meetingAlreadyStarted) {
    return NEResult<void>(
        code: NEMeetingErrorCode.meetingAlreadyExist, msg: msg);
  } else if (code == MeetingErrorCode.networkError) {
    return NEResult<void>(
        code: NEMeetingErrorCode.noNetwork,
        msg: localizations.networkUnavailableCheck);
  } else if (code == MeetingErrorCode.unauthorized) {
    return NEResult<void>(
        code: NEMeetingErrorCode.noAuth,
        msg: msg ?? localizations.unauthorized);
  } else if (code == MeetingErrorCode.roomLock) {
    return NEResult<void>(
        code: NEMeetingErrorCode.meetingLocked,
        msg: localizations.meetingLocked);
  } else if (code == MeetingErrorCode.meetingNotInProgress) {
    return NEResult<void>(
        code: NEMeetingErrorCode.meetingNotInProgress,
        msg: localizations.meetingNotExist);
  } else if (code == NEMeetingErrorCode.meetingNotExist) {
    return NEResult<void>(
        code: NEMeetingErrorCode.meetingNotExist,
        msg: localizations.meetingNotExist);
  } else {
    return NEResult<void>(code: code, msg: msg);
  }
}
