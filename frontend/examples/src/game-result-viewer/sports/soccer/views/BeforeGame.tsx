import type { SoccerGameData, RecentGameResult, LeagueStandings as LeagueStandingsType, StandingsTeam } from '../types';

interface BeforeGameProps {
  data: SoccerGameData;
}

/**
 * 경기전 화면
 * - 헤더 (리그, 날짜/시간, 상태)
 * - 팀 프리뷰 (로고, 이름, 시즌 기록)
 * - 양팀 비교 (최근 5경기, 맞대결 기록)
 * - 리그 순위
 */
export function BeforeGame({ data }: BeforeGameProps) {
  const homeColor = data.homeTeam.primaryColor;
  const awayColor = data.awayTeam.primaryColor;

  return (
    <div className="relative max-w-[600px] mx-auto p-8 bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_10px_rgba(0,0,0,0.04)]">
      {/* 배경 패턴 */}
      <div
        className="absolute top-0 left-0 w-full h-[200px] pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${homeColor}08, ${awayColor}08)`
        }}
      />

      {/* 헤더 */}
      <Header
        league={data.league}
        date={data.date}
        time={data.time}
        status={data.status}
        homeColor={homeColor}
        awayColor={awayColor}
      />

      {/* 팀 프리뷰 */}
      <TeamPreview
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
        date={data.date}
        time={data.time}
      />

      {/* 양팀 비교 */}
      <ComparisonSection
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
        headToHead={data.headToHead}
      />

      {/* 리그 순위 */}
      {data.standings && data.standings.length > 0 && (
        <StandingsSection
          standings={data.standings}
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
        />
      )}
    </div>
  );
}

// 헤더 컴포넌트
function Header({
  league,
  date,
  time,
  status,
  homeColor,
  awayColor
}: {
  league: string;
  date: string;
  time?: string;
  status: string;
  homeColor: string;
  awayColor: string;
}) {
  return (
    <header className="relative z-10 flex items-center justify-between mb-6 animate-[fadeInUp_0.6s_ease-out]">
      <span
        className="px-4 py-1.5 rounded-full text-sm font-bold tracking-wider text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
        style={{
          background: `linear-gradient(135deg, ${homeColor}, ${awayColor})`
        }}
      >
        {league}
      </span>
      <span className="text-gray-500 text-sm">
        {date} {time && `${time}`}
      </span>
      <span className="bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-amber-200">
        {status}
      </span>
    </header>
  );
}

