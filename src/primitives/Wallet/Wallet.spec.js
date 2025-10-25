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
            const address1 = wallet.getAccount(0).toAddress().toString();

            const wallet2 = Wallet.create();
            const address2 = wallet2.getAccount(0).toAddress().toString();

            expect(address1).not.toBe(address2);
            expect(address1.startsWith('sct1')).toBe(true);
        });

        it('should create a wallet from existing mnemonic', () => {
            const wallet = Wallet.create(defaultMnemonic);
            expect(wallet).toBeInstanceOf(Wallet);
            expect(wallet.chainKeyring).toBeDefined();
            expect(wallet.chainKeyring.options).toEqual({
                purpose: 44,
                coinType: 8888,
            });
            const address = wallet.getAccount(0).toAddress().toString();
            expect(address).to.equal('sct170psr9zhfp9nd9qeyp0mdggxj9m7y6el2ezeq5');
        });
        it('should create a wallet from seed', () => {
            const wallet = Wallet.fromSeed('5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4');
            expect(wallet).toBeInstanceOf(Wallet);
            expect(wallet.chainKeyring).toBeDefined();
            expect(wallet.chainKeyring.options).toEqual({
                purpose: 44,
                coinType: 8888,
            });
            const address = wallet.getAccount(0).toAddress().toString();
            expect(address).to.equal('sct170psr9zhfp9nd9qeyp0mdggxj9m7y6el2ezeq5');
        });
        it('should create a wallet with custom coinType', () => {
            const wallet = Wallet.create(defaultMnemonic, { coinType: 118 });

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
    describe('Create new and restore', () => {
        it('should create a new wallet and restore it from mnemonic', () => {
            const mnemonic = Wallet.generateMnemonic();
            const wallet = Wallet.create(mnemonic);
            const accountAddr = wallet.getAccount(0).toAddress().toString();

            const restoredWallet = Wallet.fromMnemonic(mnemonic);
            const restoredAccountAddr = restoredWallet.getAccount(0).toAddress().toString();
            expect(restoredAccountAddr).toBe(accountAddr);
        });
    });
});