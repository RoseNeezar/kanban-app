import { useQuery } from "react-query";
import agent from "../../../api/agent";
import { queryKeys } from "../../../stores/react-query/queryKeys";
import { useKanbanStore } from "../../../stores/useKanbanStore";

export const useGetKanban = (title?: string) => {
  const { CreateBoard } = useKanbanStore();
  const { isLoading: KanbanLoading, refetch: FetchKanban } = useQuery(
    queryKeys.kanban,
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
