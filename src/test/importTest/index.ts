import assert from "assert";

import activityContent from "@dsnp/activity-content";
import { factories } from "@dsnp/activity-content";
import * as factoriesDirect from "@dsnp/activity-content/factories";
import * as errors from "@dsnp/activity-content/errors";
import * as validation from "@dsnp/activity-content/validation";
import * as hash from "@dsnp/activity-content/hash";

Object.entries({
  // Add imports that should exist
  activityContent,
  factories,
  factoriesDirect,
  errors,
  validation,
  hash,
}).forEach(([key, value]) => {
  assert.notStrictEqual(value, undefined, `Was unable to import ${key}`);
});
