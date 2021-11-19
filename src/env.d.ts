/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare interface Base {
  arch?: string
  model?: string
  type?: string
}

declare interface Info {
  cpuUse?: number
  diskinfo?: Diskinfo[]
  loadavg: string[]
  mem?: Mem
  netstat?: { total: { inputMb: number, outputMb: number } }
  openedCount?: number
  uptime?: string
}

declare interface Mem {
  freeMemMb: number
  freeMemPercentage: number
  totalMemMb: number
  usedMemMb: number
  usedMemPercentage: number
}

declare interface Diskinfo {
  avail: number
  fstype: string
  pcent: number
  size: number
  target: string
  used: number
}


declare interface server {
  name: string
  api: string
}
