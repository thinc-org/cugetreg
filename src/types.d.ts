export {}

type ValueOf<T> = T[keyof T]

declare global {
  interface Window {
    __APOLLO_STATE__: any
  }
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const url: string
  export default url
}

declare module 'use-react-screenshot' {
  export const useScreenshot
}
