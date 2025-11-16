import { useState, useEffect } from 'react'

// モックデータ
const mockUsers = [
  {
    id: 1,
    name: '田中太郎',
    email: 'tanaka@example.com',
    handicap: 18,
    totalRounds: 45,
    bestScore: 82,
    averageScore: 92,
    joinDate: '2023-01-15',
    status: 'active'
  },
  {
    id: 2,
    name: '佐藤花子',
    email: 'sato@example.com',
    handicap: 12,
    totalRounds: 78,
    bestScore: 76,
    averageScore: 85,
    joinDate: '2022-08-20',
    status: 'active'
  },
  {
    id: 3,
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    handicap: 24,
    totalRounds: 23,
    bestScore: 95,
    averageScore: 105,
    joinDate: '2024-03-10',
    status: 'active'
  },
  {
    id: 4,
    name: '山田次郎',
    email: 'yamada@example.com',
    handicap: 8,
    totalRounds: 156,
    bestScore: 70,
    averageScore: 78,
    joinDate: '2021-05-05',
    status: 'active'
  },
  {
    id: 5,
    name: '高橋三郎',
    email: 'takahashi@example.com',
    handicap: 15,
    totalRounds: 67,
    bestScore: 80,
    averageScore: 88,
    joinDate: '2023-06-12',
    status: 'inactive'
  }
]

function UserInfo() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // モックAPI呼び出し（実際のAPIに置き換え可能）
    const fetchUsers = async () => {
      setLoading(true)
      // 実際のAPI呼び出し: const response = await fetch('/api/users')
      // const data = await response.json()
      
      // モックデータを返す（1秒の遅延でAPI呼び出しをシミュレート）
      setTimeout(() => {
        setUsers(mockUsers)
        setLoading(false)
      }, 500)
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">ユーザ情報表示</h2>
        <p className="text-gray-400">登録されているユーザの一覧と詳細情報を確認できます</p>
      </div>

      {/* 検索バー */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="名前またはメールアドレスで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* ユーザ一覧 */}
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
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    名前
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    メールアドレス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ハンディキャップ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    総ラウンド数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ベストスコア
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    平均スコア
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    登録日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.handicap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.totalRounds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                      {user.bestScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.averageScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {user.status === 'active' ? 'アクティブ' : '非アクティブ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 統計情報 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm">総ユーザ数</div>
          <div className="text-2xl font-bold text-white mt-1">{users.length}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm">アクティブユーザ</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {users.filter(u => u.status === 'active').length}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm">平均ハンディキャップ</div>
          <div className="text-2xl font-bold text-white mt-1">
            {users.length > 0
              ? (users.reduce((sum, u) => sum + u.handicap, 0) / users.length).toFixed(1)
              : 0}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm">総ラウンド数</div>
          <div className="text-2xl font-bold text-white mt-1">
            {users.reduce((sum, u) => sum + u.totalRounds, 0)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
