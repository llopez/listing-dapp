import { useContractWrite, usePrepareContractWrite } from "wagmi"
import ListingV3 from '../abis/ListingV3.json'
import { useContext, useEffect } from "react"
import { Context } from "./StateProvider"
import { E_TransactionActionType } from "../reducers/transaction"
import { ListGroup, Image } from "react-bootstrap"
import { Star, Trash, HandThumbsUp } from 'react-bootstrap-icons'
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

const Actions = () => {
  return (
    <span><HandThumbsUp size={24} style={{ cursor: 'pointer' }} /><Trash size={24} style={{ cursor: 'pointer' }} /></span>
  )
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

  const handleVote: React.MouseEventHandler<SVGElement> = () => {
    writeVote?.()
  }

  const handleRemove: React.MouseEventHandler<SVGElement> = () => {
    writeRemove?.()
  }

  return (
    <ListGroup.Item className="border-0">
      <div className="d-flex justify-content-between">
        <div className="p-2">
          {item.title}
        </div>
        <div className="d-flex align-items-center">
          <span className="p-2">{item.votesCount}</span>
          <Star size={24} />
        </div>
      </div>

      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="p-2 d-flex align-items-center">
          <Image src="https://via.placeholder.com/32x32" alt="avatar" />
          <span className="p-2">{item.author?.id}</span>
        </div>
        <div>
          <span><HandThumbsUp size={24} style={{ cursor: 'pointer' }} onClick={handleVote} /><Trash size={24} style={{ cursor: 'pointer' }} onClick={handleRemove} /></span>

        </div>
      </div>
    </ListGroup.Item >
  )
}

export default Item