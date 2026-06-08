import { Can } from '@/core/permissions/context/abilityContext'
import { CompanyManagement } from '@/modules/companies'
import { Header } from '@/modules/companies'
import { CreateCompanyButton } from '@/modules/companies'

export default function CompaniesPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-0">
            <span className="text-lg font-semibold">Gestão de Clientes</span>
            <span className="text-muted-foreground text-sm">
              Gerencie as informações dos clientes cadastrados no sistema.
            </span>
          </div>

          <Can I="create" a="Company">
            <div className="lg:ml-auto">
              <CreateCompanyButton />
            </div>
          </Can>
        </div>

        <CompanyManagement />
      </div>
    </div>
  )
}
