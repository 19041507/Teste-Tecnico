# Desafio — Módulo de Veículos (vehicles)

Este módulo está **propositalmente incompleto**. Você deve implementá-lo do zero,
seguindo **exatamente** os mesmos padrões dos módulos já prontos `companies` e
`users` (organização de pastas, componentes, hooks, services, forms, tabelas e
fluxo de navegação).

> Toda a aplicação roda com **dados mockados, sem backend**. O seu service também
> deve trabalhar com mocks (use os arquivos de apoio listados abaixo).

## O que já vem pronto (contratos + mocks)

- `types/Vehicle/base-vehicle.dto.ts` — entidade `Vehicle` + `vehicleSchema`
- `types/Vehicle/create-vehicle.dto.ts` — `CreateVehicleDto` + schema de validação
- `types/Vehicle/update-vehicle.dto.ts` — `UpdateVehicleDto`
- `types/Vehicle/query-vehicle.dto.ts` — `QueryVehicleDto` (paginação/ordenação/filtros)
- `enums/vehicle-type.enum.ts` — `VehicleType`
- `mocks/vehicle.mocks.ts` — lista de veículos mockados + resposta paginada de exemplo
- `mocks/api-examples.ts` — payloads de create/update/query e shape de resposta da API

## O que você deve implementar

Entregue o **módulo de veículos completo** — listagem (com tabela, paginação,
filtros e ações), formulário de criação/edição com validações e o fluxo de
navegação — **espelhando** os módulos `companies` e `users`. Crie o service, os
hooks, os componentes e o que mais for necessário **com base no que já existe**
nesses módulos. Os mocks de apoio já estão prontos como fonte de dados.

Dois pontos que vale destacar:

- Registre a rota em `src/core/http/proxy/route-config.ts` (a permissão
  `Vehicle` já existe em `core/permissions`).
- Atualize este `index.ts` com os exports do que você criar.

## Dica

Abra `src/modules/companies` lado a lado e use-o como referência. O contrato de
dados (`Vehicle`) e os mocks já estão prontos — o foco é reproduzir, com a sua
própria organização, os padrões de UI, formulário, tabela e integração.
