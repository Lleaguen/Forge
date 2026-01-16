import { useAuth } from '../../../app/providers/AuthProvider'

export function LogoutButton() {
  const { logout } = useAuth()
  return <button onClick={logout}>Logout</button>
}
