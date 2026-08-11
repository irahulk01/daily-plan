"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, editTask, toggleTaskCompletion, deleteTask } from "@/actions/task";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("/api/tasks");
      const json = await res.json();
      if (json.status !== "success") throw new Error(json.message);
      return json.data;
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.status !== "success") throw new Error(json.message);
      return json.data;
    },
  });
}

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => editTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: string }) =>
      toggleTaskCompletion(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    createTask: createMutation.mutateAsync,
    editTask: editMutation.mutateAsync,
    toggleTask: toggleMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
    isPending:
      createMutation.isPending ||
      editMutation.isPending ||
      toggleMutation.isPending ||
      deleteMutation.isPending,
  };
}
