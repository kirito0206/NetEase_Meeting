import { notification } from 'antd';
import './index.less';
import React, { useEffect, useRef } from 'react';
import MemberNotify, {
  MemberNotifyRef,
} from '@meeting-module/components/web/MemberNotify';

import { IPCEvent } from '@/types';

export default function MemberNotifyPage() {
  const [api, contextHolder] = notification.useNotification();
  const memberNotifyRef = useRef<MemberNotifyRef>(null);

  function handleViewMsg() {
    window.ipcRenderer?.send(IPCEvent.memberNotifyViewMemberMsg);
  }

  function onClose() {
    console.log('close>>>>.');
    if (window.isWins32) {
      // windows 需要延迟，否则整个弹框渲染不会因此，等下次显示会有上一次的停留
      setTimeout(() => {
        window.ipcRenderer?.send(IPCEvent.memberNotifyClose);
      }, 200);
    } else {
      window.ipcRenderer?.send(IPCEvent.memberNotifyClose);
    }
  }

  function onNotNotify() {
    window.ipcRenderer?.send(IPCEvent.memberNotifyNotNotify);
  }

  useEffect(() => {
    window.ipcRenderer?.on(IPCEvent.notifyShow, (_, arg) => {
      const { memberCount } = arg;

      memberNotifyRef.current?.notify(memberCount);
    });
    window.ipcRenderer?.on(IPCEvent.notifyHide, () => {
      memberNotifyRef.current?.destroy();
    });
    function handleMouseMove() {
      window.ipcRenderer?.send(IPCEvent.memberNotifyMourseMove);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.ipcRenderer?.removeAllListeners(IPCEvent.notifyShow);
      window.ipcRenderer?.removeAllListeners(IPCEvent.notifyHide);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return (
    <div className="nemtting-notify-page">
      {contextHolder}
      <MemberNotify
        style={{
          top: 0,
          right: 0,
        }}
        ref={memberNotifyRef}
        notificationApi={api}
        onClose={onClose}
        onNotNotify={onNotNotify}
        handleViewMsg={handleViewMsg}
      />
    </div>
  );
}
