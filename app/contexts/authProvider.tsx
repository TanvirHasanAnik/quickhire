import { extractPayload, UserPayload } from "@/utility/Auth/token"
import { createContext, useEffect, useState } from "react"

type Props = {
  children: React.ReactNode
}

type AuthContextType = {
  user: UserPayload | null
  authenticated: boolean
  loading: boolean
  login: (user: UserPayload) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: Props) {

  const [user, setUser] = useState<UserPayload | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken")

      if (token) {
        try {
          const userValues: UserPayload = extractPayload(token)
          if (userValues) {
            setUser(userValues)
            setAuthenticated(true)
          } else {
            localStorage.removeItem("authToken")
          }
        } catch {
          localStorage.removeItem("authToken")
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])



  const login = (user: UserPayload) => {
    setUser(user)
    setAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, authenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}