import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// A layout route: wrap a group of routes with it instead of each page
// individually.
//   <Route element={<ProtectedRoute />}>
//     <Route path="/dashboard" element={<DashboardPage />} />
//   </Route>
// React Router renders this element first; <Outlet /> is where the matched
// child route then renders.
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-slate-500">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
