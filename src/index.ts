/**
 * To export a new sub-module:
 * ```
 * import * as fooImport from "./foo";
 * export const foo = fooImport;
 * ```
 * Leads to use like:
 *   - `import { foo } from "@dsnp/activity-content";`
 *   - `import foo from "@dsnp/activity-content/foo";`
 */
import * as coreImport from "./core";
export const core = coreImport;

export default {
  ...core,
};
