import type { BasketballTeamInfo, GameStatus, BasketballLeague } from '../types';

interface ScoreboardProps {
  league: BasketballLeague;
  date: string;
  time?: string;
  status: GameStatus;
  homeTeam: BasketballTeamInfo;
  awayTeam: BasketballTeamInfo;
}

export function Scoreboard({ league, date, time, status, homeTeam, awayTeam }: ScoreboardProps) {
  // 리그 색상 - Apps SDK UI 시멘틱 컬러 사용
  const getLeagueColor = (league: string) => {
    switch (league) {
      case 'NBA': return 'text-info';
      case 'KBL': return 'text-warning';
      case 'WKBL': return 'text-discovery';
      default: return 'text-secondary';
    }
  };

  // 경기 상태 색상 - Apps SDK UI 시멘틱 컬러 사용
  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case '경기종료': return 'text-secondary';
      case '경기중': return 'text-danger';
      case '경기전': return 'text-info';
      default: return 'text-secondary';
    }
  };

  // 팀 로고 또는 플레이스홀더
  const TeamLogo = ({ team }: { team: BasketballTeamInfo }) => (
    <div className="w-12 h-12 flex items-center justify-center">
      {team.logo ? (
        <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain" />
      ) : (
        <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center text-xs font-semibold text-secondary">
          {team.shortName.slice(0, 2)}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-surface rounded-lg border border-default shadow-sm">
      {/* 헤더: 리그, 날짜, 상태 */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-subtle">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${getLeagueColor(league)}`}>{league}</span>
          <span className="text-tertiary text-sm">{date}</span>
          {time && status === '경기전' && (
            <span className="text-secondary text-sm">{time}</span>
          )}
        </div>
        <span className={`text-sm font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* 스코어보드 */}
      <div className="flex items-center justify-center py-6 px-4">
        {/* 홈팀 */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamLogo team={homeTeam} />
          <div className="text-center">
            <div className="font-medium text-default">{homeTeam.shortName}</div>
            <div className="text-xs text-tertiary">{homeTeam.record}</div>
          </div>
        </div>

        {/* 점수 */}
        <div className="flex items-center gap-4 px-6">
          <span className="text-4xl font-bold text-default tabular-nums">
            {status === '경기전' ? '-' : homeTeam.score}
          </span>
          <span className="text-2xl text-tertiary">vs</span>
          <span className="text-4xl font-bold text-default tabular-nums">
            {status === '경기전' ? '-' : awayTeam.score}
          </span>
        </div>

        {/* 원정팀 */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamLogo team={awayTeam} />
          <div className="text-center">
            <div className="font-medium text-default">{awayTeam.shortName}</div>
            <div className="text-xs text-tertiary">{awayTeam.record}</div>
          </div>
        </div>
      </div>

      {/* 쿼터별 점수 (경기중, 경기종료 시에만) */}
      {status !== '경기전' && homeTeam.quarterScores && awayTeam.quarterScores && (
        <QuarterScoresTable
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
    </div>
  );
}

// 쿼터별 점수 테이블
function QuarterScoresTable({
  homeTeam,
  awayTeam,
}: {
  homeTeam: BasketballTeamInfo;
  awayTeam: BasketballTeamInfo;
}) {
  const homeQ = homeTeam.quarterScores!;
  const awayQ = awayTeam.quarterScores!;
  const hasOT = homeQ.ot && homeQ.ot.length > 0;

  return (
    <div className="border-t border-subtle px-4 py-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-secondary">
            <th className="text-left font-medium py-1 w-24">팀</th>
            <th className="text-center font-medium py-1 w-12">1Q</th>
            <th className="text-center font-medium py-1 w-12">2Q</th>
            <th className="text-center font-medium py-1 w-12">3Q</th>
            <th className="text-center font-medium py-1 w-12">4Q</th>
            {hasOT && homeQ.ot!.map((_, idx) => (
              <th key={idx} className="text-center font-medium py-1 w-12">
                {idx === 0 ? 'OT' : `OT${idx + 1}`}
              </th>
            ))}
            <th className="text-center font-medium py-1 w-14">총점</th>
          </tr>
        </thead>
        <tbody className="text-default">
          <tr>
            <td className="text-left py-1 font-medium">{homeTeam.shortName}</td>
            <td className="text-center py-1 tabular-nums">{homeQ.q1}</td>
            <td className="text-center py-1 tabular-nums">{homeQ.q2}</td>
            <td className="text-center py-1 tabular-nums">{homeQ.q3}</td>
            <td className="text-center py-1 tabular-nums">{homeQ.q4}</td>
            {hasOT && homeQ.ot!.map((score, idx) => (
              <td key={idx} className="text-center py-1 tabular-nums">{score}</td>
            ))}
            <td className="text-center py-1 tabular-nums font-bold">{homeTeam.score}</td>
          </tr>
          <tr>
            <td className="text-left py-1 font-medium">{awayTeam.shortName}</td>
            <td className="text-center py-1 tabular-nums">{awayQ.q1}</td>
            <td className="text-center py-1 tabular-nums">{awayQ.q2}</td>
            <td className="text-center py-1 tabular-nums">{awayQ.q3}</td>
            <td className="text-center py-1 tabular-nums">{awayQ.q4}</td>
            {hasOT && awayQ.ot!.map((score, idx) => (
              <td key={idx} className="text-center py-1 tabular-nums">{score}</td>
            ))}
            <td className="text-center py-1 tabular-nums font-bold">{awayTeam.score}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Scoreboard;
