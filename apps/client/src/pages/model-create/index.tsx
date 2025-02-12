import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateModel } from "@/hooks/api/models";

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

  const navigate = useNavigate();

  const { mutate: createModel, isLoading } = useCreateModel({
    onSuccess: () => {
      navigate(`/models/${modelName}`);
    },
  });

  // const { mutate: createModel, isLoading } = useMutation(
  //   async () => {
  //     try {
  //       // Build a proper schema object
  //       const schemaDefinition = fields.reduce(
  //         (acc, field) => {
  //           const fieldSchema: any = { type: field.type };

  //           // Add validation properties
  //           if (field.required) fieldSchema.required = true;
  //           if (field.unique) fieldSchema.unique = true;
  //           if (field.trim && field.type === "String") fieldSchema.trim = true;

  //           // Optional additional properties
  //           if (field.min !== undefined) fieldSchema.min = field.min;
  //           if (field.max !== undefined) fieldSchema.max = field.max;
  //           if (field.default !== undefined)
  //             fieldSchema.default = field.default;
  //           if (field.enum !== undefined) fieldSchema.enum = field.enum;

  //           acc[field.name] = fieldSchema;
  //           return acc;
  //         },
  //         {} as Record<string, any>
  //       );

  //       const response = await axios.post("/api/models", {
  //         name: modelName,
  //         schema: schemaDefinition, // Send as parsed object, not stringified
  //       });
  //       return response.data;
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         throw new Error(err.message);
  //       }
  //       throw new Error("An error occurred while creating the model");
  //     }
  //   },
  //   {
  //     onSuccess: () => {
  //       navigate("/models");
  //     },
  //     onError: (err: Error) => {
  //       setError(err.message);
  //     },
  //   }
  // );

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

    if (modelName.includes(" ")) {
      alert("Model name must not contain any spaces.");
      return;
    }

    if (fields.length === 0) {
      alert("At least one field is required");
      return;
    }

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
        if (field.default !== undefined) fieldSchema.default = field.default;
        if (field.enum !== undefined) fieldSchema.enum = field.enum;

        acc[field.name] = fieldSchema;
        return acc;
      },
      {} as Record<string, any>
    );

    createModel({ name: modelName, schema: schemaDefinition });

    console.log("Creating model:", {
      name: modelName,
      fields: fields,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Model</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Enter model name (e.g., User, Product)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* New Field Form */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="grid gap-2">
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  placeholder="e.g., first_name"
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Field Type</Label>
                <Select
                  value={newField.type}
                  onValueChange={(value) =>
                    setNewField({ ...newField, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={newField.required}
                    onCheckedChange={(checked) =>
                      setNewField({ ...newField, required: checked as boolean })
                    }
                  />
                  <Label htmlFor="required">Required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unique"
                    checked={newField.unique}
                    onCheckedChange={(checked) =>
                      setNewField({ ...newField, unique: checked as boolean })
                    }
                  />
                  <Label htmlFor="unique">Unique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trim"
                    checked={newField.trim}
                    onCheckedChange={(checked) =>
                      setNewField({ ...newField, trim: checked as boolean })
                    }
                  />
                  <Label htmlFor="trim">Trim</Label>
                </div>
              </div>
              <Button onClick={handleAddField} className="self-end">
                <Plus className="w-4 h-4 mr-2" /> Add Field
              </Button>
            </div>

            {/* Fields Table */}
            <div className="border rounded-lg">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="text-left p-3">Name</TableHead>
                    <TableHead className="text-left p-3">Type</TableHead>
                    <TableHead className="text-left p-3">Required</TableHead>
                    <TableHead className="text-left p-3">Unique</TableHead>
                    <TableHead className="text-left p-3">Trim</TableHead>
                    <TableHead className="text-left p-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{field.name}</td>
                      <td className="p-3">{field.type}</td>
                      <td className="p-3">{field.required ? "Yes" : "No"}</td>
                      <td className="p-3">{field.unique ? "Yes" : "No"}</td>
                      <td className="p-3">{field.trim ? "Yes" : "No"}</td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveField(field)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!modelName || fields.length === 0 || isLoading}
              >
                {isLoading ? "Creating..." : "Create Model"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
