import { useAccount, useBalance, useConnect, useContractEvent, useContractWrite, useDisconnect, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import List from './List';
import { useContext, useEffect, useState } from 'react';
import ListingV2 from '../abis/ListingV2.json'
import { BigNumber } from 'ethers';
import { Context } from './StateProvider';
import { E_ItemActionType } from '../reducers';

function App() {
  const { address, isConnected } = useAccount()
  const [_isConnected, _setIsConnected] = useState(false)
  const { connect } = useConnect({ connector: new MetaMaskConnector() })
  const { disconnect } = useDisconnect()
  const { data: balance, isLoading: isLoadingBalance } = useBalance({ address })

  const [tx, setTx] = useState<`0x${string}` | undefined>(undefined)

  const [{ items }, dispatch] = useContext(Context)

  const [title, setTitle] = useState<string>('')

  const { config } = usePrepareContractWrite({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV2,
    functionName: 'addItem',
    args: [title]
  })

  useContractEvent({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV2,
    eventName: 'ItemAdded',
    listener: (id: BigNumber, title: string, author: string): void => {
      console.log("ItemAdded: ", id, title, author)

      dispatch({ type: E_ItemActionType.AddItem, payload: { id: id.toString(), title, votesCount: 0 } })
    },
  })

  useContractEvent({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV2,
    eventName: 'ItemVoted',
    listener: (id: BigNumber): void => {
      console.log("ItemVoted: ", id)

      const item = items.find(i => i.id === id.toString())

      if (item === undefined) return

      console.log(item)

      dispatch({ type: E_ItemActionType.VoteItem, payload: { id: id.toString() } })
    },
  })

  useContractEvent({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV2,
    eventName: 'ItemRemoved',
    listener: (id: BigNumber): void => {
      console.log("ItemRemoved: ", id)

      const item = items.find(i => i.id === id.toString())

      if (item === undefined) return

      console.log(item)

      dispatch({ type: E_ItemActionType.RemoveItem, payload: { id: id.toString() } })
    },
  })

  const { data, isLoading, write } = useContractWrite(config)

  const { isLoading: isLoadingTx } = useWaitForTransaction({ hash: tx })

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value)
  }

  const handleAdd: React.MouseEventHandler<HTMLButtonElement> = () => {
    write?.()
    setTitle('')
  }

  useEffect(() => {
    if (data?.hash) { setTx(data.hash) }
  }, [data])

  useEffect(() => {

    console.log(items)

  }, [items])

  useEffect(() => {
    if (isConnected)
      _setIsConnected(true)
    else
      _setIsConnected(false)
  }, [
    isConnected
  ])

  useEffect(() => {
    fetch('/api/listing', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(data => data.json()).then(data => dispatch({ type: E_ItemActionType.Init, payload: data }))
  }, [dispatch])

  return (
    <div>
      {_isConnected && <div>Address: {address}</div>}
      {_isConnected && !isLoadingBalance && <div>Balance: {balance?.formatted}</div>}
      {!_isConnected && <button onClick={() => { connect() }}>Connect</button>}
      {_isConnected && <button onClick={() => { disconnect() }}>Disconnect</button>}

      {
        isLoadingTx && < div style={{ border: '1px solid red' }}>
          Transaction: {tx} in progress
        </div>
      }
      <div>
        <input type="text" value={title} onChange={handleTitleChange} />
        <button onClick={handleAdd} disabled={isLoading}>Add</button>
      </div>

      <List items={items} onTx={(hash: `0x${string}`) => { setTx(hash) }} />
    </div >
  );
}

export default App;
