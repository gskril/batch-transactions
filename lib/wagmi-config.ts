import { http, createConfig, type Transport } from "wagmi"
import { base, mainnet, arbitrum, sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"

export const chains = [base, mainnet, arbitrum, sepolia] as const

export const config = createConfig({
  chains,
  connectors: [injected()],
  transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])) as Record<
    (typeof chains)[number]["id"],
    Transport
  >,
})
