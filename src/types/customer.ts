export type Customer = {
  customerId: number;
  name: string;
  contact: string;
  email: string;
  styleImageUrls?: string[];
  requestNotes?: string;
  memo?: string;
};

export type CustomerList = {
  customerId: number;
  name: string;
  targetGroup: string[];
};

export type CustomerDetail = Customer & { targetGroup: string[] };
