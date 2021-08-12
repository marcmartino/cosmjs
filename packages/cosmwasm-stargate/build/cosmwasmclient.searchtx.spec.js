"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const encoding_1 = require("@cosmjs/encoding");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const utils_1 = require("@cosmjs/utils");
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const cosmwasmclient_1 = require("./cosmwasmclient");
const testutils_spec_1 = require("./testutils.spec");
async function sendTokens(client, registry, wallet, recipient, amount, memo) {
    const [{ address: walletAddress, pubkey: pubkeyBytes }] = await wallet.getAccounts();
    const pubkey = proto_signing_1.encodePubkey({
        type: "tendermint/PubKeySecp256k1",
        value: encoding_1.toBase64(pubkeyBytes),
    });
    const txBodyFields = {
        typeUrl: "/cosmos.tx.v1beta1.TxBody",
        value: {
            messages: [
                {
                    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                    value: {
                        fromAddress: walletAddress,
                        toAddress: recipient,
                        amount: amount,
                    },
                },
            ],
            memo: memo,
        },
    };
    const txBodyBytes = registry.encode(txBodyFields);
    const { accountNumber, sequence } = (await client.getSequence(walletAddress));
    const feeAmount = [
        {
            amount: "2000",
            denom: "ucosm",
        },
    ];
    const gasLimit = 200000;
    const authInfoBytes = proto_signing_1.makeAuthInfoBytes([{ pubkey, sequence }], feeAmount, gasLimit);
    const chainId = await client.getChainId();
    const signDoc = proto_signing_1.makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    const { signature } = await wallet.signDirect(walletAddress, signDoc);
    const txRaw = tx_1.TxRaw.fromPartial({
        bodyBytes: txBodyBytes,
        authInfoBytes: authInfoBytes,
        signatures: [encoding_1.fromBase64(signature.signature)],
    });
    const txRawBytes = Uint8Array.from(tx_1.TxRaw.encode(txRaw).finish());
    const broadcastResponse = await client.broadcastTx(txRawBytes);
    return {
        broadcastResponse: broadcastResponse,
        tx: txRawBytes,
    };
}
describe("CosmWasmClient.getTx and .searchTx", () => {
    const registry = new proto_signing_1.Registry();
    let sendUnsuccessful;
    let sendSuccessful;
    beforeAll(async () => {
        if (testutils_spec_1.wasmdEnabled()) {
            const wallet = await proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(testutils_spec_1.alice.mnemonic, { prefix: testutils_spec_1.wasmd.prefix });
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const unsuccessfulRecipient = testutils_spec_1.makeRandomAddress();
            const successfulRecipient = testutils_spec_1.makeRandomAddress();
            const unsuccessfulResult = await sendTokens(client, registry, wallet, unsuccessfulRecipient, stargate_1.coins(123456700000000, "ucosm"), "Sending more than I can afford");
            if (stargate_1.isBroadcastTxFailure(unsuccessfulResult.broadcastResponse)) {
                sendUnsuccessful = {
                    sender: testutils_spec_1.alice.address0,
                    recipient: unsuccessfulRecipient,
                    hash: unsuccessfulResult.broadcastResponse.transactionHash,
                    height: unsuccessfulResult.broadcastResponse.height,
                    tx: unsuccessfulResult.tx,
                };
            }
            const successfulResult = await sendTokens(client, registry, wallet, successfulRecipient, stargate_1.coins(1234567, "ucosm"), "Something I can afford");
            if (stargate_1.isBroadcastTxSuccess(successfulResult.broadcastResponse)) {
                sendSuccessful = {
                    sender: testutils_spec_1.alice.address0,
                    recipient: successfulRecipient,
                    hash: successfulResult.broadcastResponse.transactionHash,
                    height: successfulResult.broadcastResponse.height,
                    tx: successfulResult.tx,
                };
            }
            await utils_1.sleep(75); // wait until transactions are indexed
        }
    });
    describe("getTx", () => {
        it("can get successful tx by ID", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const result = await client.getTx(sendSuccessful.hash);
            expect(result).toEqual(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                code: 0,
                tx: sendSuccessful.tx,
            }));
        });
        it("can get unsuccessful tx by ID", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendUnsuccessful, "value must be set in beforeAll()");
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const result = await client.getTx(sendUnsuccessful.hash);
            expect(result).toEqual(jasmine.objectContaining({
                height: sendUnsuccessful.height,
                hash: sendUnsuccessful.hash,
                code: 5,
                tx: sendUnsuccessful.tx,
            }));
        });
        it("can get by ID (non existent)", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const nonExistentId = "0000000000000000000000000000000000000000000000000000000000000000";
            const result = await client.getTx(nonExistentId);
            expect(result).toBeNull();
        });
    });
    describe("with SearchByHeightQuery", () => {
        it("can search successful tx by height", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const result = await client.searchTx({ height: sendSuccessful.height });
            expect(result.length).toBeGreaterThanOrEqual(1);
            expect(result).toContain(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                code: 0,
                tx: sendSuccessful.tx,
            }));
        });
        it("can search unsuccessful tx by height", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendUnsuccessful, "value must be set in beforeAll()");
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const result = await client.searchTx({ height: sendUnsuccessful.height });
            expect(result.length).toBeGreaterThanOrEqual(1);
            expect(result).toContain(jasmine.objectContaining({
                height: sendUnsuccessful.height,
                hash: sendUnsuccessful.hash,
                code: 5,
                tx: sendUnsuccessful.tx,
            }));
        });
    });
    describe("with SearchBySentFromOrToQuery", () => {
        it("can search by sender", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const results = await client.searchTx({ sentFromOrTo: sendSuccessful.sender });
            expect(results.length).toBeGreaterThanOrEqual(1);
            // Check basic structure of all results
            for (const result of results) {
                const tx = proto_signing_1.decodeTxRaw(result.tx);
                const filteredMsgs = tx.body.messages.filter((msg) => {
                    if (!stargate_1.isMsgSendEncodeObject(msg))
                        return false;
                    const decoded = registry.decode(msg);
                    return decoded.fromAddress === (sendSuccessful === null || sendSuccessful === void 0 ? void 0 : sendSuccessful.sender);
                });
                expect(filteredMsgs.length).toBeGreaterThanOrEqual(1);
            }
            // Check details of most recent result
            expect(results[results.length - 1]).toEqual(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                tx: sendSuccessful.tx,
            }));
        });
        it("can search by recipient", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const results = await client.searchTx({ sentFromOrTo: sendSuccessful.recipient });
            expect(results.length).toBeGreaterThanOrEqual(1);
            // Check basic structure of all results
            for (const result of results) {
                const tx = proto_signing_1.decodeTxRaw(result.tx);
                const filteredMsgs = tx.body.messages.filter((msg) => {
                    if (!stargate_1.isMsgSendEncodeObject(msg))
                        return false;
                    const decoded = registry.decode(msg);
                    return decoded.toAddress === (sendSuccessful === null || sendSuccessful === void 0 ? void 0 : sendSuccessful.recipient);
                });
                expect(filteredMsgs.length).toBeGreaterThanOrEqual(1);
            }
            // Check details of most recent result
            expect(results[results.length - 1]).toEqual(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                tx: sendSuccessful.tx,
            }));
        });
        it("can search by recipient and filter by minHeight", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful);
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const query = { sentFromOrTo: sendSuccessful.recipient };
            {
                const result = await client.searchTx(query, { minHeight: 0 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height - 1 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { minHeight: sendSuccessful.height + 1 });
                expect(result.length).toEqual(0);
            }
        });
        it("can search by recipient and filter by maxHeight", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful);
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const query = { sentFromOrTo: sendSuccessful.recipient };
            {
                const result = await client.searchTx(query, { maxHeight: 9999999999999 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { maxHeight: sendSuccessful.height + 1 });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { maxHeight: sendSuccessful.height });
                expect(result.length).toEqual(1);
            }
            {
                const result = await client.searchTx(query, { maxHeight: sendSuccessful.height - 1 });
                expect(result.length).toEqual(0);
            }
        });
    });
    describe("with SearchByTagsQuery", () => {
        it("can search by transfer.recipient", async () => {
            testutils_spec_1.pendingWithoutWasmd();
            utils_1.assert(sendSuccessful, "value must be set in beforeAll()");
            const client = await cosmwasmclient_1.CosmWasmClient.connect(testutils_spec_1.wasmd.endpoint);
            const results = await client.searchTx({
                tags: [{ key: "transfer.recipient", value: sendSuccessful.recipient }],
            });
            expect(results.length).toBeGreaterThanOrEqual(1);
            // Check basic structure of all results
            for (const result of results) {
                const tx = proto_signing_1.decodeTxRaw(result.tx);
                const msg = testutils_spec_1.fromOneElementArray(tx.body.messages);
                expect(msg.typeUrl).toEqual("/cosmos.bank.v1beta1.MsgSend");
                const decoded = registry.decode(msg);
                expect(decoded.toAddress).toEqual(sendSuccessful.recipient);
            }
            // Check details of most recent result
            expect(results[results.length - 1]).toEqual(jasmine.objectContaining({
                height: sendSuccessful.height,
                hash: sendSuccessful.hash,
                tx: sendSuccessful.tx,
            }));
        });
    });
});
//# sourceMappingURL=cosmwasmclient.searchtx.spec.js.map