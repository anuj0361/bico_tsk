export const FETCH_TXNS = "FETCH_TXNS";

export const txnListReducer = (state, action) => {
  switch (action.type) {
    case FETCH_TXNS:
      return { ...action.payload };

    default:
      break;
  }
};
