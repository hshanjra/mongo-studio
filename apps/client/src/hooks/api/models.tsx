import { queryClient } from "@/lib/query-client";
import axios from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";

interface Model {
  name: string;
  path: string;
}

export const useModels = (options?: UseQueryOptions<Model[], Error, any>) => {
  return useQuery<Model[], any>({
    queryKey: ["models"],
    queryFn: async () => {
      const response = await axios.get("/api/models");
      return response.data;
    },
    ...options,
  });
};

export const useCreateModel = (
  options?: UseMutationOptions<Model, Error, any>
) => {
  return useMutation<Model, Error, any>({
    mutationFn: async (payload: any) => {
      const response = await axios.post("/api/models", payload);
      return response.data;
    },
    ...options,
    onSuccess: (data, variables, context) => {
      // Revalidate query
      queryClient.invalidateQueries(["models"]);
      return options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useModel = (
  modelName: string,
  options?: UseQueryOptions<Model, Error, Model>
) => {
  return useQuery<Model, Error, Model>({
    queryKey: ["model", modelName],
    queryFn: async () => {
      const response = await axios.get(`/api/models/${modelName}`);
      return response.data;
    },
    ...options,
  });
};

export const useDeleteModel = (
  options?: UseMutationOptions<void, Error, { modelName: string }>
) => {
  return useMutation<void, Error, { modelName: string }>({
    mutationFn: (payload: { modelName: string }) =>
      axios.delete(`/api/models/${payload.modelName}`),
    ...options,
    onSuccess: (data, variables, context) => {
      // Revalidate query
      queryClient.invalidateQueries(["models"]);
      return options?.onSuccess?.(data, variables, context);
    },
  });
};
