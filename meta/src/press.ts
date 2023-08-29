import { Env, DomainData, Metadata, MetadataAttribute } from './types'
import { Overrides } from './overrides'
import { getGeneration, getRedeemed } from './utils'

const DefaultZoneConfig = {
  api: '', chain: '', contract: '',
  parent: '', origin: '', label: '', fqn: '',
  start: 0, batch: 1000, delay: 10000, lag: 128
}

const DefaultImage = 'ipfs://QmPp2GVYNwVHzWgibxCnybM775zT9BM8BbeBqh9iTCxAEA'
const ReservedTraits = ['id', 'domain', 'parent domain']

const AttributeFilter = (reserve: MetadataAttribute[] = []) => {
  const reserved = [...(reserve.map(t => t.trait_type.toLowerCase())), ...ReservedTraits]
  return (attr: MetadataAttribute) => {
    return !reserved.includes(attr.trait_type.toLowerCase())
  }
}

export async function withPress(_: Request, env: Env) {
  env.getDomain = async (namehash: string): Promise<DomainData | null> => {
    const domain = await env.RESOLVER.get(`domain:${namehash}`, 'json')
    console.log('domain >', domain)
    return domain ? { namehash, ...domain } as DomainData : null
  }

  env.getMetadata = async (namehash: string): Promise<Record<string, any> | null> => {
    const override = Overrides[namehash]
    if (override) return override

    const domain = await env.getDomain(namehash)
    if (!domain || !domain.owner) return null
    const parent = await env.getDomain(domain.parent)
    if (!parent || !parent.owner) return null

    const base = await env.getMetadataLayer(parent.owner, parent.namehash)
    const custom = await env.getMetadataLayer(domain.owner, domain.namehash)
    const overrides = await env.getMetadataLayer(parent.owner, domain.namehash)

    overrides.attributes = (overrides.attributes || []).filter(AttributeFilter())
    custom.attributes = (custom.attributes || []).filter(AttributeFilter(overrides.attributes))
    base.attributes = (base.attributes || []).filter(AttributeFilter([...custom.attributes, ...overrides.attributes]))

    const attributes = [
      { "trait_type": "ID", "value": domain.namehash },
      { "trait_type": "Domain", "value": domain.fqn },
      { "trait_type": "Parent Domain", "value": parent.fqn },
      ...base.attributes,
      ...custom.attributes,
      ...overrides.attributes
    ]
    console.log('attrs', attributes)

    return {
      image: DefaultImage,
      description: `Butterfly Protocol Domain: ${domain.fqn}`,
      ...base, ...{ name: domain.fqn }, ...custom, ...overrides, attributes
    }
  }

  env.getMetadataLayer = async (address: string, channel: string): Promise<Metadata> => {
    const layer: Metadata = await env.RESOLVER.get(`metadata:${address}:${channel}`, 'json') || {}
    if (!layer.image) delete layer.image
    return layer
  }

  env.getInvitationMetadata = async (origin: string, tid: string): Promise<Metadata | null> => {
    const zone = { ...DefaultZoneConfig, ...JSON.parse(await env.ZONES.get(origin) || '{}'), origin }
    const { api, registrar, invitation_name, invitation_image } = zone
    tid = BigInt(tid).toString().padStart(5, '0')

    const generation = await getGeneration(api, registrar, tid)
    const redeemed = await getRedeemed(api, registrar, tid)
    const offset = generation === '1' ? '512' : '500'
    const status = redeemed ? '#FF0000' : '#00FF00'
    const bg = redeemed ? '#444444' : '#000000'
    return {
      name: invitation_name.replace(/##GEN##/, generation).replace(/##TID##/, tid),
      image_data: invitation_image
        .replace(/##GEN##/, generation)
        .replace(/##OFFSET##/, offset)
        .replace(/##STATUS##/, status)
        .replace(/##TID##/, tid)
        .replace(/##BG##/, bg),
      attributes: [
        { "trait_type": "Generation", "value": generation },
        { "trait_type": "Redeemed", "value": redeemed ? 'Yes' : 'No' }
      ]
    }
  }
}
