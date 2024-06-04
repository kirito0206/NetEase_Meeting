import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NEMeetingService from '../../../../src/services/NEMeeting';
import useUserInfo from '../../../../src/hooks/useUserInfo';
import { Button } from 'antd';

import './index.less';
import AddressBook from '../../../../src/components/common/AddressBook';
import { Role, SearchAccountInfo } from '../../../../src/types';
import PCTopButtons from '../../../../src/components/common/PCTopButtons';
import { useGlobalContext } from '../../../../src/store';

export default function InvitePage() {
  const { t } = useTranslation();

  const replyCount = useRef(0);

  const { userInfo } = useUserInfo();

  const { globalConfig } = useGlobalContext();
  const [selectedMembers, setSelectedMembers] = useState<SearchAccountInfo[]>(
    [],
  );

  const scheduleMemberConfig = useMemo(() => {
    return globalConfig?.appConfig.MEETING_SCHEDULED_MEMBER_CONFIG;
  }, [globalConfig?.appConfig.MEETING_SCHEDULED_MEMBER_CONFIG]);
  const neMeeting = useMemo(() => {
    return new Proxy(
      {},
      {
        get: function (_, propKey) {
          return function (...args: any) {
            return new Promise((resolve, reject) => {
              const parentWindow = window.parent;
              const replyKey = `addressBookMeetingReply_${replyCount.current++}`;
              parentWindow?.postMessage(
                {
                  event: 'neMeeting',
                  payload: {
                    replyKey,
                    fnKey: propKey,
                    args: args,
                  },
                },
                parentWindow.origin,
              );
              const handleMessage = (e: MessageEvent) => {
                const { event, payload } = e.data;
                if (event === replyKey) {
                  const { result, error } = payload;
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                  window.removeEventListener('message', handleMessage);
                }
              };
              window.addEventListener('message', handleMessage);
            });
          };
        },
      },
    ) as NEMeetingService;
  }, []);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const { event, payload } = e.data;
      if (event === 'updateData') {
        const { selectedMembers } = payload;
        setSelectedMembers(selectedMembers);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const onCancelHandler = () => {
    const parentWindow = window.parent;
    parentWindow.postMessage(
      {
        event: 'onAddressBookCancelHandler',
      },
      parentWindow.origin,
    );
    window.close();
  };

  const onConfirmHandler = () => {
    const parentWindow = window.parent;
    parentWindow.postMessage(
      {
        event: 'onAddressBookConfirmHandler',
      },
      parentWindow.origin,
    );
    window.close();
  };

  const onMembersChangeHandler = (
    member: SearchAccountInfo,
    isChecked: boolean,
  ) => {
    const parentWindow = window.parent;
    parentWindow.postMessage(
      {
        event: 'onMembersChangeHandler',
        payload: {
          member,
          isChecked,
        },
      },
      parentWindow.origin,
    );
  };

  const onRoleChange = (uuid: string, role?: Role) => {
    const parentWindow = window.parent;
    parentWindow.postMessage(
      {
        event: 'onRoleChange',
        payload: {
          uuid,
          role,
        },
      },
      parentWindow.origin,
    );
  };

  return (
    <div className="addressBook-page">
      <div className="electron-drag-bar">
        <div className="drag-region" />
        {t('meetingAttendees')}
        <PCTopButtons minimizable={false} maximizable={false} />
      </div>
      {neMeeting && (
        <div style={{ marginTop: '20px' }}>
          <AddressBook
            sortByRole
            selectedMembers={selectedMembers}
            maxCount={scheduleMemberConfig?.max}
            maxCoHostCount={scheduleMemberConfig?.coHostLimit}
            myUuid={userInfo?.userUuid || ''}
            onChange={onMembersChangeHandler}
            onRoleChange={onRoleChange}
            neMeeting={neMeeting}
            showMore={true}
          />
          <div className="nemeeting-address-confirm-wrapper">
            <Button
              className="nemeeting-address-confirm-cancel"
              style={{ width: '120px' }}
              shape="round"
              size="large"
              onClick={onCancelHandler}
            >
              {t('globalCancel')}
            </Button>
            <Button
              style={{ width: '120px' }}
              type="primary"
              shape="round"
              size="large"
              disabled={selectedMembers.length === 0}
              onClick={onConfirmHandler}
            >
              {t('globalSure')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}