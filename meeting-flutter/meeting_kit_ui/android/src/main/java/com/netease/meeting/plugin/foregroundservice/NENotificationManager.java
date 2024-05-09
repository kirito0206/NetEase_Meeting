// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

package com.netease.meeting.plugin.foregroundservice;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import java.lang.reflect.Method;

/** Created by hzsunyj on 2020/9/25. */
class NENotificationManager {

  android.app.NotificationManager manager;

  Notification mNotification;

  private static final NENotificationManager notificationManager = new NENotificationManager();

  public static NENotificationManager getInstance() {
    return notificationManager;
  }

  private NENotificationManager() {}

  android.app.NotificationManager getManager(Context context) {
    if (manager == null) {
      manager =
          (android.app.NotificationManager)
              context.getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
    }
    return manager;
  }

  Notification ensureNotification(Context context) {
    createForegroundNotificationChannel(context);
    // Notification ID cannot be 0.
    mNotification = buildForegroundNotification(context);
    return mNotification;
  }

  Notification getNotification() {
    Notification notification = mNotification;
    mNotification = null;
    return notification;
  }

  private void createForegroundNotificationChannel(Context context) {
    // Create the NotificationChannel, but only on API 26+ because
    // the NotificationChannel class is new and not in the support library
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      ForegroundServiceConfig config = NEForegroundService.getForegroundServiceConfig();
      if (config == null) {
        return;
      }
      CharSequence name = config.channelName;
      String description = config.channelDesc;
      int importance = android.app.NotificationManager.IMPORTANCE_DEFAULT;
      NotificationChannel channel = new NotificationChannel(config.channelId, name, importance);
      channel.setDescription(description);
      // Register the channel with the system; you can't change the importance
      // or other notification behaviors after this
      getManager(context).createNotificationChannel(channel);
    }
  }

  private Notification buildForegroundNotification(Context context) {
    ForegroundServiceConfig config = NEForegroundService.getForegroundServiceConfig();
    if (config == null) {
      return null;
    }
    Intent notificationIntent = new Intent();
    if (TextUtils.isEmpty(config.launchActivityName)) {
      config.launchActivityName = getNotificationLaunchActivityName(context);
    }
    notificationIntent.setComponent(new ComponentName(context, config.launchActivityName));
    int flag = PendingIntent.FLAG_UPDATE_CURRENT;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      flag |= PendingIntent.FLAG_IMMUTABLE;
    }
    PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, notificationIntent, flag);
    return new NotificationCompat.Builder(context, config.channelId)
        .setContentTitle(config.contentTitle)
        .setContentText(config.contentText)
        .setSmallIcon(config.smallIcon == 0 ? context.getApplicationInfo().icon : config.smallIcon)
        .setContentIntent(pendingIntent)
        .setTicker(config.ticker)
        .build();
  }

  public void cancelNotification(Context context, int notificationId) {
    getManager(context).cancel(notificationId);
  }

  /**
   * 获取通知栏要跳转的目标 Activity 类名
   *
   * @param context
   * @return
   */
  private static String getNotificationLaunchActivityName(Context context) {
    String activityClassName = null;
    try {
      Class<?> meetingKitCls = Class.forName("com.netease.yunxin.kit.meeting.sdk.NEMeetingKit");
      Method getInstanceMethod = meetingKitCls.getDeclaredMethod("getInstance");
      Object meetingKit = getInstanceMethod.invoke(null);
      Method getMeetingServiceMethod = meetingKitCls.getDeclaredMethod("getMeetingService");
      Object meetingService = getMeetingServiceMethod.invoke(meetingKit);
      Class<?> meetingServiceCls =
          Class.forName("com.netease.yunxin.kit.meeting.sdk.NEMeetingService");
      Method getMeetingActivityClass =
          meetingServiceCls.getDeclaredMethod("getMeetingActivityClass");
      Object meetingActivityClass = getMeetingActivityClass.invoke(meetingService);
      if (meetingActivityClass instanceof Class) {
        activityClassName = ((Class<?>) meetingActivityClass).getCanonicalName();
      }
    } catch (Throwable ignored) {
    }
    if (TextUtils.isEmpty(activityClassName)) {
      Intent forPackage =
          context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
      activityClassName = forPackage != null ? forPackage.getComponent().getClassName() : null;
    }
    Log.e("NENotificationManager", "getNotificationLaunchActivityName: " + activityClassName);
    return activityClassName;
  }
}
