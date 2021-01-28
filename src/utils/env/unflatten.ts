// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Leaves<K, Prefix extends string> = K extends `${Prefix}${infer O}_${infer M}`
  ? never
  : K extends `${Prefix}${infer O}`
  ? O
  : never

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type NonLeaves<K, Prefix extends string> = K extends `${Prefix}${infer O}_${infer M}` ? O : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnflattenImpl<T extends Record<string, any>, Prefix extends string> = {
  [Key in Leaves<keyof T, Prefix>]: T[`${Prefix}${Key}`]
} &
  {
    [Key in NonLeaves<keyof T, Prefix>]: UnflattenImpl<T, `${Prefix}${Key}_`>
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unflatten<T extends Record<string, any>> = UnflattenImpl<T, ''>
