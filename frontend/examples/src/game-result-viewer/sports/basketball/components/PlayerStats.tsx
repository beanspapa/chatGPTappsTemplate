import { useState } from 'react';
import type { BasketballTeamInfo, BasketballPlayerStats } from '../types';

interface PlayerStatsProps {
  homeTeam: BasketballTeamInfo;
  awayTeam: BasketballTeamInfo;
}

export function PlayerStats({ homeTeam, awayTeam }: PlayerStatsProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'away'>('home');

  const currentTeam = activeTab === 'home' ? homeTeam : awayTeam;

  return (
    <div className="bg-surface border border-default rounded-lg shadow-sm">
      {/* 탭 */}
      <div className="border-b border-default">
        <div className="flex">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === 'home'
                ? 'border-info text-info'
                : 'border-transparent text-secondary hover:text-default'
            }`}
          >
            {homeTeam.shortName}
          </button>
          <button
            onClick={() => setActiveTab('away')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === 'away'
                ? 'border-info text-info'
                : 'border-transparent text-secondary hover:text-default'
            }`}
          >
            {awayTeam.shortName}
          </button>
        </div>
      </div>

      {/* 선수 스탯 테이블 */}
      <div className="p-4 overflow-x-auto">
        <PlayerStatsTable players={currentTeam.players} />
      </div>
    </div>
  );
}

function PlayerStatsTable({ players }: { players: BasketballPlayerStats[] }) {
  // 확장 스탯 여부 확인
  const hasExtendedStats = players.some(p => p.fgm !== undefined || p.steals !== undefined);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-surface-secondary border-b border-default">
          <th className="text-xs font-medium text-secondary text-left px-2 py-2">선수</th>
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-10">MIN</th>
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-10">REB</th>
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-10">AST</th>
          <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-10">득점</th>
          {hasExtendedStats && (
            <>
              <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-12">FGM</th>
              <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-12">3PM</th>
              <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-10">STL</th>
              <th className="text-xs font-medium text-secondary text-center px-2 py-2 w-10">BLK</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr key={index} className="border-b border-subtle hover:bg-primary-soft-alpha transition-colors duration-150">
            <td className="py-2 px-2">
              <div className="flex items-center gap-1">
                <span className="text-tertiary text-xs w-5">{player.number}</span>
                <span className="text-sm text-default">{player.name}</span>
                <span className="text-xs text-tertiary">{player.position}</span>
              </div>
            </td>
            <td className="text-center text-sm tabular-nums px-2 text-default">{player.minutes}</td>
            <td className="text-center text-sm tabular-nums px-2 text-default">{player.rebounds}</td>
            <td className="text-center text-sm tabular-nums px-2 text-default">{player.assists}</td>
            <td className="text-center text-sm font-medium tabular-nums px-2 text-default">{player.points}</td>
            {hasExtendedStats && (
              <>
                <td className="text-center text-sm tabular-nums px-2 text-default">
                  {player.fgm !== undefined && player.fga !== undefined
                    ? `${player.fgm}/${player.fga}`
                    : '-'}
                </td>
                <td className="text-center text-sm tabular-nums px-2 text-default">
                  {player.tpm !== undefined && player.tpa !== undefined
                    ? `${player.tpm}/${player.tpa}`
                    : '-'}
                </td>
                <td className="text-center text-sm tabular-nums px-2 text-default">
                  {player.steals ?? '-'}
                </td>
                <td className="text-center text-sm tabular-nums px-2 text-default">
                  {player.blocks ?? '-'}
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlayerStats;
