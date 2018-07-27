import { BN } from 'bn.js'
import { SagaIterator } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'

import { actions } from './actions'
import { Seed, Account } from '../types/account'

function* createAccount(account: Account) : SagaIterator {
  yield put(actions.createAccount(account))
}
