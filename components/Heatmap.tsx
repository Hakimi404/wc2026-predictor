interface HeatmapProps {
  matrix: number[][]; // [home][away]
  homeLabel: string;
  awayLabel: string;
}

export default function Heatmap({ matrix, homeLabel, awayLabel }: HeatmapProps) {
  const max = Math.max(...matrix.flat());

  function cellColor(value: number): string {
    const intensity = max > 0 ? value / max : 0;
    // Interpolate from white (low) to dark red (high)
    const r = Math.round(255 - intensity * (255 - 139));
    const g = Math.round(255 - intensity * 255);
    const b = Math.round(255 - intensity * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse mx-auto text-xs">
        <thead>
          <tr>
            <th className="p-1"></th>
            <th colSpan={matrix[0].length} className="p-1 text-center text-muted font-normal">
              {awayLabel} goals
            </th>
          </tr>
          <tr>
            <th className="p-1"></th>
            {matrix[0].map((_, awayGoals) => (
              <th key={awayGoals} className="p-1 text-center text-muted font-normal w-8">
                {awayGoals}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, homeGoals) => (
            <tr key={homeGoals}>
              {homeGoals === 0 ? (
                <th
                  rowSpan={matrix.length}
                  className="p-1 text-muted font-normal align-middle"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {homeLabel} goals
                </th>
              ) : null}
              {row.map((value, awayGoals) => (
                <td
                  key={awayGoals}
                  className="w-8 h-8 text-center border border-border"
                  style={{ backgroundColor: cellColor(value) }}
                  title={`${homeGoals}-${awayGoals}: ${(value * 100).toFixed(1)}%`}
                >
                  <span className="text-[10px] text-black/70">{(value * 100).toFixed(0)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
