export type TInvoiceRecord = {
  InvoiceNo: string | number;
  StockCode: string | number;
  Description: string;
  Quantity: number;
  InvoiceDate: number; // Excel serial date
  UnitPrice: number;
  CustomerID: number;
  Country: string;
};

export type TCountryCustomerStats = {
  country: string;
  customerCount: number;
};

export type TDailyInvoiceStats = {
  date: string;
  count: number;
};

/* 
rawData = [
  {
    InvoiceNo: 536365,
    StockCode: "85123A",
    Description: "WHITE HANGING HEART T-LIGHT HOLDER",
    Quantity: 6,
    InvoiceDate: 40513.35138888889,
    UnitPrice: 2.55,
    CustomerID: 17850,
    Country: "United Kingdom"
  }, ...
  ] */
