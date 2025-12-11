import type { BasketballGameData } from '../types';
import { TeamComparison, LeagueStandings } from '../components';

interface BeforeGameProps {
  data: BasketballGameData;
}

/**
 * 경기전 화면
 * - 양팀 비교 (경기 예정일, 리그명, 최근 5경기, 맞대결 기록)
 * - 리그 순위
 */
export function BeforeGame({ data }: BeforeGameProps) {
  return (
    <div className="space-y-4">
      {/* 양팀 비교 (경기 예정일, 리그명 포함) */}
      <TeamComparison
        league={data.league}
        date={data.date}
        time={data.time}
        status={data.status}
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
        headToHead={data.headToHead}
      />

      {/* 리그 순위 */}
      {data.standings && data.standings.length > 0 && (
        <LeagueStandings standings={data.standings} />
      )}
    </div>
  );
}

export default BeforeGame;
