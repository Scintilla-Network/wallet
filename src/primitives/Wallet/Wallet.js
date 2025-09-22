import { Mnemonic } from '@scintilla-network/mnemonic';
import { SeedKeyring, ChainKeyring } from '@scintilla-network/keys';
import Account from "../Account/Account.js";

/**
 * @typedef {Object} WalletOptions
 * @property {number} [coinType] - The coin type to use
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
            const mnemonic = Mnemonic.generateMnemonic();
            input = mnemonic.toString();
        }
        return new Wallet(input, { coinType });
    }

    /**
     * Constructor for Wallet.
     * @param {WalletInput} input - The input to use.
     * @param {WalletOptions} [options={}] - The wallet options.
     * @param {number} [options.coinType=8888] - The coin type to use.
     * @throws {Error} When invalid input is provided
     */
    constructor(input, { coinType = 8888 } = {}) {
        /** @private @type {number} */
        this.coinType = coinType;

        /** @private @type {ChainKeyring | null} */
        this.chainKeyring = null;

        if (typeof input === 'string') {
            const isMnemonic = input.split(' ').length > 1;

            if (isMnemonic) {
                const mnemonic = new Mnemonic(input);
                this.chainKeyring = SeedKeyring.fromMnemonic(mnemonic.phrase).getChainKeyring({ coinType });
            }
        }  else if ('phrase' in input && typeof input.phrase === 'string') {
            const mnemonic = input;
            this.chainKeyring = SeedKeyring.fromMnemonic(mnemonic.phrase).getChainKeyring({ coinType });
        }
        else {
            throw new Error('Invalid input for Wallet instantiation. Provide a mnemonic or private key or call Wallet.create() to generate a new wallet.');
        }
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

