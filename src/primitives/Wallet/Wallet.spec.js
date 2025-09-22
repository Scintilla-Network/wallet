import { describe, it, expect } from '@scintilla-network/litest';
import Wallet from './Wallet.js';
import Account from '../Account/Account.js';

describe('Wallet', () => {
    const defaultMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

    describe('Creation and Initialization', () => {
        it('should create a new wallet with random mnemonic', () => {
            const wallet = Wallet.create();
            expect(wallet).toBeInstanceOf(Wallet);
            expect(wallet.chainKeyring).toBeDefined();
            expect(wallet.chainKeyring.options).toEqual({
                purpose: 44,
                coinType: 8888,
            });
        });

        it('should create a wallet from existing mnemonic', () => {
            const wallet = Wallet.create(defaultMnemonic);
            expect(wallet).toBeInstanceOf(Wallet);
            expect(wallet.chainKeyring).toBeDefined();
            expect(wallet.chainKeyring.options).toEqual({
                purpose: 44,
                coinType: 8888,
            });
        });
        it('should create a wallet with custom coinType', () => {
            const wallet = Wallet.create(defaultMnemonic, { coinType: 118 });
            expect(wallet.coinType).toBe(118);
            expect(wallet.chainKeyring).toBeDefined();
            expect(wallet.chainKeyring.options).toEqual({
                purpose: 44,
                coinType: 118,
            });
        });
    });

    describe('Account Management', () => {
        it('should generate correct account from mnemonic', () => {
            const wallet = Wallet.create(defaultMnemonic);
            const account = wallet.getAccount(0);
            expect(account).toBeInstanceOf(Account);
            expect(account.signer).toBeDefined();
        });

        it('should generate different accounts for different indices', () => {
            const wallet = Wallet.create(defaultMnemonic);
            const account1 = wallet.getAccount(0);
            const account2 = wallet.getAccount(1);
            expect(account1.toAddress()).not.toBe(account2.toAddress());
        });
    });
});