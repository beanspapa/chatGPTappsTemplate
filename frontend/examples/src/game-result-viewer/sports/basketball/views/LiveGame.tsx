import type { BasketballGameData } from '../types';
import { Scoreboard, GameRecords, TeamComparison, LeagueStandings } from '../components';

interface LiveGameProps {
  data: BasketballGameData;
}

/**
 * 경기중 화면
 * 순서: 스코어보드 → 경기기록(팀스탯) → 양팀비교 → 리그순위
 */
export function LiveGame({ data }: LiveGameProps) {
  return (
    <div className="space-y-4">
      {/* 1. 스코어보드 (쿼터별 점수 포함) */}
      <Scoreboard
        league={data.league}
        date={data.date}
        status={data.status}
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
      />

      {/* 2. 경기 기록 (팀 스탯 비교) */}
      {data.gameRecords && data.gameRecords.length > 0 && (
        <GameRecords
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
          gameRecords={data.gameRecords}
        />
      )}

      {/* 3. 양팀 비교 (최근 5경기, 맞대결) */}
      <TeamComparison
        league={data.league}
        date={data.date}
        status={data.status}
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
        headToHead={data.headToHead}
      />

      {/* 4. 리그 순위 */}
      {data.standings && data.standings.length > 0 && (
        <LeagueStandings standings={data.standings} />
      )}
    </div>
  );
}

export default LiveGame;
