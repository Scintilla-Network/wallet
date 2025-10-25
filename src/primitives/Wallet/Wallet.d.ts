import { ChainKeyring } from '@scintilla-network/keys';
import Account from "../Account/Account.js";

export interface WalletOptions {
    coinType?: number;
}

export interface MnemonicInput {
    phrase: string;
}

export type WalletInput = string | MnemonicInput | { chainKeyring: ChainKeyring };

/**
 * Wallet class for managing accounts and cryptographic operations.
 */
declare class Wallet {
    private chainKeyring: ChainKeyring | null;

    /**
     * Create a new wallet.
     * @param input - The input to use.
     * @param options - The wallet options.
     * @returns The new wallet.
     */
    static create(input?: WalletInput, options?: WalletOptions): Wallet;

    /**
     * Generate a new random mnemonic.
     * @returns The new mnemonic.
     */
    static generateMnemonic(): string;

    /**
     * Generate a new random seed.
     * @param password - Optional password for seed generation
     * @returns The new seed.
     */
    static generateSeed(password?: string): Uint8Array;

    /**
     * Create a wallet from a mnemonic.
     * @param mnemonicInput - The mnemonic to use.
     * @param options - The wallet options.
     * @returns The new wallet.
     */
    static fromMnemonic(mnemonicInput: string, options?: WalletOptions): Wallet;

    /**
     * Create a wallet from a seed.
     * @param seedInput - The seed to use.
     * @param options - The wallet options.
     * @returns The new wallet.
     */
    static fromSeed(seedInput: Uint8Array | string, options?: WalletOptions): Wallet;

    /**
     * Create a wallet from an arbitrary input.
     * @param input - The input to use.
     * @param options - The wallet options.
     * @returns The new wallet.
     */
    static fromArbitraryInput(input: string | Uint8Array, options?: WalletOptions): Wallet;

    /**
     * Constructor for Wallet.
     * @param input - The input to use.
     * @param options - The wallet options.
     * @throws When invalid input is provided
     */
    constructor(input: WalletInput, options?: WalletOptions);

    /**
     * Get an account from the wallet.
     * @param accountIndex - The index of the account to get.
     * @returns The account.
     * @throws When account keyring is not available
     */
    getAccount(accountIndex?: number): Account;
}

export default Wallet;
