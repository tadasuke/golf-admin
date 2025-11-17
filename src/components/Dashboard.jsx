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

function Dashboard() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingMode, setPendingMode] = useState(false)
  const [version, setVersion] = useState('')

  // メンテナンスモードの状態を取得する関数
  const fetchMaintenanceStatus = async (signal = null) => {
    try {
      const fetchOptions = signal ? { signal } : {}
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/status`, fetchOptions)
      
      if (!response.ok) {
        throw new Error('メンテナンスモード状態の取得に失敗しました')
      }
      
      const data = await response.json()
      
      // maintenance_mode: 0 = OFF, 2 = ON
      const maintenanceMode = data?.common?.maintenance_mode ?? 0
      setIsMaintenanceMode(maintenanceMode === 2)
      
      // バージョン情報を取得
      const apiVersion = data?.common?.version ?? ''
      setVersion(apiVersion)
      
      return maintenanceMode === 2
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('メンテナンスモード状態取得エラー:', error)
        // エラー時はデフォルトでOFFとする
        setIsMaintenanceMode(false)
        throw error
      }
    }
  }

  // メンテナンスモードの状態を取得（初期読み込み時）
  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()

    const loadInitialStatus = async () => {
      try {
        setIsInitialLoading(true)
        await fetchMaintenanceStatus(abortController.signal)
      } catch (error) {
        // エラーはfetchMaintenanceStatus内で処理済み
      } finally {
        if (isMounted) {
          setIsInitialLoading(false)
        }
      }
    }

    loadInitialStatus()

    // クリーンアップ関数
    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  const handleToggleClick = () => {
    const newMode = !isMaintenanceMode
    setPendingMode(newMode)
    setShowConfirmModal(true)
  }

  const handleConfirm = async () => {
    setShowConfirmModal(false)
    setIsLoading(true)
    
    try {
      // メンテナンスモード更新APIを呼び出し
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/maintenance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: pendingMode }),
      })
      
      if (!response.ok) {
        throw new Error('メンテナンスモードの更新に失敗しました')
      }
      
      // API実行後、状態を再取得してボタンの表示を更新
      await fetchMaintenanceStatus()
    } catch (error) {
      console.error('メンテナンスモード更新エラー:', error)
      alert('メンテナンスモードの更新に失敗しました')
      // エラー時は現在の状態を再取得
      await fetchMaintenanceStatus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
    setPendingMode(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">ダッシュボード</h2>
        <p className="text-gray-400">管理画面の概要情報を表示します</p>
        {version && (
          <p className="text-gray-500 text-sm mt-2">APIバージョン：{version}</p>
        )}
      </div>

      {/* メンテナンスモード切り替え */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">メンテナンスモード</h3>
            {isInitialLoading ? (
              <p className="text-gray-400 text-sm">状態を読み込み中...</p>
            ) : (
              <p className="text-gray-400 text-sm">
                {isMaintenanceMode
                  ? '現在メンテナンスモードが有効です。サービスは一時的に利用できません。'
                  : '現在メンテナンスモードは無効です。サービスは正常に動作しています。'}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={handleToggleClick}
              disabled={isLoading || isInitialLoading}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                isMaintenanceMode ? 'bg-green-600' : 'bg-gray-600'
              } ${isLoading || isInitialLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isMaintenanceMode ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-4 text-lg font-semibold ${isMaintenanceMode ? 'text-green-400' : 'text-gray-400'}`}>
              {isMaintenanceMode ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {pendingMode ? 'メンテナンスモードを有効化しますか？' : 'メンテナンスモードを無効化しますか？'}
            </h3>
            <p className="text-gray-300 mb-6">
              {pendingMode
                ? 'メンテナンスモードを有効化すると、サービスが一時的に利用できなくなります。本当に実行しますか？'
                : 'メンテナンスモードを無効化すると、サービスが通常通り利用可能になります。本当に実行しますか？'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  pendingMode
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isLoading ? '処理中...' : '実行'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

