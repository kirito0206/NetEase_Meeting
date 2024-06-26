﻿// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

#ifndef UI_CONTROL_CHECKBOX_H_
#define UI_CONTROL_CHECKBOX_H_

#pragma once

namespace ui {

template <typename InheritType = Control>
class UILIB_API OptionTemplate : public CheckBoxTemplate<InheritType> {
public:
    ~OptionTemplate();

    virtual void SetWindow(Window* pManager, Box* pParent, bool bInit = true) override;

    virtual void SetAttribute(const std::wstring& pstrName, const std::wstring& pstrValue) override;
    void SetGroup(const std::wstring& pStrGroupName);
    std::wstring GetGroup() const;
    virtual void Selected(bool bSelected, bool bTriggerEvent = false) override;
    virtual void Activate() override;

protected:
    std::wstring m_sGroupName;
};

#include "OptionImpl.h"

typedef OptionTemplate<Control> Option;
typedef OptionTemplate<Box> OptionBox;

}  // namespace ui

#endif  // UI_CONTROL_CHECKBOX_H_
