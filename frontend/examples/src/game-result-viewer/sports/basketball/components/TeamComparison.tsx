import type {
  BasketballTeamInfo,
  HeadToHeadRecord,
  RecentGameResult,
  GameStatus,
  BasketballLeague,
} from '../types';

interface TeamComparisonProps {
  league: BasketballLeague;
  date: string;
  time?: string;
  status: GameStatus;
  homeTeam: BasketballTeamInfo;
  awayTeam: BasketballTeamInfo;
  headToHead?: HeadToHeadRecord;
}

/**
 * 양팀 비교 컴포넌트
 * - 팀 헤더 (경기전: 날짜/시간, 경기중/후: vs)
 * - 최근 5경기
 * - 맞대결 기록
 */
export function TeamComparison({
  league,
  date,
  time,
  status,
  homeTeam,
  awayTeam,
  headToHead,
}: TeamComparisonProps) {
  return (
    <div className="bg-surface border border-default rounded-lg shadow-sm">
      {/* 헤더 (경기전에는 숨김) */}
      {status !== '경기전' && (
        <div className="px-4 py-3 border-b border-subtle">
          <h3 className="text-sm font-medium text-default">양팀 비교</h3>
        </div>
      )}

      {/* 팀 헤더 (경기전일 때 날짜/시간 표시) */}
      <div className="px-4 py-3 border-b border-subtle">
        <div className="flex items-center justify-between">
          {/* 홈팀 */}
          <div className="flex items-center gap-2">
            <TeamLogo team={homeTeam} size="sm" />
            <span className="font-medium text-default">{homeTeam.shortName}</span>
          </div>

          {/* 중앙 정보 */}
          <div className="text-center">
            {status === '경기전' ? (
              <div>
                <div className="text-xs text-tertiary">{league}</div>
                <div className="text-sm font-medium text-secondary">{date}</div>
                {time && <div className="text-xs text-tertiary">{time}</div>}
              </div>
            ) : (
              <span className="text-tertiary">vs</span>
            )}
          </div>

          {/* 원정팀 */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-default">{awayTeam.shortName}</span>
            <TeamLogo team={awayTeam} size="sm" />
          </div>
        </div>
      </div>

      {/* 최근 5경기 */}
      {(homeTeam.recentGames || awayTeam.recentGames) && (
        <div className="px-4 py-3 border-b border-subtle">
          <div className="text-xs text-tertiary mb-2 text-center">최근 5경기</div>
          <div className="flex items-center justify-between">
            <RecentGamesDisplay games={homeTeam.recentGames} align="left" />
            <RecentGamesDisplay games={awayTeam.recentGames} align="right" />
          </div>
        </div>
      )}

      {/* 맞대결 기록 */}
      {headToHead && (
        <div className="px-4 py-3">
          <div className="text-xs text-tertiary mb-2 text-center">
            상대 전적 (최근 {headToHead.totalGames}경기)
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-default">{headToHead.homeWins}</div>
              <div className="text-xs text-tertiary">승</div>
            </div>
            <div className="text-tertiary">-</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-default">{headToHead.awayWins}</div>
              <div className="text-xs text-tertiary">승</div>
            </div>
          </div>

          {/* 최근 맞대결 기록 */}
          {headToHead.recentMatches && headToHead.recentMatches.length > 0 && (
            <div className="mt-3 space-y-1">
              {headToHead.recentMatches.slice(0, 5).map((match, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-tertiary">{match.date}</span>
                  <div className="flex items-center gap-2">
                    <span className={match.winner === 'home' ? 'font-bold text-default' : 'text-tertiary'}>
                      {match.homeScore}
                    </span>
                    <span className="text-tertiary">-</span>
                    <span className={match.winner === 'away' ? 'font-bold text-default' : 'text-tertiary'}>
                      {match.awayScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 팀 로고
function TeamLogo({ team, size = 'md' }: { team: BasketballTeamInfo; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <div className={`${sizeClass} flex items-center justify-center`}>
      {team.logo ? (
        <img src={team.logo} alt={team.name} className={`${sizeClass} object-contain`} />
      ) : (
        <div className={`${sizeClass} bg-primary-soft rounded-full flex items-center justify-center ${textSize} font-semibold text-secondary`}>
          {team.shortName.slice(0, 2)}
        </div>
      )}
    </div>
  );
}

// 최근 5경기 표시
function RecentGamesDisplay({
  games,
  align,
}: {
  games?: RecentGameResult[];
  align: 'left' | 'right';
}) {
  if (!games || games.length === 0) return null;

  return (
    <div className={`flex gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      {games.slice(0, 5).map((result, idx) => (
        <div
          key={idx}
          className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-sm ${
            result === 'W'
              ? 'bg-info-solid text-info-solid'
              : 'bg-primary-soft text-secondary'
          }`}
        >
          {result}
        </div>
      ))}
    </div>
  );
}

export default TeamComparison;
