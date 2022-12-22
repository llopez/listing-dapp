import Item, { I_Item } from "./Item"

interface I_ListProps {
  items: I_Item[]
}

const List = (props: I_ListProps) => {
  const { items } = props

  return (
    <ul>
      {
        items.sort((a, b) => b.votesCount - a.votesCount).map(item => <Item key={item.id} item={item} />)
      }
    </ul>
  )
}

export default List