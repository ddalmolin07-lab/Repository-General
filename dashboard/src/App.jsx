import { Routes, Route } from 'react-router-dom'
import Escalation from './pages/Escalation'
import Storico from './pages/Storico'
import Analytics from './pages/Analytics'
import Impostazioni from './pages/Impostazioni'
import Kb from './pages/Kb'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'
import ProtectedLayout from './components/auth/ProtectedLayout'

export default function App() {
  return (
    <Routes>
      {/* Auth routes — full-screen, nessun chrome */}
      <Route path="/login"           element={<SignIn />} />
      <Route path="/signup"          element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* App routes — protette, con KpiBar + Sidebar */}
      <Route element={<ProtectedLayout />}>
        <Route path="/"             element={<Escalation />} />
        <Route path="/storico"      element={<Storico />} />
        <Route path="/kb"           element={<Kb />} />
        <Route path="/analytics"    element={<Analytics />} />
        <Route path="/impostazioni" element={<Impostazioni />} />
      </Route>
    </Routes>
  )
}
