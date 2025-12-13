import type { BasketballGameData, BasketballGameRecord, BasketballPlayerStats, RecentGameResult, Conference, LeagueStandings as LeagueStandingsType, StandingsTeam } from '../types';
import { useState } from 'react';

interface AfterGameProps {
  data: BasketballGameData;
}

/**
 * 경기종료 화면
 * - 헤더 (리그, 날짜, 경기종료 상태)
 * - 스코어보드 (최종 점수 + 쿼터별 점수)
 * - 선수 스탯 (탭)
 * - 경기 기록 (팀 스탯)
 * - 양팀 비교 (최근 5경기, 맞대결)
 * - 리그 순위
 */
export function AfterGame({ data }: AfterGameProps) {
  const homeWins = data.homeTeam.score > data.awayTeam.score;

  return (
    <div className="relative max-w-[600px] mx-auto p-8 bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_10px_rgba(0,0,0,0.04)]">
      {/* 배경 패턴 */}
      <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />

      {/* 헤더 */}
      <Header league={data.league} date={data.date} status={data.status} />

      {/* 스코어보드 */}
      <ScoreboardSection
        homeTeam={data.homeTeam}
        awayTeam={data.awayTeam}
        homeWins={homeWins}
      />

      {/* 쿼터별 점수 */}
      {data.homeTeam.quarterScores && data.awayTeam.quarterScores && (
        <QuarterScoresSection
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
        <GameRecordsSection
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
          gameRecords={data.gameRecords}
        />
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
          homeTeamName={data.homeTeam.shortName}
          awayTeamName={data.awayTeam.shortName}
        />
      )}
    </div>
  );
}

