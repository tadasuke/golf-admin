import { useState } from 'react'
import Dashboard from './components/Dashboard'
import RankingInfo from './components/RankingInfo'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'ranking':
        return <RankingInfo />
      default:
        return <Dashboard />
    }
  }

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
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  📊 ダッシュボード
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('ranking')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentPage === 'ranking'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  🏆 ランキング情報表示
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-auto bg-gray-900">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App