import { I_Item } from "../components/Item";
import itemsReducer from "./items";

export interface I_State {
  items: I_Item[];
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

const rootReducer: React.Reducer<
  I_State,
  I_AddItemAction | I_VoteItemAction | I_RemoveItemAction | I_InitAction
> = ({ items }, action) => ({
  items: itemsReducer(items, action),
});

export default rootReducer;
