import { I_Item } from "../components/Item";
import itemsReducer from "./items";
import transactionReducer, { I_Transaction } from "./transaction";
import userReducer, { I_User } from "./user";

export interface I_State {
  items: I_Item[];
  transaction: I_Transaction | null;
  user: I_User | null;
}

export enum E_ItemActionType {
  Init = "Init",
  AddItem = "AddItem",
  VoteItem = "VoteItem",
  RemoveItem = "RemoveItem",
}

export interface I_AddItemAction {
  type: E_ItemActionType.AddItem;
  payload: I_Item;
}

interface I_VoteItemPayload {
  id: string;
}

export interface I_VoteItemAction {
  type: E_ItemActionType.VoteItem;
  payload: I_VoteItemPayload;
}

interface I_RemoveItemPayload {
  id: string;
}

export interface I_RemoveItemAction {
  type: E_ItemActionType.RemoveItem;
  payload: I_RemoveItemPayload;
}

export interface I_InitAction {
  type: E_ItemActionType.Init;
  payload: I_Item[];
}

const rootReducer: React.Reducer<I_State, any> = (
  { items, transaction, user },
  action
) => ({
  items: itemsReducer(items, action),
  transaction: transactionReducer(transaction, action),
  user: userReducer(user, action),
});

export default rootReducer;
