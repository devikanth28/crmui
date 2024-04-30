import { CRM_UI } from '../../services/ServiceConstants';

export const RedirectToProductDetail = (productId,customerId,history) => {
    history.push(`${CRM_UI}/customer/${customerId}/catalog/${productId}`)
}
