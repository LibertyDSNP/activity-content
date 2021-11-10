import { keccak256, Message } from "js-sha3";
/**
 * DSNPUserURI represents a URI targeting a user following the DSNP
 * [Identifiers](https://github.com/LibertyDSNP/spec/blob/main/pages/Identifiers.md)
 * specification.
 */
export type DSNPUserURI = string;

/**
 * Hexadecimal String
 */
export declare type HexString = string;

/**
 * hash() takes a string and returns a keccak256 hash string with a 0x prefix.
 *
 * @param content - The string content to hash
 * @returns A 0x prefixed keccak256 hash
 */
export const hash = (content: Message): HexString => `0x${keccak256(content)}`;
