﻿// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

//
// Author: Ruan Liang <ruanliang@corp.netease.com>
// Date: 2011/11/6
//
// network utility function unittest

#if defined(WITH_UNITTEST)

#include "base/network/network_util.h"
#include <vector>
#include "gtest/gtest.h"

TEST(Network_Util, basic) {
    std::vector<std::string> ip_addresses;
    EXPECT_TRUE(nbase::GetIpAddressList(ip_addresses));

    std::vector<uint32_t> ip_addresses2;
    EXPECT_TRUE(nbase::GetIpAddressList(ip_addresses2));

    EXPECT_EQ(ip_addresses.size(), ip_addresses2.size());
    for (uint32_t i = 0; i < ip_addresses.size(); ++i) {
        EXPECT_EQ(ip_addresses2[i], nbase::InetStringToNumber(ip_addresses[i]));
        EXPECT_STREQ(ip_addresses[i].c_str(), nbase::InetNumberToString(ip_addresses2[i]).c_str());
    }

    std::string mac_address;
    EXPECT_TRUE(nbase::GetMacAddress(mac_address));

    EXPECT_TRUE(nbase::IsInternalIP(ip_addresses[0]));
    EXPECT_TRUE(nbase::IsInternalIP(ip_addresses2[0]));
    EXPECT_TRUE(nbase::IsInternalIP("192.168.147.148"));
    EXPECT_FALSE(nbase::IsInternalIP("123.127.31.28"));

    std::string ip = "192.168.147.148";
    uint16_t port = 443;
    std::string address = nbase::MakeNetAddress(ip, port);
    EXPECT_STREQ("192.168.147.148:443", address.c_str());

    uint32_t ip_out;
    uint16_t port_out;
    nbase::AnalyzeNetAddress(address, ip_out, port_out);
    EXPECT_EQ(port, port_out);
    EXPECT_EQ(nbase::InetStringToNumber(ip), ip_out);
}

#endif