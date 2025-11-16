import { useState, useEffect } from 'react'

// モックデータ
const mockRanking = [
  {
    rank: 1,
    userId: 4,
    name: '山田次郎',
    bestScore: 70,
    averageScore: 78,
    totalRounds: 156,
    handicap: 8,
    recentScore: 72,
    trend: 'up'
  },
  {
    rank: 2,
    userId: 2,
    name: '佐藤花子',
    bestScore: 76,
    averageScore: 85,
    totalRounds: 78,
    handicap: 12,
    recentScore: 78,
    trend: 'stable'
  },
  {
    rank: 3,
    userId: 1,
    name: '田中太郎',
    bestScore: 82,
    averageScore: 92,
    totalRounds: 45,
    handicap: 18,
    recentScore: 85,
    trend: 'down'
  },
  {
    rank: 4,
    userId: 5,
    name: '高橋三郎',
    bestScore: 80,
    averageScore: 88,
    totalRounds: 67,
    handicap: 15,
    recentScore: 86,
    trend: 'up'
  },
  {
    rank: 5,
    userId: 3,
    name: '鈴木一郎',
    bestScore: 95,
    averageScore: 105,
    totalRounds: 23,
    handicap: 24,
    recentScore: 98,
    trend: 'stable'
  }
]

function RankingInfo() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('bestScore') // bestScore, averageScore, totalRounds

  useEffect(() => {
    // モックAPI呼び出し（実際のAPIに置き換え可能）
    const fetchRankings = async () => {
      setLoading(true)
      // 実際のAPI呼び出し: const response = await fetch('/api/rankings')
      // const data = await response.json()
      
      // モックデータを返す（1秒の遅延でAPI呼び出しをシミュレート）
      setTimeout(() => {
        let sortedRankings = [...mockRanking]
        
        // ソート処理
        if (sortBy === 'bestScore') {
          sortedRankings.sort((a, b) => a.bestScore - b.bestScore)
        } else if (sortBy === 'averageScore') {
          sortedRankings.sort((a, b) => a.averageScore - b.averageScore)
        } else if (sortBy === 'totalRounds') {
          sortedRankings.sort((a, b) => b.totalRounds - a.totalRounds)
        }
        
        // ランクを更新
        sortedRankings = sortedRankings.map((r, index) => ({
          ...r,
          rank: index + 1
        }))
        
        setRankings(sortedRankings)
        setLoading(false)
      }, 500)
    }

    fetchRankings()
  }, [sortBy])

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '📈'
    if (trend === 'down') return '📉'
    return '➡️'
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">ランキング情報表示</h2>
        <p className="text-gray-400">ゴルフプレイヤーのランキングを確認できます</p>
      </div>

      {/* ソートオプション */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSortBy('bestScore')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'bestScore'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
          }`}
        >
          ベストスコア順
        </button>
        <button
          onClick={() => setSortBy('averageScore')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'averageScore'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
          }`}
        >
          平均スコア順
        </button>
        <button
          onClick={() => setSortBy('totalRounds')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'totalRounds'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
          }`}
        >
          総ラウンド数順
        </button>
      </div>

      {/* ランキングテーブル */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">読み込み中...</div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    順位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    プレイヤー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ハンディキャップ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ベストスコア
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    平均スコア
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    直近スコア
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    総ラウンド数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    トレンド
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {rankings.map((player) => (
                  <tr
                    key={player.userId}
                    className={`hover:bg-gray-750 ${
                      player.rank <= 3 ? 'bg-gray-750' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMedalEmoji(player.rank) && (
                          <span className="text-2xl mr-2">{getMedalEmoji(player.rank)}</span>
                        )}
                        <span
                          className={`text-lg font-bold ${
                            player.rank === 1
                              ? 'text-yellow-400'
                              : player.rank === 2
                              ? 'text-gray-300'
                              : player.rank === 3
                              ? 'text-amber-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {player.rank}位
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {player.handicap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                      {player.bestScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {player.averageScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                      {player.recentScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {player.totalRounds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-xl">{getTrendIcon(player.trend)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* トップ3のハイライト */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {rankings.slice(0, 3).map((player) => (
          <div
            key={player.userId}
            className={`p-6 rounded-lg border ${
              player.rank === 1
                ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/10 border-yellow-700'
                : player.rank === 2
                ? 'bg-gradient-to-br from-gray-700/30 to-gray-600/10 border-gray-600'
                : 'bg-gradient-to-br from-amber-900/30 to-amber-800/10 border-amber-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{getMedalEmoji(player.rank)}</span>
                <div>
                  <div className="text-lg font-bold text-white">{player.name}</div>
                  <div className="text-sm text-gray-400">{player.rank}位</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">ベストスコア</span>
                <span className="text-green-400 font-semibold">{player.bestScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">平均スコア</span>
                <span className="text-gray-300">{player.averageScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">総ラウンド数</span>
                <span className="text-gray-300">{player.totalRounds}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RankingInfo
