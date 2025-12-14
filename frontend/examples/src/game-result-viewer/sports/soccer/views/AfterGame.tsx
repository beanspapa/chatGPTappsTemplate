import type { SoccerGameData, SoccerGameRecord, SoccerPlayerStats, GoalEvent, RecentGameResult, LeagueStandings as LeagueStandingsType, StandingsTeam } from '../types';
import { useState } from 'react';

interface AfterGameProps {
  data: SoccerGameData;
}

/**
 * 경기종료 화면
 * - 헤더 (리그, 날짜, 경기종료 상태)
 * - 스코어보드 (최종 점수 + WIN/DRAW 표시)
 * - 전/후반 점수
 * - 골 이벤트 타임라인
 * - 선수 스탯 (탭)
 * - 경기 기록 (팀 스탯)
 * - 양팀 비교 (최근 5경기, 맞대결)
 * - 리그 순위
 */
export function AfterGame({ data }: AfterGameProps) {
  const homeWins = data.homeTeam.score > data.awayTeam.score;
  const awayWins = data.awayTeam.score > data.homeTeam.score;
  const isDraw = data.homeTeam.score === data.awayTeam.score;
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
        status={data.status}
        homeColor={homeColor}
        awayColor={awayColor}
      />

      {/* 스코어보드 */}
      <ScoreboardSection
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
        homeWins={homeWins}
        awayWins={awayWins}
        isDraw={isDraw}
      />

      {/* 전/후반 점수 */}
      {data.homeTeam.halfScores && data.awayTeam.halfScores && (
        <HalfScoresSection
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
        />
      )}

      {/* 골 이벤트 타임라인 */}
      {data.goals && data.goals.length > 0 && (
        <GoalTimelineSection
          goals={data.goals}
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
        />
      )}

      {/* 선수 스탯 */}
      <PlayerStatsSection
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
      />

      {/* 경기 기록 */}
      {data.gameRecords && data.gameRecords.length > 0 && (
        <GameRecordsSection gameRecords={data.gameRecords} />
      )}

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
  status,
  homeColor,
  awayColor
}: {
  league: string;
  date: string;
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
      <span className="text-gray-500 text-sm">{date}</span>
      <span className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-green-200">
        {status}
      </span>
    </header>
  );
}

