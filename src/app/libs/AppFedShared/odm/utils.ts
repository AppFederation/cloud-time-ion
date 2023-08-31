export function dateToStringSuitableForId(nowDate: Date) {
  return nowDate.toISOString()
    .replace('T', '__')
    .replace(/:/g, '.')
}

export function getNowTimePointSuitableForId() {
  const nowDate = new Date()
  return dateToStringSuitableForId(nowDate)
}
