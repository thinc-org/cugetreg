type ValueOf<T> = T[keyof T]

declare module '*.svg' {
  const content: string
  export default content
}

declare module 'use-react-screenshot' {
  export const useScreenshot
}
