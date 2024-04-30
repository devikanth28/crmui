import { useState } from "react";
import Validate from "../../helpers/Validate";

const StoreDetails = (props) => {

    const validate = Validate();
    const stores = props.stores;
    const [filteredStores, setFilteredStores] = useState(stores); 


    const handleOnChange = (e) => {
        let filterStores = stores;
        const value = e.target.value.toLowerCase();
        if(validate.isNotEmpty(value) && validate.isNotEmpty(stores)) {
            if(props?.isFromMart) {
                filterStores = stores.filter(eachStore => eachStore.storeName.toLowerCase().includes(value.toLowerCase()) || eachStore.address.toLowerCase().includes(value.toLowerCase()) || eachStore.phoneNumber.includes(value));
            } else {
                filterStores = stores.filter(eachStore => eachStore.pathLabStore.name.toLowerCase().includes(value.toLowerCase()));
            }
        }
        
        setFilteredStores(filterStores);
    }

    return (
        <div className='p-12 card' style={{ "max-height": "25rem", "overflowY": "auto" }}>
            <div className="align-items-center border-bottom col-lg-4 col-12 d-flex mb-2 px-0 py-2 search-input position-relative">
                <input type="text" placeholder="Search for the nearby stores" autocomplete="off" className="border-0 form-control pl-3 searchBarInput" onChange={(e) => handleOnChange(e)} />
                <svg xmlns="http://www.w3.org/2000/svg" className="search-icon position-absolute" style={{right: '0.5rem'}} width="20" height="20" viewBox="0 0 20 20">
                    <g transform="translate(-1955.526 -233.434)">
                        <rect fill="none" width="20" height="20" transform="translate(1955.526 233.434)"></rect>
                        <path fill="none" d="M1955.534,253.419"></path>
                        <path fill="#404040" d="M1963.31,248.985a7.636,7.636,0,0,0,4.968-1.811l6.039,6.038a.707.707,0,0,0,1-1l-6.039-6.038a7.769,7.769,0,1,0-5.968,2.811Zm0-14.146a6.366,6.366,0,1,1-6.361,6.372V241.2A6.374,6.374,0,0,1,1963.31,234.839Z"></path>
                    </g>
                </svg>
            </div>
            {validate.isNotEmpty(stores) &&
                <div className="address-container gap-2">
                    {filteredStores?.map((eachStore) => {
                        const storeInfo = props?.isFromMart ? eachStore : eachStore?.pathLabStore;
                        return (
                            <address className="address-outline three-column max-width-mobile m-0" /* onClick={() => props.setPickUpStoreInfo(storeInfo.storeId)} */ >
                                <label htmlFor={storeInfo.storeId} className="pointer">
                                    <input class="form-check-input position-absolute" type="radio" id={storeInfo.storeId} value={storeInfo.storeId} style={{ "left": "0.75rem" }} onChange={() => props.handleStores(storeInfo.storeId, undefined)} checked={props.selectedStoreId == storeInfo.storeId} />
                                    <p className="title">
                                        {storeInfo?.storeName ? storeInfo?.storeName : storeInfo?.name} {`[${storeInfo.storeId}]`}
                                    </p>
                                    <small className="text-capitalize text-secondary" style={{ "wordWrap": "break-word" }}>
                                        {storeInfo.address}
                                    </small>
                                    <div className="mt-2">
                                    <a href={`tel:+${storeInfo.phoneNumber}`} title="click to call" className="mb-0 mt-3 text-decoration-none font-12">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="me-2">
                                                <g transform="translate(-180.438 -213.832)">
                                                    <rect width="24" height="24" transform="translate(180.438 213.832)" fill="none"></rect>
                                                    <g transform="translate(182.199 215.78)">
                                                        <g transform="translate(0 1.429)">
                                                            <path d="M185.394,217.171a2.043,2.043,0,0,0-.705.124,3.87,3.87,0,0,0-.728.361l-.369.26a3.029,3.029,0,0,0-.264.236,3.822,3.822,0,0,0-.979,1.742c-.771,2.889,1.118,7.237,4.7,10.82,3,3,6.621,4.87,9.442,4.87a5.349,5.349,0,0,0,1.377-.171,3.8,3.8,0,0,0,1.738-.975,2.837,2.837,0,0,0,.265-.3l.262-.374a3.9,3.9,0,0,0,.334-.689,2.167,2.167,0,0,0-.821-2.518l-2.625-1.833a2.261,2.261,0,0,0-3.063.546l-.509.731-.126-.089a24.713,24.713,0,0,1-5.47-5.468l-.089-.127.732-.51a2.2,2.2,0,0,0,.545-3.063l-1.832-2.624A2.229,2.229,0,0,0,185.394,217.171Zm11.1,17.253c-2.524,0-5.828-1.735-8.623-4.53-3.246-3.247-5.057-7.237-4.4-9.7a2.668,2.668,0,0,1,.678-1.22,1.807,1.807,0,0,1,.135-.126l.318-.225a2.535,2.535,0,0,1,.493-.24,1.03,1.03,0,0,1,1.162.4l1.831,2.622a1.042,1.042,0,0,1-.257,1.449l-1.193.833a.576.576,0,0,0-.16.783,24.809,24.809,0,0,0,6.813,6.815.585.585,0,0,0,.785-.16l.833-1.195a1.071,1.071,0,0,1,1.447-.257l2.624,1.833a1.006,1.006,0,0,1,.4,1.163l-.007.017a2.439,2.439,0,0,1-.206.435l-.223.321a1.537,1.537,0,0,1-.156.173,2.649,2.649,0,0,1-1.219.677A4.167,4.167,0,0,1,196.492,234.424Z" transform="translate(-182.178 -217.171)" fill="#343a40"></path>
                                                        </g>
                                                        <g transform="translate(9.963)">
                                                            <path d="M192.615,215.757a.58.58,0,0,0-.034,1.158,9.141,9.141,0,0,1,8.548,8.546.589.589,0,0,0,.621.543.579.579,0,0,0,.537-.615,10.284,10.284,0,0,0-3-6.636h0a10.28,10.28,0,0,0-6.634-3Z" transform="translate(-192.036 -215.757)" fill="#343a40"></path>
                                                        </g>
                                                        <g transform="translate(8.736 3.129)">
                                                            <path d="M191.427,218.853a.611.611,0,0,0-.6.544.58.58,0,0,0,.145.419.572.572,0,0,0,.4.2h0a6.708,6.708,0,0,1,6.274,6.275.589.589,0,0,0,.621.541h0a.578.578,0,0,0,.536-.613,7.869,7.869,0,0,0-7.362-7.36Z" transform="translate(-190.822 -218.853)" fill="#343a40"></path>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            {storeInfo.phoneNumber}
                                    </a>
                                    </div>
                                </label>
                            </address>
                        )
                    })}
                </div>}
        </div>
    )
}

export default StoreDetails