import { StorageKey } from './constants'
import { StorageType } from './types'

export class Storage {
  storage: typeof localStorage | undefined

  constructor(storageType: StorageType) {
    if (typeof window === 'undefined') return
    switch (storageType) {
      case 'localStorage':
        this.storage = localStorage
        break
      case 'sessionStorage':
        this.storage = sessionStorage
        break
      default:
        this.storage = localStorage
        break
    }
  }

  get<T = Record<string, never>>(key: StorageKey): T | undefined {
    const valueString = this.storage?.getItem(key)
    if (!valueString) return undefined

    const valueObject: T = JSON.parse(valueString)
    return valueObject
  }

  set<T = Record<string, never>>(key: StorageKey, value: T) {
    const valueString = JSON.stringify(value)
    this.storage?.setItem(key, valueString)
  }

  remove(key: StorageKey) {
    this.storage?.removeItem(key)
  }

  clear() {
    this.storage?.clear()
  }
}
