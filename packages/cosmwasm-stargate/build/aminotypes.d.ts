import { AminoConverter, Coin } from "@cosmjs/stargate";
/**
 * @see https://github.com/CosmWasm/wasmd/blob/v0.18.0-rc1/proto/cosmwasm/wasm/v1/types.proto#L36-L41
 */
declare type AccessConfig = never;
/**
 * The Amino JSON representation of [MsgStoreCode].
 *
 * [MsgStoreCode]: https://github.com/CosmWasm/wasmd/blob/v0.18.0-rc1/proto/cosmwasm/wasm/v1/tx.proto#L28-L39
 */
export interface AminoMsgStoreCode {
    type: "wasm/MsgStoreCode";
    value: {
        /** Bech32 account address */
        readonly sender: string;
        /** Base64 encoded Wasm */
        readonly wasm_byte_code: string;
        readonly instantiate_permission?: AccessConfig;
    };
}
/**
 * The Amino JSON representation of [MsgExecuteContract].
 *
 * [MsgExecuteContract]: https://github.com/CosmWasm/wasmd/blob/v0.18.0-rc1/proto/cosmwasm/wasm/v1/tx.proto#L73-L86
 */
export interface AminoMsgExecuteContract {
    type: "wasm/MsgExecuteContract";
    value: {
        /** Bech32 account address */
        readonly sender: string;
        /** Bech32 account address */
        readonly contract: string;
        /** Handle message as JavaScript object */
        readonly msg: any;
        readonly funds: readonly Coin[];
    };
}
/**
 * The Amino JSON representation of [MsgInstantiateContract].
 *
 * [MsgInstantiateContract]: https://github.com/CosmWasm/wasmd/blob/v0.18.0-rc1/proto/cosmwasm/wasm/v1/tx.proto#L46-L64
 */
export interface AminoMsgInstantiateContract {
    type: "wasm/MsgInstantiateContract";
    value: {
        /** Bech32 account address */
        readonly sender: string;
        /** ID of the Wasm code that was uploaded before */
        readonly code_id: string;
        /** Human-readable label for this contract */
        readonly label: string;
        /** Instantiate message as JavaScript object */
        readonly msg: any;
        readonly funds: readonly Coin[];
        /** Bech32-encoded admin address */
        readonly admin?: string;
    };
}
/**
 * The Amino JSON representation of [MsgMigrateContract].
 *
 * [MsgMigrateContract]: https://github.com/CosmWasm/wasmd/blob/v0.18.0-rc1/proto/cosmwasm/wasm/v1/tx.proto#L94-L104
 */
export interface AminoMsgMigrateContract {
    type: "wasm/MsgMigrateContract";
    value: {
        /** Bech32 account address */
        readonly sender: string;
        /** Bech32 account address */
        readonly contract: string;
        /** The new code */
        readonly code_id: string;
        /** Migrate message as JavaScript object */
        readonly msg: any;
    };
}
/**
 * The Amino JSON representation of [MsgUpdateAdmin].
 *
 * [MsgUpdateAdmin]: https://github.com/CosmWasm/wasmd/blob/v0.18.0-rc1/proto/cosmwasm/wasm/v1/tx.proto#L113-L121
 */
export interface AminoMsgUpdateAdmin {
    type: "wasm/MsgUpdateAdmin";
    value: {
        /** Bech32-encoded sender address. This must be the old admin. */
        readonly sender: string;
        /** Bech32-encoded contract address to be updated */
        readonly contract: string;
        /** Bech32-encoded address of the new admin */
        readonly new_admin: string;
    };
}
/**
 * The Amino JSON representation of [MsgClearAdmin].
 *
 * [MsgClearAdmin]: https://github.com/CosmWasm/wasmd/blob/v0.18.0-rc1/proto/cosmwasm/wasm/v1/tx.proto#L126-L132
 */
export interface AminoMsgClearAdmin {
    type: "wasm/MsgClearAdmin";
    value: {
        /** Bech32-encoded sender address. This must be the old admin. */
        readonly sender: string;
        /** Bech32-encoded contract address to be updated */
        readonly contract: string;
    };
}
export declare const cosmWasmTypes: Record<string, AminoConverter>;
export {};
