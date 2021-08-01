import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import agent from "../../../api/agent";
import { queryKeys } from "../../../stores/react-query/queryKeys";
import { ICalendarCard } from "../../../stores/types/kanban.types";
import { useCalendarStore } from "../../../stores/useCalendarStore";
import { getMonthYearDetails, getNewMonthYear } from "./monthYear";

const commonOptions = { staleTime: 0, cacheTime: 30000 };

const useCalendar = () => {
  const { setCardDueDateList } = useCalendarStore();
  const currentMonthYear = getMonthYearDetails(dayjs());

  const [monthYear, setMonthYear] = useState(currentMonthYear);

  const updateMonthYear = (monthIncrement: number) => {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  };
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery(
      [queryKeys.cardDueDate, nextMonthYear.year, nextMonthYear.month],
      () =>
        agent.CalendarService.getAllDueDate(monthYear.year, monthYear.month),
      commonOptions
    );
  }, [queryClient, monthYear, commonOptions]);

  const fallback: ICalendarCard = {};
  const { data: CardDueDate = fallback } = useQuery(
    [queryKeys.cardDueDate, monthYear.year, monthYear.month],
    () => agent.CalendarService.getAllDueDate(monthYear.year, monthYear.month),
    {
      ...commonOptions,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (item) => {
        setCardDueDateList(item);
      },
    }
  );

  return { CardDueDate, monthYear, updateMonthYear };
};

export { useCalendar };
