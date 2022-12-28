import React from "react"
import { NavDropdown } from "react-bootstrap"
import { useNetwork, useSwitchNetwork, Chain } from "wagmi"

interface Item {
  data: Chain
  onSelect: (id: number) => void
}

const Item = (props: React.PropsWithChildren<Item>) => {
  const { data, onSelect } = props

  const { name, id } = data

  const handleSelect = (): void => {
    onSelect(id)
  }

  return (
    <NavDropdown.Item onClick={handleSelect} disabled={name === 'Ethereum'}>{name}</NavDropdown.Item>
  )
}

export const NetworkSelector = () => {
  const { chain } = useNetwork()
  const { chains, switchNetwork } = useSwitchNetwork()

  const handleChange = (id: number) => {
    switchNetwork?.(id)
  }

  // useEffect(() => {
  //   if (chain?.id !== 5) { switchNetwork?.(5) }
  // }, [chain?.id, switchNetwork])

  return (
    <NavDropdown title={chain?.name} id="basic-nav-dropdown" align='end'>
      {chains.map(c => <Item key={c.id} data={c} onSelect={handleChange}>{c.name}</Item>)}
    </NavDropdown>
  )
}

