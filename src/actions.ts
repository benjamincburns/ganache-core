// This pattern was taken from the below article, and it's far more succinct than the
// naïve approach to type safe redux actions/reducers
// https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575

export interface Action<T extends string> {
  type: T
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P
}

export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>
export function createAction<T extends string, P>(type: T, payload?: P) {
  return payload === undefined ? { type } : { type, payload }
}

export type FunctionType = ( ...args: any[] ) => any
export type ActionCreatorMapObject = { [actionCreator: string]: FunctionType }
export type ActionsUnion<A extends ActionCreatorMapObject> = ReturnType<A[keyof A]>
