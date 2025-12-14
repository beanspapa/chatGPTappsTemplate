import type { VolleyballGameData, VolleyballGameRecord, VolleyballPlayerStats, RecentGameResult, LeagueStandings as LeagueStandingsType, StandingsTeam } from '../types';
import { useState } from 'react';

interface AfterGameProps {
  data: VolleyballGameData;
}

/**
 * 경기종료 화면
 * - 헤더 (리그, 날짜, 경기종료 상태)
 * - 스코어보드 (최종 세트 획득 수 + WIN 표시)
 * - 세트별 점수
 * - 선수 스탯 (탭)
 * - 경기 기록 (팀 스탯)
 * - 양팀 비교 (최근 5경기, 맞대결)
 * - 리그 순위
 */
export function AfterGame({ data }: AfterGameProps) {
  const homeWins = data.homeTeam.setsWon > data.awayTeam.setsWon;
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
      />

      {/* 세트별 점수 */}
      {data.homeTeam.setScores && data.awayTeam.setScores && (
        <SetScoresSection
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
}: {
  homeTeam: VolleyballGameData['homeTeam'];
  awayTeam: VolleyballGameData['awayTeam'];
  homeWins: boolean;
}) {
  return (
    <section className="relative z-10 flex items-center justify-between py-8 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
      {/* 홈팀 */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <TeamLogo team={homeTeam} />
        <div className="text-base font-semibold text-gray-800">{homeTeam.shortName}</div>
        <div className="text-xs text-gray-500">{homeTeam.record}</div>
      </div>

      {/* 세트 점수 */}
      <div className="flex flex-col items-center relative flex-[1.5]">
        <div className="flex items-center gap-4">
          <span
            className={`text-6xl font-extrabold font-['Oswald',sans-serif] tracking-tight transition-all duration-300`}
            style={{
              color: homeWins ? homeTeam.primaryColor : 'rgb(209 213 219)',
              filter: homeWins ? `drop-shadow(0 2px 8px ${homeTeam.primaryColor}33)` : 'none'
            }}
          >
            {homeTeam.setsWon}
          </span>
          <span className="text-base text-gray-400 font-semibold">VS</span>
          <span
            className={`text-6xl font-extrabold font-['Oswald',sans-serif] tracking-tight transition-all duration-300`}
            style={{
              color: !homeWins ? awayTeam.primaryColor : 'rgb(209 213 219)',
              filter: !homeWins ? `drop-shadow(0 2px 8px ${awayTeam.primaryColor}33)` : 'none'
            }}
          >
            {awayTeam.setsWon}
          </span>
        </div>
        {/* WIN 표시 */}
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
function TeamLogo({ team }: { team: VolleyballGameData['homeTeam'] }) {
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

// 세트별 점수 섹션
function SetScoresSection({
  homeTeam,
  awayTeam,
}: {
  homeTeam: VolleyballGameData['homeTeam'];
  awayTeam: VolleyballGameData['awayTeam'];
}) {
  const homeS = homeTeam.setScores!;
  const awayS = awayTeam.setScores!;

  const sets = [
    { label: 'SET1', home: homeS.set1, away: awayS.set1 },
    { label: 'SET2', home: homeS.set2, away: awayS.set2 },
    { label: 'SET3', home: homeS.set3, away: awayS.set3 },
  ];

  if (homeS.set4 !== undefined) {
    sets.push({ label: 'SET4', home: homeS.set4, away: awayS.set4 ?? 0 });
  }
  if (homeS.set5 !== undefined) {
    sets.push({ label: 'SET5', home: homeS.set5, away: awayS.set5 ?? 0 });
  }

  return (
    <section className="relative z-10 mb-6 mt-10 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <div className="grid items-center gap-2" style={{ gridTemplateColumns: `60px repeat(${sets.length}, 1fr) 1fr` }}>
          {/* 헤더 */}
          <div className="text-xs text-gray-500 font-semibold uppercase"></div>
          {sets.map((s) => (
            <div key={s.label} className="text-xs text-gray-500 font-semibold uppercase text-center">{s.label}</div>
          ))}
          <div className="text-xs text-gray-500 font-semibold uppercase text-center">SETS</div>

          {/* 홈팀 */}
          <div className="text-sm font-bold" style={{ color: homeTeam.primaryColor }}>{homeTeam.shortName}</div>
          {sets.map((s) => (
            <div
              key={`home-${s.label}`}
              className={`text-base text-center font-medium ${s.home > s.away ? 'text-green-600 font-bold' : 'text-gray-400'}`}
            >
              {s.home}
            </div>
          ))}
          <div
            className="text-xl text-center font-bold"
            style={{ color: homeTeam.primaryColor }}
          >
            {homeTeam.setsWon}
          </div>

          {/* 원정팀 */}
          <div className="text-sm font-bold" style={{ color: awayTeam.primaryColor }}>{awayTeam.shortName}</div>
          {sets.map((s) => (
            <div
              key={`away-${s.label}`}
              className={`text-base text-center font-medium ${s.away > s.home ? 'text-green-600 font-bold' : 'text-gray-400'}`}
            >
              {s.away}
            </div>
          ))}
          <div
            className="text-xl text-center font-bold"
            style={{ color: awayTeam.primaryColor }}
          >
            {awayTeam.setsWon}
          </div>
        </div>
      </div>
    </section>
  );
}

// 선수 스탯 섹션
function PlayerStatsSection({
  homeTeam,
  awayTeam,
}: {
  homeTeam: VolleyballGameData['homeTeam'];
  awayTeam: VolleyballGameData['awayTeam'];
}) {
  const [activeTab, setActiveTab] = useState<'home' | 'away'>('home');
  const currentTeam = activeTab === 'home' ? homeTeam : awayTeam;

  if (currentTeam.players.length === 0) return null;

  return (
    <section className="relative z-10 mb-6 animate-[fadeInUp_0.6s_ease-out_0.25s_both]">
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
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">SET</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">득점</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">공격</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">블킹</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">서브</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-10">디그</th>
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
function PlayerRow({ player, teamColor }: { player: VolleyballPlayerStats; teamColor: string }) {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs w-5">{player.number}</span>
          <span className="text-sm font-medium" style={{ color: teamColor }}>{player.name}</span>
          <span className="text-xs text-gray-400">{player.position}</span>
        </div>
      </td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.sets}</td>
      <td className="text-center text-sm tabular-nums font-bold text-gray-800 px-2">{player.points}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.kills}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.blocks}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.aces}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.digs}</td>
    </tr>
  );
}

// 경기 기록 섹션
function GameRecordsSection({
  gameRecords,
}: {
  gameRecords: VolleyballGameRecord[];
}) {
  return (
    <section className="relative z-10 mb-6 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
        <span>📊</span> 경기 기록
      </h3>

      <div className="flex flex-col gap-2">
        {gameRecords.map((record, idx) => {
          const homeValue = typeof record.home === 'number' ? record.home : parseFloat(String(record.home)) || 0;
          const awayValue = typeof record.away === 'number' ? record.away : parseFloat(String(record.away)) || 0;

          const isLowerBetter = record.label === '서브 실책' || record.label === '실책';
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
  homeTeam: VolleyballGameData['homeTeam'];
  awayTeam: VolleyballGameData['awayTeam'];
  headToHead?: VolleyballGameData['headToHead'];
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
            <div className="flex justify-center items-center gap-8">
              <span
                className="text-5xl font-extrabold font-['Oswald',sans-serif]"
                style={{ color: homeTeam.primaryColor }}
              >
                {headToHead.homeWins}
              </span>
              <span className="text-2xl text-gray-300">-</span>
              <span
                className="text-5xl font-extrabold font-['Oswald',sans-serif]"
                style={{ color: awayTeam.primaryColor }}
              >
                {headToHead.awayWins}
              </span>
            </div>
            <div className="flex justify-center gap-24 mt-2 text-xs text-gray-500">
              <span>승</span>
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
                    {match.homeSets}
                  </span>
                  <span className="text-gray-300 px-3">-</span>
                  <span
                    className={`w-12 text-center font-['Oswald',monospace] text-base ${match.winner === 'away' ? 'font-bold' : 'text-gray-300'}`}
                    style={{ color: match.winner === 'away' ? awayTeam.primaryColor : undefined }}
                  >
                    {match.awaySets}
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

// 최근 5경기 표시
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
  homeTeam: VolleyballGameData['homeTeam'];
  awayTeam: VolleyballGameData['awayTeam'];
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
  homeTeam: VolleyballGameData['homeTeam'];
  awayTeam: VolleyballGameData['awayTeam'];
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
      className="grid grid-cols-[30px_50px_40px_40px_55px_1fr] items-center py-3.5 px-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      style={highlightStyle}
    >
      <span className="text-sm text-gray-500 font-semibold">{team.rank}</span>
      <span className="text-sm font-bold" style={{ color: teamColor }}>{team.shortName}</span>
      <span className="text-sm text-gray-600 text-center">{team.wins}</span>
      <span className="text-sm text-gray-600 text-center">{team.losses}</span>
      <span className="text-sm text-gray-800 font-semibold text-center">{team.winRate}</span>
      <div className="flex gap-0.5 justify-end">
        {team.recentGames.slice(0, 5).map((result, idx) => (
          <span
            key={idx}
            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${
              result === 'W' ? 'bg-green-500' : 'bg-red-500'
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
