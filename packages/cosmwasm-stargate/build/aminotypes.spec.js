"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const encoding_1 = require("@cosmjs/encoding");
const stargate_1 = require("@cosmjs/stargate");
const long_1 = __importDefault(require("long"));
const aminotypes_1 = require("./aminotypes");
describe("AminoTypes", () => {
    describe("toAmino", () => {
        it("works for MsgStoreCode", () => {
            const msg = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                wasmByteCode: encoding_1.fromBase64("WUVMTE9XIFNVQk1BUklORQ=="),
                instantiatePermission: undefined,
            };
            const aminoMsg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).toAmino({
                typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
                value: msg,
            });
            const expected = {
                type: "wasm/MsgStoreCode",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    wasm_byte_code: "WUVMTE9XIFNVQk1BUklORQ==",
                },
            };
            expect(aminoMsg).toEqual(expected);
        });
        it("works for MsgInstantiateContract", () => {
            const msg = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                codeId: long_1.default.fromString("12345"),
                label: "sticky",
                msg: encoding_1.toUtf8(JSON.stringify({
                    foo: "bar",
                })),
                funds: stargate_1.coins(1234, "ucosm"),
                admin: "cosmos10dyr9899g6t0pelew4nvf4j5c3jcgv0r73qga5",
            };
            const aminoMsg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).toAmino({
                typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
                value: msg,
            });
            const expected = {
                type: "wasm/MsgInstantiateContract",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    code_id: "12345",
                    label: "sticky",
                    msg: {
                        foo: "bar",
                    },
                    funds: stargate_1.coins(1234, "ucosm"),
                    admin: "cosmos10dyr9899g6t0pelew4nvf4j5c3jcgv0r73qga5",
                },
            };
            expect(aminoMsg).toEqual(expected);
        });
        it("works for MsgUpdateAdmin", () => {
            const msg = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                newAdmin: "cosmos10dyr9899g6t0pelew4nvf4j5c3jcgv0r73qga5",
                contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
            };
            const aminoMsg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).toAmino({
                typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
                value: msg,
            });
            const expected = {
                type: "wasm/MsgUpdateAdmin",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    new_admin: "cosmos10dyr9899g6t0pelew4nvf4j5c3jcgv0r73qga5",
                    contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                },
            };
            expect(aminoMsg).toEqual(expected);
        });
        it("works for MsgClearAdmin", () => {
            const msg = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
            };
            const aminoMsg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).toAmino({
                typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
                value: msg,
            });
            const expected = {
                type: "wasm/MsgClearAdmin",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                },
            };
            expect(aminoMsg).toEqual(expected);
        });
        it("works for MsgExecuteContract", () => {
            const msg = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                msg: encoding_1.toUtf8(JSON.stringify({
                    foo: "bar",
                })),
                funds: stargate_1.coins(1234, "ucosm"),
            };
            const aminoMsg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).toAmino({
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                value: msg,
            });
            const expected = {
                type: "wasm/MsgExecuteContract",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                    msg: {
                        foo: "bar",
                    },
                    funds: stargate_1.coins(1234, "ucosm"),
                },
            };
            expect(aminoMsg).toEqual(expected);
        });
        it("works for MsgMigrateContract", () => {
            const msg = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                codeId: long_1.default.fromString("98765"),
                msg: encoding_1.toUtf8(JSON.stringify({
                    foo: "bar",
                })),
            };
            const aminoMsg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).toAmino({
                typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
                value: msg,
            });
            const expected = {
                type: "wasm/MsgMigrateContract",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                    code_id: "98765",
                    msg: {
                        foo: "bar",
                    },
                },
            };
            expect(aminoMsg).toEqual(expected);
        });
    });
    describe("fromAmino", () => {
        it("works for MsgStoreCode", () => {
            const aminoMsg = {
                type: "wasm/MsgStoreCode",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    wasm_byte_code: "WUVMTE9XIFNVQk1BUklORQ==",
                },
            };
            const msg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).fromAmino(aminoMsg);
            const expectedValue = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                wasmByteCode: encoding_1.fromBase64("WUVMTE9XIFNVQk1BUklORQ=="),
                instantiatePermission: undefined,
            };
            expect(msg).toEqual({
                typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
                value: expectedValue,
            });
        });
        it("works for MsgInstantiateContract", () => {
            const aminoMsg = {
                type: "wasm/MsgInstantiateContract",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    code_id: "12345",
                    label: "sticky",
                    msg: {
                        foo: "bar",
                    },
                    funds: stargate_1.coins(1234, "ucosm"),
                    admin: "cosmos10dyr9899g6t0pelew4nvf4j5c3jcgv0r73qga5",
                },
            };
            const msg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).fromAmino(aminoMsg);
            const expectedValue = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                codeId: long_1.default.fromString("12345"),
                label: "sticky",
                msg: encoding_1.toUtf8(JSON.stringify({
                    foo: "bar",
                })),
                funds: stargate_1.coins(1234, "ucosm"),
                admin: "cosmos10dyr9899g6t0pelew4nvf4j5c3jcgv0r73qga5",
            };
            expect(msg).toEqual({
                typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
                value: expectedValue,
            });
        });
        it("works for MsgUpdateAdmin", () => {
            const aminoMsg = {
                type: "wasm/MsgUpdateAdmin",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    new_admin: "cosmos10dyr9899g6t0pelew4nvf4j5c3jcgv0r73qga5",
                    contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                },
            };
            const msg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).fromAmino(aminoMsg);
            const expectedValue = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                newAdmin: "cosmos10dyr9899g6t0pelew4nvf4j5c3jcgv0r73qga5",
                contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
            };
            expect(msg).toEqual({
                typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
                value: expectedValue,
            });
        });
        it("works for MsgClearAdmin", () => {
            const aminoMsg = {
                type: "wasm/MsgClearAdmin",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                },
            };
            const msg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).fromAmino(aminoMsg);
            const expectedValue = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
            };
            expect(msg).toEqual({
                typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
                value: expectedValue,
            });
        });
        it("works for MsgExecuteContract", () => {
            const aminoMsg = {
                type: "wasm/MsgExecuteContract",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                    msg: {
                        foo: "bar",
                    },
                    funds: stargate_1.coins(1234, "ucosm"),
                },
            };
            const msg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).fromAmino(aminoMsg);
            const expectedValue = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                msg: encoding_1.toUtf8(JSON.stringify({
                    foo: "bar",
                })),
                funds: stargate_1.coins(1234, "ucosm"),
            };
            expect(msg).toEqual({
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                value: expectedValue,
            });
        });
        it("works for MsgMigrateContract", () => {
            const aminoMsg = {
                type: "wasm/MsgMigrateContract",
                value: {
                    sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                    code_id: "98765",
                    msg: {
                        foo: "bar",
                    },
                },
            };
            const msg = new stargate_1.AminoTypes({ additions: aminotypes_1.cosmWasmTypes }).fromAmino(aminoMsg);
            const expectedValue = {
                sender: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                contract: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
                codeId: long_1.default.fromString("98765"),
                msg: encoding_1.toUtf8(JSON.stringify({
                    foo: "bar",
                })),
            };
            expect(msg).toEqual({
                typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
                value: expectedValue,
            });
        });
    });
});
//# sourceMappingURL=aminotypes.spec.js.map