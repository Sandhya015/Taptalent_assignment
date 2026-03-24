import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyAgg, HourlyPoint } from "@/utils/aggregateForecast";
import { windDirection } from "@/utils/format";

const axisStyle = { fill: "#94a3b8", fontSize: 11 };
const gridColor = "rgba(148, 163, 184, 0.12)";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#111a2e",
        border: "1px solid rgba(148,163,184,0.2)",
        borderRadius: 10,
        padding: "10px 12px",
        fontSize: 12,
      }}
    >
      <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 6 }}>{label}</div>
          {payload.map((p) => (
        <div key={String(p.dataKey)} style={{ color: p.color ?? "#cbd5e1" }}>
          {p.name}:{" "}
          <strong>
            {typeof p.value === "number" ? p.value.toFixed(1) : String(p.value ?? "—")}
          </strong>
        </div>
      ))}
    </div>
  );
}

export function HourlyTempChart({
  data,
  unitLabel,
}: {
  data: HourlyPoint[];
  unitLabel: string;
}) {
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, name: d.label })),
    [data]
  );
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis
            tick={axisStyle}
            axisLine={false}
            tickLine={false}
            width={36}
            label={{ value: unitLabel, angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Area
            type="monotone"
            dataKey="temp"
            name={`Temp (${unitLabel})`}
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#tempFill)"
            isAnimationActive={false}
          />
          <Brush dataKey="name" height={22} stroke="#38bdf8" travellerWidth={8} />
        </AreaChart>
      </ResponsiveContainer>
      <p className="chart-hint">Drag the brush below the chart to zoom the time range.</p>
    </div>
  );
}

export function DailyTempChart({
  data,
  unitLabel,
}: {
  data: DailyAgg[];
  unitLabel: string;
}) {
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, name: d.label, tmin: d.tempMin, tmax: d.tempMax })),
    [data]
  );
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="tmax"
            name={`High (${unitLabel})`}
            stroke="#fbbf24"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="tmin"
            name={`Low (${unitLabel})`}
            stroke="#38bdf8"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PrecipitationChart({ data }: { data: HourlyPoint[] }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        name: d.label,
        rain: Math.round(d.rainMm * 10) / 10,
        popPct: Math.round(d.pop * 100),
      })),
    [data]
  );
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={axisStyle} axisLine={false} tickLine={false} width={32} />
          <YAxis
            yAxisId="r"
            orientation="right"
            tick={axisStyle}
            axisLine={false}
            tickLine={false}
            width={32}
            domain={[0, 100]}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar yAxisId="l" dataKey="rain" name="Rain / snow (mm)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="r" dataKey="popPct" name="Precip chance %" fill="#a78bfa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WindChart({ data, windUnit }: { data: HourlyPoint[]; windUnit: string }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        name: d.label,
        dir: windDirection(d.windDeg),
      })),
    [data]
  );

  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            content={({ active: a, payload, label }) => {
              if (!a || !payload?.length) return null;
              const row = payload[0]?.payload as HourlyPoint & { name: string; dir: string };
              return (
                <ChartTooltip
                  active
                  label={label}
                  payload={[
                    { name: `Wind (${windUnit})`, value: row.wind, dataKey: "w", color: "#34d399" },
                    { name: "Direction", value: row.dir, dataKey: "d", color: "#94a3b8" },
                  ]}
                />
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="wind"
            name={`Wind (${windUnit})`}
            stroke="#34d399"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="chart-hint">Hover points for speed and compass direction (8-point).</p>
    </div>
  );
}
