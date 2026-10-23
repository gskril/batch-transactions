'use client'

import { useState } from 'react'
import { useAccount, useSendCalls, useWaitForCallsStatus } from 'wagmi'
import { parseEther, isAddress } from 'viem'
import { Button } from '@/components/ui/button'
import { TransactionInput } from './transaction-input'
import {
  Plus,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Transaction {
  to: string
  value: string
  data: string
}

export function BatchTransactionForm() {
  const { isConnected, chain } = useAccount()
  const { sendCalls, isPending, isSuccess, isError, error, data } =
    useSendCalls()
  // `data.id` is the wallet's batch identifier (EIP-5792), not a transaction
  // hash, so wait for the batch to land and read the hash from its receipt
  const { data: callsStatus, isError: isCallsStatusError } =
    useWaitForCallsStatus({ id: data?.id })
  const txHash = callsStatus?.receipts?.[0]?.transactionHash

  // Blockscan doesn't index testnets, so link to the chain's own explorer there
  const explorerUrl = chain?.testnet
    ? chain.blockExplorers?.default.url
    : 'https://blockscan.com'

  const [transactions, setTransactions] = useState<Transaction[]>([
    { to: '', value: '', data: '0x' },
  ])

  const handleAddTransaction = () => {
    setTransactions([...transactions, { to: '', value: '', data: '0x' }])
  }

  const handleRemoveTransaction = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index))
  }

  const handleTransactionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...transactions]
    updated[index] = { ...updated[index], [field]: value }
    setTransactions(updated)
  }

  const isValidTransaction = (tx: Transaction) => {
    return isAddress(tx.to) && (tx.value !== '' || tx.data !== '0x')
  }

  const hasValidTransactions = transactions.some(isValidTransaction)

  const handleSendBatch = async () => {
    const validTransactions = transactions.filter(isValidTransaction)

    const calls = validTransactions.map((tx) => ({
      to: tx.to as `0x${string}`,
      value: tx.value ? parseEther(tx.value) : undefined,
      data:
        tx.data && tx.data !== '0x' ? (tx.data as `0x${string}`) : undefined,
    }))

    sendCalls({ calls })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <TransactionInput
            key={index}
            index={index}
            transaction={transaction}
            onChange={handleTransactionChange}
            onRemove={handleRemoveTransaction}
            canRemove={transactions.length > 1}
          />
        ))}
      </div>

      <Button
        onClick={handleAddTransaction}
        variant="outline"
        className="w-full gap-2 border-dashed bg-transparent"
      >
        <Plus className="h-4 w-4" />
        Add Transaction
      </Button>

      <Button
        onClick={handleSendBatch}
        disabled={!isConnected || !hasValidTransactions || isPending}
        className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending Batch...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Batch Transaction
          </>
        )}
      </Button>

      {isSuccess && (
        <Alert className="bg-success/10 border-success/20">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            <div className="flex flex-col gap-2">
              <span>Batch transaction sent successfully!</span>
              {txHash ? (
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm underline hover:no-underline"
                >
                  View on block explorer <ExternalLink className="h-3 w-3" />
                </a>
              ) : isCallsStatusError ? (
                <span className="text-sm">
                  Couldn&apos;t confirm the transaction. Check your wallet for its
                  status.
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Waiting for confirmation...
                </span>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert className="bg-destructive/10 border-destructive/20">
          <XCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive-foreground">
            {error?.message || 'Failed to send batch transaction'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