// 스코어보드 섹션
function ScoreboardSection({
  homeTeam,
  awayTeam,
  homeWins,
  awayWins,
  isDraw,
}: {
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
  homeWins: boolean;
  awayWins: boolean;
  isDraw: boolean;
}) {
  return (
    <section className="relative z-10 flex items-center justify-between py-8 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
      {/* 홈팀 */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <TeamLogo team={homeTeam} />
        <div className="text-base font-semibold text-gray-800">{homeTeam.shortName}</div>
        <div className="text-xs text-gray-500">{homeTeam.record}</div>
      </div>

      {/* 점수 */}
      <div className="flex flex-col items-center relative flex-[1.5]">
        <div className="flex items-center gap-4">
          <span
            className={`text-6xl font-extrabold font-['Oswald',sans-serif] tracking-tight transition-all duration-300`}
            style={{
              color: homeWins || isDraw ? homeTeam.primaryColor : 'rgb(209 213 219)',
              filter: homeWins ? `drop-shadow(0 2px 8px ${homeTeam.primaryColor}33)` : 'none'
            }}
          >
            {homeTeam.score}
          </span>
          <span className="text-base text-gray-400 font-semibold">-</span>
          <span
            className={`text-6xl font-extrabold font-['Oswald',sans-serif] tracking-tight transition-all duration-300`}
            style={{
              color: awayWins || isDraw ? awayTeam.primaryColor : 'rgb(209 213 219)',
              filter: awayWins ? `drop-shadow(0 2px 8px ${awayTeam.primaryColor}33)` : 'none'
            }}
          >
            {awayTeam.score}
          </span>
        </div>
        {/* WIN/DRAW 표시 */}
        {isDraw ? (
          <div
            className="absolute -bottom-6 text-xs font-bold tracking-widest px-3 py-1 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600"
          >
            DRAW
          </div>
        ) : (
          <div
            className={`absolute -bottom-6 text-xs font-bold tracking-widest px-3 py-1 rounded-xl ${
              homeWins ? 'left-[15%]' : 'right-[15%]'
            }`}
            style={{
              color: homeWins ? homeTeam.primaryColor : awayTeam.primaryColor,
              background: homeWins
                ? `linear-gradient(to right, ${homeTeam.primaryColor}15, ${homeTeam.secondaryColor}10)`
                : `linear-gradient(to right, ${awayTeam.secondaryColor}10, ${awayTeam.primaryColor}15)`
            }}
          >
            WIN
          </div>
        )}
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

// 전/후반 점수 섹션
function HalfScoresSection({
  homeTeam,
  awayTeam,
}: {
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
}) {
  const homeS = homeTeam.halfScores!;
  const awayS = awayTeam.halfScores!;

  const periods = [
    { label: '전반', home: homeS.firstHalf, away: awayS.firstHalf },
    { label: '후반', home: homeS.secondHalf, away: awayS.secondHalf },
  ];

  if (homeS.extraFirstHalf !== undefined) {
    periods.push({ label: '연장전반', home: homeS.extraFirstHalf, away: awayS.extraFirstHalf ?? 0 });
  }
  if (homeS.extraSecondHalf !== undefined) {
    periods.push({ label: '연장후반', home: homeS.extraSecondHalf, away: awayS.extraSecondHalf ?? 0 });
  }
  if (homeS.penalties !== undefined) {
    periods.push({ label: 'PK', home: homeS.penalties, away: awayS.penalties ?? 0 });
  }

  return (
    <section className="relative z-10 mb-6 mt-10 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <div className="grid items-center gap-2" style={{ gridTemplateColumns: `60px repeat(${periods.length}, 1fr) 1fr` }}>
          {/* 헤더 */}
          <div className="text-xs text-gray-500 font-semibold uppercase"></div>
          {periods.map((p) => (
            <div key={p.label} className="text-xs text-gray-500 font-semibold uppercase text-center">{p.label}</div>
          ))}
          <div className="text-xs text-gray-500 font-semibold uppercase text-center">TOTAL</div>

          {/* 홈팀 */}
          <div className="text-sm font-bold" style={{ color: homeTeam.primaryColor }}>{homeTeam.shortName}</div>
          {periods.map((p) => (
            <div
              key={`home-${p.label}`}
              className={`text-base text-center font-medium ${p.home > p.away ? 'text-green-600 font-bold' : 'text-gray-400'}`}
            >
              {p.home}
            </div>
          ))}
          <div
            className="text-xl text-center font-bold"
            style={{ color: homeTeam.primaryColor }}
          >
            {homeTeam.score}
          </div>

          {/* 원정팀 */}
          <div className="text-sm font-bold" style={{ color: awayTeam.primaryColor }}>{awayTeam.shortName}</div>
          {periods.map((p) => (
            <div
              key={`away-${p.label}`}
              className={`text-base text-center font-medium ${p.away > p.home ? 'text-green-600 font-bold' : 'text-gray-400'}`}
            >
              {p.away}
            </div>
          ))}
          <div
            className="text-xl text-center font-bold"
            style={{ color: awayTeam.primaryColor }}
          >
            {awayTeam.score}
          </div>
        </div>
      </div>
    </section>
  );
}

// 골 이벤트 타임라인 섹션
function GoalTimelineSection({
  goals,
  homeTeam,
  awayTeam,
}: {
  goals: GoalEvent[];
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
}) {
  // 시간순 정렬
  const sortedGoals = [...goals].sort((a, b) => {
    const aTime = a.minute + (a.addedTime || 0) / 100;
    const bTime = b.minute + (b.addedTime || 0) / 100;
    return aTime - bTime;
  });

  return (
    <section className="relative z-10 mb-6 animate-[fadeInUp_0.6s_ease-out_0.25s_both]">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
        <span>⚽</span> 골 타임라인
      </h3>

      <div className="flex flex-col gap-2">
        {sortedGoals.map((goal, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${
              goal.team === 'home'
                ? 'bg-gradient-to-r from-gray-50 to-transparent border-l-4'
                : 'bg-gradient-to-l from-gray-50 to-transparent border-r-4 flex-row-reverse'
            }`}
            style={{
              borderColor: goal.team === 'home' ? homeTeam.primaryColor : awayTeam.primaryColor
            }}
          >
            <span
              className="text-sm font-bold px-2 py-1 rounded-lg text-white"
              style={{
                background: goal.team === 'home' ? homeTeam.primaryColor : awayTeam.primaryColor
              }}
            >
              {goal.minute}{goal.addedTime ? `+${goal.addedTime}` : ''}'
            </span>
            <div className={`flex flex-col ${goal.team === 'away' ? 'items-end' : ''}`}>
              <span className="font-medium text-gray-800">
                {goal.scorer}
                {goal.isPenalty && <span className="ml-1 text-xs text-gray-500">(PK)</span>}
                {goal.isOwnGoal && <span className="ml-1 text-xs text-red-500">(자책골)</span>}
              </span>
              {goal.assist && (
                <span className="text-xs text-gray-500">어시스트: {goal.assist}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 선수 스탯 섹션
function PlayerStatsSection({
  homeTeam,
  awayTeam,
}: {
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
}) {
  const [activeTab, setActiveTab] = useState<'home' | 'away'>('home');
  const currentTeam = activeTab === 'home' ? homeTeam : awayTeam;

  if (currentTeam.players.length === 0) return null;

  return (
    <section className="relative z-10 mb-6 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
        <span>👤</span> 선수 기록
      </h3>

      {/* 탭 */}
      <div className="flex mb-4 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'home'
              ? 'bg-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ color: activeTab === 'home' ? homeTeam.primaryColor : undefined }}
        >
          {homeTeam.shortName}
        </button>
        <button
          onClick={() => setActiveTab('away')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'away'
              ? 'bg-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ color: activeTab === 'away' ? awayTeam.primaryColor : undefined }}
        >
          {awayTeam.shortName}
        </button>
      </div>

      {/* 선수 테이블 */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-xs font-semibold text-gray-500 text-left px-3 py-3">선수</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">MIN</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">골</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">AS</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">슈팅</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">패스</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">태클</th>
            </tr>
          </thead>
          <tbody>
            {currentTeam.players.map((player, idx) => (
              <PlayerRow
                key={idx}
                player={player}
                teamColor={activeTab === 'home' ? homeTeam.primaryColor : awayTeam.primaryColor}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// 선수 행
function PlayerRow({ player, teamColor }: { player: SoccerPlayerStats; teamColor: string }) {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs w-5">{player.number}</span>
          <span className="text-sm font-medium" style={{ color: teamColor }}>{player.name}</span>
          <span className="text-xs text-gray-400">{player.position}</span>
          {player.yellowCards > 0 && (
            <span className="w-3 h-4 bg-yellow-400 rounded-sm" title="옐로카드" />
          )}
          {player.redCards > 0 && (
            <span className="w-3 h-4 bg-red-500 rounded-sm" title="레드카드" />
          )}
        </div>
      </td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.minutes}</td>
      <td className="text-center text-sm tabular-nums font-bold text-gray-800 px-2">{player.goals}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.assists}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.shots}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.passes}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.tackles}</td>
    </tr>
  );
}

// 경기 기록 섹션
function GameRecordsSection({
  gameRecords,
}: {
  gameRecords: SoccerGameRecord[];
}) {
  return (
    <section className="relative z-10 mb-6 animate-[fadeInUp_0.6s_ease-out_0.35s_both]">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
        <span>📊</span> 경기 기록
      </h3>

      <div className="flex flex-col gap-2">
        {gameRecords.map((record, idx) => {
          const homeValue = typeof record.home === 'number' ? record.home : parseFloat(String(record.home)) || 0;
          const awayValue = typeof record.away === 'number' ? record.away : parseFloat(String(record.away)) || 0;

          const isLowerBetter = record.label === '파울' || record.label === '실책' || record.label === '오프사이드';
          const homeWins = isLowerBetter ? homeValue < awayValue : homeValue > awayValue;
          const awayWins = isLowerBetter ? awayValue < homeValue : awayValue > homeValue;

          return (
            <div
              key={idx}
              className="grid grid-cols-[1fr_80px_1fr] items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
            >
              <div className={`text-base font-semibold font-['Oswald',monospace] tracking-wider ${homeWins ? 'text-green-600' : 'text-gray-400'}`}>
                {record.home}
              </div>
              <div className="text-xs text-gray-500 font-semibold text-center uppercase tracking-wider">
                {record.label}
              </div>
              <div className={`text-base font-semibold font-['Oswald',monospace] tracking-wider text-right ${awayWins ? 'text-green-600' : 'text-gray-400'}`}>
                {record.away}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 양팀 비교 섹션
function ComparisonSection({
  homeTeam,
  awayTeam,
  headToHead,
}: {
  homeTeam: SoccerGameData['homeTeam'];
  awayTeam: SoccerGameData['awayTeam'];
  headToHead?: SoccerGameData['headToHead'];
}) {
  return (
    <section className="relative z-10 mb-6 animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
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

// 순위 행
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

export default AfterGame;
