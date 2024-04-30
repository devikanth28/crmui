import React, { useContext, useEffect } from "react";
import { SidebarContext } from "../Contexts/UserContext";
import { Wrapper } from "./CommonStructure";

const MobileViewSearchForm = (props) => {
    const Component = props.mobileSearchFormComponent;
    const urlParams = props.location?.state?.urlParams;
    const { setSidebarCollapsedFlag } = useContext(SidebarContext);

    useEffect(() => {
        setTimeout(() => {
          setSidebarCollapsedFlag(true);
        },[500])
    },[]);

    return(
        <Wrapper>
            <div className="mobile-search-form custom-model-filter-container h-100">
                <Component {...props} urlParams={urlParams} />
            </div>
        </Wrapper>
    );
};

export default MobileViewSearchForm;