// 팀 프리뷰 컴포넌트
function TeamPreview({
  homeTeam,
  awayTeam,
  date,
  time,
}: {
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
  date: string;
  time?: string;
}) {
  return (
    <section className="relative z-10 flex items-center justify-between py-8 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
      {/* 홈팀 */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <TeamLogo team={homeTeam} />
        <div className="text-base font-semibold text-gray-800">{homeTeam.shortName}</div>
        <div className="text-xs text-gray-500">{homeTeam.record}</div>
      </div>

      {/* 중앙 - 경기 예정 정보 */}
      <div className="flex flex-col items-center flex-1">
        <div className="text-4xl font-bold text-gray-300 tracking-tight font-['Oswald',sans-serif]">VS</div>
        <div className="mt-2 text-sm text-gray-400">{date}</div>
        {time && <div className="text-lg font-semibold text-gray-600">{time}</div>}
      </div>

      {/* 원정팀 */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <TeamLogo team={awayTeam} />
        <div className="text-base font-semibold text-gray-800">{awayTeam.shortName}</div>
        <div className="text-xs text-gray-500">{awayTeam.record}</div>
      </div>
    </section>
  );
}

// 팀 로고 컴포넌트 (동적 컬러)
function TeamLogo({ team }: { team: SoccerGameData['homeTeam'] }) {
  const initials = team.shortName.slice(0, 3).toUpperCase();

  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-extrabold text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-[5deg]"
      style={{
        background: `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor})`,
        boxShadow: `0 8px 24px ${team.primaryColor}40`
      }}
    >
      {initials}
    </div>
  );
}

// 양팀 비교 섹션
function ComparisonSection({
  homeTeam,
  awayTeam,
  headToHead
}: {
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
  headToHead?: SoccerGameData['headToHead'];
}) {
  return (
    <section className="relative z-10 mb-6 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
        <span>⚔️</span> 양팀 비교
      </h3>

      {/* 최근 5경기 */}
      {(homeTeam.recentGames || awayTeam.recentGames) && (
        <div className="flex justify-between items-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4 border border-gray-200">
          <div className="flex flex-col items-center gap-3">
            <span className="font-bold text-sm" style={{ color: homeTeam.primaryColor }}>{homeTeam.shortName}</span>
            <RecentGamesRow games={homeTeam.recentGames} />
          </div>
          <div className="text-xs text-gray-500">최근 5경기</div>
          <div className="flex flex-col items-center gap-3">
            <span className="font-bold text-sm" style={{ color: awayTeam.primaryColor }}>{awayTeam.shortName}</span>
            <RecentGamesRow games={awayTeam.recentGames} />
          </div>
        </div>
      )}

      {/* 맞대결 기록 */}
      {headToHead && (
        <>
          <div className="text-center p-6 bg-white rounded-2xl mb-4 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-xs text-gray-500 mb-4">상대 전적 (최근 {headToHead.totalGames}경기)</div>
            <div className="flex justify-center items-center gap-6">
              <span
                className="text-5xl font-extrabold font-['Oswald',sans-serif]"
                style={{ color: homeTeam.primaryColor }}
              >
                {headToHead.homeWins}
              </span>
              <span className="text-2xl text-gray-400 font-bold">{headToHead.draws}</span>
              <span
                className="text-5xl font-extrabold font-['Oswald',sans-serif]"
                style={{ color: awayTeam.primaryColor }}
              >
                {headToHead.awayWins}
              </span>
            </div>
            <div className="flex justify-center gap-12 mt-2 text-xs text-gray-500">
              <span>승</span>
              <span>무</span>
              <span>승</span>
            </div>
          </div>

          {/* 최근 맞대결 */}
          {headToHead.recentMatches && headToHead.recentMatches.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {headToHead.recentMatches.slice(0, 3).map((match, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-4 py-3.5 bg-gray-50 rounded-xl text-sm border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  <span className="text-gray-500 flex-1">{match.date}</span>
                  <span
                    className={`w-12 text-center font-['Oswald',monospace] text-base ${match.winner === 'home' ? 'font-bold' : 'text-gray-300'}`}
                    style={{ color: match.winner === 'home' ? homeTeam.primaryColor : undefined }}
                  >
                    {match.homeScore}
                  </span>
                  <span className="text-gray-300 px-3">-</span>
                  <span
                    className={`w-12 text-center font-['Oswald',monospace] text-base ${match.winner === 'away' ? 'font-bold' : 'text-gray-300'}`}
                    style={{ color: match.winner === 'away' ? awayTeam.primaryColor : undefined }}
                  >
                    {match.awayScore}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

// 최근 5경기 표시 (무승부 포함)
function RecentGamesRow({ games }: { games?: RecentGameResult[] }) {
  if (!games || games.length === 0) return null;

  return (
    <div className="flex gap-1.5">
      {games.slice(0, 5).map((result, idx) => (
        <span
          key={idx}
          className={`w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-bold text-white transition-transform duration-200 hover:scale-115 hover:-translate-y-0.5 ${
            result === 'W'
              ? 'bg-gradient-to-br from-green-500 to-green-400 shadow-[0_4px_12px_rgba(67,160,71,0.35)]'
              : result === 'D'
              ? 'bg-gradient-to-br from-gray-400 to-gray-300 shadow-[0_4px_12px_rgba(156,163,175,0.35)]'
              : 'bg-gradient-to-br from-red-500 to-red-400 shadow-[0_4px_12px_rgba(229,57,53,0.35)]'
          }`}
        >
          {result}
        </span>
      ))}
    </div>
  );
}

// 순위 섹션
function StandingsSection({
  standings,
  homeTeam,
  awayTeam,
}: {
  standings: LeagueStandingsType[];
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
}) {
  const currentStandings = standings[0];

  return (
    <section className="relative z-10 animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
        <span>🏆</span> 순위
      </h3>

      {/* 순위 테이블 */}
      <div className="flex flex-col gap-1">
        {currentStandings.teams.slice(0, 5).map((team) => (
          <StandingRow
            key={team.rank}
            team={team}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />
        ))}
      </div>
    </section>
  );
}

// 순위 행 (축구용: 승점, 골득실 포함)
function StandingRow({
  team,
  homeTeam,
  awayTeam,
}: {
  team: StandingsTeam;
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
}) {
  const isHomeTeam = team.shortName === homeTeam.shortName;
  const isAwayTeam = team.shortName === awayTeam.shortName;

  const highlightStyle = isHomeTeam
    ? {
        background: `linear-gradient(to right, ${homeTeam.primaryColor}14, ${homeTeam.secondaryColor}0a)`,
        borderLeft: `3px solid ${homeTeam.primaryColor}`
      }
    : isAwayTeam
    ? {
        background: `linear-gradient(to right, ${awayTeam.primaryColor}14, ${awayTeam.secondaryColor}0a)`,
        borderLeft: `3px solid ${awayTeam.primaryColor}`
      }
    : {
        background: 'rgb(249 250 251)',
        borderLeft: '3px solid transparent'
      };

  const teamColor = isHomeTeam
    ? homeTeam.primaryColor
    : isAwayTeam
    ? awayTeam.primaryColor
    : 'rgb(31 41 55)';

  return (
    <div
      className="grid grid-cols-[30px_55px_28px_28px_28px_40px_45px_1fr] items-center py-3.5 px-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      style={highlightStyle}
    >
      <span className="text-sm text-gray-500 font-semibold">{team.rank}</span>
      <span className="text-sm font-bold" style={{ color: teamColor }}>{team.shortName}</span>
      <span className="text-xs text-gray-600 text-center">{team.wins}</span>
      <span className="text-xs text-gray-600 text-center">{team.draws}</span>
      <span className="text-xs text-gray-600 text-center">{team.losses}</span>
      <span className="text-xs text-gray-500 text-center">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</span>
      <span className="text-sm text-gray-800 font-bold text-center">{team.points}</span>
      <div className="flex gap-0.5 justify-end">
        {team.recentGames.slice(0, 5).map((result, idx) => (
          <span
            key={idx}
            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${
              result === 'W'
                ? 'bg-green-500'
                : result === 'D'
                ? 'bg-gray-400'
                : 'bg-red-500'
            }`}
          >
            {result}
          </span>
        ))}
      </div>
    </div>
  );
}

export default BeforeGame;
