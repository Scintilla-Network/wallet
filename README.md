# @scintilla-network/wallet

Advanced wallet management library for Scintilla Network with comprehensive account, persona, and cryptographic operations support.

[![npm version](https://badge.fury.io/js/@scintilla-network%2Fwallet.svg)](https://www.npmjs.com/package/@scintilla-network/wallet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Wallet Management**
  - BIP39 mnemonic-based wallet creation
  - Hierarchical deterministic key derivation (BIP32/44)
  - Multiple account support
  - Chain-specific key management

- **Account Operations**
  - Cryptographic signing and verification
  - Message encryption and decryption
  - Address generation with custom prefixes

- **Persona System**
  - Moniker-based persona management
  - Multiple address derivation per persona
  - Persona-specific signing operations
  - Change address support

- **Security**
  - Nearly no dependencies except for @noble audited libraries
  - Various signature (including post-quantum) and encryption algorithms supported

## Installation

```bash
npm install @scintilla-network/wallet
```

### Browser

```html
<script type="module">
  import { Wallet, Account, Persona } from 'https://unpkg.com/@scintilla-network/wallet'
</script>
```

## Quick Start

```javascript
import { Wallet } from '@scintilla-network/wallet';

// Create a new wallet with generated mnemonic
const wallet = Wallet.create();

// Get the default account
const account = wallet.getAccount(0);

// Get account address
const address = account.toAddress('sct');
console.log('Address:', address.toString());

// Sign a message
const message = 'Hello, Scintilla!';
const signature = account.sign(message);
console.log('Signature:', signature);

// Verify the signature
const isValid = account.verify(signature, message);
console.log('Valid:', isValid);
```

## Usage Guide

### Wallet Creation and Management

```javascript
import { Wallet } from '@scintilla-network/wallet';

// Create new wallet with generated mnemonic
const wallet = Wallet.create();

// Create wallet from existing mnemonic
const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const existingWallet = new Wallet(mnemonic);

// Create wallet with custom coin type
const customWallet = Wallet.create(null, { coinType: 118 }); // Cosmos coin type

// Get multiple accounts
const account0 = wallet.getAccount(0);
const account1 = wallet.getAccount(1);
```

### Account Operations

```javascript
// Get account from wallet
const account = wallet.getAccount(0);

// Generate addresses
const defaultAddress = account.toAddress(); // Uses 'sct' prefix
const cosmosAddress = account.toAddress('cosmos');
const bitcoinAddress = account.toAddress('bc');

// Message signing
const message = 'Transaction data';
const signature = account.sign(message);

// Message verification
const isValid = account.verify(signature, message);

// Get public/private keys
const publicKey = account.toPublicKey();
const privateKey = account.toPrivateKey();

// Message encryption/decryption
const encrypted = account.encrypt('Secret message');
const decrypted = account.decrypt(encrypted);
```

### Persona Management

```javascript
// Get persona from account
const persona = account.getPersona('alice');

// Get persona moniker
const moniker = persona.getMoniker();

// Generate persona addresses
const address0 = persona.getAddress(0); // Receiving address
const changeAddress = persona.getAddress(0, true); // Change address

// Persona-specific operations
const personaSigner = persona.getSigner();
const personaSignature = persona.sign('Message for alice');
const isPersonaValid = persona.verify(personaSignature, 'Message for alice', publicKey);

// Persona encryption
const encryptedForPersona = persona.encrypt('Private message');
const decryptedFromPersona = persona.decrypt(encryptedForPersona);
```

### Advanced Key Management

```javascript
// Get specific persona keys
const personaParams = {
  kind: 'persona.spender',
  moniker: 'alice'
};

const spenderPublicKey = account.toPublicKey(personaParams);
const spenderPrivateKey = account.toPrivateKey(personaParams);

// Get specialized signers
const spenderSigner = account.getSigner('alice', 'persona.spender');
const voterSigner = account.getSigner('alice', 'persona.voter');
const stakeSigner = account.getSigner('alice', 'persona.stake');
```

### Message Types and Formats

All signing and encryption methods accept multiple message formats:

```javascript
// String messages
const stringSignature = account.sign('Hello World');

// Uint8Array messages
const bytes = new TextEncoder().encode('Hello World');
const bytesSignature = account.sign(bytes);

// SignableMessage objects
import { SignableMessage } from '@scintilla-network/keys';
const signableMsg = SignableMessage.fromString('Hello World');
const signableSig = account.sign(signableMsg);

// Hex string messages
const hexSignature = account.sign('48656c6c6f20576f726c64'); // "Hello World" in hex
```

### Signature Algorithms

```javascript
import { Signer } from '@scintilla-network/keys';

// Sign with SECP256K1 (default)
const secp256k1Sig = account.sign(message, { 
  algorithm: Signer.ALGORITHMS.SECP256K1 
});

// Sign with BLS (if supported)
const blsSig = account.sign(message, { 
  algorithm: Signer.ALGORITHMS.BLS 
});
```

## API Reference

### `Wallet`

#### Static Methods

```typescript
static create(input?: WalletInput, options?: WalletOptions): Wallet
```
Creates a new wallet with optional mnemonic input and configuration.

#### Constructor

```typescript
new Wallet(input: WalletInput, options?: WalletOptions)
```

- `input`: Mnemonic string or `{ phrase: string }` object
- `options.coinType`: BIP44 coin type (default: 8888)

#### Methods

```typescript
getAccount(accountIndex?: number): Account
```
Returns an Account instance for the specified index (default: 0).

### `Account`

#### Constructor

```typescript
new Account(accountKeyring: AccountKeyring)
```

#### Methods

```typescript
getPersona(moniker: string): Persona
sign(message: string | Uint8Array | SignableMessage, options?): [string, string] | string
verify(signature: string | Uint8Array, message: string | Uint8Array | SignableMessage, options?): boolean
toAddress(bech32Prefix?: string): Address | null
toPublicKey(params?: PersonaParams): Uint8Array | string
toPrivateKey(params?: PersonaParams): Uint8Array
getSigner(moniker?: string | null, type?: PersonaKind): Signer | null
encrypt(message: string | Uint8Array | SignableMessage, options?): string
decrypt(message: string, options?): string
```

### `Persona`

#### Constructor

```typescript
new Persona(personaKeyring?: PersonaKeyring | null)
```

#### Methods

```typescript
getMoniker(): string
getAddressKeyring(index: number, isChange?: boolean): AddressKeyring | null
getAddress(index: number, isChange?: boolean): Address | null
getSigner(): Signer | null
sign(message: string | Uint8Array | SignableMessage, options?): [string, string] | string
verify(signature: string, message: string | Uint8Array | SignableMessage, publicKey: string, options?): boolean
encrypt(message: string | Uint8Array | SignableMessage, options?): string
decrypt(message: string, options?): string
```

### Types

```typescript
type PersonaKind = 
  | 'persona.owner' 
  | 'persona.spender' 
  | 'persona.proposer' 
  | 'persona.voter' 
  | 'persona.stake' 
  | 'persona.operator';

interface PersonaParams {
  kind: PersonaKind;
  moniker: string;
}

interface WalletOptions {
  coinType?: number;
}

type WalletInput = string | { phrase: string };
```

N.B: 

- Consider using different personas for different purposes
- Regularly rotate keys when possible

## Examples

### Multi-Account Wallet

```javascript
const wallet = Wallet.create();

// Create multiple accounts for different purposes
const mainAccount = wallet.getAccount(0);
const votingAccount = wallet.getAccount(1);
const stakingAccount = wallet.getAccount(2);

// Each account has its own address space
console.log('Main:', mainAccount.toAddress().toString());
console.log('Voting:', votingAccount.toAddress().toString());
console.log('Staking:', stakingAccount.toAddress().toString());
```

### Persona-Based Operations

```javascript
const account = wallet.getAccount(0);

// Create personas for different roles
const alicePersona = account.getPersona('alice');
const bobPersona = account.getPersona('bob');

// Each persona can have multiple addresses
const aliceReceiving = alicePersona.getAddress(0, false);
const aliceChange = alicePersona.getAddress(0, true);

// Persona-specific signing
const aliceMessage = alicePersona.sign('Alice signed this');
const bobMessage = bobPersona.sign('Bob signed this');
```

### Cross-Chain Address Generation

```javascript
const account = wallet.getAccount(0);

// Generate addresses for different networks
const scintillaAddr = account.toAddress('sct');
const cosmosAddr = account.toAddress('cosmos');
const osmosisAddr = account.toAddress('osmo');

console.log('Scintilla:', scintillaAddr.toString());
console.log('Cosmos:', cosmosAddr.toString());
console.log('Osmosis:', osmosisAddr.toString());
```

## Dependencies

- [@scintilla-network/keys](https://www.npmjs.com/package/@scintilla-network/keys): Key management and cryptographic operations
- [@scintilla-network/mnemonic](https://www.npmjs.com/package/@scintilla-network/mnemonic): BIP39 mnemonic generation and validation
- [@scintilla-network/hashes](https://www.npmjs.com/package/@scintilla-network/hashes): Cryptographic hash functions

## Related Packages

- [@scintilla-network/signatures](https://www.npmjs.com/package/@scintilla-network/signatures): Digital signatures and key exchange
- [@scintilla-network/ciphers](https://www.npmjs.com/package/@scintilla-network/ciphers): Encryption and decryption utilities
- [@scintilla-network/hashes](https://www.npmjs.com/package/@scintilla-network/hashes): Hash functions and utilities

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.