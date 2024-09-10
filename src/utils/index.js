import fs from "fs";
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

export const checkDir = async (dir) => {
  let targetDir = dir;

  if (targetDir !== process.cwd()) {
    targetDir = path.resolve(dir);
  }

  const [files, err] = await checkData(readdir(targetDir));
  return [targetDir, files, err];
};
