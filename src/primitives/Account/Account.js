import { Signer, utils, ExtendedPrivateKey, AccountKeyring, SignableMessage, Address, PrivateKey } from "@scintilla-network/keys";
import Persona from "../Persona/Persona.js";

/**
 * @typedef {'persona.owner' | 'persona.spender' | 'persona.proposer' | 'persona.voter' | 'persona.stake' | 'persona.operator'} PersonaKind
 */

/**
 * @typedef {Object} PersonaParams
 * @property {PersonaKind} kind - The kind of persona
 * @property {string} moniker - The moniker of the persona
 */

/**
 * @typedef {Object} SignedElement
 * @property {string} _signature - The signature
 * @property {string} _publicKey - The public key
 * @property {string} _message - The message
 */

/**
 * Account class for managing cryptographic operations and persona interactions.
 */
class Account {
    /**
     * Constructor for Account.
     * @param {AccountKeyring | null} [accountKeyring=null] - The account keyring to use.
     * @throws {Error} When AccountKeyring is not provided
     */
    constructor(accountKeyring = null) {
        /** @private @type {AccountKeyring | null} */
        this.key = accountKeyring;
        /** @private @type {Signer | null} */
        this.signer = null;
        
        if (!accountKeyring) {
            throw new Error('AccountKeyring is required');
        }
        this.signer = new Signer(accountKeyring.getPrivateKey());
    }

    /**
     * Get a persona from the account.
     * @param {string} moniker - The moniker of the persona to get.
     * @returns {Persona | null} The persona.
     */
    getPersona(moniker) {
        return new Persona(this.key?.getPersonaKeyring(moniker));
    }

    /**
     * Parse a message to a signable message.
     * @param {string | Uint8Array | SignableMessage} message - The message to parse.
     * @returns {SignableMessage} The signable message.
     */
    parseMessage(message) {
        let signableMessage;
        if(typeof message === 'string') {
            signableMessage = SignableMessage.fromString(message);
        } else if (message instanceof Uint8Array) {
            signableMessage = new SignableMessage(message);
        } else if (message?.input) {
            // This is assumption that the message is a signable messages
            signableMessage = message;
        } else {
            throw new Error('Invalid message type');
        }
        return signableMessage;
    }
   
    /**
     * Sign a message.
     * @param {string | Uint8Array | SignableMessage} message - The message to sign.
     * @param {Object} [options] - The options to use.
     * @param {string} [options.algorithm] - The algorithm to use.
     * @returns {[string, string] | string} The signed message.
     * @throws {Error} When signer is not initialized
     */
    sign(message, options = { algorithm: Signer.ALGORITHMS.SECP256K1 }) {
        if (!this.signer) {
            throw new Error('Signer not initialized');
        }
        let signableMessage = this.parseMessage(message);
        
        return this.signer.sign(signableMessage, options);
    }

    // /**
    //  * Sign a message.
    //  * @param {string | Uint8Array} message - The message to sign.
    //  * @param {Object} [options] - The options to use.
    //  * @param {string} [options.algorithm] - The algorithm to use.
    //  * @returns {[string, string] | string} The signed message.
    //  * @throws {Error} When signer is not initialized
    //  */
    // signMessage(message, options = { algorithm: Signer.ALGORITHMS.SECP256K1 }) {
    //     if (!this.signer) {
    //         throw new Error('Signer not initialized');
    //     }
    //     let signableMessage;
    //     if(typeof message === 'string') {
    //         signableMessage = SignableMessage.fromString(message);
    //     } else if (message instanceof Uint8Array) {
    //         signableMessage = new SignableMessage(message);
    //     } else if (message?.input) {
    //         // This is assumption that the message is a signable messages
    //         signableMessage = message;
    //     } else {
    //         throw new Error('Invalid message type');
    //     }
    //     return this.signer.sign(signableMessage, options);
    // }

    // /**
    //  * Verify a message.
    //  * @param {string} signature - The signature to verify.
    //  * @param {string | Buffer} message - The message to verify.
    //  * @param {string} publicKey - The public key to verify.
    //  * @returns {boolean} Whether the message is verified.
    //  * @throws {Error} When signer is not initialized
    //  */
    // verifyMessage(signature, message, publicKey) {
    //     if (!this.signer) {
    //         throw new Error('Signer not initialized');
    //     }
    //     let signableMessage;
    //     if(typeof message === 'string') {
    //         signableMessage = SignableMessage.fromString(message);
    //     } else if (message instanceof Uint8Array) {
    //         signableMessage = new SignableMessage(message);
    //     } else if (message?.input) {
    //         // This is assumption that the message is a signable messages
    //         signableMessage = message;
    //     } else {
    //         throw new Error('Invalid message type');
    //     }
    //     return signableMessage.verify(signature, publicKey);
    // }

