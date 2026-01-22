import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { WorldProvider } from '@/contexts/WorldContext'
import { ToastProvider } from '@/components/ui'
import { AppShell } from '@/components/shell'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { CharactersPage } from '@/pages/characters/CharactersPage'
import { LocationsPage } from '@/pages/locations/LocationsPage'
import { OrganizationsPage } from '@/pages/organizations/OrganizationsPage'
import { TimelinePage } from '@/pages/timeline/TimelinePage'
import { ItemsPage } from '@/pages/items/ItemsPage'
import { RulesPage } from '@/pages/rules/RulesPage'
import { StoriesPage } from '@/pages/stories/StoriesPage'
import { ChatPage } from '@/pages/chat/ChatPage'
import { ExportPage } from '@/pages/export/ExportPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorldProvider>
          <ToastProvider>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/characters" element={<CharactersPage />} />
              <Route path="/characters/:id" element={<CharactersPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/locations/:id" element={<LocationsPage />} />
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/organizations/:id" element={<OrganizationsPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/timeline/:id" element={<TimelinePage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemsPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/rules/:id" element={<RulesPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/stories/:id" element={<StoriesPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/export" element={<ExportPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ToastProvider>
        </WorldProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
