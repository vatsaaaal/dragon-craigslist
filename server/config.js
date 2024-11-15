import fs from "fs";
import path from "path";

const envConfig = JSON.parse(
  fs.readFileSync(path.resolve("env.json"), "utf-8")
);

export const config = envConfig;
