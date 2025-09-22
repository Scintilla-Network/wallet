import { AccountKeyring, SignableMessage, Address, Signer } from "@scintilla-network/keys";
import Persona from "../Persona/Persona.js";

export type PersonaKind = 
    | 'persona.owner'
    | 'persona.spender'
    | 'persona.proposer'
    | 'persona.voter'
    | 'persona.stake'
    | 'persona.operator';

export interface PersonaParams {
    kind: PersonaKind;
    moniker: string;
}

export interface SignedElement {
    _signature: string;
    _publicKey: string;
    _message: string;
    [key: string]: any;
}

declare class Account {
    private key: AccountKeyring | null;
    private signer: Signer | null;

    /**
     * Constructor for Account.
     * @param accountKeyring - The account keyring to use.
     * @throws {Error} When AccountKeyring is not provided
     */
    constructor(accountKeyring?: AccountKeyring | null);

    /**
     * Get a persona from the account.
     * @param moniker - The moniker of the persona to get.
     * @returns The persona.
     */
    getPersona(moniker: string): Persona | null;

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
     * @param options - The options to use.
     * @returns Whether the message is verified.
     * @throws {Error} When signer is not initialized
     */
    verify(signature: string | Uint8Array, message: string | Uint8Array | SignableMessage, options?: object): boolean;

    /**
     * Get the address of the account.
     * @param bech32Prefix - The bech32 prefix to use.
     * @returns The address of the account.
     */
    toAddress(bech32Prefix?: string): Address | null;

    /**
     * Get the public key of the account.
     * @param params - The parameters to use.
     * @returns The public key of the account.
     * @throws {Error} When key is not available or invalid
     */
    toPublicKey(params?: PersonaParams): Uint8Array | string;

    /**
     * Get the private key of the account.
     * @param params - The parameters to use.
     * @returns The private key of the account.
     * @throws {Error} When key is not available
     */
    toPrivateKey(params?: PersonaParams): Uint8Array;

    /**
     * Get the signer of the account.
     * @param moniker - The moniker of the persona to get.
     * @param type - The type of the persona to get.
     * @returns The signer of the account.
     */
    getSigner(moniker?: string | null, type?: PersonaKind): Signer | null;

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

export default Account;
