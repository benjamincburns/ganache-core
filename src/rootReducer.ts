import { combineReducers } from 'redux'

import accounts from './accounts/reducers'

export interface RootState {
  accounts: accounts.AccountState
}

export type RootAction = AccountAction

export combineReducers({
  accounts
})
