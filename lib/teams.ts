export type Confederation =
  | "UEFA"
  | "CONMEBOL"
  | "CONCACAF"
  | "CAF"
  | "AFC"
  | "OFC";

export interface Team {
  id: string;
  name: string;
  flag: string;
  attack_rate: number;
  defence_rate: number;
  elo: number;
  fifa_rank: number;
  form_pts: number;
  confederation: Confederation;
  wc22_stage: string;
  funFacts: string[];
}

export const teams: Record<string, Team> = {
  argentina: { id: "argentina", name: "Argentina", flag: "🇦🇷", attack_rate: 2.05, defence_rate: 0.78, elo: 2106, fifa_rank: 1, form_pts: 2.4, confederation: "CONMEBOL", wc22_stage: "Champions", funFacts: [
    "Argentina's biggest rivalry isn't even international — it's Boca Juniors vs River Plate, a derby so intense it's been voted the 'match to see before you die'.",
    "Diego Maradona once scored a goal with his hand and called it the 'Hand of God' — and 40 years later, people are still mad about it.",
  ] },
  france: { id: "france", name: "France", flag: "🇫🇷", attack_rate: 2.0, defence_rate: 0.85, elo: 2042, fifa_rank: 2, form_pts: 2.2, confederation: "UEFA", wc22_stage: "Runners-up", funFacts: [
    "After winning the 1998 World Cup, half of Paris partied so hard that a giant photo of the team's faces was projected onto the Arc de Triomphe.",
    "Kylian Mbappé scored a hat-trick in the 2022 final and still ended up on the losing side — arguably the most heartbreaking hat-trick in history.",
  ] },
  spain: { id: "spain", name: "Spain", flag: "🇪🇸", attack_rate: 2.1, defence_rate: 0.75, elo: 2080, fifa_rank: 3, form_pts: 2.6, confederation: "UEFA", wc22_stage: "Round of 16", funFacts: [
    "Spain went over 80 years without a major trophy, then won Euro 2008, the 2010 World Cup, and Euro 2012 back-to-back-to-back like they'd been saving it all up.",
    "Spain's nickname 'La Furia Roja' (The Red Fury) sounds like a finishing move in a wrestling game, not a football team.",
  ] },
  england: { id: "england", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", attack_rate: 1.95, defence_rate: 0.8, elo: 2020, fifa_rank: 4, form_pts: 2.1, confederation: "UEFA", wc22_stage: "Quarter-finals", funFacts: [
    "England fans have been singing 'Football's coming home' since 1996 — the song is now older than most of the players they're singing it for.",
    "England are so synonymous with losing penalty shootouts that it's basically become its own genre of sports meme.",
  ] },
  brazil: { id: "brazil", name: "Brazil", flag: "🇧🇷", attack_rate: 2.0, defence_rate: 0.82, elo: 2010, fifa_rank: 5, form_pts: 1.9, confederation: "CONMEBOL", wc22_stage: "Quarter-finals", funFacts: [
    "Pelé scored his 1,000th career goal in 1969 and the match was literally paused so fans could run on and hug him.",
    "Brazil is the only country to play at every World Cup since 1930 — they treat missing it the way other countries treat missing Christmas.",
  ] },
  portugal: { id: "portugal", name: "Portugal", flag: "🇵🇹", attack_rate: 1.9, defence_rate: 0.85, elo: 1990, fifa_rank: 6, form_pts: 2.3, confederation: "UEFA", wc22_stage: "Quarter-finals", funFacts: [
    "Madeira's airport is officially named after Cristiano Ronaldo — so he has scored against rival nations AND has his own runway.",
    "Ronaldo has scored against more than 40 different national teams, which means somewhere a goalkeeper is still having nightmares about him.",
  ] },
  netherlands: { id: "netherlands", name: "Netherlands", flag: "🇳🇱", attack_rate: 1.85, defence_rate: 0.8, elo: 1985, fifa_rank: 7, form_pts: 2.0, confederation: "UEFA", wc22_stage: "Quarter-finals", funFacts: [
    "The Dutch are nicknamed 'Oranje' even though orange isn't a color on their flag — it's just the royal family's favorite color, and nobody argued.",
    "The Netherlands have lost three World Cup finals (1974, 1978, 2010) — close enough to taste it, three separate times.",
  ] },
  germany: { id: "germany", name: "Germany", flag: "🇩🇪", attack_rate: 1.9, defence_rate: 0.88, elo: 1965, fifa_rank: 8, form_pts: 1.8, confederation: "UEFA", wc22_stage: "Group Stage", funFacts: [
    "Germany beat host nation Brazil 7-1 in a 2014 World Cup semi-final — a scoreline so absurd it got its own nickname, the 'Mineirazo'.",
    "Germany has won the World Cup as 'West Germany' and as a unified Germany — they've literally won under two different national identities.",
  ] },
  croatia: { id: "croatia", name: "Croatia", flag: "🇭🇷", attack_rate: 1.7, defence_rate: 0.85, elo: 1945, fifa_rank: 10, form_pts: 1.9, confederation: "UEFA", wc22_stage: "Third place", funFacts: [
    "Croatia has about 4 million people — roughly the population of Los Angeles — and still made the 2018 World Cup final.",
    "Croatia's iconic red-and-white checkerboard kit is based on their coat of arms, and is instantly recognizable even to people who've never watched a match.",
  ] },
  belgium: { id: "belgium", name: "Belgium", flag: "🇧🇪", attack_rate: 1.75, defence_rate: 0.9, elo: 1935, fifa_rank: 11, form_pts: 1.8, confederation: "UEFA", wc22_stage: "Round of 16", funFacts: [
    "Belgium's 2010s 'Golden Generation' was so stacked that pundits joked their substitutes' bench could field its own competitive national team.",
    "Belgium is famous for waffles, chocolate, AND a team nicknamed the 'Red Devils' — possibly the most aggressively delicious-yet-terrifying combo in football.",
  ] },
  morocco: { id: "morocco", name: "Morocco", flag: "🇲🇦", attack_rate: 1.65, defence_rate: 0.7, elo: 1925, fifa_rank: 12, form_pts: 2.1, confederation: "CAF", wc22_stage: "Fourth place", funFacts: [
    "After their historic 2022 wins, Morocco's players brought their moms onto the pitch for post-match interviews — instantly the most wholesome moment of the tournament.",
    "Morocco beat Spain and Portugal back-to-back at the 2022 World Cup, basically telling the Iberian Peninsula 'not today'.",
  ] },
  japan: { id: "japan", name: "Japan", flag: "🇯🇵", attack_rate: 1.7, defence_rate: 0.88, elo: 1900, fifa_rank: 13, form_pts: 2.0, confederation: "AFC", wc22_stage: "Round of 16", funFacts: [
    "Japanese fans are famous for staying behind to clean up the stadium stands after matches — win, lose, or draw.",
    "Japan beat both Germany and Spain at the 2022 World Cup in the same group — the football equivalent of beating two bosses before the final level.",
  ] },
  mexico: { id: "mexico", name: "Mexico", flag: "🇲🇽", attack_rate: 1.6, defence_rate: 0.95, elo: 1850, fifa_rank: 14, form_pts: 1.7, confederation: "CONCACAF", wc22_stage: "Group Stage", funFacts: [
    "Mexico will become the first country to host three World Cups (1970, 1986, 2026) — at this point they should just get a permanent trophy display case.",
    "Mexican fans are so famous for a stadium-wide chant during opposing goal kicks that FIFA has fined the federation over it more than once.",
  ] },
  senegal: { id: "senegal", name: "Senegal", flag: "🇸🇳", attack_rate: 1.6, defence_rate: 0.9, elo: 1880, fifa_rank: 15, form_pts: 1.8, confederation: "CAF", wc22_stage: "Round of 16", funFacts: [
    "In 2002, Senegal beat the defending champions France in their very first-ever World Cup match — talk about a debut.",
    "Senegal's squad is famous for breaking into full synchronized dance routines after scoring, turning celebrations into mini concerts.",
  ] },
  uruguay: { id: "uruguay", name: "Uruguay", flag: "🇺🇾", attack_rate: 1.6, defence_rate: 0.85, elo: 1895, fifa_rank: 17, form_pts: 1.8, confederation: "CONMEBOL", wc22_stage: "Group Stage", funFacts: [
    "Uruguay has a population smaller than many cities, yet they've won the World Cup twice — pound for pound maybe the most overachieving football nation ever.",
    "Uruguay's 1950 win over Brazil was so devastating it's simply called the 'Maracanazo' — Brazilians still bring it up at parties, 75 years later.",
  ] },
  colombia: { id: "colombia", name: "Colombia", flag: "🇨🇴", attack_rate: 1.7, defence_rate: 0.88, elo: 1905, fifa_rank: 18, form_pts: 2.1, confederation: "CONMEBOL", wc22_stage: "Did not qualify", funFacts: [
    "James Rodríguez's chest-and-volley goal against Uruguay in 2014 is so good that people still slow it down frame-by-frame just to admire it.",
    "Colombian fans celebrate big wins with so many fireworks that air-quality sensors in Bogotá have reportedly noticed.",
  ] },
  switzerland: { id: "switzerland", name: "Switzerland", flag: "🇨🇭", attack_rate: 1.55, defence_rate: 0.85, elo: 1880, fifa_rank: 19, form_pts: 1.8, confederation: "UEFA", wc22_stage: "Round of 16", funFacts: [
    "Switzerland knocked the reigning World Cup champions France out of Euro 2020 on penalties — quite the upset for a country better known for chocolate and trains that run on time.",
    "Switzerland's squads are famously multilingual, with players sometimes choosing between national teams thanks to the country's mix of cultures.",
  ] },
  southkorea: { id: "southkorea", name: "South Korea", flag: "🇰🇷", attack_rate: 1.55, defence_rate: 0.95, elo: 1850, fifa_rank: 20, form_pts: 1.7, confederation: "AFC", wc22_stage: "Round of 16", funFacts: [
    "South Korea's 2002 semi-final run included beating Italy and Spain, sparking the biggest street parties the country had ever seen — millions wore matching red shirts.",
    "South Korea has qualified for ten World Cups in a row — they're basically never not invited to the party.",
  ] },
  usa: { id: "usa", name: "USA", flag: "🇺🇸", attack_rate: 1.6, defence_rate: 0.92, elo: 1830, fifa_rank: 21, form_pts: 1.6, confederation: "CONCACAF", wc22_stage: "Round of 16", funFacts: [
    "American fans love chanting 'I believe that we will win' — even when, statistically, they often will not.",
    "The 1994 World Cup, hosted solely by the USA, set attendance records that still stand today, despite soccer being a 'niche' sport there at the time.",
  ] },
  austria: { id: "austria", name: "Austria", flag: "🇦🇹", attack_rate: 1.6, defence_rate: 0.9, elo: 1860, fifa_rank: 22, form_pts: 1.9, confederation: "UEFA", wc22_stage: "Did not qualify", funFacts: [
    "Austria's 1930s side was nicknamed the 'Wunderteam' — a name so good that every modern Austrian squad gets unfavorably compared to it.",
    "Austria once played a match at the 1982 World Cup so suspiciously convenient for both teams that it's remembered as the 'Disgrace of Gijón'.",
  ] },
  turkey: { id: "turkey", name: "Türkiye", flag: "🇹🇷", attack_rate: 1.6, defence_rate: 0.92, elo: 1855, fifa_rank: 23, form_pts: 1.8, confederation: "UEFA", wc22_stage: "Did not qualify", funFacts: [
    "Türkiye's Hakan Şükür scored the fastest goal in World Cup history — just 11 seconds into a 2002 third-place match. Some fans were probably still finding their seats.",
    "Turkish stadiums are regularly rated among the loudest and most intimidating in world football — visiting players have compared it to playing inside a drum.",
  ] },
  australia: { id: "australia", name: "Australia", flag: "🇦🇺", attack_rate: 1.4, defence_rate: 0.95, elo: 1780, fifa_rank: 27, form_pts: 1.6, confederation: "AFC", wc22_stage: "Round of 16", funFacts: [
    "Australia switched football confederations from Oceania to Asia in 2006, basically saying 'we're tired of beating the same three teams every cycle'.",
    "The Socceroos' 2022 Round of 16 win reportedly had fans back home setting alarms for 5am just to watch — dedication that should come with a medal of its own.",
  ] },
  ecuador: { id: "ecuador", name: "Ecuador", flag: "🇪🇨", attack_rate: 1.45, defence_rate: 0.85, elo: 1800, fifa_rank: 28, form_pts: 1.7, confederation: "CONMEBOL", wc22_stage: "Group Stage", funFacts: [
    "Ecuador opened the 2022 World Cup by beating host nation Qatar 2-0 — the ultimate party-crasher move.",
    "Ecuador plays home qualifiers high up in Quito, where the thin mountain air leaves visiting teams gasping like they've run a marathon just to kick off.",
  ] },
  iran: { id: "iran", name: "IR Iran", flag: "🇮🇷", attack_rate: 1.5, defence_rate: 1.0, elo: 1790, fifa_rank: 29, form_pts: 1.6, confederation: "AFC", wc22_stage: "Group Stage", funFacts: [
    "Iran's 2-1 win over the USA in 1998 was nicknamed the 'Mother of All Games' — yet players from both teams swapped gifts and posed for photos afterward, like the politest grudge match ever.",
    "Iranian fans turn the stands into a sea of color with elaborate face-painting and giant flag displays for every match.",
  ] },
  canada: { id: "canada", name: "Canada", flag: "🇨🇦", attack_rate: 1.5, defence_rate: 0.95, elo: 1790, fifa_rank: 31, form_pts: 1.7, confederation: "CONCACAF", wc22_stage: "Group Stage", funFacts: [
    "Canada's men's team waited 36 years between World Cup appearances (1986 to 2022) — their qualification party reportedly went on for days.",
    "Canada becomes the first country ever to co-host a World Cup with two neighbors at once — basically a football road trip with friends.",
  ] },
  algeria: { id: "algeria", name: "Algeria", flag: "🇩🇿", attack_rate: 1.5, defence_rate: 0.95, elo: 1780, fifa_rank: 33, form_pts: 1.7, confederation: "CAF", wc22_stage: "Did not qualify", funFacts: [
    "After Algeria's 1982 upset of West Germany, the two European teams played a suspiciously convenient match that Algerian fans protested by waving banknotes at the players.",
    "Algeria pushed eventual champions Germany to extra time in the 2014 Round of 16 — the champs needed every extra minute to get past them.",
  ] },
  egypt: { id: "egypt", name: "Egypt", flag: "🇪🇬", attack_rate: 1.4, defence_rate: 0.95, elo: 1770, fifa_rank: 34, form_pts: 1.6, confederation: "CAF", wc22_stage: "Did not qualify", funFacts: [
    "Mohamed Salah is so beloved in Egypt that entire building walls in Cairo are painted with his face.",
    "Egypt has won the Africa Cup of Nations a record seven times — they collect continental titles like trading cards.",
  ] },
  ivorycoast: { id: "ivorycoast", name: "Côte d'Ivoire", flag: "🇨🇮", attack_rate: 1.5, defence_rate: 1.0, elo: 1775, fifa_rank: 35, form_pts: 1.7, confederation: "CAF", wc22_stage: "Did not qualify", funFacts: [
    "Côte d'Ivoire's 'Golden Generation', led by Didier Drogba, once helped pause a civil war for a moment of national unity after qualifying for the 2006 World Cup — football literally stopped a war.",
    "The team's nickname, 'The Elephants', is fitting for a side known for both raw power and surprisingly delicate footwork.",
  ] },
  saudiarabia: { id: "saudiarabia", name: "Saudi Arabia", flag: "🇸🇦", attack_rate: 1.35, defence_rate: 1.0, elo: 1740, fifa_rank: 36, form_pts: 1.5, confederation: "AFC", wc22_stage: "Group Stage", funFacts: [
    "After Saudi Arabia's shock 2-1 win over Argentina in 2022, the government declared a national holiday — possibly the best 'we won, everyone stay home' excuse ever.",
    "Fans celebrated that win so hard that seismologists reportedly picked up earthquake-like tremors in Riyadh.",
  ] },
  paraguay: { id: "paraguay", name: "Paraguay", flag: "🇵🇾", attack_rate: 1.35, defence_rate: 0.95, elo: 1750, fifa_rank: 37, form_pts: 1.6, confederation: "CONMEBOL", wc22_stage: "Did not qualify", funFacts: [
    "Goalkeeper José Luis Chilavert used to take Paraguay's free kicks AND penalties, scoring over 60 career goals — more than plenty of actual strikers.",
    "Paraguay reached the Round of 16 or better in four straight World Cups despite barely ever scoring more than one goal a game — proof that defense (and penalty shootouts) really can take you places.",
  ] },
  ghana: { id: "ghana", name: "Ghana", flag: "🇬🇭", attack_rate: 1.4, defence_rate: 1.05, elo: 1720, fifa_rank: 39, form_pts: 1.5, confederation: "CAF", wc22_stage: "Group Stage", funFacts: [
    "In 2010, Ghana came one missed penalty away from a historic semi-final after Luis Suárez handballed a goal-bound shot off the line — Ghanaians still haven't forgiven him.",
    "Ghana's nickname 'Black Stars' comes straight off the national flag, making it one of the most patriotically-loaded team names in football.",
  ] },
  tunisia: { id: "tunisia", name: "Tunisia", flag: "🇹🇳", attack_rate: 1.3, defence_rate: 0.95, elo: 1725, fifa_rank: 40, form_pts: 1.4, confederation: "CAF", wc22_stage: "Group Stage", funFacts: [
    "Tunisia beat the reigning champions France at the 2022 World Cup and celebrated like they'd won the whole thing.",
    "Tunisia was the first African nation to ever win a World Cup match, beating Mexico 3-1 back in 1978 — they've been trendsetters ever since.",
  ] },
  iraq: { id: "iraq", name: "Iraq", flag: "🇮🇶", attack_rate: 1.25, defence_rate: 1.05, elo: 1680, fifa_rank: 43, form_pts: 1.4, confederation: "AFC", wc22_stage: "Did not qualify", funFacts: [
    "Iraq won the 2007 Asian Cup despite having to train abroad due to the security situation back home — and the whole country erupted regardless.",
    "Iraqi fans celebrate goals so loudly that TV commentators have had to pause broadcasts just to let the noise pass.",
  ] },
  southafrica: { id: "southafrica", name: "South Africa", flag: "🇿🇦", attack_rate: 1.3, defence_rate: 1.05, elo: 1690, fifa_rank: 44, form_pts: 1.5, confederation: "CAF", wc22_stage: "Did not qualify", funFacts: [
    "South Africa's 2010 World Cup introduced the world to the vuvuzela — a plastic horn so loud broadcasters had to add audio filters to tone it down.",
    "The team's nickname 'Bafana Bafana' means 'The Boys, The Boys' in Zulu — possibly the friendliest, most huggable nickname in football.",
  ] },
  newzealand: { id: "newzealand", name: "New Zealand", flag: "🇳🇿", attack_rate: 1.15, defence_rate: 1.1, elo: 1620, fifa_rank: 46, form_pts: 1.4, confederation: "OFC", wc22_stage: "Did not qualify", funFacts: [
    "New Zealand's 'All Whites' went through the entire 2010 World Cup unbeaten — three draws, zero wins, zero losses, technically the only undefeated team at the tournament.",
    "New Zealand once topped the football headlines back home over rugby news for a weekend — in a country where that practically never happens.",
  ] },
  panama: { id: "panama", name: "Panama", flag: "🇵🇦", attack_rate: 1.2, defence_rate: 1.05, elo: 1660, fifa_rank: 47, form_pts: 1.4, confederation: "CONCACAF", wc22_stage: "Did not qualify", funFacts: [
    "Panama's first-ever World Cup goal in 2018 sparked celebrations so wild that TV commentators were filmed crying and screaming live on air.",
    "That goal famously didn't fully cross the line — but without goal-line tech it stood, breaking Costa Rican hearts forever.",
  ] },
  czechrepublic: { id: "czechrepublic", name: "Czechia", flag: "🇨🇿", attack_rate: 1.4, defence_rate: 0.95, elo: 1730, fifa_rank: 41, form_pts: 1.5, confederation: "UEFA", wc22_stage: "Did not qualify", funFacts: [
    "Czechoslovakia, Czechia's predecessor, reached two World Cup finals (1934 and 1962) and lost both — some habits die hard.",
    "At Euro 1996, Czechia lost the final to Germany on the very first 'golden goal' in major tournament history — an unfortunate way to make the history books.",
  ] },
  bosnia: { id: "bosnia", name: "Bosnia & Herzegovina", flag: "🇧🇦", attack_rate: 1.35, defence_rate: 1.0, elo: 1700, fifa_rank: 45, form_pts: 1.4, confederation: "UEFA", wc22_stage: "Did not qualify", funFacts: [
    "Bosnia and Herzegovina's all-time top scorer Edin Džeko is nicknamed 'The Diamond' — fitting, since he's been a gem for every club he's ever played for.",
    "Bosnia made their World Cup debut in 2014, just two decades after the country's independence — turning qualification into one giant national party.",
  ] },
  qatar: { id: "qatar", name: "Qatar", flag: "🇶🇦", attack_rate: 1.25, defence_rate: 1.1, elo: 1690, fifa_rank: 42, form_pts: 1.3, confederation: "AFC", wc22_stage: "Group Stage", funFacts: [
    "Qatar built entire stadiums (including one made partly from shipping containers that could be disassembled afterward) just to host the 2022 World Cup.",
    "Qatar is the only host nation in World Cup history to lose its opening match — falling 2-0 to Ecuador in 2022, the world's most awkward home debut.",
  ] },
  scotland: { id: "scotland", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", attack_rate: 1.45, defence_rate: 0.95, elo: 1750, fifa_rank: 38, form_pts: 1.5, confederation: "UEFA", wc22_stage: "Did not qualify", funFacts: [
    "Scotland and England played the world's very first international football match in 1872 — it ended 0-0, setting the bar for centuries of nervy Scotland football to come.",
    "The 'Tartan Army', Scotland's traveling fans, regularly win awards for being among the friendliest supporters in football, even when their team is losing.",
  ] },
  haiti: { id: "haiti", name: "Haiti", flag: "🇭🇹", attack_rate: 1.15, defence_rate: 1.2, elo: 1620, fifa_rank: 48, form_pts: 1.2, confederation: "CONCACAF", wc22_stage: "Did not qualify", funFacts: [
    "Haiti's 2026 qualification came 52 years after their only previous World Cup in 1974 — a wait so long that none of the current players were even born yet.",
    "In 1974, Haiti scored against the eventual champions Italy, ending Italy's run of not conceding a goal in the tournament — a true party-pooper moment.",
  ] },
  curacao: { id: "curacao", name: "Curaçao", flag: "🇨🇼", attack_rate: 1.15, defence_rate: 1.15, elo: 1640, fifa_rank: 47, form_pts: 1.4, confederation: "CONCACAF", wc22_stage: "Did not qualify", funFacts: [
    "Curaçao, an island of around 150,000 people, is about to become one of the smallest nations ever to reach a World Cup — fewer people than fit in some stadiums combined.",
    "Several Curaçao internationals also qualify for the Netherlands national team — which must make for some interesting family group chats.",
  ] },
  sweden: { id: "sweden", name: "Sweden", flag: "🇸🇪", attack_rate: 1.6, defence_rate: 0.95, elo: 1820, fifa_rank: 30, form_pts: 1.6, confederation: "UEFA", wc22_stage: "Did not qualify", funFacts: [
    "Sweden hosted the 1958 World Cup and reached the final — only to lose to a 17-year-old kid named Pelé, who scored twice against them.",
    "Swedish fans are famously calm and orderly — even their wildest celebrations look more like polite applause than a pitch invasion.",
  ] },
  capeverde: { id: "capeverde", name: "Cabo Verde", flag: "🇨🇻", attack_rate: 1.2, defence_rate: 1.0, elo: 1690, fifa_rank: 44, form_pts: 1.5, confederation: "CAF", wc22_stage: "Did not qualify", funFacts: [
    "Cabo Verde has a population of around 500,000 — smaller than the combined capacity of several World Cup stadiums — yet they're heading to 2026.",
    "Their nickname, 'Tubarões Azuis' (the Blue Sharks), sounds way more menacing than 'a country made up of ten small islands'.",
  ] },
  norway: { id: "norway", name: "Norway", flag: "🇳🇴", attack_rate: 1.6, defence_rate: 0.95, elo: 1820, fifa_rank: 33, form_pts: 1.7, confederation: "UEFA", wc22_stage: "Did not qualify", funFacts: [
    "Norway beat Brazil at the 1998 World Cup, a result so shocking that commentators back home reportedly lost their voices from screaming.",
    "Norway's Erling Haaland celebrates goals by sitting cross-legged on the pitch in a meditation pose — a celebration so iconic that kids copy it on playgrounds worldwide.",
  ] },
  jordan: { id: "jordan", name: "Jordan", flag: "🇯🇴", attack_rate: 1.15, defence_rate: 1.05, elo: 1670, fifa_rank: 46, form_pts: 1.3, confederation: "AFC", wc22_stage: "Did not qualify", funFacts: [
    "When Jordan reached the 2023 Asian Cup final for the first time, the national airline reportedly offered discounted flights so fans could follow the team.",
    "Jordan's 2026 World Cup debut comes after decades of near-misses — fans have basically been rehearsing their celebrations for years just in case.",
  ] },
  congodr: { id: "congodr", name: "Congo DR", flag: "🇨🇩", attack_rate: 1.25, defence_rate: 1.1, elo: 1680, fifa_rank: 49, form_pts: 1.4, confederation: "CAF", wc22_stage: "Did not qualify", funFacts: [
    "At the 1974 World Cup, a Zaire (now DR Congo) defender ran out of the wall and booted the ball away before a free kick was even taken — one of football's all-time funniest moments of panic.",
    "DR Congo has won the Africa Cup of Nations twice, but under two different national names (Congo and Zaire) — a genuine football identity crisis.",
  ] },
  uzbekistan: { id: "uzbekistan", name: "Uzbekistan", flag: "🇺🇿", attack_rate: 1.2, defence_rate: 1.05, elo: 1660, fifa_rank: 50, form_pts: 1.5, confederation: "AFC", wc22_stage: "Did not qualify", funFacts: [
    "Uzbekistan's 2026 qualification ended one of Asian football's longest 'best team to never make it' streaks — fans reportedly partied in Tashkent's streets for days.",
    "Uzbekistan's youth academy has been so productive lately that pundits jokingly call it a 'football factory'.",
  ] },
};

