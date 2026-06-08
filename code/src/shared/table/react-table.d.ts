import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta {
    /**
     * Controla o estado inicial de visibilidade da coluna via getInitialVisibility().
     * true  → coluna visível ao carregar a tabela
     * false → coluna oculta ao carregar (padrão)
     *
     * Independente de enableHiding: false, que impede o usuário de alternar a visibilidade.
     */
    visible?: boolean
  }
}
