import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { HistoryDataPoint } from "../loaders.ts";
import {
  formatRateDisplay,
  formatChartXAxis,
  formatChartYAxis,
} from "../utils/formatting";

interface RateHistoryChartProps {
  data: HistoryDataPoint[];
  from: string;
  to: string;
}

const RateHistoryChart: React.FC<RateHistoryChartProps> = ({
  data,
  from,
  to,
}) => {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  const averageRate =
    data.length > 0
      ? data.reduce((sum, point) => sum + point.rate, 0) / data.length
      : null;

  return (
    <ResponsiveContainer height={300}>
      <LineChart data={data}>
        <CartesianGrid />
        <XAxis dataKey="date" tickFormatter={formatChartXAxis} dy={5} />
        <YAxis
          domain={["auto", "auto"]}
          tickFormatter={formatChartYAxis}
          dx={-5}
          allowDataOverflow={true}
        />
        <Tooltip
          formatter={(value: number) => [
            formatRateDisplay(value),
            `1 ${fromUpper} = Value`,
          ]}
          labelFormatter={(label: string) => `Date: ${label}`}
        />
        <Legend verticalAlign="top" align="center" />
        <Line
          type="monotone"
          dataKey="rate"
          name={`1 ${fromUpper} to ${toUpper}`}
          dot={false}
        />
        {averageRate !== null && (
          <ReferenceLine
            y={averageRate}
            label={{
              value: `Avg: ${formatRateDisplay(averageRate)}`,
              position: "insideTopRight",
              fill: "var(--chart-ref-line-label-color, #aaa)",
              fontSize: 10,
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RateHistoryChart;
