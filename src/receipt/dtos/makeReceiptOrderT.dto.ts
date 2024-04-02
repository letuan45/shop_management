export class ReceiptOrderTransferItem {
  productId: number;
  quantity: number;
  price: number;
}

export class MakeReceiptOrderTransferDto {
  constructor(
    employeeId: number,
    supplierId: number,
    receiptOrderItems: ReceiptOrderTransferItem[],
  ) {
    this.employeeId = employeeId;
    this.supplierId = supplierId;
    this.receiptOrderItems = receiptOrderItems;
  }

  employeeId: number;
  supplierId: number;
  receiptOrderItems: ReceiptOrderTransferItem[];
}
