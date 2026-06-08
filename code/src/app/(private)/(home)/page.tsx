import { Dashboard } from '@/modules/dashboard'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/shared/ui/breadcrumb'

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 flex items-center border-b px-6 py-3 backdrop-blur-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Dashboard />
      </main>
    </div>
  )
}
