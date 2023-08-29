export const ApeMeta: Record<string, any> = {
  "name": "Ape Cloud",
  "description": "NFTs are cool but what if they could be cool and useful? With Ape Cloud you can create a whole new kind of primate.",
  "image": "ipfs://QmNdCZNSxrc1CSVoQ2eVN4te3YGfd9395LiFbyv215GANf",
  "external_link": "https://ape.cloud",
  "seller_fee_basis_points": 100,
  "fee_recipient": "0xb34ff44cD68e0af7F04b60Cd47C7ae93C730Ef8e"
}

export const CardFiMeta: Record<string, any> = {
  "name": "CardFi",
  "description": "CardFi makes it easy to create, trade and redeem asset attached NFT gift-cards.",
  "image": "ipfs://QmUhtGakkayTKvs33Zkuf9vuZ8nn4bSrxgnvEfkPQHv6h1",
  "external_link": "https://cardfi.co",
  "seller_fee_basis_points": 100,
  "fee_recipient": "0xb34ff44cD68e0af7F04b60Cd47C7ae93C730Ef8e"
}

export const PepeMeta: Record<string, any> = {
  "name": "Pepe Domains",
  "description": ".pepe is the ultimate meme domain on the blockchain. a fun crypto domain that blends meme spirit with decentralized domain technology. it is the most memeable domain on the internet, and is the only domain that can be bought with $pepe.",
  "image": "ipfs://QmZ3q8mJ8iLZhdgFP1w7iHnGaiTgVuMGUvU7vyxvDuK4oT",
  "external_link": "https://pepe.fans",
  "seller_fee_basis_points": 100,
  "fee_recipient": "0xb34ff44cD68e0af7F04b60Cd47C7ae93C730Ef8e"
}

export const Overrides: Record<string, any> = {
  "0x9d2edf6f8646ce4b09ed29de4881db297ab36bc9328b0225e0f954ce9039324d": ApeMeta,
  "0x5b0ff7c1d5683bef738838377aa985128bbc5c6d2c0aaa42cd72a1a09c34e624": PepeMeta,
  "0xc31a94cc5ee10b1eb4e9b7f485cb2136dc2673427b450bdec8c0674c87720a87": CardFiMeta
}
