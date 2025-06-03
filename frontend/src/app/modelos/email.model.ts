export interface Email {
    id: number;
    from_email: string;
    from_name: string;
    to_email: string;
    subject: string;
    body: string;
    is_sent: boolean;
    created_at: string;  
}