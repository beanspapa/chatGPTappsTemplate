import type { BasketballGameRecord, BasketballTeamInfo } from '../types';

interface GameRecordsProps {
  homeTeam: BasketballTeamInfo;
  awayTeam: BasketballTeamInfo;
  gameRecords: BasketballGameRecord[];
}

/**
 * 팀 스탯 비교 컴포넌트
 * - 2점슛, 3점슛, 자유투, 리바운드, 어시스트 등
 */
export function GameRecords({ homeTeam, awayTeam, gameRecords }: GameRecordsProps) {
  if (!gameRecords || gameRecords.length === 0) return null;

  return (
    <div className="bg-surface border border-default rounded-lg shadow-sm">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-subtle">
        <h3 className="text-sm font-medium text-default">경기 기록</h3>
      </div>

      {/* 테이블 */}
      <div className="p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-secondary">
              <th className="text-center py-1 w-20">{homeTeam.shortName}</th>
              <th className="text-center py-1">항목</th>
              <th className="text-center py-1 w-20">{awayTeam.shortName}</th>
            </tr>
          </thead>
          <tbody className="text-default">
            {gameRecords.map((record, idx) => {
              // 숫자 비교로 승자 하이라이트
              const homeValue = typeof record.home === 'number' ? record.home : parseFloat(record.home) || 0;
              const awayValue = typeof record.away === 'number' ? record.away : parseFloat(record.away) || 0;

              // 턴오버, 파울은 적을수록 좋음
              const isLowerBetter = record.label === '턴오버' || record.label === '파울';
              const homeWins = isLowerBetter ? homeValue < awayValue : homeValue > awayValue;
              const awayWins = isLowerBetter ? awayValue < homeValue : awayValue > homeValue;

              return (
                <tr key={idx} className="border-t border-subtle">
                  <td className={`text-center py-1.5 tabular-nums ${homeWins ? 'font-bold text-info' : ''}`}>
                    {record.home}
                  </td>
                  <td className="text-center py-1.5 text-secondary">{record.label}</td>
                  <td className={`text-center py-1.5 tabular-nums ${awayWins ? 'font-bold text-info' : ''}`}>
                    {record.away}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameRecords;
