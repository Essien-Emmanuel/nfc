import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import { createGunzip } from "zlib";
import * as tar from "tar";

import { checkDir } from "../utils/index.js";

export class UnzipTool {
  constructor(dir) {
    this.dir = dir;
  }

  stripLen(fileName) {
    return fileName.split("\\").slice(0, -1).length - 1; // '- 1 to account for 'C:'
  }

  async unzipFile(zippedFile) {
    const unzippedFileFormat = zippedFile.slice(0, zippedFile.length - 3);

    const src = fs.createReadStream(zippedFile);
    const gunzip = createGunzip();
    const dest = fs.createWriteStream(unzippedFileFormat);

    try {
      await pipeline(src, gunzip, dest);
    } catch (error) {
      console.log("An error occured while unzipping file");
      console.error(error);
    }
  }

  async unzipFolder(zippedFolder) {
    const resolvedPath = path.resolve(zippedFolder);
    const stripLen = this.stripLen(resolvedPath);

    tar.x({
      strip: stripLen,
      file: zippedFolder,
      preservePaths: false,
    });
  }

  IsZipped(dir) {
    const fileExt = path.parse(dir).ext;
    const checkZip = [".gz", ".tar.gz", ".tgz"].includes(fileExt);
    return checkZip;
  }

  unzipCheckedItem(item) {
    if (item.slice(item.length - 7, item.length).includes(".tar.gz")) {
      return this.unzipFolder(item);
    }
    if (item.slice(item.length - 3, item.length).includes(".gz")) {
      return this.unzipFile(item);
    }
  }

  async unzip() {
    const [targetDir, files, err] = await checkDir(this.dir);

    if (err) {
      console.log(err.message);
      return;
    }

    if (files.length < 1) {
      if (!this.IsZipped(targetDir)) return;
      this.unzipCheckedItem(targetDir);
    }

    for (const file of files) {
      if (!this.IsZipped(file)) continue;
      this.unzipCheckedItem(file);
    }
    console.log("proceeding");
  }
}