export function getTeam(id: string): Team | undefined {
  return teams[id];
}

export const teamList: Team[] = Object.values(teams);

const confederationNames: Record<Confederation, { en: string; de: string }> = {
  UEFA: { en: "Europe (UEFA)", de: "Europa (UEFA)" },
  CONMEBOL: { en: "South America (CONMEBOL)", de: "Südamerika (CONMEBOL)" },
  CONCACAF: { en: "North/Central America & Caribbean (CONCACAF)", de: "Nord-/Mittelamerika & Karibik (CONCACAF)" },
  CAF: { en: "Africa (CAF)", de: "Afrika (CAF)" },
  AFC: { en: "Asia (AFC)", de: "Asien (AFC)" },
  OFC: { en: "Oceania (OFC)", de: "Ozeanien (OFC)" },
};

/** Generates a handful of quick facts about a team for the prediction page. */
export function getTeamFacts(team: Team, lang: "en" | "de" = "en"): string[] {
  const conf = confederationNames[team.confederation][lang];

  if (lang === "de") {
    return [
      `${team.flag} ${team.name} liegt aktuell auf Platz ${team.fifa_rank} der FIFA-Weltrangliste.`,
      `Die ELO-Bewertung des Teams beträgt ${team.elo} Punkte.`,
      `Bei der WM 2022 erreichte ${team.name}: ${team.wc22_stage}.`,
      `${team.name} spielt in der Confederation: ${conf}.`,
      `Aktuelle Form: ${team.form_pts.toFixed(1)} Punkte pro Spiel in den letzten 10 Partien.`,
    ];
  }

  return [
    `${team.flag} ${team.name} are currently ranked #${team.fifa_rank} in the FIFA World Rankings.`,
    `Their current ELO rating is ${team.elo} points.`,
    `At the 2022 World Cup, ${team.name} reached: ${team.wc22_stage}.`,
    `${team.name} compete in the ${conf} confederation.`,
    `Recent form: ${team.form_pts.toFixed(1)} points per game over their last 10 matches.`,
  ];
}

/** Fun facts about a team's history in football, always in English. */
export function getFunFacts(team: Team): string[] {
  return team.funFacts;
}
