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
import { HistoryDataPoint } from "../hooks/useRateHistory";
import {
  formatRateDisplay,
  formatChartXAxis,
  formatChartYAxis,
} from "../utils/formatting";

interface RateHistoryChartProps {
  data: HistoryDataPoint[];
  from: string;
  to: string;
  loading: boolean;
  error: string | null;
}

const RateHistoryChart: React.FC<RateHistoryChartProps> = ({
  data,
  from,
  to,
  loading,
  error,
}) => {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  if (loading) {
    return (
      <div className="loading-message chart-loading">Loading history...</div>
    );
  }

  if (error) {
    return (
      <div className="error-message chart-error">
        Error loading history: {error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="info-message chart-info">
        No historical data available to display for {fromUpper}/{toUpper}.
      </div>
    );
  }

  const averageRate =
    data.length > 0
      ? data.reduce((sum, point) => sum + point.rate, 0) / data.length
      : null;

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }} // Adjusted margins
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid-color, #555)"
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatChartXAxis}
            stroke="var(--chart-axis-color, #aaa)"
            tick={{ fontSize: 11 }}
            dy={5}
          />
          <YAxis
            stroke="var(--chart-axis-color, #aaa)"
            domain={["auto", "auto"]}
            tickFormatter={formatChartYAxis}
            tick={{ fontSize: 11 }}
            width={85}
            dx={-5}
            allowDataOverflow={true}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg, #333)",
              border: "1px solid var(--tooltip-border, #555)",
              borderRadius: "4px",
              boxShadow: "var(--tooltip-shadow, none)",
            }}
            labelStyle={{
              color: "var(--tooltip-label-color, #eee)",
              fontWeight: "bold",
              marginBottom: "5px",
              display: "block",
            }}
            itemStyle={{ color: "var(--chart-line-color, #87cefa)" }}
            formatter={(value: number) => [
              formatRateDisplay(value),
              `1 ${fromUpper} = Value`,
            ]}
            labelFormatter={(label: string) => `Date: ${label}`}
          />
          <Legend
            wrapperStyle={{
              color: "var(--chart-legend-color, #ccc)",
              paddingTop: "10px",
            }}
            verticalAlign="top"
            align="center"
          />
          <Line
            type="monotone"
            dataKey="rate"
            name={`1 ${fromUpper} to ${toUpper}`}
            stroke="var(--chart-line-color, #87cefa)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              strokeWidth: 1,
              fill: "var(--chart-line-color, #87cefa)",
              stroke: "var(--background-color)",
            }}
          />
          {/* Optional: Add Reference Line for Average or Current Rate */}
          {averageRate !== null && (
            <ReferenceLine
              y={averageRate}
              label={{
                value: `Avg: ${formatRateDisplay(averageRate)}`,
                position: "insideTopRight",
                fill: "var(--chart-ref-line-label-color, #aaa)",
                fontSize: 10,
              }}
              stroke="var(--chart-ref-line-color, #aaa)"
              strokeDasharray="3 3"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RateHistoryChart;
