import type { Codec } from "multiformats/bases/base";
import type { HexString } from "./types";

import { blake2b256 } from "@multiformats/blake2/blake2b";
import { sha256 } from "multiformats/hashes/sha2";
import { decode, create } from "multiformats/hashes/digest";
import { base58btc } from "multiformats/bases/base58";
import { bases, bytes } from "multiformats/basics";

// Note: There are two "encoders"
// 1. The encoding of the string as a Uint8Array (using the TextEncoder)
// 2. The encoding of the resulting hash, which is a Uint8Array, as a base58btc string

const toUint8Array = new TextEncoder();

/**
 * Union of supported hash algorithms
 */
export type SupportedAlg = "blake2b-256" | "sha2-256";

/**
 * The hash codes supported by this library and DSNP 1.2.0
 */
export const supportedHashCodes: Set<number> = new Set([
  blake2b256.code,
  sha256.code,
]);

/**
 * Take a string and hash it
 * @param content - the UTF-8 string to hash
 * @param alg - the algorithm to used (defaults to blake2b-256)
 * @returns The multibase string (base58btc) of the multihash
 */
export const toMultibaseHash = async (
  content: string,
  alg: SupportedAlg = "blake2b-256"
): Promise<string> => {
  const encoded = toUint8Array.encode(content);
  const hash =
    alg === "blake2b-256"
      ? blake2b256.digest(encoded)
      : alg === "sha2-256"
      ? sha256.digest(encoded)
      : null;

  if (hash === null) throw new Error("Unsupported Hash Algorithm");
  return base58btc.encode((await hash).bytes);
};

/**
 * Produce a multibase encoded string from a hash
 * @param hash - the hex string or Uint8Array of the hash
 * @param alg - The algorithm of the hash (must be a supported one)
 * @returns The multibase string (base58btc) of the multihash
 */
export const toMultibase = (
  hash: HexString | Uint8Array,
  alg: SupportedAlg
): string => {
  const uint8arr =
    hash instanceof Uint8Array ? hash : bytes.fromHex(hash.replace("0x", ""));
  const digest =
    alg === "blake2b-256"
      ? create(blake2b256.code, uint8arr)
      : alg === "sha2-256"
      ? create(sha256.code, uint8arr)
      : null;
  if (digest === null) throw new Error("Unsupported Hash Algorithm");
  return base58btc.encode(digest.bytes);
};

const basesByPrefix: Record<string, Codec<string, string>> = Object.fromEntries(
  Object.entries(bases).map(([_k, codec]) => [codec.prefix, codec])
);

/**
 * Decodes a multibase encoded hash
 * Does NOT throw errors
 * @param mbString - The multibase encoded string
 * @returns null if unable to decode or the codec name, algorithm code, and Uint8Array hash if it can
 */
export const fromMultibase = (
  mbString: string
): { hash: Uint8Array; codec: string; algCode: number } | null => {
  const prefix = mbString[0];
  const codec = basesByPrefix[prefix];
  if (codec == null) {
    return null;
  }
  try {
    const decodedBase = codec.decode(mbString);
    const digest = decode(decodedBase);
    return {
      codec: codec.name,
      algCode: digest.code,
      hash: digest.digest,
    };
  } catch (e) {
    return null;
  }
};
