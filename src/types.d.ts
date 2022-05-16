type ValueOf<T> = T[keyof T]

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
