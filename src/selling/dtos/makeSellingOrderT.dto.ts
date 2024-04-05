export class SellingOrderTransferItem {
  productId: number;
  quantity: number;
  price: number;
}

export class MakeSellingOrderTransferDto {
  constructor(
    employeeId: number,
    sellingOrderItems: SellingOrderTransferItem[],
    customerId?: number,
  ) {
    this.employeeId = employeeId;
    this.sellingOrderItems = sellingOrderItems;
    this.customerId = customerId ?? null;
  }

  employeeId: number;
  customerId: number | null;
  sellingOrderItems: SellingOrderTransferItem[];
}
