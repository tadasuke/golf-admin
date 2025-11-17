import RankingInfo from './components/RankingInfo'

function App() {
  return (
    <div className="dark min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* サイドバー */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-green-400">Marty Admin</h1>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <div className="w-full text-left px-4 py-3 rounded-lg bg-green-600 text-white">
                  🏆 ランキング情報表示
                </div>
              </li>
            </ul>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-auto bg-gray-900">
          <div className="p-8">
            <RankingInfo />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App