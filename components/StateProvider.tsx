import { PropsWithChildren, createContext, useReducer } from "react";
import rootReducer, { I_AddItemAction, I_InitAction, I_RemoveItemAction, I_State, I_VoteItemAction } from "../reducers";
import { I_AddTransactionAction, I_RemoveTransactionAction } from "../reducers/transaction";

const initialState: I_State = {
  items: [],
  transaction: null
}

export const Context = createContext<[I_State, React.Dispatch<I_AddItemAction | I_VoteItemAction | I_RemoveItemAction | I_InitAction | I_AddTransactionAction | I_RemoveTransactionAction>]>([
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