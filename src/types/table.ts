export type TableStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "MAINTENANCE";

export interface TableRequest {
  tableNumber: string;
  capacity: number;
  status: TableStatus;
}

export interface TableResponse extends TableRequest {
  id: number;
  orderId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TablePageResponse {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: TableResponse[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}
