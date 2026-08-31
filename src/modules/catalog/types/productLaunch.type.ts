import type { components } from '@/core/api/schema'

type ProductLaunchResource = components['schemas']['ProductLaunchResource']

/**
 * Tipo de domínio, em cima do `ProductLaunchResource` gerado (seção 6.1
 * de `docs/infra/convencoes-frontend-infra.md`), mesmo padrão de
 * `Product`. `purchasePrice` continua `string` (decimal do backend) —
 * mesma convenção de `Product.purchasePrice`.
 */
export interface ProductLaunch {
  createdAt: ProductLaunchResource['created_at']
  date: ProductLaunchResource['date']
  id: ProductLaunchResource['id']
  productId: ProductLaunchResource['product_id']
  purchasePrice: ProductLaunchResource['purchase_price']
  quantity: ProductLaunchResource['quantity']
}

export function toProductLaunch(resource: ProductLaunchResource): ProductLaunch {
  return {
    createdAt: resource.created_at,
    date: resource.date,
    id: resource.id,
    productId: resource.product_id,
    purchasePrice: resource.purchase_price,
    quantity: resource.quantity,
  }
}
