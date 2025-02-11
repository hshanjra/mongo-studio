import { useNavigate } from "react-router-dom";
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
  Tooltip,
  Button,
  Stack,
} from "@mui/material";
import { Delete, Edit, Visibility, Add } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import Loading from "../../components/loading";

interface Model {
  name: string;
  path: string;
}

export default function ModelList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: models, isLoading } = useQuery<Model[]>("models", async () => {
    const response = await axios.get("/api/models");
    return response.data;
  });

  const { mutate: deleteModel, isLoading: isDeleting } = useMutation(
    async (modelName: string) => {
      // Delete the model
      await axios.delete(`/api/models/${modelName}`);
      
      // Delete the associated collection
      await axios.delete(`/api/collections/${modelName}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('models');
        queryClient.invalidateQueries('collections');
      },
      onError: (error: any) => {
        console.error('Error deleting model or collection:', error);
        // Optionally show an error toast or notification
      }
    }
  );

  if (isLoading) {
    return <Loading message="Loading models..." fullScreen />;
  }

  if (!models) {
    return <Typography>No models found</Typography>;
  }

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Models</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate("/models/builder")}
        >
          Create Model
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model Name</TableCell>
              <TableCell>Path</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.map((model: Model) => (
              <TableRow key={model.name}>
                <TableCell>{model.name}</TableCell>
                <TableCell>{model.path}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Data">
                    <IconButton
                      onClick={() => navigate(`/models/${model.name}/view`)}
                      color="primary"
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Schema">
                    <IconButton
                      onClick={() => navigate(`/models/${model.name}/edit`)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Model">
                    <IconButton
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this model?"
                          )
                        ) {
                          deleteModel(model.name);
                        }
                      }}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
