import { Request, Response, Router } from "express";
import { Schema } from "mongoose";
import { asyncHandler } from "../middleware/errorHandler";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { FileManager } from "../utils/file-manager";

const router = Router();
const fileManager = new FileManager();

// Get all models
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const models = await fileManager.listModels();
    res.json(models);
  })
);

// Create new model
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, schema } = req.body;

    if (!name || !schema) {
      throw new BadRequestError("Model name and schema are required");
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      throw new BadRequestError("Model name must be a non-empty string");
    }

    if (typeof schema !== "object" || schema === null) {
      throw new BadRequestError("Schema must be a valid object");
    }

    const mongoose = req.app.locals.mongoose;

    // Check if model already exists
    if (mongoose.models[name]) {
      throw new BadRequestError(`Model ${name} already exists`);
    }

    try {
      // Save the TypeScript model file
      const modelPath = await fileManager.saveModelAsTypeScript(name, schema);

      // Create Mongoose model
      const mongooseSchema = new Schema(schema, { timestamps: true });
      mongoose.model(name, mongooseSchema);

      res.status(201).json({
        message: `Model ${name} created successfully`,
        modelPath: modelPath,
        name: name,
      });
    } catch (error: any) {
      throw new BadRequestError(`Failed to create model: ${error.message}`);
    }
  })
);

// Get model definition
router.get(
  "/:name/definition",
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;
    const modelDefinition = await fileManager.getModel(name);

    if (!modelDefinition) {
      throw new NotFoundError(`Model ${name} not found`);
    }

    res.json({
      name,
      definition: modelDefinition,
    });
  })
);

// Get model by name
router.get(
  "/:name",
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;
    const model = await fileManager.getModel(name);

    if (!model) {
      throw new NotFoundError(`Model ${name} not found`);
    }

    res.json({ name, model });
  })
);

// Delete model
router.delete(
  "/:name",
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;
    const deleted = await fileManager.deleteModel(name);

    if (!deleted) {
      throw new NotFoundError(`Model ${name} not found`);
    }

    // Remove from mongoose models if exists
    if (req.app.locals.mongoose.models[name]) {
      delete req.app.locals.mongoose.models[name];
    }

    res.json({ message: `Model ${name} deleted successfully` });
  })
);

export default router;
