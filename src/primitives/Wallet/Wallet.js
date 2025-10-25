import { SeedKeyring, ChainKeyring } from '@scintilla-network/keys';
import { Mnemonic } from '@scintilla-network/mnemonic';
import { hex } from '@scintilla-network/keys/utils';

import Account from "../Account/Account.js";

/**
 * @typedef {Object} WalletOptions
 * @property {number} [coinType] - The coin type to use (default: 8888)
 */

/**
 * @typedef {Object} MnemonicInput
 * @property {string} phrase - The mnemonic phrase
 */

/**
 * @typedef {string | MnemonicInput} WalletInput
 */

/**
 * Wallet class for managing accounts and cryptographic operations.
 */
class Wallet {
    /**
     * Create a new wallet.
     * @param {WalletInput} [input] - The input to use.
     * @param {WalletOptions} [options={}] - The wallet options.
     * @param {number} [options.coinType=8888] - The coin type to use.
     * @returns {Wallet} The new wallet.
     */
    static create(input, { coinType = 8888 } = {}) {
        if (!input) {
            input = Wallet.generateMnemonic()
        }
        return Wallet.fromArbitraryInput(input, { coinType });
    }

    /**
     * Generate a new random mnemonic.
     * @returns {string} The new mnemonic.
     */
    static generateMnemonic() {
        const mnemonic = Mnemonic.generateMnemonic();
        return mnemonic.toString();
    }

    /**
     * Generate a new random seed.
     * @returns {Uint8Array} The new seed.
     */
    static generateSeed(password = '') {
        const mnemonic = Mnemonic.generateMnemonic();
        const seed = new Mnemonic(mnemonic).toSeed(password);
        return seed;
    }

    /**
     * Create a wallet from a mnemonic.
     * @param {string} mnemonicInput - The mnemonic to use.
     * @param {number} [coinType=8888] - The coin type to use.
     * @returns {Wallet} The new wallet.
     */
    static fromMnemonic(mnemonicInput, { coinType = 8888 } = {}) {
        const mnemonic = new Mnemonic(mnemonicInput);
        return Wallet.fromSeed(mnemonic.toSeed(), { coinType });
    }

    /**
     * Create a wallet from a seed.
     * @param {Uint8Array | string} seedInput - The seed to use.
     * @param {number} [coinType=8888] - The coin type to use.
     * @returns {Wallet} The new wallet.
     */
    static fromSeed(seedInput, { coinType = 8888 } = {}) {
        if(typeof seedInput === 'string') {
            seedInput = hex.toUint8Array(seedInput);
        }
        const seedKeyring = SeedKeyring.fromSeed(seedInput);
        const chainKeyring = seedKeyring.getChainKeyring({ coinType });
        return new Wallet({chainKeyring}, { coinType });
    }

    /**
     * Create a wallet from an arbitrary input.
     * @param {string | Uint8Array} input - The input to use.
     * @param {number} [coinType=8888] - The coin type to use.
     * @returns {Wallet} The new wallet.
     */
    static fromArbitraryInput(input, { coinType = 8888 } = {}) {
        const typeOfInput = typeof input;

        switch(typeOfInput) {
            case 'string':
                const isMnemonic = input.split(' ').length > 1;
                if(isMnemonic) {
                    return Wallet.fromMnemonic(input, { coinType });
                }
                return Wallet.fromSeed(input, { coinType });
            case 'Uint8Array':
                return Wallet.fromSeed(input, { coinType });
            default:
                throw new Error(`Use Wallet.create() to create a new wallet with a newly generated mnemonic.`);
        }
    }

    /**
     * Constructor for Wallet.
     * @param {WalletInput} input - The input to use.
     * @param {WalletOptions} [options={}] - The wallet options.
     * @param {number} [options.coinType=8888] - The coin type to use.
     * @throws {Error} When invalid input is provided
     */
    constructor(input, { coinType = 8888 } = {}) {
        if(!input?.chainKeyring) {
            return Wallet.fromArbitraryInput(input, { coinType });
        }

        /** @private @type {ChainKeyring | null} */
        this.chainKeyring = input.chainKeyring;
    }

    /**
     * Get an account from the wallet.
     * @param {number} [accountIndex=0] - The index of the account to get.
     * @returns {Account} The account.
     * @throws {Error} When account keyring is not available
     */
    getAccount(accountIndex = 0) {
        let accountKeyring = this.chainKeyring?.getAccountKeyring(accountIndex);
        if(!accountKeyring) {
            throw new Error('Account keyring is required.');
        }

        const account = new Account(accountKeyring);
        return account;
    }
}

export default Wallet;

