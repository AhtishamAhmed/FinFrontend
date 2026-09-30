import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

// Shared shell for every authenticated page: navbar on top, page content
// (whichever child route matched) rendered through <Outlet /> below it.
export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
