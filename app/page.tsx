import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ChainSelector } from "@/components/chain-selector"
import { BatchTransactionForm } from "@/components/batch-transaction-form"
import { Layers } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Batch Transaction Sender</h1>
              <p className="text-sm text-muted-foreground">Send multiple transactions in one batch</p>
            </div>
          </div>
          <WalletConnectButton />
        </div>

        {/* Chain Selector */}
        <div className="mb-6">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Network</label>
          <ChainSelector />
        </div>

        {/* Transaction Form */}
        <BatchTransactionForm />

        {/* Info Footer */}
        <div className="mt-8 p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This app uses the <code className="text-primary font-mono text-xs">useSendCalls()</code> hook from wagmi to
            batch multiple Ethereum transactions together. Connect your wallet, select a network, and add transactions
            to get started.
          </p>
        </div>
      </div>
    </main>
  )
}
