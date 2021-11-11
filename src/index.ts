/**
 * To export a new sub-module:
 * ```
 * import * as fooImport from "./foo";
 * export const foo = fooImport;
 * ```
 * Leads to use like:
 *   - `import { foo } from "@dsnp/sdk";`
 *   - `import foo from "@dsnp/sdk/foo";`
 */
import * as coreImport from "./core";
export const core = coreImport;

export default {
  ...core,
};
