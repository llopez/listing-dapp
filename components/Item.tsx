import { useContractWrite, usePrepareContractWrite } from "wagmi"
import ListingV3 from '../abis/ListingV3.json'
import { useEffect } from "react"

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
  onTx: (hash: `0x${string}`) => void
}

const Item = (props: I_ItemProps) => {
  const { item, onTx } = props

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
    if (dataVote?.hash) { onTx(dataVote.hash) }

  }, [dataVote, onTx])

  useEffect(() => {
    if (dataRemove?.hash) { onTx(dataRemove.hash) }

  }, [dataRemove, onTx])

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