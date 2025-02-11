import { Router } from "express";
import { validateSchema } from "../utils/schema-validator";

const router = Router();

// Validate schema
router.post("/validate", async (req, res) => {
  try {
    const { schema } = req.body;
    const validationResult = validateSchema(schema);
    res.json(validationResult);
  } catch (error) {
    res.status(500).json({ error: "Schema validation failed" });
  }
});

export default router;
