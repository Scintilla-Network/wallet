export { default as Account } from './primitives/Account/Account.js';
export { default as Wallet } from './primitives/Wallet/Wallet.js';

// Re-export types for convenience
export type { PersonaKind, PersonaParams, SignedElement } from './primitives/Account/Account.js';
export type { WalletOptions, MnemonicInput, WalletInput } from './primitives/Wallet/Wallet.js';
export type { SignedElement as PersonaSignedElement } from './primitives/Persona/Persona.js';

