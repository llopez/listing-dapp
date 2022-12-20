import { WagmiConfig, configureChains, createClient } from "wagmi";
import { mainnet, polygon, goerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { StateProvider } from "../components/StateProvider";
import App from "../components/App";

const { provider, webSocketProvider } = configureChains(
  [mainnet, polygon, goerli],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
})

export default function Home() {
  return (
    <StateProvider>
      <WagmiConfig client={client}>
        <App />
      </WagmiConfig>
    </StateProvider>
  )
}
