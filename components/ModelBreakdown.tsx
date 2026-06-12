import { Prediction } from "@/lib/prediction";

interface ModelBreakdownProps {
  breakdown: Prediction["breakdown"];
  homeName: string;
  awayName: string;
}

const rows: { key: keyof ModelBreakdownProps["breakdown"]; label: string; weight: string }[] = [
  { key: "dixonColes", label: "Dixon-Coles Poisson", weight: "45%" },
  { key: "elo", label: "ELO Rating", weight: "35%" },
  { key: "form", label: "Recent Form", weight: "12%" },
  { key: "h2h", label: "Head to Head", weight: "8%" },
];

export default function ModelBreakdown({ breakdown, homeName, awayName }: ModelBreakdownProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border text-muted text-left">
            <th className="py-2 pr-2">Layer</th>
            <th className="py-2 px-2">Weight</th>
            <th className="py-2 px-2">{homeName} Win</th>
            <th className="py-2 px-2">Draw</th>
            <th className="py-2 px-2">{awayName} Win</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, label, weight }) => {
            const layer = breakdown[key];
            return (
              <tr key={key} className="border-b border-border/50">
                <td className="py-2 pr-2 font-medium">{label}</td>
                <td className="py-2 px-2 text-muted">{weight}</td>
                <td className="py-2 px-2">{(layer.win_a * 100).toFixed(1)}%</td>
                <td className="py-2 px-2">{(layer.draw * 100).toFixed(1)}%</td>
                <td className="py-2 px-2">{(layer.win_b * 100).toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
