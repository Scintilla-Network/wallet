import { PersonaKeyring, Signer, Address, SignableMessage, AddressKeyring, PrivateKey, utils } from "@scintilla-network/keys";

/**
 * @typedef {Object} SignedElement
 * @property {string} _signature - The signature
 * @property {string} _publicKey - The public key
 * @property {string} _message - The message
 */

/**
 * Persona is a class that represents a persona in the Scintilla network.
 * A persona is a set of keys that are used to sign transactions.
 * It is used to represent a user in the Scintilla network.
 */
class Persona {
    /**
     * Constructor for Persona.
     * @param {PersonaKeyring | null} [personaKeyring=null] - The persona keyring to use.
     */
    constructor(personaKeyring = null) {
        /** @private @type {PersonaKeyring | null} */
        this.key = personaKeyring;
        /** @private @type {string} */
        this.moniker = personaKeyring?.getMoniker() ?? '';
    }

    /**
     * Get the moniker of the persona.
     * @returns {string} The moniker of the persona.
     */
    getMoniker() {
        return this.moniker;
    }

    /**
     * Get the address keyring of the persona.
     * @param {number} index - The index of the address keyring to get.
     * @param {boolean} [isChange=false] - Whether to get the change address keyring.
     * @returns {AddressKeyring | null} The address keyring of the persona.
     */
    getAddressKeyring(index, isChange = false) {
        return this.key?.getAddressKeyring(index, { change: isChange? 1 : 0 }) ?? null;
    }

    /**
     * Get the address of the persona.
     * @param {number} index - The index of the address to get.
     * @param {boolean} [isChange=false] - Whether to get the change address.
     * @returns {Address | null} The address of the persona.
     */
    getAddress(index, isChange = false) {
        return this.key?.getAddressKeyring(index, { change: isChange? 1 : 0 }).getAddress('sct') ?? null;
    }

    /**
     * Get the signer of the persona.
     * @returns {Signer | null} The signer of the persona.
     * @throws {Error} When persona keyring is not available
     */
    getSigner() {
        if(!this.key) {
            throw new Error('Persona keyring is required.');
        }
        return new Signer(/** @type {PrivateKey} */ (this.key.getPrivateKey()), this.moniker);
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
    sign(message, options) {
        const signer = this.getSigner();
        if(!signer) {
            throw new Error('Signer is required.');
        }
        const signableMessage = this.parseMessage(message);
        const signed = signableMessage.sign(signer, options); 
        return signed;
    }

    // /**
    //  * Sign a message.
    //  * @param {string | Buffer | SignableMessage} message - The message to sign.
    //  * @param {Object} [options] - The options to use.
    //  * @param {string} [options.algorithm] - The algorithm to use.
    //  * @param {AddressKeyring | null} [keyring=null] - The keyring to use.
    //  * @returns {[string, string] | string} The signed message.
    //  * @throws {Error} When signer is not available
    //  */
    // signMessage(message, options, keyring = null) {
    //     if(!keyring) {
    //         keyring = /** @type {AddressKeyring} */ (this.getAddressKeyring(0, false));
    //     }
    //     const signer = this.getSigner();
    //     if(!signer) {
    //         throw new Error('Signer is required.');
    //     }
    //     const signableMessage = this.parseMessage(message);
    //     const signed = signableMessage.sign(signer, options); 
    //     return signed;
    // }

    // /**
    //  * Verify a message.
    //  * @param {string | Buffer | SignableMessage} message - The message to verify.
    //  * @param {string} signature - The signature to verify.
    //  * @param {string} publicKey - The public key to verify.
    //  * @param {Object} [options] - The options to use.
    //  * @returns {boolean} Whether the message is verified.
    //  */
    // verifyMessage(message, signature, publicKey, options) {
    //     const signableMessage = this.parseMessage(message);
    //     return signableMessage.verify(signature, publicKey, options);
    // }

    /**
     * Verify a message.
     * @param {string | Uint8Array | SignableMessage} message - The message to verify.
     * @param {string} signature - The signature to verify.
     * @param {string} publicKey - The public key to verify.
     * @param {Object} [options] - The options to use.
     * @returns {boolean} Whether the message is verified.
     * @throws {Error} When signer is not initialized
     */
    verify(signature, message, publicKey, options) {
        if(typeof signature === 'string') {
            signature = utils.hex.toUint8Array(signature);
        }
        if(typeof publicKey === 'string') {
            publicKey = utils.hex.toUint8Array(publicKey);
        }
        let signableMessage = this.parseMessage(message);
        return signableMessage.verify(signature, publicKey, options);
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

export default Persona;
