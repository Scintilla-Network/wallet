import { ChainKeyring } from '@scintilla-network/keys';
import Account from "../Account/Account.js";

export interface WalletOptions {
    coinType?: number;
}

export interface MnemonicInput {
    phrase: string;
    // toMasterDerivableKey: () => ExtendedPrivateKey;
}

export type WalletInput = string | MnemonicInput;

/**
 * Wallet class for managing accounts and cryptographic operations.
 */
declare class Wallet {
    private client: any | null;
    private coinType: number;
    private chainKeyring: ChainKeyring | null;

    /**
     * Create a new wallet.
     * @param input - The input to use.
     * @param options - The wallet options.
     * @returns The new wallet.
     */
    static create(input?: WalletInput, options?: WalletOptions): Wallet;

    /**
     * Constructor for Wallet.
     * @param input - The input to use.
     * @param options - The wallet options.
     */
    constructor(input: WalletInput, options?: WalletOptions);

    /**
     * Attach a client to the wallet.
     * @param client - The client to attach.
     */
    attachClient(client: any): void;

    /**
     * Get an account from the wallet.
     * @param accountIndex - The index of the account to get.
     * @returns The account.
     */
    getAccount(accountIndex?: number): Account;
}

export default Wallet;


