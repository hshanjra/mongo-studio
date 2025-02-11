import fs from "fs";
import path from "path";
import { promisify } from "util";
import { generateTypeScript } from "./mongoose-generator";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);

export class FileManager {
  private modelsPath: string;

  constructor() {
    this.modelsPath = path.resolve(
      process.env.MODELS_PATH || "../../generated/models"
    );
    this.initializePaths();
  }

  private async initializePaths() {
    await this.ensureDirectoryExists(this.modelsPath);
  }

  private async ensureDirectoryExists(dirPath: string) {
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw error;
      }
    }
  }

  async saveModelAsTypeScript(modelName: string, schema: any) {
    try {
      // Generate TypeScript model code
      const modelCode = await generateTypeScript(modelName, schema);
      const filePath = path.join(this.modelsPath, `${modelName}.model.ts`);
      await writeFile(filePath, modelCode);
      return filePath;
    } catch (error) {
      throw new Error(`Failed to generate TypeScript model: ${error}`);
    }
  }

  async getModel(modelName: string) {
    const filePath = path.join(this.modelsPath, `${modelName}.model.ts`);
    try {
      return await readFile(filePath, "utf-8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  async listModels() {
    try {
      const files = await readdir(this.modelsPath);
      return files
        .filter((file) => file.endsWith(".model.ts"))
        .map((file) => ({
          name: file.replace(".model.ts", ""),
          path: path.join(this.modelsPath, file),
        }));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  async deleteModel(modelName: string) {
    const filePath = path.join(this.modelsPath, `${modelName}.model.ts`);
    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return false;
      }
      throw error;
    }
  }
}
