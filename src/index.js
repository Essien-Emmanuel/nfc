#!/usr/bin/env node

import { Tool } from "./tools/index.js";

if (process.argv.length < 3) {
  console.log("Enter a command >>> 'zip', 'pdf'");
  process.exit(-1);
}

const args = process.argv.slice(2);
const [command, ...items] = args;
console.log("args ", args);

const targetItems = items.length > 0 ? items : Array(process.cwd());

const tool = new Tool(command, targetItems);
tool.call();
