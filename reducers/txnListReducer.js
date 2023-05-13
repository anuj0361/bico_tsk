import { SORT_DIRECTION } from "@/helpers/constants";

export const FETCH_TXNS = "FETCH_TXNS";
export const SORT_BY = "SORT_BY";

export const txnListReducer = (state, action) => {
  switch (action.type) {
    case FETCH_TXNS:
      return { ...action.payload };
    case SORT_BY:
      return {
        ...state,
        sortType: action.payload.sortType,
        sortDirection: action.payload.sortDirection,
      };
    default:
      break;
  }
};
