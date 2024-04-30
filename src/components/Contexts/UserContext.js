import { createContext } from 'react';


export const UserContext = createContext({});

export const SidebarContext = createContext({
    sidebarCollapsedFlag: false,
    setSidebarCollapsedFlag: () => {}
});

export const AlertContext=createContext({
  alertContent:{},
  setAlertContent:(alert)=>{},
  toastContent:{},
  setToastContent:()=>{},
  stackedToastContent:{},
  setStackedToastContent:()=>{}
});
export const DetailModelOpened = createContext({
  selectedFormsSection : true,
  hasFormsSection :true,
  hasDatagridSection : true,
  setHasFormsSection : () =>{},
  setDataGridSection : () => {},
  setSelectedFormsSection: () => {}
});

export const AgentAppContext = createContext({
  customerId : undefined,
  setCustomerId : () => {},
  tpaTokenId : undefined,
  setTpaTokenId : () => {},
  locationSearchText : undefined,
  setLocationSearchText : () => {},
  collectionStoreId : undefined,
  setCollectionStoreId : () => {},
  isThirdPartyAgent : undefined,
  setIsThirdPartyAgent : () => {},
  userId : undefined,
  setUserId : () => {}
});

export const ShoppingCartContext = createContext({
 shoppingCart: undefined,
 setShoppingCart: () =>{},
 isOnlineCartAdded: undefined,
 setisOnlineCartAdded: () =>{},
 redisCart: undefined,
 setRedisCart: () =>{},
 productId: undefined,
 setProductId: () =>{},
 labShoppingCart: undefined,
 setLabShoppingCart: () =>{}
})

export const LocalityContext= createContext({
  martLocality:{},
  setMartLocality:()=>{},
  labLocality:{},
  setLabLocality:()=>{},
  storeSearchText:{},
  setStoreSearchText:()=>{},
  isLocalityComponentNeeded: true,
  setIsLocalityComponentNeeded: () => {},
  reloadLocality:false,
  setReloadLocality:() => {}
});

export const CustomerContext = createContext({
  tokenId:{},
  setTokenId:()=>{},
  customer:{},
  setCustomer:()=>{},
  customerId:{},
  setCustomerId:()=>{},
  subscription:{},
  setSubscription:()=>{}
})
