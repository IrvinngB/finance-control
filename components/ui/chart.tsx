import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  title?: string
  yAxisWidth?: number
  showGrid?: boolean
  categories: {
    name: string
    color: string
  }[]
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ data, title, categories, className, yAxisWidth = 50, showGrid = true, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("w-full", className)} {...props}>
        <CardHeader>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                {showGrid && (
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    className="stroke-muted" 
                    vertical={false}
                  />
                )}
                <XAxis 
                  dataKey="name" 
                  className="text-sm fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ className: "stroke-border" }}
                />
                <YAxis 
                  width={yAxisWidth}
                  className="text-sm fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ className: "stroke-border" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload) return null
                    return (
                      <div className="rounded-lg border bg-background p-4 shadow-md">
                        <div className="text-sm font-medium text-foreground mb-2">{label}</div>
                        {payload.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  }}
                />
                {categories.map((category, index) => (
                  <Bar
                    key={category.name}
                    dataKey={category.name}
                    fill={category.color}
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }
)
Chart.displayName = "Chart"

export { Chart }