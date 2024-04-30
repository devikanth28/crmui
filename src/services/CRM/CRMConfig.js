import { REQUEST_TYPE } from "../ServiceConstants";

const CRM_CONFIG = {
    API: {
        MWALLET: {
            GET_MWALLET_REFUND_INFO: {
                url: "/getMWalletRefundInfo",
                method: REQUEST_TYPE.GET
            }
          },
        STORE_LOCATOR: {
            GET_STORES_INFO: {
                url: "/GetStores",
                method: REQUEST_TYPE.GET
            },GET_STORE_LOCALITY_INFO: {
                url: "/getStoreLocalityInfo",
                method: REQUEST_TYPE.GET
            },GET_STORE_LOCATIONS: {
                url: "/getStoreLocalities",
                method: REQUEST_TYPE.GET
            }
        }
    }
}

export default CRM_CONFIG;