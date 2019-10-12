interface HistoryEventDetails {
    amount: number;
    validated: boolean;
}

interface HistoryEvent {
    user: string;
    action: string;
    details?: HistoryEventDetails;
}

interface HistoryResponse {
    history: HistoryEvent[];
}

interface UserStats {
    clientName: string;
    stats: {
        buyRate: number;
        averageCart: number;
    };
}
