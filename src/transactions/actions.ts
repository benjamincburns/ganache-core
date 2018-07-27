export enum TransactionActionType = {
  SUBMIT = "TRANSACTION_SUBMIT",
  SUBMIT_SUCCESS = "TRANSACTION_SUBMIT_SUCCESS",
  SUBMIT_FAILURE = "TRANSACTION_SUBMIT_FAILURE",

  EXECUTE_START = "TRANSACTION_EXECUTE_START",
  EXECUTE_SUCCESS = "TRANSACTION_EXECUTE_SUCCESS"
  EXECUTE_FAILURE = "TRANSACTION_EXECUTE_FAILURE",
}

export interface BaseTransactionAction {
  type: TransactionActionType
}

export interface SubmitAction extends BaseTransactionAction {
  type: TransactionActionType.SUBMIT
  tx: SignedTransaction
}

export function submit(tx: SignedTransaction): SubmitAction {
  return {
    type: TransactionActionType.SUBMIT,
    tx
  }
}

export interface SubmitSuccessAction extends BaseTransactionAction {
  type: TransactionActionType.SUBMIT_SUCCESS
}

export function submit_success(): SubmitSuccessAction {
  return {
    type: TransactionActionType.SUBMIT_SUCCESS
  }
}

export interface SubmitFailureAction extends BaseTransactionAction {
  type: TransactionActionType.SUBMIT_FAILURE
}

export function submit_failure(error: Error): SubmitSuccessAction {
  return {
    type: TransactionActionType.SUBMIT_FAILURE,
    error
  }
}

