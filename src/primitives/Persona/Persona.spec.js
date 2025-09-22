import { describe, it, expect } from '@scintilla-network/litest';
// import { describe, it, expect } from 'vitest';
import Wallet from '../Wallet/Wallet.js';
import Persona from './Persona.js';


const defaultMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const account = Wallet.create(defaultMnemonic).getAccount(0);
const persona = account.getPersona('persona.owner');

describe('Persona', () => {
    describe('Persona Functionality', () => {
        it('should get the moniker', () => {
            expect(persona.getMoniker()).toBe('persona.owner');
        });
        it('should get the address', () => {
            const address = persona.getAddress(0);
            expect(address).toBeDefined();
            expect(address.toString()).toBeDefined();
            expect(address.toString().length).toBeGreaterThan(30);
            expect(address.toString().startsWith('sct1')).toBe(true); // Default prefix
        });
        it('should get the signer', () => {
            const signer = persona.getSigner();
            expect(signer).toBeDefined();
            expect(signer.getMoniker()).toBe('persona.owner');
        });
        it('should sign and verify messages', () => {
            const message = 'Hello, World!';
            const [signature, pubKey] = persona.sign(message);
            const isValid = persona.verify(signature, message, pubKey);
            expect(isValid).toBe(true);
        });
        it('should encrypt and decrypt messages', () => {
            const message = 'Hello, World!';
            const encrypted = persona.encrypt(message);
            // expect uint8array
            expect(encrypted).toBeInstanceOf(Uint8Array);

            const decrypted = persona.decrypt(encrypted);
            expect(decrypted).toBe(message);
        });
    });
});