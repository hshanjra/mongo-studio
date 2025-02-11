import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
} from "@mui/material";

// Define the structure for a collection field
interface CollectionField {
  name: string;
  type: string;
  required: boolean;
}

// Define the structure for a collection
interface Collection {
  name: string;
  fields: CollectionField[];
}

export default function CollectionList() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [openInsertDialog, setOpenInsertDialog] = useState(false);
  const [newField, setNewField] = useState<CollectionField>({
    name: "",
    type: "String",
    required: false,
  });

  const fieldTypes = [
    "String",
    "Number",
    "Boolean",
    "Date",
    "ObjectId",
    "Array",
    "Object",
  ];

  useEffect(() => {
    // TODO: Fetch collections from backend
    const mockCollections: Collection[] = [
      {
        name: "Users",
        fields: [
          { name: "username", type: "String", required: true },
          { name: "email", type: "String", required: true },
        ],
      },
      {
        name: "Products",
        fields: [
          { name: "name", type: "String", required: true },
          { name: "price", type: "Number", required: true },
        ],
      },
    ];
    setCollections(mockCollections);
  }, []);

  const handleOpenInsertDialog = () => {
    setOpenInsertDialog(true);
  };

  const handleCloseInsertDialog = () => {
    setOpenInsertDialog(false);
    // Reset new field form
    setNewField({
      name: "",
      type: "String",
      required: false,
    });
  };

  const handleAddField = () => {
    // Validate field before adding
    if (newField.name.trim() === "") {
      alert("Field name cannot be empty");
      return;
    }

    // TODO: Implement actual collection creation logic
    console.log("Adding new field:", newField);
    handleCloseInsertDialog();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Collections
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Collection Name</TableCell>
                <TableCell>Fields</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collections.map((collection) => (
                <TableRow key={collection.name}>
                  <TableCell>{collection.name}</TableCell>
                  <TableCell>
                    {collection.fields
                      .map(
                        (field) =>
                          `${field.name} (${field.type})${field.required ? " *" : ""}`
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Insert Collection Dialog */}
      <Dialog
        open={openInsertDialog}
        onClose={handleCloseInsertDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Collection Name"
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Required</InputLabel>
                <Select
                  value={newField.required.toString()}
                  label="Required"
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      required: e.target.value === "true",
                    })
                  }
                >
                  <MenuItem value="false">Optional</MenuItem>
                  <MenuItem value="true">Required</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInsertDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddField} color="primary" variant="contained">
            Add Field
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