// 헤더 컴포넌트
function Header({ league, date, status }: { league: string; date: string; status: string }) {
  return (
    <header className="relative z-10 flex items-center justify-between mb-6 animate-[fadeInUp_0.6s_ease-out]">
      <span className="bg-gradient-to-r from-[#c9082a] to-[#17408b] px-4 py-1.5 rounded-full text-sm font-bold tracking-wider text-white shadow-[0_4px_12px_rgba(201,8,42,0.25)]">
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
  homeTeam: BasketballGameData['homeTeam'];
  awayTeam: BasketballGameData['awayTeam'];
  homeWins: boolean;
}) {
  return (
    <section className="relative z-10 flex items-center justify-between py-8 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
      {/* 홈팀 */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <TeamLogo name={homeTeam.shortName} isHome />
        <div className="text-base font-semibold text-gray-800">{homeTeam.shortName}</div>
        <div className="text-xs text-gray-500">{homeTeam.record}</div>
      </div>

      {/* 점수 */}
      <div className="flex flex-col items-center relative flex-[1.5]">
        <div className="flex items-center gap-4">
          <span className={`text-6xl font-extrabold font-['Oswald',sans-serif] tracking-tight transition-all duration-300 ${homeWins ? 'text-[#552583] drop-shadow-[0_2px_8px_rgba(85,37,131,0.2)]' : 'text-gray-300'}`}>
            {homeTeam.score}
          </span>
          <span className="text-base text-gray-400 font-semibold">VS</span>
          <span className={`text-6xl font-extrabold font-['Oswald',sans-serif] tracking-tight transition-all duration-300 ${!homeWins ? 'text-[#1D428A] drop-shadow-[0_2px_8px_rgba(29,66,138,0.2)]' : 'text-gray-300'}`}>
            {awayTeam.score}
          </span>
        </div>
        {/* WIN 표시 */}
        <div className={`absolute -bottom-6 text-xs font-bold tracking-widest px-3 py-1 rounded-xl ${
          homeWins
            ? 'left-[15%] text-[#552583] bg-gradient-to-r from-purple-100 to-purple-50'
            : 'right-[15%] text-[#1D428A] bg-gradient-to-r from-blue-50 to-blue-100'
        }`}>
          WIN
        </div>
      </div>

      {/* 원정팀 */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <TeamLogo name={awayTeam.shortName} isHome={false} />
        <div className="text-base font-semibold text-gray-800">{awayTeam.shortName}</div>
        <div className="text-xs text-gray-500">{awayTeam.record}</div>
      </div>
    </section>
  );
}

// 팀 로고 컴포넌트
function TeamLogo({ name, isHome }: { name: string; isHome: boolean }) {
  const initials = name.slice(0, 3).toUpperCase();

  return (
    <div
      className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-extrabold text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-[5deg] ${
        isHome
          ? 'bg-gradient-to-br from-[#552583] to-[#FDB927] shadow-[0_8px_24px_rgba(85,37,131,0.35)]'
          : 'bg-gradient-to-br from-[#1D428A] to-[#FFC72C] shadow-[0_8px_24px_rgba(29,66,138,0.35)]'
      }`}
    >
      {initials}
    </div>
  );
}

// 쿼터별 점수 섹션
function QuarterScoresSection({
  homeTeam,
  awayTeam,
}: {
  homeTeam: BasketballGameData['homeTeam'];
  awayTeam: BasketballGameData['awayTeam'];
}) {
  const homeQ = homeTeam.quarterScores!;
  const awayQ = awayTeam.quarterScores!;
  const hasOT = homeQ.ot && homeQ.ot.length > 0;

  const quarters = [
    { label: '1Q', home: homeQ.q1, away: awayQ.q1 },
    { label: '2Q', home: homeQ.q2, away: awayQ.q2 },
    { label: '3Q', home: homeQ.q3, away: awayQ.q3 },
    { label: '4Q', home: homeQ.q4, away: awayQ.q4 },
  ];

  if (hasOT) {
    homeQ.ot!.forEach((score, idx) => {
      quarters.push({
        label: idx === 0 ? 'OT' : `OT${idx + 1}`,
        home: score,
        away: awayQ.ot![idx],
      });
    });
  }

  return (
    <section className="relative z-10 mb-6 mt-10 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <div className={`grid items-center gap-2`} style={{ gridTemplateColumns: `60px repeat(${quarters.length}, 1fr) 1fr` }}>
          {/* 헤더 */}
          <div className="text-xs text-gray-500 font-semibold uppercase"></div>
          {quarters.map((q) => (
            <div key={q.label} className="text-xs text-gray-500 font-semibold uppercase text-center">{q.label}</div>
          ))}
          <div className="text-xs text-gray-500 font-semibold uppercase text-center">FINAL</div>

          {/* 홈팀 */}
          <div className="text-sm font-bold text-[#552583]">{homeTeam.shortName}</div>
          {quarters.map((q) => (
            <div
              key={`home-${q.label}`}
              className={`text-base text-center font-medium ${q.home > q.away ? 'text-green-600 font-bold' : 'text-gray-400'}`}
            >
              {q.home}
            </div>
          ))}
          <div className="text-xl text-center font-bold text-[#552583]">{homeTeam.score}</div>

          {/* 원정팀 */}
          <div className="text-sm font-bold text-[#1D428A]">{awayTeam.shortName}</div>
          {quarters.map((q) => (
            <div
              key={`away-${q.label}`}
              className={`text-base text-center font-medium ${q.away > q.home ? 'text-green-600 font-bold' : 'text-gray-400'}`}
            >
              {q.away}
            </div>
          ))}
          <div className="text-xl text-center font-bold text-[#1D428A]">{awayTeam.score}</div>
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
  homeTeam: BasketballGameData['homeTeam'];
  awayTeam: BasketballGameData['awayTeam'];
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
              ? 'bg-white text-[#552583] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {homeTeam.shortName}
        </button>
        <button
          onClick={() => setActiveTab('away')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'away'
              ? 'bg-white text-[#1D428A] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
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
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-12">MIN</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-12">REB</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-12">AST</th>
              <th className="text-xs font-semibold text-gray-500 text-center px-2 py-3 w-12">PTS</th>
            </tr>
          </thead>
          <tbody>
            {currentTeam.players.map((player, idx) => (
              <PlayerRow key={idx} player={player} isHome={activeTab === 'home'} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// 선수 행
function PlayerRow({ player, isHome }: { player: BasketballPlayerStats; isHome: boolean }) {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs w-5">{player.number}</span>
          <span className={`text-sm font-medium ${isHome ? 'text-[#552583]' : 'text-[#1D428A]'}`}>{player.name}</span>
          <span className="text-xs text-gray-400">{player.position}</span>
        </div>
      </td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.minutes}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.rebounds}</td>
      <td className="text-center text-sm tabular-nums text-gray-600 px-2">{player.assists}</td>
      <td className="text-center text-sm tabular-nums font-bold text-gray-800 px-2">{player.points}</td>
    </tr>
  );
}

// 경기 기록 섹션
function GameRecordsSection({
  homeTeam,
  awayTeam,
  gameRecords,
}: {
  homeTeam: BasketballGameData['homeTeam'];
  awayTeam: BasketballGameData['awayTeam'];
  gameRecords: BasketballGameRecord[];
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

          const isLowerBetter = record.label === '턴오버' || record.label === '파울' || record.label === 'TO';
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
  homeTeam: BasketballGameData['homeTeam'];
  awayTeam: BasketballGameData['awayTeam'];
  headToHead?: BasketballGameData['headToHead'];
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
            <span className="font-bold text-sm text-[#552583]">{homeTeam.shortName}</span>
            <RecentGamesRow games={homeTeam.recentGames} />
          </div>
          <div className="text-xs text-gray-500">최근 5경기</div>
          <div className="flex flex-col items-center gap-3">
            <span className="font-bold text-sm text-[#1D428A]">{awayTeam.shortName}</span>
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
              <span className="text-5xl font-extrabold text-[#552583] font-['Oswald',sans-serif]">{headToHead.homeWins}</span>
              <span className="text-2xl text-gray-300">-</span>
              <span className="text-5xl font-extrabold text-[#1D428A] font-['Oswald',sans-serif]">{headToHead.awayWins}</span>
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
                  <span className={`w-12 text-center font-['Oswald',monospace] text-base ${match.winner === 'home' ? 'text-[#552583] font-bold' : 'text-gray-300'}`}>
                    {match.homeScore}
                  </span>
                  <span className="text-gray-300 px-3">-</span>
                  <span className={`w-12 text-center font-['Oswald',monospace] text-base ${match.winner === 'away' ? 'text-[#1D428A] font-bold' : 'text-gray-300'}`}>
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
  homeTeamName,
  awayTeamName,
}: {
  standings: LeagueStandingsType[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  const hasConferences = standings.length > 1 && standings[0].conference;
  const [activeConference, setActiveConference] = useState<Conference>(
    hasConferences ? (standings[0].conference as Conference) : '동부'
  );

  const currentStandings = hasConferences
    ? standings.find(s => s.conference === activeConference) || standings[0]
    : standings[0];

  return (
    <section className="relative z-10 animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
        <span>🏆</span> 순위
      </h3>

      {/* 컨퍼런스 탭 */}
      {hasConferences && (
        <div className="flex mb-4 bg-gray-100 rounded-xl p-1">
          {standings.map((s) => (
            <button
              key={s.conference}
              onClick={() => setActiveConference(s.conference as Conference)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeConference === s.conference
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s.conference}
            </button>
          ))}
        </div>
      )}

      {/* 순위 테이블 */}
      <div className="flex flex-col gap-1">
        {currentStandings.teams.slice(0, 5).map((team) => (
          <StandingRow
            key={team.rank}
            team={team}
            isHomeTeam={team.shortName === homeTeamName}
            isAwayTeam={team.shortName === awayTeamName}
          />
        ))}
      </div>
    </section>
  );
}

// 순위 행
function StandingRow({
  team,
  isHomeTeam,
  isAwayTeam,
}: {
  team: StandingsTeam;
  isHomeTeam: boolean;
  isAwayTeam: boolean;
}) {
  const highlightClass = isHomeTeam
    ? 'bg-gradient-to-r from-[rgba(85,37,131,0.08)] to-[rgba(253,185,39,0.05)] border-l-[3px] border-l-[#552583]'
    : isAwayTeam
    ? 'bg-gradient-to-r from-[rgba(29,66,138,0.08)] to-[rgba(255,199,44,0.05)] border-l-[3px] border-l-[#1D428A]'
    : 'bg-gray-50 border-l-[3px] border-l-transparent';

  const teamColorClass = isHomeTeam
    ? 'text-[#552583]'
    : isAwayTeam
    ? 'text-[#1D428A]'
    : 'text-gray-800';

  return (
    <div className={`grid grid-cols-[30px_50px_40px_40px_55px_1fr] items-center py-3.5 px-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${highlightClass}`}>
      <span className="text-sm text-gray-500 font-semibold">{team.rank}</span>
      <span className={`text-sm font-bold ${teamColorClass}`}>{team.shortName}</span>
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
