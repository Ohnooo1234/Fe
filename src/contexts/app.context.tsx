import { createContext, useState } from 'react'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import { getAccessTokenFromLS, getProfileFromLS, getRoleFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  role: string
  setRole: React.Dispatch<React.SetStateAction<string>>
  profile: SuccessResponse<{ token: string; user: User }> | null
  setProfile: React.Dispatch<React.SetStateAction<SuccessResponse<{ token: string; user: User }> | null>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  role: getRoleFromLS(),
  setRole: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [role, setRole] = useState<string>(initialAppContext.role)
  const [profile, setProfile] = useState<SuccessResponse<{ token: string; user: User }> | null>(
    initialAppContext.profile
  )
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        role,
        setRole,
        profile,
        setProfile
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
