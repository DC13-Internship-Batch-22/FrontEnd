export type OrderStatus = 'PENDING' | 'CONFIRMED'

export interface Order {
  order_id: number
  tableNumber: string
  createdAt: string
  totalAmount: number
  orderStatus: OrderStatus
}

export interface PagedOrderParams {
  page: number
  size: number
  orderId?: string
  status?: OrderStatus
}

export interface PagedOrderResponse<Order> {
  items: Order[]
  totalCount: number
  totalPage: number
  page: number
  pageSize: number
}

export interface OrderDetail {
  order_id: number
  tableNumber: string
  items: OrderItem[]
  createdAt: string
  totalAmount: number
  orderStatus: OrderStatus
}

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
}
