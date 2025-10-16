// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:nemeeting/base/util/text_util.dart';
import 'package:nemeeting/utils/nav_register.dart';
import 'package:netease_meeting_kit/meeting_ui.dart';
import 'package:url_launcher/url_launcher_string.dart';
import '../utils/router_name.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:netease_common/netease_common.dart';

class NavUtils {
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static Future<bool> launchByURL(String url, {bool? forceWebView}) async {
    Uri uri = Uri.parse(url.trimLeft());
    if (Platform.isIOS) {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      bool result = false;
      String? error;
      try {
        result = await launchUrlString(url,
            mode: LaunchMode.externalNonBrowserApplication);
      } catch (e) {
        error = e.toString();
      }
      if (!result) {
        Alog.d(tag: 'NavUtils', content: 'Could not launch $url. $error');
      }
      return Future.value(result);
    }
  }

  static void exitApp() {
    if (Platform.isAndroid) {
      exitAndroid();
    } else {
      exit(0);
    }
  }

  static Future<void> exitAndroid() async {
    await SystemChannels.platform.invokeMethod('SystemNavigator.pop');
  }

  ///pageRoute:true 浮窗路由
  static Future<T?> pushNamed<T>(
    BuildContext context,
    String routeName, {
    Object? arguments,
    bool? pageRoute,
  }) {
    return (pageRoute ??
            NEMeetingKit.instance.getMeetingService().getMeetingStatus() ==
                    NEMeetingStatus.inMeetingMinimized ||
                NEMeetingKit.instance.getMeetingService().getMeetingStatus() ==
                    NEMeetingStatus.inMeeting)
        ? Navigator.push(
            context,
            RoutesRegister.getPageRoute(routeName, context,
                arguments: arguments) as Route<T>)
        : Navigator.of(context).pushNamed(routeName, arguments: arguments);
  }

  static Future<void> pushNamedAndRemoveUntil(
    BuildContext context,
    String routeName, {
    String? utilRouteName,
    Object? arguments,
    bool rootNavigator = false,
  }) {
    return Navigator.of(context, rootNavigator: rootNavigator)
        .pushNamedAndRemoveUntil(
      routeName,
      TextUtil.isEmpty(utilRouteName)
          ? (Route<dynamic> route) => false
          : withName(utilRouteName!),
      arguments: arguments,
    );
  }

  static RoutePredicate withName(String name) {
    return (Route<dynamic> route) {
      return !route.willHandlePopInternally &&
          route is ModalRoute &&
          route.settings.name == name;
    };
  }

  static void popAndPushNamed(
    BuildContext context,
    String routeName, {
    Object? arguments,
  }) {
    Navigator.of(context).popAndPushNamed(routeName, arguments: arguments);
  }

  static void pop(BuildContext context, {Object? arguments}) {
    Navigator.of(context).pop(arguments);
  }

  static void popUntil(BuildContext context, String pageRoute) {
    Navigator.of(context).popUntil(ModalRoute.withName(pageRoute));
  }

  static void closeCurrentState([dynamic result]) {
    navigatorKey.currentState?.pop(result);
  }

  static const int clickTimes = 5;
  static const int duration = 2 * 1000;
  static var mHits = List<int>.filled(clickTimes, 0);

  static void toEntrance(BuildContext context, {rootNavigator = false}) {
    NavUtils.pushNamedAndRemoveUntil(context, RouterName.entrance,
        rootNavigator: rootNavigator);
  }

  static Future<void> toMeetingCreate(BuildContext context) async {
    final settingsService = NEMeetingKit.instance.getSettingsService();
    final isAudioOn =
    await settingsService.isTurnOnMyAudioWhenJoinMeetingEnabled();
    final isVideoOn =
    await settingsService.isTurnOnMyVideoWhenJoinMeetingEnabled();
    NavUtils.pushNamed(
      context,
      RouterName.meetCreate,
      arguments: {
        'isTurnOnMyAudioWhenJoinMeetingEnabled': isAudioOn,
        'isTurnOnMyVideoWhenJoinMeetingEnabled': isVideoOn,
      },
    );
  }

  static Future<void> toMeetingJoin(BuildContext context) async {
    final settingsService = NEMeetingKit.instance.getSettingsService();
    final isAudioOn =
    await settingsService.isTurnOnMyAudioWhenJoinMeetingEnabled();
    final isVideoOn =
    await settingsService.isTurnOnMyVideoWhenJoinMeetingEnabled();
    NavUtils.pushNamed(
      context,
      RouterName.meetJoin,
      arguments: {
        'isTurnOnMyAudioWhenJoinMeetingEnabled': isAudioOn,
        'isTurnOnMyVideoWhenJoinMeetingEnabled': isVideoOn,
      },
    );
  }

  static Future<void> toMeetingJoinAndRemoveUntil(
      BuildContext context, {
        String? utilRouteName,
      }) async {
    final settingsService = NEMeetingKit.instance.getSettingsService();
    final isAudioOn =
    await settingsService.isTurnOnMyAudioWhenJoinMeetingEnabled();
    final isVideoOn =
    await settingsService.isTurnOnMyVideoWhenJoinMeetingEnabled();
    NavUtils.pushNamedAndRemoveUntil(
      context,
      RouterName.meetJoin,
      utilRouteName: utilRouteName,
      arguments: {
        'isTurnOnMyAudioWhenJoinMeetingEnabled': isAudioOn,
        'isTurnOnMyVideoWhenJoinMeetingEnabled': isVideoOn,
      },
    );
  }
}
