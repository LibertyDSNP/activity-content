import assert from "assert";

import factories from "@dsnp/activity-content";
import errors from "@dsnp/activity-content";
import validation from "@dsnp/activity-content";

Object.entries({
  // Add imports that should exist
  factories,
  errors,
  validation
  
}).forEach(([key, value]) => {
  assert.notStrictEqual(value, undefined, `Was unable to import ${key}`);
});

