export class SellingOrderTransferItem {
  productId: number;
  quantity: number;
  price: number;
}

export class MakeSellingOrderTransferDto {
  constructor(
    employeeId: number,
    customerId: number,
    sellingOrderItems: SellingOrderTransferItem[],
  ) {
    this.employeeId = employeeId;
    this.customerId = customerId;
    this.sellingOrderItems = sellingOrderItems;
  }

  employeeId: number;
  customerId: number;
  sellingOrderItems: SellingOrderTransferItem[];
}
