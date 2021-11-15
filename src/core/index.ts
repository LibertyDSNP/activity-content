/**
 * To export a new sub-module:
 * ```
 * import * as fooImport from "./foo";
 * export const foo = fooImport;
 * 
 * Leads to use like:
 *   - `import { foo } from "@dsnp/activity-content/core";
 *   - `import foo from "@dsnp/activity-content/core/foo";
 */
import * as factoriesImport from "./factories";
export const factories = factoriesImport;

import * as errorsImport from "./errors";
export const errors = errorsImport;

import * as validationImport from "./validation";
export const validation = validationImport;
