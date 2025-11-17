import { useState, useEffect } from 'react'

// APIベースURLをドメインに応じて決定
const getApiBaseUrl = () => {
  const hostname = window.location.hostname
  
  if (hostname === 'management.s.marty-golf.co') {
    return 'https://api.s.marty-golf.co'
  } else if (hostname === 'test-admin.s.marty-golf.co') {
    return 'https://5lajrqrx7xdj5brkfzsinr7s640wubzo.lambda-url.ap-northeast-1.on.aws'
  } else {
    // 環境変数が設定されている場合はそれを使用、それ以外はlocalhost:8080
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  }
}

const API_BASE_URL = getApiBaseUrl()

function RankingInfo() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [caddieMaster, setCaddieMaster] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [loadingCourses, setLoadingCourses] = useState(true)

  // マスターデータ取得
  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()

    const fetchMasterData = async () => {
      try {
        setLoadingCourses(true)
        const response = await fetch(`${API_BASE_URL}/api/v1/admin/master`, {
          signal: abortController.signal
        })
        if (!response.ok) {
          throw new Error('マスターデータの取得に失敗しました')
        }
        const data = await response.json()
        
        // コンポーネントがマウントされている場合のみ状態を更新
        if (isMounted) {
          // コースデータを設定
          if (data.course_master && Array.isArray(data.course_master)) {
            setCourses(data.course_master)
          }
          // キャディマスターデータを設定
          if (data.caddie_master && Array.isArray(data.caddie_master)) {
            setCaddieMaster(data.caddie_master)
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('マスターデータ取得エラー:', error)
          // エラー時は空の配列を設定
          setCourses([])
        }
      } finally {
        if (isMounted) {
          setLoadingCourses(false)
        }
      }
    }

    fetchMasterData()

    // クリーンアップ関数
    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  // ランキングデータ取得
  useEffect(() => {
    if (!selectedCourseId) {
      setRankings([])
      setLoading(false)
      return
    }

    const fetchRankings = async () => {
      try {
        setLoading(true)
        // ランキングAPI呼び出し（コースIDをパスパラメータとして渡す）
        const response = await fetch(`${API_BASE_URL}/api/v1/admin/ranking/${selectedCourseId}`)
        
        if (!response.ok) {
          throw new Error('ランキングデータの取得に失敗しました')
        }
        
        const data = await response.json()
        let rankingsData = []
        
        // APIレスポンスは配列形式
        if (Array.isArray(data)) {
          rankingsData = data
        } else if (data.rankings && Array.isArray(data.rankings)) {
          rankingsData = data.rankings
        } else if (data.data && Array.isArray(data.data)) {
          rankingsData = data.data
        }
        
        // スコアでソート（小さい順、既にrankが含まれているが念のため）
        let sortedRankings = [...rankingsData]
        sortedRankings.sort((a, b) => (a.score || 0) - (b.score || 0))
        
        // ランクを更新（APIから取得したrankを使用、ソート順に基づいて再計算）
        sortedRankings = sortedRankings.map((r, index) => ({
          ...r,
          rank: index + 1
        }))
        
        setRankings(sortedRankings)
      } catch (error) {
        console.error('ランキング取得エラー:', error)
        setRankings([])
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [selectedCourseId])

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}/${month}/${day} ${hours}:${minutes}`
    } catch (error) {
      return dateString
    }
  }

  const getCaddieName = (caddieId) => {
    if (!caddieId) return '-'
    const caddie = caddieMaster.find(c => c.caddie_id === caddieId)
    return caddie?.caddie_name || caddieId
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">ランキング情報表示</h2>
        <p className="text-gray-400">コースごとのランキングデータ表示</p>
      </div>

      {/* コース選択 */}
      <div className="mb-6">
        <label htmlFor="course-select" className="block text-sm font-medium text-gray-300 mb-2">
          コース選択
        </label>
        {loadingCourses ? (
          <div className="text-gray-400">コースデータを読み込み中...</div>
        ) : (
          <select
            id="course-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">---</option>
            {courses.length === 0 ? (
              <option value="" disabled>コースがありません</option>
            ) : (
              courses
                .filter((course) => course.course_type !== 0)
                .map((course) => {
                  const facilityName = course.facility_master?.facility_name || ''
                  const courseName = course.course_name || ''
                  const displayText = facilityName && courseName 
                    ? `${facilityName} ${courseName}`
                    : courseName || `コース ${course.course_id}`
                  return (
                    <option key={course.course_id} value={course.course_id}>
                      {displayText}
                    </option>
                  )
                })
            )}
          </select>
        )}
      </div>

      {/* ランキングテーブル */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">読み込み中...</div>
        </div>
      ) : rankings.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">
            {selectedCourseId ? 'ランキングデータがありません' : 'コースを選択してください'}
          </div>
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
                    ニックネーム
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ウォレットアドレス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    スコア
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ストローク
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    キャディ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ホールアウト
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {rankings.map((player, index) => (
                  <tr
                    key={player.app_user_id || index}
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
                      {player.basic_data?.nick_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {player.basic_data?.wallet_address || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                      {player.score ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                      {player.data?.total_stroke_count ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {getCaddieName(player.data?.caddie_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDateTime(player.data?.last_play_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default RankingInfo
