import { PropsWithChildren, createContext, useReducer } from "react";
import rootReducer, { I_AddItemAction, I_InitAction, I_RemoveItemAction, I_State, I_VoteItemAction } from "../reducers";

const initialState: I_State = {
  items: [],
}

export const Context = createContext<[I_State, React.Dispatch<I_AddItemAction | I_VoteItemAction | I_RemoveItemAction | I_InitAction>]>([
  initialState,
  () => { }
]);

export const StateProvider = (props: PropsWithChildren) => {
  const { children } = props

  const [state, dispatch] = useReducer(rootReducer, initialState)

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
}