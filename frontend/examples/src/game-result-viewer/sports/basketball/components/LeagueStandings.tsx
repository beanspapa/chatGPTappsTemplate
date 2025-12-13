import { useState } from 'react';
import type { LeagueStandings as LeagueStandingsType, StandingsTeam, RecentGameResult, Conference } from '../types';

interface LeagueStandingsProps {
  standings: LeagueStandingsType[];
}

export function LeagueStandings({ standings }: LeagueStandingsProps) {
  // 컨퍼런스가 있으면 탭으로 전환
  const hasConferences = standings.length > 1 && standings[0].conference;
  const [activeConference, setActiveConference] = useState<Conference>(
    hasConferences ? (standings[0].conference as Conference) : '동부'
  );

  const currentStandings = hasConferences
    ? standings.find(s => s.conference === activeConference) || standings[0]
    : standings[0];

  return (
    <div className="bg-surface border border-default rounded-lg shadow-sm">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-subtle">
        <h3 className="text-sm font-medium text-default">순위</h3>
      </div>

      {/* 컨퍼런스 탭 (NBA) */}
      {hasConferences && (
        <div className="border-b border-default">
          <div className="flex">
            {standings.map((s) => (
              <button
                key={s.conference}
                onClick={() => setActiveConference(s.conference as Conference)}
                className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
                  activeConference === s.conference
                    ? 'border-info text-info'
                    : 'border-transparent text-secondary hover:text-default'
                }`}
              >
                {s.conference}컨퍼런스
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 순위 테이블 */}
      <div className="p-4 overflow-x-auto">
        <StandingsTable teams={currentStandings.teams} />
      </div>
    </div>
  );
}

function StandingsTable({ teams }: { teams: StandingsTeam[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-surface-secondary border-b border-default">
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-8">#</th>
          <th className="text-xs font-medium text-secondary text-left px-2 py-2">팀</th>
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-8">승</th>
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-8">패</th>
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-12">승률</th>
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-24">최근 5경기</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team, index) => (
          <tr key={index} className="border-b border-subtle hover:bg-primary-soft-alpha transition-colors duration-150">
            <td className="text-center py-2 px-2 text-secondary">{team.rank}</td>
            <td className="py-2 px-2">
              <span className="text-sm text-default">{team.shortName}</span>
            </td>
            <td className="text-center py-2 px-2 tabular-nums text-default">{team.wins}</td>
            <td className="text-center py-2 px-2 tabular-nums text-default">{team.losses}</td>
            <td className="text-center py-2 px-2 tabular-nums text-default">{team.winRate}</td>
            <td className="py-2 px-2">
              <RecentGamesDisplay games={team.recentGames} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RecentGamesDisplay({ games }: { games: RecentGameResult[] }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {games.slice(0, 5).map((result, idx) => (
        <div
          key={idx}
          className={`w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-sm ${
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

export default LeagueStandings;
