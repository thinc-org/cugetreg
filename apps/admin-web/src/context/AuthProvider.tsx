import { createContext, useState } from 'react'

import { UserDto } from '@admin-web/common/types/UserDto'

interface AuthProviderProps {
  children: React.ReactNode
}

interface IAuthContext {
  user: UserDto | null
  logout: () => Promise<void>
}

export const AuthContext = createContext<IAuthContext | null>(null)

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDto | null>(null)
  const logout = async () => {
    // TODO: send api for logging user out
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>
}
