import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { predictMatch } from "@/lib/prediction";
import { getTeam } from "@/lib/teams";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { homeTeam, awayTeam } = body as { homeTeam?: string; awayTeam?: string };

  if (!homeTeam || !awayTeam) {
    return NextResponse.json({ error: "homeTeam and awayTeam are required" }, { status: 400 });
  }

  const home = getTeam(homeTeam);
  const away = getTeam(awayTeam);
  if (!home || !away) {
    return NextResponse.json({ error: "Unknown team id" }, { status: 400 });
  }

  const prediction = predictMatch(homeTeam, awayTeam);
  if (!prediction) {
    return NextResponse.json({ error: "Could not generate prediction" }, { status: 500 });
  }

  let analysis = "";
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    analysis =
      "Set ANTHROPIC_API_KEY in your environment to enable Claude-powered match analysis. " +
      "In the meantime, here's a quick stat summary: " +
      `${home.name} (ELO ${home.elo}, FIFA #${home.fifa_rank}) face ${away.name} (ELO ${away.elo}, FIFA #${away.fifa_rank}). ` +
      `The model gives ${home.name} a ${(prediction.win_a * 100).toFixed(0)}% chance to win, ` +
      `a draw ${(prediction.draw * 100).toFixed(0)}%, and ${away.name} ${(prediction.win_b * 100).toFixed(0)}%, ` +
      `with an expected scoreline around ${prediction.most_likely_score[0].home}-${prediction.most_likely_score[0].away}.`;
  } else {
    try {
      const anthropic = new Anthropic({ apiKey });
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are a World Cup football analyst. Write a 3-paragraph expert analysis of the upcoming FIFA World Cup 2026 match between ${home.name} (FIFA rank #${home.fifa_rank}, ELO ${home.elo}, recent form ${home.form_pts} pts/game, attack rate ${home.attack_rate}, defence rate ${home.defence_rate}) and ${away.name} (FIFA rank #${away.fifa_rank}, ELO ${away.elo}, recent form ${away.form_pts} pts/game, attack rate ${away.attack_rate}, defence rate ${away.defence_rate}).

Our statistical model predicts: ${home.name} win ${(prediction.win_a * 100).toFixed(1)}%, draw ${(prediction.draw * 100).toFixed(1)}%, ${away.name} win ${(prediction.win_b * 100).toFixed(1)}%. Expected goals: ${home.name} ${prediction.xg_a.toFixed(2)}, ${away.name} ${prediction.xg_b.toFixed(2)}. Most likely scoreline: ${prediction.most_likely_score[0].home}-${prediction.most_likely_score[0].away}.

Paragraph 1: discuss each team's current form and tactical setup. Paragraph 2: discuss key players to watch for both teams. Paragraph 3: give your reasoning for how the match is likely to play out, referencing the statistical prediction. Keep it concise, insightful, and written for football fans.`,
          },
        ],
      });

      const textBlock = message.content.find((block) => block.type === "text");
      analysis = textBlock && textBlock.type === "text" ? textBlock.text : "No analysis returned.";
    } catch (err) {
      analysis = `Failed to reach Claude API: ${err instanceof Error ? err.message : "unknown error"}`;
    }
  }

  return NextResponse.json({ prediction, analysis });
}
