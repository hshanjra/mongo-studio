import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import Editor from "@monaco-editor/react";

interface Document {
  _id: string;
  [key: string]: any;
}

export default function ModelView() {
  const { modelName } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [documentData, setDocumentData] = useState("{}");

  // Fetch model data
  const { data, isLoading } = useQuery(
    ["modelData", modelName, page],
    async () => {
      const response = await axios.get(
        `/api/models/${modelName}?page=${page}&limit=10`
      );
      return response.data;
    }
  );

  // Create document mutation
  const createDocument = useMutation(
    async (newDoc: any) => {
      const response = await axios.post(`/api/models/${modelName}`, newDoc);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["modelData", modelName]);
        handleCloseDialog();
      },
    }
  );

  // Update document mutation
  const updateDocument = useMutation(
    async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/models/${modelName}/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["modelData", modelName]);
        handleCloseDialog();
      },
    }
  );

  // Delete document mutation
  const deleteDocument = useMutation(
    async (id: string) => {
      await axios.delete(`/api/models/${modelName}/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["modelData", modelName]);
      },
    }
  );

  const handleOpenDialog = (doc?: Document) => {
    if (doc) {
      setEditingDoc(doc);
      setDocumentData(JSON.stringify(doc, null, 2));
    } else {
      setEditingDoc(null);
      setDocumentData("{}");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDoc(null);
    setDocumentData("{}");
  };

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(documentData);
      if (editingDoc) {
        updateDocument.mutate({ id: editingDoc._id, data: parsedData });
      } else {
        createDocument.mutate(parsedData);
      }
    } catch (error) {
      alert("Invalid JSON format");
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const columns = data?.data[0] ? Object.keys(data.data[0]) : [];

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">{modelName} Data</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Document
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((doc: Document) => (
              <TableRow key={doc._id}>
                {columns.map((column) => (
                  <TableCell key={`${doc._id}-${column}`}>
                    {JSON.stringify(doc[column])}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenDialog(doc)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteDocument.mutate(doc._id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil((data?.total || 0) / 10)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingDoc ? "Edit Document" : "Create New Document"}
        </DialogTitle>
        <DialogContent>
          <Editor
            height="400px"
            defaultLanguage="json"
            value={documentData}
            onChange={(value) => setDocumentData(value || "{}")}
            options={{
              minimap: { enabled: false },
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
