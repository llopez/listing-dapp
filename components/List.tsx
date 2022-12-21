import Item, { I_Item } from "./Item"

interface I_ListProps {
  items: I_Item[]
  onTx: (hash: `0x${string}`) => void
}

const List = (props: I_ListProps) => {
  const { items, onTx } = props

  return (
    <ul>
      {
        items.sort((a, b) => b.votesCount - a.votesCount).map(item => <Item key={item.id} item={item} onTx={onTx} />)
      }
    </ul>
  )
}

export default List