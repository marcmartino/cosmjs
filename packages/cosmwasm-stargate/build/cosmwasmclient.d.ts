import { Account, AuthExtension, BankExtension, Block, BroadcastTxResponse, Coin, IndexedTx, QueryClient, SearchTxFilter, SearchTxQuery, SequenceResponse } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { JsonObject, WasmExtension } from "./queries";
export { JsonObject, };
export interface Code {
    readonly id: number;
    /** Bech32 account address */
    readonly creator: string;
    /** Hex-encoded sha256 hash of the code stored here */
    readonly checksum: string;
}
export interface CodeDetails extends Code {
    /** The original Wasm bytes */
    readonly data: Uint8Array;
}
export interface Contract {
    readonly address: string;
    readonly codeId: number;
    /** Bech32 account address */
    readonly creator: string;
    /** Bech32-encoded admin address */
    readonly admin: string | undefined;
    readonly label: string;
    /**
     * The IBC port ID assigned to this contract by wasmd.
     *
     * This is set for all IBC contracts (https://github.com/CosmWasm/wasmd/blob/v0.16.0/x/wasm/keeper/keeper.go#L299-L306).
     */
    readonly ibcPortId: string | undefined;
}
export interface ContractCodeHistoryEntry {
    /** The source of this history entry */
    readonly operation: "Genesis" | "Init" | "Migrate";
    readonly codeId: number;
    readonly msg: Record<string, unknown>;
}
/** Use for testing only */
export interface PrivateCosmWasmClient {
    readonly tmClient: Tendermint34Client | undefined;
    readonly queryClient: (QueryClient & AuthExtension & BankExtension & WasmExtension) | undefined;
}
export declare class CosmWasmClient {
    private readonly tmClient;
    private readonly queryClient;
    private readonly codesCache;
    private chainId;
    static connect(endpoint: string): Promise<CosmWasmClient>;
    protected constructor(tmClient: Tendermint34Client | undefined);
    protected getTmClient(): Tendermint34Client | undefined;
    protected forceGetTmClient(): Tendermint34Client;
    protected getQueryClient(): (QueryClient & AuthExtension & BankExtension & WasmExtension) | undefined;
    protected forceGetQueryClient(): QueryClient & AuthExtension & BankExtension & WasmExtension;
    getChainId(): Promise<string>;
    getHeight(): Promise<number>;
    getAccount(searchAddress: string): Promise<Account | null>;
    getSequence(address: string): Promise<SequenceResponse>;
    getBlock(height?: number): Promise<Block>;
    getBalance(address: string, searchDenom: string): Promise<Coin>;
    getTx(id: string): Promise<IndexedTx | null>;
    searchTx(query: SearchTxQuery, filter?: SearchTxFilter): Promise<readonly IndexedTx[]>;
    disconnect(): void;
    /**
     * Broadcasts a signed transaction to the network and monitors its inclusion in a block.
     *
     * If broadcasting is rejected by the node for some reason (e.g. because of a CheckTx failure),
     * an error is thrown.
     *
     * If the transaction is not included in a block before the provided timeout, this errors with a `TimeoutError`.
     *
     * If the transaction is included in a block, a `BroadcastTxResponse` is returned. The caller then
     * usually needs to check for execution success or failure.
     */
    broadcastTx(tx: Uint8Array, timeoutMs?: number, pollIntervalMs?: number): Promise<BroadcastTxResponse>;
    getCodes(): Promise<readonly Code[]>;
    getCodeDetails(codeId: number): Promise<CodeDetails>;
    getContracts(codeId: number): Promise<readonly string[]>;
    /**
     * Throws an error if no contract was found at the address
     */
    getContract(address: string): Promise<Contract>;
    /**
     * Throws an error if no contract was found at the address
     */
    getContractCodeHistory(address: string): Promise<readonly ContractCodeHistoryEntry[]>;
    /**
     * Returns the data at the key if present (raw contract dependent storage data)
     * or null if no data at this key.
     *
     * Promise is rejected when contract does not exist.
     */
    queryContractRaw(address: string, key: Uint8Array): Promise<Uint8Array | null>;
    /**
     * Makes a smart query on the contract, returns the parsed JSON document.
     *
     * Promise is rejected when contract does not exist.
     * Promise is rejected for invalid query format.
     * Promise is rejected for invalid response format.
     */
    queryContractSmart(address: string, queryMsg: Record<string, unknown>): Promise<JsonObject>;
    private txsQuery;
}
