"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { CalldataGenerator } from "./calldata-generator"

interface TransactionInputProps {
  index: number
  transaction: {
    to: string
    value: string
    data: string
  }
  onChange: (index: number, field: string, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export function TransactionInput({ index, transaction, onChange, onRemove, canRemove }: TransactionInputProps) {
  const handleCalldataGenerate = (calldata: string) => {
    onChange(index, "data", calldata)
  }

  return (
    <Card className="p-4 bg-card border-border relative">
      {canRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onRemove(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground">Transaction {index + 1}</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`to-${index}`} className="text-sm text-muted-foreground">
            To Address
          </Label>
          <Input
            id={`to-${index}`}
            placeholder="0x..."
            value={transaction.to}
            onChange={(e) => onChange(index, "to", e.target.value)}
            className="bg-background border-border font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`value-${index}`} className="text-sm text-muted-foreground">
            Value (ETH)
          </Label>
          <Input
            id={`value-${index}`}
            placeholder="0.0"
            type="number"
            step="0.000001"
            value={transaction.value}
            onChange={(e) => onChange(index, "value", e.target.value)}
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`data-${index}`} className="text-sm text-muted-foreground">
              Calldata (optional)
            </Label>
            <CalldataGenerator onGenerate={handleCalldataGenerate} />
          </div>
          <Input
            id={`data-${index}`}
            placeholder="0x"
            value={transaction.data}
            onChange={(e) => onChange(index, "data", e.target.value)}
            className="bg-background border-border font-mono text-sm"
          />
        </div>
      </div>
    </Card>
  )
}
