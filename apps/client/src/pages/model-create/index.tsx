import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Select,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { useMutation } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the structure for a model field
interface ModelField {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  trim: boolean;
  min?: number;
  max?: number;
  default?: string;
  enum?: string[];
}

export default function ModelCreate() {
  const [modelName, setModelName] = useState("");
  const [fields, setFields] = useState<ModelField[]>([]);
  const [newField, setNewField] = useState<ModelField>({
    name: "",
    type: "String",
    required: false,
    unique: false,
    trim: false,
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { mutate: createModel, isLoading } = useMutation(
    async () => {
      try {
        // Build a proper schema object
        const schemaDefinition = fields.reduce(
          (acc, field) => {
            const fieldSchema: any = { type: field.type };

            // Add validation properties
            if (field.required) fieldSchema.required = true;
            if (field.unique) fieldSchema.unique = true;
            if (field.trim && field.type === "String") fieldSchema.trim = true;

            // Optional additional properties
            if (field.min !== undefined) fieldSchema.min = field.min;
            if (field.max !== undefined) fieldSchema.max = field.max;
            if (field.default !== undefined)
              fieldSchema.default = field.default;
            if (field.enum !== undefined) fieldSchema.enum = field.enum;

            acc[field.name] = fieldSchema;
            return acc;
          },
          {} as Record<string, any>
        );

        const response = await axios.post("/api/models", {
          name: modelName,
          schema: schemaDefinition, // Send as parsed object, not stringified
        });
        return response.data;
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
        throw new Error("An error occurred while creating the model");
      }
    },
    {
      onSuccess: () => {
        navigate("/models");
      },
      onError: (err: Error) => {
        setError(err.message);
      },
    }
  );

  // Available field types
  const fieldTypes = [
    "String",
    "Number",
    "Boolean",
    "Date",
    "ObjectId",
    "Array",
    "Object",
  ];

  // Add a new field to the model
  const handleAddField = () => {
    // Basic validation
    if (!newField.name) {
      alert("Field name is required");
      return;
    }

    // Check for duplicate field names
    if (fields.some((f) => f.name === newField.name)) {
      alert("Field name must be unique");
      return;
    }

    // Add the new field
    setFields([...fields, { ...newField }]);

    // Reset the new field form
    setNewField({
      name: "",
      type: "String",
      required: false,
      unique: false,
      trim: false,
    });
  };

  // Remove a field from the model
  const handleRemoveField = (fieldToRemove: ModelField) => {
    setFields(fields.filter((field) => field !== fieldToRemove));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate model name and fields
    if (!modelName) {
      alert("Model name is required");
      return;
    }

    if (fields.length === 0) {
      alert("At least one field is required");
      return;
    }

    // TODO: Send model creation request to backend
    setError("");
    createModel();

    console.log("Creating model:", {
      name: modelName,
      fields: fields,
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Create New Model
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Model Name"
              variant="outlined"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name (e.g., User, Product)"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Model Fields
        </Typography>

        {/* New Field Input Form */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Field Name"
              variant="outlined"
              value={newField.name}
              onChange={(e) =>
                setNewField({
                  ...newField,
                  name: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Field Type</InputLabel>
              <Select
                value={newField.type}
                label="Field Type"
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    type: e.target.value,
                  })
                }
              >
                {fieldTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} className="flex flex-col">
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              className="w-full"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField({ ...newField, required: e.target.checked })
                    }
                  />
                }
                label="Required"
                className="w-full"
              />
            </Box>
          </Grid>
          <Grid item xs={4} className="flex flex-col">
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              className="w-full"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newField.unique}
                    onChange={(e) =>
                      setNewField({ ...newField, unique: e.target.checked })
                    }
                  />
                }
                label="Unique"
                className="w-full"
              />
            </Box>
          </Grid>
          <Grid item xs={4} className="flex flex-col">
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              className="w-full"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newField.trim}
                    onChange={(e) =>
                      setNewField({ ...newField, trim: e.target.checked })
                    }
                  />
                }
                label="Trim"
                className="w-full"
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddField}
            >
              Add Field
            </Button>
          </Grid>
        </Grid>

        {/* Fields Table */}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Unique</TableCell>
                <TableCell>Trim</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={index}>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{field.type}</TableCell>
                  <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                  <TableCell>{field.unique ? "Yes" : "No"}</TableCell>
                  <TableCell>{field.trim ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveField(field)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Submit Button */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!modelName || fields.length === 0 || isLoading}
          >
            {isLoading ? "Creating..." : "Create Model"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
