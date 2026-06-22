import { Md5 } from 'ts-md5'

function getUuid() {
  let date = new Date().getTime()

  if (window.performance && typeof window.performance.now === 'function') {
    date += performance.now()
  }

  const uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (date + Math.random() * 16) % 16 | 0

      date = Math.floor(date / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )

  return uuid
}

const passwordHash = '@yiyong.im'

export function md5Password(password: string) {
  return Md5.hashStr(password + passwordHash)
}

export { getUuid }
