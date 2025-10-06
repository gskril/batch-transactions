import { http, createConfig } from "wagmi"
import { base, mainnet, arbitrum } from "wagmi/chains"
import { injected } from "wagmi/connectors"

export const config = createConfig({
  chains: [base, mainnet, arbitrum],
  connectors: [injected()],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
})
