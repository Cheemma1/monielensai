export interface AddBudgetPayload {
  category: string;
  month: string;
  limit: number;
  name: string;
  note?: string;
}

export interface UpdateBudgetPayload {
  category?: string;
  month?: string;
  limit?: number;
  name?: string;
  note?: string;
}

export interface Budget {
  id: string;
  category: string;
  month: string;
  limit: number;
  name: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
