import { Navigate, Route, Routes } from 'react-router-dom'
import { TopsysPage } from './pages/TopsysPage'
import { SmartShopPage } from './pages/SmartShopPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AboutPage } from './pages/AboutPage'
import { CareersPage } from './pages/CareersPage'
import { CalendarBookingPage } from './pages/CalendarBookingPage'
import { ChatPage } from './pages/ChatPage'
import { CRMPage } from './pages/CRMPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { WowLandingPage } from './pages/WowLandingPage'
import { LoginPage } from './pages/LoginPage'
import { PricingPage } from './pages/PricingPage'
import { RegisterPage } from './pages/RegisterPage'
import { ReportPage } from './pages/ReportPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { TicketsPage } from './pages/TicketsPage'
import { HRAttendancePage } from './pages/hr/HRAttendancePage'
import { HRCompaniesPage } from './pages/hr/HRCompaniesPage'
import { HRDashboard } from './pages/hr/HRDashboard'
import { HREmployeesPage } from './pages/hr/HREmployeesPage'
import { HRLeavePage } from './pages/hr/HRLeavePage'
import { HRLoginPage } from './pages/hr/HRLoginPage'
import { HRPayslipsPage } from './pages/hr/HRPayslipsPage'
import { HRProfilePage } from './pages/hr/HRProfilePage'
import { HRReportsPage } from './pages/hr/HRReportsPage'
import { getHRToken } from './lib/hrApi'
import { FreelanceLandingPage } from './pages/FreelanceLandingPage'
import { FreelanceJobsPage } from './pages/FreelanceJobsPage'
import { FreelancePostJobPage } from './pages/FreelancePostJobPage'
import { FreelanceFreelancersPage } from './pages/FreelanceFreelancersPage'
import { BartPage } from './pages/BartPage'
import { BartCampaignPage } from './pages/BartCampaignPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminContentPage } from './pages/admin/AdminContentPage'

function HRProtectedRoute({ children }: { children: React.ReactNode }) {
  return getHRToken() ? <>{children}</> : <Navigate to="/hr" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/topsys" element={<TopsysPage />} />
      <Route path="/smartshop" element={<SmartShopPage />} />
      <Route path="/" element={<WowLandingPage />} />
      <Route path="/agent" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} />
      <Route path="/cal" element={<CalendarBookingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />

      {/* ── HR Portal ── */}
      <Route path="/hr" element={<HRLoginPage />} />
      <Route path="/hr/dashboard" element={<HRProtectedRoute><HRDashboard /></HRProtectedRoute>} />
      <Route path="/hr/companies" element={<HRProtectedRoute><HRCompaniesPage /></HRProtectedRoute>} />
      <Route path="/hr/employees" element={<HRProtectedRoute><HREmployeesPage /></HRProtectedRoute>} />
      <Route path="/hr/attendance" element={<HRProtectedRoute><HRAttendancePage /></HRProtectedRoute>} />
      <Route path="/hr/leave" element={<HRProtectedRoute><HRLeavePage /></HRProtectedRoute>} />
      <Route path="/hr/payslips" element={<HRProtectedRoute><HRPayslipsPage /></HRProtectedRoute>} />
      <Route path="/hr/reports" element={<HRProtectedRoute><HRReportsPage /></HRProtectedRoute>} />
      <Route path="/hr/profile" element={<HRProtectedRoute><HRProfilePage /></HRProtectedRoute>} />

      {/* ── BART Transit Portal ── */}
      {/* ── Admin CMS ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/content" element={<AdminContentPage />} />

      <Route path="/bart" element={<BartPage />} />
      <Route path="/bart/not-one-more-girl" element={<BartCampaignPage />} />

      {/* ── Freelance Marketplace ── */}
      <Route path="/freelance" element={<FreelanceLandingPage />} />
      <Route path="/freelance/jobs" element={<FreelanceJobsPage />} />
      <Route path="/freelance/post-job" element={<FreelancePostJobPage />} />
      <Route path="/freelance/freelancers" element={<FreelanceFreelancersPage />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
