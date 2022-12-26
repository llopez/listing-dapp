import { Address, useContractWrite, usePrepareContractWrite } from "wagmi"
import ListingV3 from '../abis/ListingV3.json'
import { useContext, useEffect } from "react"
import { Context } from "./StateProvider"
import { E_TransactionActionType } from "../reducers/transaction"
import { ListGroup, Image } from "react-bootstrap"
import { Star, Trash, HandThumbsUp } from 'react-bootstrap-icons'
import { I_Vote } from "../pages/api/listing"

export interface I_User {
  id: Address
}

export interface I_Item {
  id: string
  title: string
  votesCount: number
  author: I_User
  votes: I_Vote[]
}

export interface I_ItemProps {
  item: I_Item
}

const Item = (props: I_ItemProps) => {
  const { item } = props

  const [{ user }, dispatch] = useContext(Context)

  const { config: configVote } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: ListingV3,
    functionName: 'voteItem',
    args: [item.id],
    enabled: true
  })

  const { config: configRemove } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
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

  const isAuthor = user && item.author.id === user.address
  const alreadyVoted = user && item.votes.filter(v => v.user).map(v => v.user.id).includes(user.address)
  const noVotes = item.votesCount === 0

  const canVote = !isAuthor && !alreadyVoted
  const canRemove = noVotes && isAuthor

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
          {user && <span>
            {canVote && <HandThumbsUp size={24} style={{ cursor: 'pointer' }} onClick={handleVote} />}
            {canRemove && <Trash size={24} style={{ cursor: 'pointer' }} onClick={handleRemove} />}
          </span>}
        </div>
      </div>
    </ListGroup.Item >
  )
}

export default Item