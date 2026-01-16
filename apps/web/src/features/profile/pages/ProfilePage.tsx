import { useAuth } from '../../../app/providers/AuthProvider'

export function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
