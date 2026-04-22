export interface Task {
    id: string;
    user_id: string;
    subid: string;
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    is_completed: boolean;
    source: string;
}