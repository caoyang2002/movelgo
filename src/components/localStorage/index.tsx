/**
 *
 * @param key 键 string
 * @param value 值 string
 */
export function localStrSave(key: string, value: string) {
  // 存储字符串到localStorage
  localStorage.setItem(key, value)
}

/**
 *
 * @param key 键 string
 * @param obj 对象 object
 */
export function localObjSave(key: string, obj: object) {
  // 存储对象到localStorage，使用JSON.stringify转换对象为字符串
  localStorage.setItem(key, JSON.stringify(obj))
}

/**
 *
 * @param key 键
 * @returns
 */
export function localRead(key: string) {
  // 从localStorage获取数据
  const content = localStorage.getItem(key)
  if (content === null) {
    console.log('No data found for the given key.')
    return null
  }
  try {
    // 尝试将字符串转换为对象
    const storedObject = JSON.parse(content)
    console.log(storedObject)
    return storedObject
  } catch (error) {
    console.error('Failed to parse stored data:', error)
    return content // 返回原始字符串，或根据需要进行处理
  }
}
