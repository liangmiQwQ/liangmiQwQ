import type { ChildProcess } from 'node:child_process'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import type { FSWatcher } from 'node:fs'
import { watch } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const watchMode = process.argv.includes('--watch')
const runMode = process.argv.includes('--run')

if (watchMode && !runMode) {
  startWatchMode()
} else {
  await runDev()
}

async function runDev() {
  await runCommand('vp', ['run', 'cpack'])
  await import(createFreshImportUrl(resolve('dist/index.mjs')))
}

function startWatchMode() {
  const watchers = createWatchers(queueRestart)
  let child = startDevChild()
  let restartTimer: NodeJS.Timeout | undefined
  let restartPromise = Promise.resolve()

  function queueRestart() {
    clearTimeout(restartTimer)
    restartTimer = setTimeout(() => {
      restartPromise = restartPromise.then(restart)
    }, 100)
  }

  async function restart() {
    child = await restartChild(child)
  }

  function stop(signal: NodeJS.Signals) {
    clearTimeout(restartTimer)
    closeWatchers(watchers)
    child.kill(signal)
    process.exit(0)
  }

  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
}

function startDevChild() {
  return spawn(process.execPath, [import.meta.filename, '--run'], {
    stdio: 'inherit'
  })
}

async function restartChild(child: ChildProcess) {
  if (child.exitCode === null) {
    child.kill('SIGTERM')
    await once(child, 'exit')
  }

  return startDevChild()
}

function createWatchers(listener: () => void) {
  return [
    watch(resolve('src'), { recursive: true }, listener),
    watch(resolve('scripts/dev.ts'), listener),
    watch(resolve('vite.config.ts'), listener),
    watch(resolve('package.json'), listener)
  ]
}

function closeWatchers(watchers: FSWatcher[]) {
  for (const watcher of watchers) {
    watcher.close()
  }
}

function runCommand(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit'
    })

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} ${args.join(' ')} failed with ${signal ?? code}`))
    })
  })
}

function createFreshImportUrl(file: string) {
  const url = pathToFileURL(file)
  url.searchParams.set('updated', Date.now().toString())
  return url.href
}
