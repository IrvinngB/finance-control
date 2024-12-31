"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartProps {
  config: ChartConfig
  className?: string
  children: React.ReactNode
}

export function ChartContainer({
  config,
  className,
  children,
}: ChartProps) {
  return (
    <div className={className}>
      <style jsx global>{`
        :root {
          ${Object.entries(config).map(
            ([key, value]) => `--color-${key}: ${value.color};`
          )}
        }
      `}</style>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface TooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  config?: ChartConfig
  hideLabel?: boolean
}

export function ChartTooltip({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="rounded-lg border bg-background p-2 shadow-sm"
    >
      {children}
    </div>
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  config,
  hideLabel = false,
}: TooltipProps) {
  if (!active || !payload) {
    return null
  }

  return (
    <ChartTooltip>
      {!hideLabel && <p className="mb-2 font-medium">{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((item: any, i: number) => {
          const color = config?.[item.dataKey]?.color ?? item.color
          const label = config?.[item.dataKey]?.label ?? item.dataKey
          const value = item.value.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })

          return (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
              <p className="text-sm font-medium">{value}</p>
            </div>
          )
        })}
      </div>
    </ChartTooltip>
  )
}

