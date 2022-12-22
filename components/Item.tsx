import { useContractWrite, usePrepareContractWrite } from "wagmi"
import ListingV3 from '../abis/ListingV3.json'
import { useContext, useEffect } from "react"
import { Context } from "./StateProvider"
import { E_TransactionActionType } from "../reducers/transaction"

export interface I_User {
  id: string
}

export interface I_Item {
  id: string
  title: string
  votesCount: number
  author?: I_User
}

export interface I_ItemProps {
  item: I_Item
}

const Item = (props: I_ItemProps) => {
  const { item } = props

  const [, dispatch] = useContext(Context)

  const { config: configVote } = usePrepareContractWrite({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV3,
    functionName: 'voteItem',
    args: [item.id],
    enabled: true
  })

  const { config: configRemove } = usePrepareContractWrite({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV3,
    functionName: 'removeItem',
    args: [item.id],
    enabled: true
  })

  const { data: dataVote, isLoading: isLoadingVote, write: writeVote } = useContractWrite(configVote)

  const { data: dataRemove, isLoading: isLoadingRemove, write: writeRemove } = useContractWrite(configRemove)

  useEffect(() => {
    if (dataVote?.hash) { dispatch({ type: E_TransactionActionType.AddTransaction, payload: { hash: dataVote.hash } }) }

  }, [dataVote, dispatch])

  useEffect(() => {
    if (dataRemove?.hash) { dispatch({ type: E_TransactionActionType.AddTransaction, payload: { hash: dataRemove.hash } }) }

  }, [dataRemove, dispatch])

  const handleVote: React.MouseEventHandler<HTMLButtonElement> = () => {
    writeVote?.()
  }

  const handleRemove: React.MouseEventHandler<HTMLButtonElement> = () => {
    writeRemove?.()
  }

  return (
    <li>({item.id}) | [{item.votesCount}] | {item.title} | <button onClick={handleVote} disabled={isLoadingVote}>vote</button>| <button onClick={handleRemove} disabled={isLoadingRemove}>remove</button></li>
  )
}

export default Item