let sequence = 0

export function createId(prefix: string): string {
  sequence += 1
  const random = globalThis.crypto?.randomUUID?.().slice(0, 8) ?? sequence.toString(36).padStart(8, '0')
  return `${prefix}_${random}`
}

export function requestFingerprint(request: { requestId: string; action: string; mandate: string | null; arguments: Record<string, unknown> }): string {
  const text = JSON.stringify([request.requestId, request.action, request.mandate, request.arguments])
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}
