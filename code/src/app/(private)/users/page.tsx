import { Can } from '@/core/permissions/context/abilityContext'
import { Header } from '@/modules/users'
import { UserManagement } from '@/modules/users'
import { CreateUserButton } from '@/modules/users'

export default function UsersPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-0">
            <span className="text-lg font-semibold">Gestão de Usuários</span>
            <span className="text-muted-foreground text-sm">
              Gerencie os usuários e seus perfis de acesso.
            </span>
          </div>

          <Can I="create" a="User">
            <div className="lg:ml-auto">
              <CreateUserButton />
            </div>
          </Can>
        </div>

        <UserManagement />
      </div>
    </div>
  )
}