     /**
     * Verify a message.
     * @param {string | Uint8Array} signature - The signature to verify.
     * @param {string | Uint8Array | SignableMessage} message - The message to verify.
     * @param {Object} [options] - The options to use.
     * @returns {boolean} Whether the message is verified.
     * @throws {Error} When signer is not initialized
     */
    verify(signature, message, options) {
        if (!this.signer) {
            throw new Error('Signer not initialized');
        }
        if(typeof signature === 'string') {
            signature = utils.hex.toUint8Array(signature);
        }
        const publicKey = this.signer.getPublicKey().getKey();
        let signableMessage = this.parseMessage(message);
        return signableMessage.verify(signature, publicKey, options);
    }

    /**
     * Get the address of the account.
     * @param {string} [bech32Prefix='sct'] - The bech32 prefix to use.
     * @returns {Address | null} The address of the account.
     */
    toAddress(bech32Prefix = 'sct') {
        return this.key?.getAddressKeyring(0).getAddress(bech32Prefix) ?? null;
    }

    /**
     * Get the public key of the account.
     * @param {PersonaParams} [params] - The parameters to use.
     * @returns {Uint8Array | string} The public key of the account.
     * @throws {Error} When key is not available or invalid
     */
    toPublicKey(params) {
        const key = this.key;

        if (!key) {
            throw new Error('Key or Public Key is required for getting public key.');
        }

        if (typeof key === 'string') {
            return key;
        }
        if(key === null) {
            throw new Error('Key is required for getting public key.');
        }

        const personaKeyring = key.getPersonaKeyring(params?.moniker ?? '').getPersonaTypedKey(params?.kind ?? 'persona.owner');

        return personaKeyring.getPublicKey().getKey();
    }

    /**
     * Get the private key of the account.
     * @param {PersonaParams} [params] - The parameters to use.
     * @returns {Uint8Array} The private key of the account.
     * @throws {Error} When key is not available
     */
    toPrivateKey(params) {
        const key = this.key;

        if(key === null) {
            throw new Error('Key is required for getting private key.');
        }

        const personaKeyring = /** @type {ExtendedPrivateKey} */ (key.getPersonaKeyring(params?.moniker ?? '').getPersonaTypedKey(params?.kind ?? 'persona.owner'));
        return personaKeyring.getPrivateKey().getKey();
    }

    /**
     * Get the signer of the account.
     * @param {string | null} [moniker=null] - The moniker of the persona to get.
     * @param {PersonaKind} [type='persona.spender'] - The type of the persona to get.
     * @returns {Signer | null} The signer of the account.
     */
    getSigner(moniker = null, type = 'persona.spender') {
        if (moniker) {
            // const derivedKey = this.toPrivateKey({ kind: type, moniker });
            return new Signer(/** @type {PrivateKey} */ (this.key?.getPrivateKey()));
        }
        return this.signer;
    }

    /**
     * Encrypt a message.
     * @param {string | Uint8Array | SignableMessage} message - The message to encrypt.
     * @param {Object} [options] - The options to use.
     * @returns {string} The encrypted message.
     * @throws {Error} When signer is not initialized
     */
    encrypt(message, options) {
        const signer = this.getSigner();
        if(!signer) {
            throw new Error('Signer is required.');
        }
        const signableMessage = this.parseMessage(message);
        const encrypted = signableMessage.encrypt(signer, options);
        return encrypted;
    }

    /**
     * Decrypt a message.
     * @param {string} message - The message to decrypt.
     * @param {Object} [options] - The options to use.
     * @returns {string} The decrypted message.
     * @throws {Error} When signer is not initialized
     */
    decrypt(message, options = { output: 'utf8' }) {
        const signer = this.getSigner();
        if(!signer) {
            throw new Error('Signer is required.');
        }
        const decrypted = new SignableMessage(new Uint8Array()).decrypt(message, signer, options);
        return decrypted;
    }
}

export default Account;

