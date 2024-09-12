#!/usr/bin/env node

import { ToolManager } from "./tools/index.js";

import { validateArgs } from "./utils/parser/cli-args.js";

const args = process.argv.slice(2);
const [command, ...items] = args;

const validatedCliArgs = validateArgs(args);
console.log(validatedCliArgs);

const targetItems = items.length > 0 ? items : Array(process.cwd());

try {
  const tool = new ToolManager(validatedCliArgs);
  tool.use();
} catch (exc) {
  console.error(exc.message);
}
