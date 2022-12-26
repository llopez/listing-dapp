import { Address, useAccount, useBalance, useConnect, useContractEvent, useContractWrite, useDisconnect, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import List from './List';
import { useCallback, useContext, useEffect, useState } from 'react';
import ListingV3 from '../abis/ListingV3.json'
import { BigNumber } from 'ethers';
import { Context } from './StateProvider';
import { E_ItemActionType } from '../reducers';
import { I_Item_Resp } from '../pages/api/listing';
import Pagination from './Pagination';
import { E_TransactionActionType } from '../reducers/transaction';
import { Alert, Button, Col, Container, Form, Nav, NavDropdown, Navbar, Row, Spinner } from 'react-bootstrap';

function App() {
  const { address, isConnected } = useAccount()
  const [_isConnected, _setIsConnected] = useState(false)
  const { connect } = useConnect({ connector: new MetaMaskConnector() })
  const { disconnect } = useDisconnect()
  const { data: balance, isLoading: isLoadingBalance } = useBalance({ address })

  const [{ items, transaction }, dispatch] = useContext(Context)

  const [title, setTitle] = useState<string>('')

  const fetchItems = useCallback((per: number, page: number) => {
    fetch(`/api/listing?per=${per}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(data => data.json()).then((data: I_Item_Resp[]) => dispatch({ type: E_ItemActionType.Init, payload: data.map(i => ({ ...i, votesCount: parseInt(i.votesCount) })) }))
  }, [dispatch])


  useEffect(() => {
    console.log('fetching subgraph...')
    fetchItems(5, 1)

  }, [fetchItems])

  const { config } = usePrepareContractWrite({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV3,
    functionName: 'addItem',
    args: [title]
  })

  useContractEvent({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV3,
    eventName: 'ItemAdded',
    listener: (id: BigNumber, title: string, author: string): void => {
      console.log("ItemAdded: ", id, title, author)

      dispatch({ type: E_ItemActionType.AddItem, payload: { id: id.toString(), title, votesCount: 0 } })
    },
  })

  useContractEvent({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV3,
    eventName: 'ItemVoted',
    listener: (id: BigNumber, voter: Address): void => {
      console.log("ItemVoted: ", id, voter)

      const item = items.find(i => i.id === id.toString())

      if (item === undefined) return

      console.log(item)

      dispatch({ type: E_ItemActionType.VoteItem, payload: { id: id.toString() } })
    },
  })

  useContractEvent({
    address: '0x576E4df9f9df070e0ae7B4A8f920C814a92eFdB0',
    abi: ListingV3,
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

  const { isLoading: isLoadingTx } = useWaitForTransaction({ hash: transaction?.hash })

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value)
  }

  const handleAdd: React.MouseEventHandler<HTMLButtonElement> = () => {
    write?.()
    setTitle('')
  }

  useEffect(() => {
    if (data?.hash) { dispatch({ type: E_TransactionActionType.AddTransaction, payload: { hash: data.hash } }) }
  }, [data, dispatch])

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

  return (
    <>
      <Navbar expand="sm" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="#">Listing</Navbar.Brand>
          {_isConnected && <Nav>
            {/* <NetworkSelector /> */}
            <NavDropdown title={address} align="end">
              <NavDropdown.Item disabled>
                {!isLoadingBalance && <span>{balance?.formatted} {balance?.symbol}</span>}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => { disconnect() }}>
                Disconnect
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>}
          {!_isConnected && <Nav.Link onClick={() => { connect() }}>Connect</Nav.Link>}
        </Container>
      </Navbar>
      <Container fluid>
        <Row md={12} style={{ justifyContent: 'center' }}>
          <Col md={6}>
            <Row>
              <Col>
                {_isConnected && isLoadingTx && <Alert className="mt-2 d-flex justify-content-between align-items-center">
                  <span>Waiting for transaction: <a target="blank" href={`https://goerli.etherscan.io/tx/${transaction?.hash}`}>{transaction?.hash}</a></span>
                  <Spinner animation="border" role="status" />
                </Alert>}
              </Col>
            </Row>
            <Row style={{ flexDirection: 'column' }} className="mt-4">
              <Col>
                <Form>
                  <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={3} value={title} onChange={handleTitleChange} />
                  </Form.Group>
                  <Form.Group className="justify-content-end d-flex">
                    <Button variant="primary" type="submit" onClick={handleAdd} disabled={isLoading}>
                      Publish
                    </Button>
                  </Form.Group>
                </Form>
                <List items={items} />
                <Pagination onChange={(page) => { fetchItems(5, page) }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>

  );
}

export default App;
