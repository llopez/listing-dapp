import {
  E_ItemActionType,
  I_AddItemAction,
  I_InitAction,
  I_RemoveItemAction,
  I_VoteItemAction,
} from ".";
import { I_Item } from "../components/Item";

const itemsReducer: React.Reducer<
  I_Item[],
  I_AddItemAction | I_VoteItemAction | I_RemoveItemAction | I_InitAction
> = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case E_ItemActionType.Init:
      return payload;

    case E_ItemActionType.AddItem:
      return [...state, payload];

    case E_ItemActionType.VoteItem:
      const item = state.find(({ id }) => id === payload.id);

      if (item === undefined) {
        return state;
      }

      return [
        ...state.filter((i) => i.id !== payload.id),
        { ...item, votesCount: item.votesCount + 1 },
      ];
    case E_ItemActionType.RemoveItem:
      return state.filter((i) => i.id !== payload.id);

    default:
      return state;
  }
};

export default itemsReducer;
