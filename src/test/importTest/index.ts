import assert from "assert";

import activityContent from "@dsnp/activity-content";
import { factories }  from "@dsnp/activity-content";
import * as factoriesDirect from "@dsnp/activity-content/factories";
import * as errors from "@dsnp/activity-content/errors";
import * as validation from "@dsnp/activity-content/validation";

Object.entries({
  // Add imports that should exist
  activityContent,
  factories,
  factoriesDirect,
  errors,
  validation
  
}).forEach(([key, value]) => {
  assert.notStrictEqual(value, undefined, `Was unable to import ${key}`);
});

