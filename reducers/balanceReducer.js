export const FETCH_BALANCES = "FETCH_BALANCES";

export const balanceReducer = (state, action) => {
  switch (action.type) {
    case FETCH_BALANCES:
      return { ...action.payload };
    default:
      break;
  }
};
