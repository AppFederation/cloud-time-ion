
export type nullish = null | undefined

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
