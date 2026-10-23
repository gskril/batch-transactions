import { http, createConfig } from "wagmi"
import { base, mainnet, arbitrum, sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"

export const config = createConfig({
  chains: [base, mainnet, arbitrum, sepolia],
  connectors: [injected()],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
})
