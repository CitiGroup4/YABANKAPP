export interface Account {
    account_id: number;
    user_id: number;
    balance: number;
    account_type: string;
    created_at: string;
}


export interface AccountCreate {
    user_id: number;
    balance: number;
    account_type: string;
}