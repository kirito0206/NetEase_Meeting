﻿// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

//
// Wang Rongtao <rtwang@corp.netease.com>
// 2012/2/22
//
// a thread manager for iter-thread communicatios, etc.

#ifndef BASE_THREAD_THREAD_MANAGER_H_
#define BASE_THREAD_THREAD_MANAGER_H_

#include <map>
#include "base/base_export.h"
#include "base/forbid_copy.h"
#include "base/memory/ref_count.h"
#include "base/thread/framework_thread.h"

namespace nbase {
class MessageLoop;
class MessageLoopProxy;

class ThreadMap {
public:
    static ThreadMap* GetInstance();
    static bool AquireAccess();

    bool RegisterThread(int self_identifier);
    bool UnregisterThread();
    int QueryThreadId(const FrameworkThread* thread);
    scoped_refptr<MessageLoopProxy> GetMessageLoop(int identifier) const;
    FrameworkThread* QueryThreadInternal(int identifier) const;

    NLock lock_;
    std::map<int, FrameworkThread*> threads_;
};

// 使用ThreadManager可以极大地方便线程间通信
// 注意：只有受ThreadManager托管的线程（通过Register托管）才允许调用除Register和Post族外的成员函数
class BASE_EXPORT ThreadManager {
public:
    NBASE_FORBID_COPY(ThreadManager)

    // 托管当前FrameworkThread线程
    // identifier >= 0
    // 必须在self的线程过程内被调用
    static bool RegisterThread(int self_identifier);
    // 取消当前线程托管
    // 线程运行结束之前必须调用UnregisterThread取消托管
    static bool UnregisterThread();

    // 查找
    static FrameworkThread* CurrentThread();
    template <typename T>
    static T* CurrentThreadT();
    static scoped_refptr<MessageLoopProxy> QueryMessageLoop(int identifier);
    static int QueryThreadId(const FrameworkThread* thread);

    static bool PostTask(const StdClosure& task);
    static bool PostTask(int identifier, const StdClosure& task);

    static bool PostDelayedTask(const StdClosure& task, TimeDelta delay);
    static bool PostDelayedTask(int identifier, const StdClosure& task, TimeDelta delay);

    static bool PostNonNestableTask(const StdClosure& task);
    static bool PostNonNestableTask(int identifier, const StdClosure& task);

    static bool PostNonNestableDelayedTask(const StdClosure& task, TimeDelta delay);
    static bool PostNonNestableDelayedTask(int identifier, const StdClosure& task, TimeDelta delay);

    template <typename T1, typename T2>
    static bool Await(int identifier, const std::function<T1>& task, const std::function<T2>& reply) {
        scoped_refptr<MessageLoopProxy> message_loop = ThreadMap::GetInstance()->GetMessageLoop(identifier);
        if (message_loop == NULL)
            return false;
        message_loop->PostTaskAndReply(task, reply);
        return true;
    }
};

template <typename T>
T* ThreadManager::CurrentThreadT() {
    return static_cast<T*>(CurrentThread());
}

}  // namespace nbase

#endif  // BASE_THREAD_THREAD_MANAGER_H_
