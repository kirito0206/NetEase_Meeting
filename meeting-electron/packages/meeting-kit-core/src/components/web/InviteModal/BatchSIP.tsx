import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import Toast from '../../common/toast'
import AddressBook from '../../common/AddressBook'
import NEMeetingService from '../../../services/NEMeeting'
import { NEMember, SaveSipCallItem, SearchAccountInfo } from '../../../types'
import useUserInfo from '../../../hooks/useUserInfo'
import { saveCallRecord } from '../../../utils/recordCall'

interface SIPBatchCallProps {
  className?: string
  onCalled?: () => void
  neMeeting: NEMeetingService
  memberList: NEMember[]
  inSipInvitingMemberList?: NEMember[]
  myUuid: string
}

const BatchSIP: React.FC<SIPBatchCallProps> = ({
  className,
  onCalled,
  neMeeting,
  memberList,
  inSipInvitingMemberList,
  myUuid,
}) => {
  const { t } = useTranslation()

  const [callLoading, setCallLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<SearchAccountInfo[]>(
    []
  )

  const selectedMemberUuids = useMemo(() => {
    return selectedMembers.map((item) => item.userUuid)
  }, [selectedMembers])

  const { getUserInfo } = useUserInfo()

  const onCallHandler = async () => {
    setCallLoading(true)
    try {
      await neMeeting?.callByUserUuids(selectedMemberUuids)
      const userInfo = getUserInfo()

      saveCallRecord(
        `nemeeting-call-${userInfo?.userUuid as string}`,
        selectedMembers as SaveSipCallItem[]
      )
      onCalled?.()
    } catch (err: unknown) {
      const knownError = err as { message: string; msg: string }

      Toast.fail(knownError.message)
    } finally {
      setCallLoading(false)
    }
  }

  const onMembersChange = (member: SearchAccountInfo, isChecked) => {
    if (isChecked && selectedMembers.length >= 10) {
      Toast.fail(
        t('sipCallMaxCount', {
          count: 10,
        })
      )
      return
    }

    const tmpSelectedMembers = [...selectedMembers]

    if (inSipInvitingMemberList && isChecked) {
      // 判断选中的人是否有在呼叫中的且是等待呼叫或者呼叫中的状态 有的话不允许选中
      const index = inSipInvitingMemberList.findIndex(
        (item) =>
          item.uuid === member.userUuid &&
          (item.inviteState === 1 || item.inviteState === 2)
      )

      if (index > -1) {
        Toast.fail(t('sipCallIsInInviting'))
        return
      }
    }

    if (isChecked && memberList) {
      // 判断选中的人是否有在会议中的 有的话不允许选中
      const index = memberList.findIndex(
        (item) => item.uuid === member.userUuid
      )

      if (index > -1) {
        Toast.fail(t('sipCallIsInMeeting'))
        return
      }
    }

    if (isChecked && !member.phoneNumber) {
      Toast.fail(t('sipContactNoNumber'))
      return
    }

    // 添加
    if (isChecked) {
      tmpSelectedMembers.push(member)
    } else {
      // 删除人员
      const index = tmpSelectedMembers.findIndex(
        (item) => item.userUuid === member.userUuid
      )

      if (index > -1) {
        tmpSelectedMembers.splice(index, 1)
      }
    }

    setSelectedMembers(tmpSelectedMembers)
  }

  // 添加disabled字段
  const memberSelectedList = useMemo(() => {
    return selectedMembers.map((item) => {
      return {
        ...item,
        disabled: !item.phoneNumber,
      }
    })
  }, [selectedMembers])

  return (
    <div className={`nemeeting-batch-call ${className || ''}`}>
      <AddressBook
        selectedMembers={memberSelectedList}
        maxCount={10}
        myUuid={myUuid}
        onChange={onMembersChange}
        neMeeting={neMeeting}
      />
      <div className={'nemeeting-SIP-batch-call-btn-wrap'}>
        <Button
          className="nemeeting-SIP-batch-call-btn"
          type="primary"
          size="large"
          disabled={selectedMemberUuids.length === 0}
          loading={callLoading}
          onClick={onCallHandler}
        >
          {t('sipCallPhone')}
        </Button>
      </div>
    </div>
  )
}

export default BatchSIP
