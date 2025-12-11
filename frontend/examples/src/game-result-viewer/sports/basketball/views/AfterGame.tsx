import type { BasketballGameData } from '../types';
import { Scoreboard, PlayerStats, GameRecords, TeamComparison, LeagueStandings } from '../components';

interface AfterGameProps {
  data: BasketballGameData;
}

/**
 * 경기종료 화면
 * 순서: 스코어보드 → 선수스탯 → 경기기록(팀스탯) → 양팀비교 → 리그순위
 */
export function AfterGame({ data }: AfterGameProps) {
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

      {/* 2. 선수 스탯 */}
      <PlayerStats
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
      />

      {/* 3. 경기 기록 (팀 스탯 비교) */}
      {data.gameRecords && data.gameRecords.length > 0 && (
        <GameRecords
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
          gameRecords={data.gameRecords}
        />
      )}

      {/* 4. 양팀 비교 (최근 5경기, 맞대결) */}
      <TeamComparison
        league={data.league}
        date={data.date}
        status={data.status}
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
        headToHead={data.headToHead}
      />

      {/* 5. 리그 순위 */}
      {data.standings && data.standings.length > 0 && (
        <LeagueStandings standings={data.standings} />
      )}
    </div>
  );
}

export default AfterGame;
