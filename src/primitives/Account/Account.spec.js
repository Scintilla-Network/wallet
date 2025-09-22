import { describe, it, expect } from '@scintilla-network/litest';
// import { describe, it, expect } from 'vitest';
import Wallet from '../Wallet/Wallet.js';

describe('Account', () => {
    const defaultMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const account = Wallet.create(defaultMnemonic).getAccount(0);

    describe('Account Functionality', () => {
        it('should sign and verify messages', () => {
            const [signature, pubKey] = account.sign('Hello, World!');
            expect(signature).toBeDefined();
            expect(pubKey).toBeDefined();

            const isValid = account.verify(signature, 'Hello, World!');
            expect(isValid).toBe(true);
        });

        it('should generate correct bech32 addresses', () => {
            const address = account.toAddress();
            console.log(address.toString());
            expect(address.toString()).toBeDefined();
            expect(address.toString().length).toBeGreaterThan(30);
            expect(address.toString().startsWith('sct1')).toBe(true); // Default prefix
        });
        it("should encrypt and decrypt messages", () => {
            const message = 'Hello, World!';
            const encrypted = account.encrypt(message);
            expect(encrypted).toBeDefined();
            const decrypted = account.decrypt(encrypted);
            expect(decrypted).toBe(message);
        });
        it("should sign and verify messages", () => {
            const message = 'Hello, World!';
            const [signature, pubKey] = account.sign(message);
            expect(signature).toBeDefined();
            expect(pubKey).toBeDefined();
        });
        it("should verify messages", () => {
            const message = 'Hello, World!';
            const [signature, pubKey] = account.sign(message);
            expect(signature).toBeDefined();
            expect(pubKey).toBeDefined();
        });
    });

    describe('Persona Keys', () => {
        it('should derive different persona keys for the same account', () => {
            const moniker = 'test-validator';

            const spenderKey = account.toPublicKey({ kind: 'spender', moniker });
            const proposerKey = account.toPublicKey({ kind: 'proposer', moniker });
            const voterKey = account.toPublicKey({ kind: 'voter', moniker });
            
            expect(spenderKey).not.toBe(proposerKey);
            expect(proposerKey).not.toBe(voterKey);
            expect(voterKey).not.toBe(spenderKey);
        });

        it('should consistently derive the same persona keys', () => {
            const moniker = 'test-validator';

            const key1 = account.toPublicKey({ kind: 'spender', moniker });
            const key2 = account.toPublicKey({ kind: 'spender', moniker });
            expect(key1.toString()).toBe(key2.toString());
            expect(Buffer.from(key1).toString('hex')).toBe('027edd605531b7cfb16ca6d5db5d337a2b1138a7acab08b306cd45b31cc704e3fe');
        });
    });
});