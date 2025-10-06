"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <Button onClick={() => disconnect()} variant="outline" className="gap-2">
        <Wallet className="h-4 w-4" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    )
  }

  return (
    <Button onClick={() => connect({ connector: connectors[0] })} className="gap-2 bg-primary hover:bg-primary/90">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
