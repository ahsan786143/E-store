import { showToast } from "@/lib/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useDeleteMutation = (deleteEndpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      const { data: response } = await axios({
        url: deleteEndpoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },

    onSuccess: (data) => {
      showToast("success", data.message);
      queryClient.invalidateQueries(queryKey);
    },

    onError: (err) => {
      const msg =
        err?.response?.data?.message || err.message || "Something went wrong";
      showToast("error", msg);
    },
  });
};

export default useDeleteMutation;
