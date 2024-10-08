cmake_minimum_required(VERSION 3.28)
project(room_kit_node)

set(CMAKE_CXX_STANDARD 14)

include_directories(build)
include_directories(build/Release)
include_directories(build/Release/nertc_sdk_Mac.framework)
include_directories(build/Release/nertc_sdk_Mac.framework/Headers)
include_directories(build/Release/nertc_sdk_Mac.framework/Versions)
include_directories(build/Release/nertc_sdk_Mac.framework/Versions/A)
include_directories(build/Release/nertc_sdk_Mac.framework/Versions/A/Headers)
include_directories(build/Release/nertc_sdk_Mac.framework/Versions/Current)
include_directories(build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers)
include_directories(darwin-universal)
include_directories(darwin-universal/include)
include_directories(darwin-universal/include/controller)
include_directories(darwin-universal/include/nertc)
include_directories(darwin-universal/lib)
include_directories(darwin-universal/lib/nertc_sdk_Mac.framework)
include_directories(darwin-universal/lib/nertc_sdk_Mac.framework/Headers)
include_directories(darwin-universal/lib/nertc_sdk_Mac.framework/Versions)
include_directories(darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A)
include_directories(darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers)
include_directories(darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current)
include_directories(darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers)
include_directories(node-sdk)
include_directories(node-sdk/mac)
include_directories(node-sdk/mac/neroom-node-sdk)
include_directories(node-sdk/mac/neroom-node-sdk/build)
include_directories(node-sdk/mac/neroom-node-sdk/build/Release)
include_directories(node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework)
include_directories(node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Headers)
include_directories(node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions)
include_directories(node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A)
include_directories(node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers)
include_directories(node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current)
include_directories(node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers)
include_directories(sources)
include_directories(sources/common)
include_directories(sources/sdk_helper)

