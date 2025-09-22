import { Buffer } from "buffer";
import { PersonaKeyring, Signer, Address, SignableMessage, AddressKeyring } from "@scintilla-network/keys";

export interface SignedElement {
    _signature: string;
    _publicKey: string;
    _message: string;
    [key: string]: any;
}

/**
 * Persona is a class that represents a persona in the Scintilla network.
 * A persona is a set of keys that are used to sign transactions.
 * It is used to represent a user in the Scintilla network.
 */
declare class Persona {
    private key: PersonaKeyring | null;
    private moniker: string;

    /**
     * Constructor for Persona.
     * @param personaKeyring - The persona keyring to use.
     */
    constructor(personaKeyring?: PersonaKeyring | null);

    /**
     * Get the moniker of the persona.
     * @returns The moniker of the persona.
     */
    getMoniker(): string;

    /**
     * Get the address keyring of the persona.
     * @param index - The index of the address keyring to get.
     * @param isChange - Whether to get the change address keyring.
     * @returns The address keyring of the persona.
     */
    getAddressKeyring(index: number, isChange?: boolean): AddressKeyring | null;

    /**
     * Get the address of the persona.
     * @param index - The index of the address to get.
     * @param isChange - Whether to get the change address.
     * @returns The address of the persona.
     */
    getAddress(index: number, isChange?: boolean): Address | null;

    /**
     * Get the signer of the persona.
     * @returns The signer of the persona.
     * @throws {Error} When persona keyring is not available
     */
    getSigner(): Signer;

    /**
     * Parse a message to a signable message.
     * @param message - The message to parse.
     * @returns The signable message.
     */
    parseMessage(message: string | Uint8Array | SignableMessage): SignableMessage;

    /**
     * Sign a message.
     * @param message - The message to sign.
     * @param options - The options to use.
     * @param options.algorithm - The algorithm to use.
     * @returns The signed message.
     * @throws {Error} When signer is not initialized
     */
    sign(message: string | Uint8Array | SignableMessage, options?: { algorithm?: string }): [string, string] | string;

    /**
     * Verify a message.
     * @param signature - The signature to verify.
     * @param message - The message to verify. 
     * @param publicKey - The public key to verify.
     * @param options - The options to use.
     * @returns Whether the message is verified.
     * @throws {Error} When signer is not initialized
     */
    verify(signature: string | Uint8Array, message: string | Uint8Array | SignableMessage, publicKey: string | Uint8Array, options?: object): boolean;

    /**
     * Encrypt a message.
     * @param message - The message to encrypt.
     * @param options - The options to use.
     * @returns The encrypted message.
     * @throws {Error} When signer is not initialized
     */
    encrypt(message: string | Uint8Array | SignableMessage, options?: object): string;

    /**
     * Decrypt a message.
     * @param message - The message to decrypt.
     * @param options - The options to use.
     * @returns The decrypted message.
     * @throws {Error} When signer is not initialized
     */
    decrypt(message: string, options?: { output: string }): string;
}

export default Persona;
