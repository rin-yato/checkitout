export interface TransactionSuccess {
  responseCode: 0;
  responseMessage: "Getting transaction successfully.";
  errorCode: null;
  data: {
    hash: string;
    fromAccountId: string;
    toAccountId: string;
    currency: string;
    amount: number;
    description: string;
    createdDateMs: number;
    acknowledgedDateMs: number;
  };
}

export interface TransactionFailed {
  responseCode: 1;
  responseMessage: "Transaction failed.";
  errorCode: 3;
  data: null;
}

export interface TransactionNotFound {
  responseCode: 1;
  responseMessage: "Transaction could not be found. Please check and try again.";
  errorCode: 1;
  data: null;
}

export type TransactionResponse = TransactionSuccess | TransactionFailed | TransactionNotFound;
