import { Address } from "wagmi";

export enum E_UserActionType {
  AddUser = "AddUser",
  RemoveUser = "RemoveUser",
}

export interface I_User {
  address: Address;
}

export interface I_AddUserAction {
  type: E_UserActionType.AddUser;
  payload: I_User;
}

export interface I_RemoveUserAction {
  type: E_UserActionType.RemoveUser;
  payload: null;
}

const userReducer: React.Reducer<
  I_User | null,
  I_AddUserAction | I_RemoveUserAction
> = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case E_UserActionType.AddUser:
      return payload;

    case E_UserActionType.RemoveUser:
      return null;

    default:
      return state;
  }
};

export default userReducer;
