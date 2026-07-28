import apiClient from "./client";
import type {Account, AccountCreate} from "../types/account.ts";


export async function getAccount(
    accountId:number
): Promise<Account>{

    const response = await apiClient.get(
        `/accounts/${accountId}`
    );

    return response.data;
}



export async function createAccount(
    account:AccountCreate
): Promise<Account>{

    const response = await apiClient.post(
        "/accounts",
        account
    );

    return response.data;
}