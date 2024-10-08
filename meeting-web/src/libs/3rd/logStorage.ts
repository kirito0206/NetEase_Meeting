/*
 * @Description: 日志上报
 */

import LogStorage from '@netease-yunxin/log-storage'

export type LogName = 'meetingLog' | 'rtcLog' | 'imLog'
export type LogType = 'error' | 'warn' | 'info' | 'log' | 'debug'

let logger: LoggerWithStorage | null
class LoggerWithStorage {
  public meetingLog: LogStorage
  public rtcLog: LogStorage
  public imLog: LogStorage
  constructor() {
    this.meetingLog = new LogStorage('meeting')
    this.rtcLog = new LogStorage('rtc')
    this.imLog = new LogStorage('im')
  }

  public log(logName: LogName, logContent: string) {
    this.baseLog(logName, 'log', logContent)
  }

  public warn(logName: LogName, logContent: string) {
    this.baseLog(logName, 'warn', logContent)
  }

  public error(logName: LogName, logContent: string) {
    this.baseLog(logName, 'error', logContent)
  }

  public async getLog(
    logName: LogName,
    start = 0,
    end = Date.now(),
    logType?: LogType
  ) {
    return await this.logAction('get', logName, start, end, logType)
  }

  public async deleteLog(
    logName: LogName,
    start = 0,
    end = Date.now(),
    logType?: LogType
  ) {
    return await this.logAction('delete', logName, start, end, logType)
  }

  private async logAction(
    actionType: 'get' | 'delete',
    logName: LogName,
    start = 0,
    end = Date.now(),
    type?: LogType
  ) {
    return await this[logName][actionType]({
      start,
      end,
      type,
    })
  }

  private baseLog(
    logName: LogName,
    logType: LogType,
    logContent: string,
    subType?: any
  ): void {
    this[logName].log(logType, logContent, subType)
  }
}

export default {
  getInstance() {
    if (!logger) {
      logger = new LoggerWithStorage()
    }
    return logger
  },
  destroy() {
    logger = null
  },
}
