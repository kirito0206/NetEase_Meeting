﻿// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

//
// Wang Rongtao <rtwang@corp.netease.com>
// 2013/10/11
//
// Aysnc modal dialog runner
//

#include "async_do_modal.h"
#include "async_modal_runner.h"

bool AsyncDoModal(ModalWndBase* dlg) {
    return AsyncModalRunnerManager::GetInstance()->DoModal(dlg);
}

void CancelAllAsyncModalDialogs() {
    AsyncModalRunnerManager::GetInstance()->CancelAllThreads();
}