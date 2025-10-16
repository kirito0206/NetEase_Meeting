// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:nemeeting/auth/auth_widgets.dart';
import 'package:nemeeting/auth/login_sso.dart';
import 'package:nemeeting/base/util/global_preferences.dart';
import 'package:nemeeting/channel/deep_link_manager.dart';
import 'package:nemeeting/service/auth/auth_manager.dart';
import 'package:nemeeting/service/config/app_config.dart';
import 'package:nemeeting/utils/privacy_util.dart';
import 'package:nemeeting/utils/security_notice_util.dart';
import 'package:nemeeting/utils/state_utils.dart';
import 'package:nemeeting/widget/meeting_text_field.dart';
import 'package:nemeeting/widget/ne_widget.dart';
import 'package:netease_meeting_kit/meeting_ui.dart';
import 'package:url_launcher/url_launcher_string.dart';
import '../language/localizations.dart';
import '../uikit/utils/nav_utils.dart';
import '../uikit/utils/router_name.dart';
import '../uikit/values/asset_name.dart';
import '../uikit/values/colors.dart';
import '../uikit/values/fonts.dart';

enum _Edition {
  corp,
  trial,
}

class EntranceRoute extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _EntranceRouteState();
  }
}

class _EntranceRouteState extends PlatformAwareLifecycleBaseState
    with NESSOLoginControllerMixin {
  var _edition = _Edition.corp;
  final _corpCodeController = TextEditingController();
  var _hasInputChanged = false;
  bool showCorpCodeInput = false;

  @override
  void initState() {
    super.initState();

    ///需求默认加载未登录
    PrivacyUtil.privateAgreementChecked = false;
    AppNotificationManager().reset();
    GlobalPreferences().hasPrivacyDialogShowed.then((value) {
      if (value != true) {
        PrivacyUtil.showPrivacyDialog(context);
      }
    });

    DeepLinkManager().attach(context);

    /// 加载企业代码
    GlobalPreferences().savedCorpCode.then((value) {
      if (!mounted || value == null || _hasInputChanged) return;
      _corpCodeController.text = value;
    });

    /// 同意隐私政策弹窗后再显示输入框，解决vivo隐私检测问题
    GlobalPreferences().ensurePrivacyAgree().then((_) {
      setState(() {
        showCorpCodeInput = true;
      });
    });
  }

  @override
  Widget buildWithPlatform(BuildContext context) {
    Widget child = Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: false,
      body: SafeArea(
        child: Container(
          padding: EdgeInsets.symmetric(
            horizontal: 30,
          ),
          child: Column(
            children: <Widget>[
              SizedBox(
                height: 73.h,
              ),
              buildIcon(),
              if (_edition == _Edition.corp) ...[
                SizedBox(
                  height: 54,
                ),
                if (showCorpCodeInput) buildCorpCodeInput(),
                SizedBox(
                  height: 10,
                ),
                buildCorpLoginSubActions(),
                SizedBox(
                  height: 20,
                ),
                ListenableBuilder(
                  listenable: _corpCodeController,
                  builder: (context, child) {
                    return MeetingActionButton(
                      text: getAppLocalizations().authNextStep,
                      onTap: _corpCodeController.text.trim().isNotEmpty
                          ? launchCorpLogin
                          : null,
                    );
                  },
                ),
              ],
              if (_edition == _Edition.trial) ...[
                SizedBox(
                  height: 113,
                ),
                MeetingActionButton(
                  text: getAppLocalizations().authRegisterAndLogin,
                  onTap: launchTrialLogin,
                ),
              ],
              SizedBox(
                height: 24.h,
              ),
              PrivacyUtil.protocolTips(),
              Spacer(),
              if (_edition == _Edition.corp) buildCorpLoginBottomSubActions(),
              if (_edition == _Edition.trial) buildTrialLoginSubActions(),
              SizedBox(
                height: 16.h,
              ),
              Image.asset(
                AssetName.provider,
                fit: BoxFit.none,
              ),
              SizedBox(
                height: 10,
              ),
            ],
          ),
        ),
      ),
      // ]),
    );
    child = AutoHideKeyboard(
      child: child,
    );
    return PopScope(
      canPop: _edition == _Edition.corp,
      onPopInvoked: (didPop) {
        if (!didPop && _edition == _Edition.trial) {
          setState(() {
            _edition = _Edition.corp;
          });
        }
      },
      child: child,
    );
  }

  TextStyle buildTextStyle(Color color) {
    return TextStyle(
        color: color,
        fontSize: 12,
        fontWeight: FontWeight.w400,
        decoration: TextDecoration.none);
  }

  Widget buildCorpCodeInput() {
    return SizedBox(
      height: 44.h,
      child: MeetingTextField(
        prefixIcon: Icon(
          IconFont.icon_corp,
          color: AppColors.color_CDCFD7,
        ),
        controller: _corpCodeController,
        hintText: getAppLocalizations().authEnterCorpCode,
        textInputAction: TextInputAction.done,
        onEditingComplete: launchCorpLogin,
        onChanged: (_) => _hasInputChanged = true,
      ),
    );
  }

  Widget buildCorpLoginSubActions() {
    return Row(
      children: <Widget>[
        NEGestureDetector(
          onTap: () {
            launchUrlString(
              AppConfig().corpCodeIntroductionUrl,
              mode: LaunchMode.externalApplication,
            );
          },
          child: Text(
            getAppLocalizations().authHowToGetCorpCode,
            style: TextStyle(
              color: AppColors.blue_337eff,
              fontSize: 14.spMin,
            ),
          ),
        ),
      ],
    );
  }

  Widget buildCorpLoginBottomSubActions() {
    return SizedBox(
      height: 22,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          buildTextAction(getAppLocalizations().meetingJoin, () async {
            NavUtils.toMeetingJoin(context);
          }),
          Container(
            color: AppColors.colorE6E7EB,
            width: 1,
            height: 12,
            margin: EdgeInsets.symmetric(horizontal: 10),
          ),
          buildTextAction(getAppLocalizations().authLoginBySSO, () async {
            if (!await PrivacyUtil.ensurePrivacyAgree(context)) return;
            NavUtils.pushNamed(context, RouterName.ssoLogin,
                arguments: _corpCodeController.text.trim());
          }),
          Container(
            color: AppColors.colorE6E7EB,
            width: 1,
            height: 12,
            margin: EdgeInsets.symmetric(horizontal: 10),
          ),
          buildTextAction(getAppLocalizations().authLoginToTrialEdition, () {
            setState(() {
              _edition = _Edition.trial;
            });
          }),
        ],
      ),
    );
  }

  Widget buildTextAction(String action, VoidCallback callback) {
    return NEGestureDetector(
      onTap: callback,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10),
        child: Text(
          action,
          style: TextStyle(
            fontSize: 14,
            color: AppColors.color_8D90A0,
          ),
        ),
      ),
    );
  }

  Widget buildTrialLoginSubActions() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          getAppLocalizations().authHasCorpCode,
          style: TextStyle(
            color: AppColors.color_666666,
            fontSize: 14.spMin,
          ),
        ),
        NEGestureDetector(
          child: Text(
            getAppLocalizations().authLoginToCorpEdition,
            style: TextStyle(
              color: AppColors.blue_337eff,
              fontSize: 14.spMin,
            ),
          ),
          onTap: () {
            setState(() {
              _edition = _Edition.corp;
            });
          },
        ),
      ],
    );
  }

  int _tapCount = 0;
  int _tapTime = 0;

  Widget buildIcon() {
    return Container(
      width: 166,
      height: 157,
      child: Image.asset(
        AssetName.meet,
        //package: AssetName.package,
        fit: BoxFit.contain,
      ),
    );
  }

  @override
  void dispose() {
    PrivacyUtil.dispose();
    DeepLinkManager().detach(context);
    _corpCodeController.dispose();
    super.dispose();
  }

  void launchCorpLogin() async {
    if (!await PrivacyUtil.ensurePrivacyAgree(context)) return;
    doIfNetworkAvailable(() async {
      final corpCode = _corpCodeController.text.trim();
      LoadingUtil.showLoading();
      final result = await AuthManager().initialize(corpCode: corpCode);
      LoadingUtil.cancelLoading();
      final corpInfo = result.data;
      if (corpInfo == null) {
        ToastUtils.showToast(context, getAppLocalizations().authCorpNotFound);
        return;
      }

      /// 配置并强制使用 sso 登录
      if (corpInfo.isForceSSOLogin) {
        startSSOLoginByCorpInfo(corpInfo);
      } else {
        NavUtils.pushNamed(context, RouterName.corpAccountLogin,
            arguments: corpInfo);
      }
    });
  }

  //发起URS登录
  void launchTrialLogin() async {
    if (!await PrivacyUtil.ensurePrivacyAgree(context)) return;
    NavUtils.pushNamed(context, RouterName.mobileLogin);
  }
}
