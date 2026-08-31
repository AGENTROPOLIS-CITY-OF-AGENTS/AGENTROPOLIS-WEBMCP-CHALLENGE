/// <reference types="vite/client" />

interface ModelContextTool {
  name: string
  title?: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }
  execute: (input: unknown, client?: { signal?: AbortSignal }) => Promise<unknown> | unknown
}

interface ModelContext {
  registerTool(tool: ModelContextTool, options?: { signal?: AbortSignal }): Promise<void>
}

interface Document {
  readonly modelContext?: ModelContext
}
