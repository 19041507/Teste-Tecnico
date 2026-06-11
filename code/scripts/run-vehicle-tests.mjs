import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const buildDir = path.join(root, '.vehicle-test-build')
const typescriptBin = path.join(
  root,
  'node_modules',
  'typescript',
  'bin',
  'tsc'
)

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
  })

  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

try {
  rmSync(buildDir, { recursive: true, force: true })
  run(process.execPath, [typescriptBin, '-p', 'tsconfig.vehicles-tests.json'])

  const aliasScope = path.join(buildDir, 'node_modules', '@')
  mkdirSync(aliasScope, { recursive: true })

  const links = [
    ['modules', path.join(buildDir, 'modules')],
    ['shared', path.join(buildDir, 'shared')],
  ]

  for (const [name, target] of links) {
    const destination = path.join(aliasScope, name)
    if (!existsSync(destination)) {
      symlinkSync(
        target,
        destination,
        process.platform === 'win32' ? 'junction' : 'dir'
      )
    }
  }

  run(process.execPath, [
    '--test',
    path.join(
      buildDir,
      'modules',
      'vehicles',
      '__tests__',
      'vehicleService.test.js'
    ),
  ])
} finally {
  rmSync(buildDir, { recursive: true, force: true })
}
