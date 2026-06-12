interface ProbabilityBarProps {
  label: string;
  value: number; // 0-1
  color: "blue" | "grey" | "red";
}

const colorMap: Record<ProbabilityBarProps["color"], string> = {
  blue: "bg-blue",
  grey: "bg-muted",
  red: "bg-red",
};

export default function ProbabilityBar({ label, value, color }: ProbabilityBarProps) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted">{label}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="h-3 rounded-full bg-background border border-border overflow-hidden">
        <div
          key={pct}
          className={`prob-bar h-full rounded-full ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
