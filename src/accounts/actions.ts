import { createAction, ActionsUnion, Action, ActionWithPayload } from '../actions'
import { Seed, Account } from '../types/account'

export const SET_SEED = "[account] SET_SEED"
export const CREATE_ACCOUNT = "[account] CREATE_ACCOUNT"

export const actions = {
  setSeed: (seed: Seed) => createAction(SET_SEED, seed),
  createAccount: (account: Account) => createAction(CREATE_ACCOUNT, account)
}

export type AccountAction = ActionsUnion<typeof actions>
