#!/usr/bin/env node

import { Tool } from "./tools/index.js";

const args = process.argv.slice(2);
const [command, ...items] = args;

const cliArgs = args.reduce((acc, cur) => {}, {});

const targetItems = items.length > 0 ? items : Array(process.cwd());

try {
  const tool = new Tool(command, targetItems);
  tool.use();
} catch (exc) {
  console.error(exc.message);
}
