"use client"

import { useAccount, useSwitchChain } from "wagmi"
import { base, mainnet, arbitrum } from "wagmi/chains"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const chains = [mainnet, base, arbitrum]

export function ChainSelector() {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  return (
    <Select value={chain?.id.toString()} onValueChange={(value) => switchChain({ chainId: Number.parseInt(value) })}>
      <SelectTrigger className="w-[180px] bg-card border-border">
        <SelectValue placeholder="Select chain" />
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
