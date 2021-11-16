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

import * as factoriesImport from "./core/factories";
export const factories = factoriesImport;

import * as errorsImport from "./core/errors";
export const errors = errorsImport;

import * as validationImport from "./core/validation";
export const validation = validationImport;

export default {
  factories,
  errors,
  validation,
};
