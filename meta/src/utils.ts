// Hex stuff
export function isHex(str: string): boolean {
  return (typeof str === 'string') && /^(0x)?[a-f0-9]*$/i.test(str)
}

export function toHex(bytes: Uint8Array, prefix = true): string {
  const hex = bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
  return prefix ? '0x' + hex : hex
}

export function fromHex(str: string) {
  if (!isHex(str)) throw Error('invalid encoding')
  const HexRegex = /(?<=^(0x)?)[a-f0-9]{1}(?=([a-f0-9]{2})*$)|(?<=^(0x)?[a-f0-9]*)([a-f0-9]{2})/gi
  const bytes = (str.match(HexRegex) ?? []).map(byte => parseInt(byte, 16))
  return Uint8Array.from(bytes)
}

export function toBytes(bytelike: any) {
  if (bytelike instanceof Uint8Array) { return bytelike }
  if (isHex(bytelike)) { return fromHex(bytelike) }
  throw Error('invalid bytes')
}

export function toUTF8(byteslike: any) {
  const bytes = toBytes(byteslike)
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

export function withJSON(data: any): Response {
  if (!data) return new Response('{"msg": "not found"}', { status: 404 })

  const json = JSON.stringify(data, null, 2)
  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'access-control-allow-origin': '*',
    }
  })
}

export async function providerFetch(
  url: string,
  method: string,
  params?: Array<any>
): Promise<any> {
  return fetch(url, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ id: 1, jsonrpc: '2.0', method, params })
  }).then(response => response.json())
}

export async function currentBlock(api: string): Promise<bigint> {
  const response = await providerFetch(api, 'eth_blockNumber')
  return BigInt(response.result)
}

export async function getGeneration(api: string, contract: string, tid: string) {
  const data = '0x7d71dc35' + parseInt(tid).toString(16).padStart(64, '0')
  const response = await providerFetch(api, 'eth_call', [
    { to: contract, data },
    'latest'
  ])
  return BigInt(response.result).toString()
}

export async function getRedeemed(api: string, contract: string, tid: string) {
  const data = '0x7ed0f1c1' + parseInt(tid).toString(16).padStart(64, '0')
  const response = await providerFetch(api, 'eth_call', [
    { to: contract, data },
    'latest'
  ])
  return !!BigInt(response.result)
}
