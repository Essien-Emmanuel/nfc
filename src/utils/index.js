import fs from "fs";
import path from "path";

const { lstat, readdir } = fs.promises;

export const checkIsFile = async (filePath) => {
  try {
    const fileStat = await lstat(filePath);
    return fileStat.isFile();
  } catch (error) {
    console.error("An error occured for lstat: ", error.message);
  }
};

export const checkData = async (data) => {
  try {
    const result = await data;
    return [result, null];
  } catch (err) {
    return [null, err];
  }
};

export const checkDir = async (dirs) => {
  if (dirs.length < 1) {
    const [files, err] = await checkData(readdir(process.cwd()));
    return [process.cwd(), files, err];
  }

  let res = [process.cwd(), [], null];

  dirs.map((dir) => {
    const resolvedPath = path.resolve(dir);
    res[1].push(resolvedPath);
  });

  return res;
};
