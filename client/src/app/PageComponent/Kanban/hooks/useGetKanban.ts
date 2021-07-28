import { useQuery } from "react-query";
import agent from "../../../api/agent";
import { useKanbanStore } from "../../../stores/useKanbanStore";

export const useGetKanban = (title?: string) => {
  const { CreateBoard } = useKanbanStore();
  const { isLoading: KanbanLoading, refetch: FetchKanban } = useQuery(
    "kanban",
    () => agent.KanbanService.createNewBoard(String(title)),
    {
      enabled: false,
      onSuccess: (item) => {
        CreateBoard(item);
      },
    }
  );

  return { KanbanLoading, FetchKanban };
};
