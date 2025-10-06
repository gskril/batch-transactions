"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2 } from "lucide-react"
import { encodeFunctionData, parseEther, isAddress } from "viem"

interface CalldataGeneratorProps {
  onGenerate: (calldata: string, to?: string) => void
}

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

const ERC721_ABI = [
  {
    name: "safeTransferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
] as const

const ERC1155_ABI = [
  {
    name: "safeTransferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
  },
] as const

export function CalldataGenerator({ onGenerate }: CalldataGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [tokenType, setTokenType] = useState<"ERC20" | "ERC721" | "ERC1155">("ERC20")
  const [tokenAddress, setTokenAddress] = useState("")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [fromAddress, setFromAddress] = useState("")
  const [error, setError] = useState("")

  const handleGenerate = () => {
    setError("")

    try {
      // Validate token address
      if (!tokenAddress || !isAddress(tokenAddress)) {
        setError("Invalid token contract address")
        return
      }

      // Validate recipient
      if (!recipient || !isAddress(recipient)) {
        setError("Invalid recipient address")
        return
      }

      let calldata: `0x${string}`

      if (tokenType === "ERC20") {
        if (!amount || Number.parseFloat(amount) <= 0) {
          setError("Invalid amount")
          return
        }

        // Parse amount with 18 decimals (standard for most ERC20 tokens)
        const amountWei = parseEther(amount)

        calldata = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [recipient as `0x${string}`, amountWei],
        })
      } else if (tokenType === "ERC721") {
        if (!fromAddress || !isAddress(fromAddress)) {
          setError("Invalid from address")
          return
        }
        if (!tokenId) {
          setError("Invalid token ID")
          return
        }

        calldata = encodeFunctionData({
          abi: ERC721_ABI,
          functionName: "safeTransferFrom",
          args: [fromAddress as `0x${string}`, recipient as `0x${string}`, BigInt(tokenId)],
        })
      } else {
        // ERC1155
        if (!fromAddress || !isAddress(fromAddress)) {
          setError("Invalid from address")
          return
        }
        if (!tokenId) {
          setError("Invalid token ID")
          return
        }
        if (!amount || Number.parseFloat(amount) <= 0) {
          setError("Invalid amount")
          return
        }

        calldata = encodeFunctionData({
          abi: ERC1155_ABI,
          functionName: "safeTransferFrom",
          args: [fromAddress as `0x${string}`, recipient as `0x${string}`, BigInt(tokenId), BigInt(amount), "0x"],
        })
      }

      onGenerate(calldata, tokenAddress)
      setOpen(false)

      // Reset form
      setTokenAddress("")
      setRecipient("")
      setAmount("")
      setTokenId("")
      setFromAddress("")
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate calldata")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Wand2 className="h-4 w-4" />
          Generate Calldata
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Token Transfer Calldata</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Token Type</Label>
            <Select value={tokenType} onValueChange={(value) => setTokenType(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ERC20">ERC20 (Fungible Token)</SelectItem>
                <SelectItem value="ERC721">ERC721 (NFT)</SelectItem>
                <SelectItem value="ERC1155">ERC1155 (Multi-Token)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Token Contract Address</Label>
            <Input
              placeholder="0x..."
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {(tokenType === "ERC721" || tokenType === "ERC1155") && (
            <div className="space-y-2">
              <Label>From Address (Token Owner)</Label>
              <Input
                placeholder="0x..."
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Recipient Address</Label>
            <Input
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {(tokenType === "ERC721" || tokenType === "ERC1155") && (
            <div className="space-y-2">
              <Label>Token ID</Label>
              <Input placeholder="1" type="number" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
            </div>
          )}

          {(tokenType === "ERC20" || tokenType === "ERC1155") && (
            <div className="space-y-2">
              <Label>{tokenType === "ERC20" ? "Amount (in tokens)" : "Amount"}</Label>
              <Input
                placeholder={tokenType === "ERC20" ? "1.0" : "1"}
                type="number"
                step={tokenType === "ERC20" ? "0.000001" : "1"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {tokenType === "ERC20" && (
                <p className="text-xs text-muted-foreground">Assumes 18 decimals (standard for most tokens)</p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleGenerate} className="w-full">
            Generate & Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
