﻿// Copyright (c) 2022 NetEase, Inc. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

//
// Author: Ruan Liang <ruanliang@corp.netease.com>
// Date: 2011/6/12
//
// Modified by Wang Rongtao <rtwang@corp.netease.com>
// Date: 2013/9/17
//
// Utilities for file and filepath operation

#include "base/file/file_util.h"
#include "base/memory/scoped_std_handle.h"
#include "base/util/string_util.h"

#if defined(OS_POSIX)
#include <dirent.h>
#include <errno.h>
#include <sys/stat.h>
#endif  // OS_POSIX

namespace nbase {

#if defined(OS_POSIX)
const PathChar kEndChar = '\0';
const PathChar kFilePathSeparators[] = "/";
const PathChar kFilePathCurrentDirectory[] = ".";
const PathChar kFilePathParentDirectory[] = "..";
const PathChar kFilePathExtensionSeparator = '.';
#elif defined(OS_WIN)
const PathChar kEndChar = L'\0';
const PathChar kFilePathSeparators[] = L"\\/";
const PathChar kFilePathCurrentDirectory[] = L".";
const PathChar kFilePathParentDirectory[] = L"..";
const PathChar kFilePathExtensionSeparator = L'.';
#endif  // OS_WIN

bool IsFilePathSeparator(const PathChar separator) {
    if (separator == kEndChar)
        return false;

    size_t len = sizeof(kFilePathSeparators) / sizeof(PathChar);
    for (size_t i = 0; i < len; i++) {
        if (separator == kFilePathSeparators[i])
            return true;
    }

    return false;
}

bool IsFilePathSeparator(const PathString& separator) {
    if (separator.empty())
        return false;
    PathChar c = separator[0];
    return IsFilePathSeparator(c);
}

bool FilePathExtension(const PathString& filepath_in, PathString& extension_out) {
    if (filepath_in.size() == 0)
        return false;
    size_t pos = filepath_in.rfind(kFilePathExtensionSeparator);
    if (pos == PathString::npos)
        return false;
    extension_out = filepath_in.substr(pos, PathString::npos);
    return true;
}

bool FilePathApartDirectory(const PathString& filepath_in, PathString& directory_out) {
    size_t index = filepath_in.size() - 1;
    if (index <= 0 || filepath_in.size() == 0)
        return false;
    for (; index != 0; index--) {
        if (IsFilePathSeparator(filepath_in[index])) {
            if (index == filepath_in.size() - 1)
                directory_out = filepath_in;
            else
                directory_out = filepath_in.substr(0, index + 1);
            return true;
        }
    }
    return false;
}

bool FilePathApartFileName(const PathString& filepath_in, PathString& filename_out) {
    size_t index = filepath_in.size() - 1;
    if (index <= 0 || filepath_in.size() == 0)
        return false;
    for (; index != 0; index--) {
        if (IsFilePathSeparator(filepath_in[index])) {
            if (index == filepath_in.size() - 1)
                return false;
            filename_out = filepath_in.substr(index + 1, PathString::npos);
            return true;
        }
    }
    return false;
}

template <typename CharType>
bool ParsePathComponentsT(const CharType* path, const CharType* seperators, std::list<std::basic_string<CharType> >& components) {
    components.clear();
    if (path == NULL)
        return false;
    const CharType* prev = NULL;
    const CharType* next = path;
    const CharType* c;
    while (*next) {
        prev = next;
        // find the first seperator
        for (;;) {
            for (c = seperators; *c && *next != *c; c++)
                ;
            if (*c || !*next)
                break;
            next++;
        }
        components.push_back(std::basic_string<CharType>(prev, next - prev));
        if (*next)
            components.back().push_back(*seperators);
        // skip duplicated seperators
        for (++next;;) {
            for (c = seperators; *c && *next != *c; c++)
                ;
            if (!*c)
                break;
            next++;
        }
    }
    return true;
}

bool ParsePathComponents(const PathChar* path, std::list<PathString>& components) {
    return ParsePathComponentsT<PathChar>(path, kFilePathSeparators, components);
}

bool IsDirectoryComponent(const PathString& component) {
    if (component.empty())
        return false;
#if defined(OS_WIN)
    return *component.rbegin() == kFilePathSeparators[0] || *component.rbegin() == kFilePathSeparators[1];
#else
    return *component.rbegin() == kFilePathSeparators[0];
#endif  // OS_WIN
}

bool FilePathCompose(const PathString& directory_in, const PathString& filename_in, PathString& filepath_out) {
    PathString directory;
    if (!FilePathApartDirectory(directory_in, directory))
        return false;
    filepath_out = directory + filename_in;
    return true;
}

bool FilePathIsExist(const PathString& filepath_in, bool is_directory) {
    return FilePathIsExist((const PathChar*)filepath_in.c_str(), is_directory);
}

FILE* OpenFile(const PathString& filepath, const PathChar* mode) {
    return OpenFile(filepath.c_str(), mode);
}

bool CloseFile(FILE* file) {
    if (NULL == file)
        return true;
    return fclose(file) == 0;
}

int ReadFile(const PathString& filepath, void* data_out, size_t size) {
    return ReadFile(filepath.c_str(), data_out, size);
}

int WriteFile(const PathString& filepath, const std::string& data) {
    return WriteFile(filepath.c_str(), data.c_str(), data.size());
}

bool ReadFileToString(const PathString& filepath, std::string& out) {
    ScopedStdHandle file;
#if defined(OS_WIN)
    file.Reset(OpenFile(filepath.c_str(), L"rb"));
#else
    file.Reset(OpenFile(filepath.c_str(), "rb"));
#endif

    if (!file.Valid())
        return false;

    int64_t file_size = GetFileSize(filepath);
    if (file_size > std::numeric_limits<size_t>::max())
        return false;  // Too large

    bool read_ok = true;
    out.resize((size_t)file_size);
    if (!out.empty()) {
        read_ok = fread(&out[0], 1, out.size(), file) == out.size();
    }

    return read_ok;
}

}  // namespace nbase
