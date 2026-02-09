/**
 * LEO Senior Standard Reactor - Server State Engine
 * @author Nguyễn Minh Tâm (AKA LEO)
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 phút
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