add_executable(room_kit_node
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_audio_device_manager.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_base.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_base_types.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_beauty.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_channel.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_channel_event_handler.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_device_collection.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_defines.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_event_handler.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_event_handler_ex.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_ex.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_media_stats_observer.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_predecode_observer.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_video_encoder_qos_observer.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_error_code.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_introduction-cn.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_introduction.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_video_device_manager.h
        build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_warn_code.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_audio_device_manager.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_base.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_base_types.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_beauty.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_channel.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_channel_event_handler.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_device_collection.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_defines.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_event_handler.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_event_handler_ex.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_ex.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_media_stats_observer.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_predecode_observer.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_video_encoder_qos_observer.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_error_code.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_introduction-cn.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_introduction.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_video_device_manager.h
        build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_warn_code.h
        darwin-universal/include/controller/annotation_ctrl_interface.h
        darwin-universal/include/controller/app_invite_ctrl_interface.h
        darwin-universal/include/controller/base_ctrl_interface.h
        darwin-universal/include/controller/chat_ctrl_interface.h
        darwin-universal/include/controller/live_ctrl_interface.h
        darwin-universal/include/controller/pre_rtc_ctrl_interface.h
        darwin-universal/include/controller/rtc_ctrl_interface.h
        darwin-universal/include/controller/sip_ctrl_interface.h
        darwin-universal/include/controller/waiting_room_ctrl_interface.h
        darwin-universal/include/controller/whiteboard_ctrl_interface.h
        darwin-universal/include/nertc/nertc_audio_device_manager.h
        darwin-universal/include/nertc/nertc_base.h
        darwin-universal/include/nertc/nertc_base_types.h
        darwin-universal/include/nertc/nertc_beauty.h
        darwin-universal/include/nertc/nertc_channel.h
        darwin-universal/include/nertc/nertc_channel_event_handler.h
        darwin-universal/include/nertc/nertc_device_collection.h
        darwin-universal/include/nertc/nertc_engine.h
        darwin-universal/include/nertc/nertc_engine_defines.h
        darwin-universal/include/nertc/nertc_engine_event_handler.h
        darwin-universal/include/nertc/nertc_engine_event_handler_ex.h
        darwin-universal/include/nertc/nertc_engine_ex.h
        darwin-universal/include/nertc/nertc_engine_media_stats_observer.h
        darwin-universal/include/nertc/nertc_engine_predecode_observer.h
        darwin-universal/include/nertc/nertc_engine_video_encoder_qos_observer.h
        darwin-universal/include/nertc/nertc_error_code.h
        darwin-universal/include/nertc/nertc_introduction-cn.h
        darwin-universal/include/nertc/nertc_introduction.h
        darwin-universal/include/nertc/nertc_video_device_manager.h
        darwin-universal/include/nertc/nertc_warn_code.h
        darwin-universal/include/auth_service_interface.h
        darwin-universal/include/base_service_interface.h
        darwin-universal/include/base_type_defines.h
        darwin-universal/include/error_code_defines.h
        darwin-universal/include/message_service_interface.h
        darwin-universal/include/nos_service_interface.h
        darwin-universal/include/preview_room_context_interface.h
        darwin-universal/include/preview_room_listener.h
        darwin-universal/include/room_context_interface.h
        darwin-universal/include/room_kit_interface.h
        darwin-universal/include/room_kit_listener.h
        darwin-universal/include/room_listener.h
        darwin-universal/include/room_service_interface.h
        darwin-universal/include/waiting_room_listener.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_audio_device_manager.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_base.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_base_types.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_beauty.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_channel.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_channel_event_handler.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_device_collection.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_defines.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_event_handler.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_event_handler_ex.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_ex.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_media_stats_observer.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_predecode_observer.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_video_encoder_qos_observer.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_error_code.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_introduction-cn.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_introduction.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_video_device_manager.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_warn_code.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_audio_device_manager.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_base.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_base_types.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_beauty.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_channel.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_channel_event_handler.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_device_collection.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_defines.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_event_handler.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_event_handler_ex.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_ex.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_media_stats_observer.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_predecode_observer.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_video_encoder_qos_observer.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_error_code.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_introduction-cn.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_introduction.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_video_device_manager.h
        darwin-universal/lib/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_warn_code.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_audio_device_manager.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_base.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_base_types.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_beauty.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_channel.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_channel_event_handler.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_device_collection.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_defines.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_event_handler.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_event_handler_ex.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_ex.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_media_stats_observer.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_predecode_observer.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_engine_video_encoder_qos_observer.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_error_code.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_introduction-cn.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_introduction.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_video_device_manager.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/A/Headers/nertc_warn_code.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_audio_device_manager.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_base.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_base_types.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_beauty.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_channel.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_channel_event_handler.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_device_collection.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_defines.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_event_handler.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_event_handler_ex.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_ex.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_media_stats_observer.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_predecode_observer.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_engine_video_encoder_qos_observer.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_error_code.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_introduction-cn.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_introduction.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_video_device_manager.h
        node-sdk/mac/neroom-node-sdk/build/Release/nertc_sdk_Mac.framework/Versions/Current/Headers/nertc_warn_code.h
        source/event_handler.cc
        source/event_handler.h
        source/sdk_helper/async_operation.cc
        source/sdk_helper/nim_node_async_queue.cc
        source/sdk_helper/nim_node_async_queue.h
        source/sdk_helper/node_api_helper.cc
        source/sdk_helper/node_api_helper.h
        source/sdk_helper/superfasthash.cc
        source/addon.cc
        source/room_kit_wrap.cc
        source/room_kit_wrap.h
        source/room_service_wrap.cc
        source/room_service_wrap.h
        source/room_auth_service_wrap.cc
        source/room_auth_service_wrap.h
        source/room_nos_service_wrap.cc
        source/room_nos_service_wrap.h
        source/room_rtc_controller_wrap.cc
        source/room_rtc_controller_wrap.h
        source/room_preview_room_rtc_controller_wrap.cc
        source/room_preview_room_rtc_controller_wrap.h
        source/room_preview_room_context_wrap.cc
        source/room_preview_room_context_wrap.h
        source/room_preview_room_listener.cc
        source/room_preview_room_listener.h
        source/room_context_wrap.cc
        source/room_context_wrap.h
        source/room_live_controller_wrap.cc
        source/room_live_controller_wrap.h
        source/room_whiteboard_controller_wrap.cc
        source/room_whiteboard_controller_wrap.h
        source/room_annotation_controller_wrap.cc
        source/room_annotation_controller_wrap.h
        source/room_chat_controller_wrap.cc
        source/room_chat_controller_wrap.h
        source/room_message_channel_service_wrap.cc
        source/room_message_channel_service_wrap.h
        source/room_message_channel_listener.cc
        source/room_message_channel_listener.h
        source/room_member_wrap.cc
        source/room_member_wrap.h
        source/room_context_listener.cc
        source/room_context_listener.h
        source/room_rtc_stats_listener.cc
        source/room_rtc_stats_listener.h
        source/room_whiteboard_view.cc
        source/room_whiteboard_view.h
        source/room_annotation_view.cc
        source/room_annotation_view.h
        source/room_global_event_listener.cc
        source/room_global_event_listener.h
        source/room_auth_event_listener.cc
        source/room_auth_event_listener.h
        source/sdk_helper/neroom_node_helper.cc
        source/sdk_helper/neroom_node_helper.h
        source/room_waiting_room_controller_wrap.cc
        source/room_waiting_room_controller_wrap.h
        source/room_waiting_room_listener.cc
        source/room_waiting_room_listener.h
        source/room_sip_controller_wrap.cc
        source/room_sip_controller_wrap.h
        source/room_app_invite_controller_wrap.cc
        source/room_app_invite_controller_wrap.h
        source/room_listeners_manager.cc
        source/room_listeners_manager.h
        )
