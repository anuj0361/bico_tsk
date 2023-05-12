export const FETCH_TXNS_DETAILS = "FETCH_TXNS_DETAILS";

export const txnDetailsReducer = (state, action) => {
  switch (action.type) {
    case FETCH_TXNS_DETAILS:
      return { ...action.payload };

    default:
      break;
  }
};
