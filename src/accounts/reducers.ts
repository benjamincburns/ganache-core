import * as AccountActions from './actions'

import {
  SerializedAccount,
  toSerializedAccount,
  SerializedSeed,
  toSerializedSeed
} from '../types/serializable/account'

export interface AccountState {
  seed?: SerializedSeed
  accounts: SerializedAccount[]
}

const initialState : AccountState = {
  accounts: []
}

export function accounts(state: AccountState = initialState, action: AccountActions.AccountAction) {
  switch (action.type) {
    case AccountActions.SET_SEED:
      let { payload: seed } = action
      let serializedSeed = toSerializedSeed(seed)
      return {
        ...state,
        serializedSeed
      }

    case AccountActions.CREATE_ACCOUNT:
      let { payload: account } = action
      let serializedAccount = toSerializedAccount(account)
      return {
        ...state,
        accounts: [...state.accounts, serializedAccount]
      }

    default:
      return state
  }
}
