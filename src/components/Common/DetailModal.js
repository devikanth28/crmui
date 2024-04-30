
import React, { useRef } from "react";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import { BodyComponent, HeaderComponent, Wrapper} from "./CommonStructure";
import Validate from "../../helpers/Validate";

const DetailModal = (props) => {

    const headerRef = useRef(0);

    return <React.Fragment>
        <div className="custom-modal header">
            <Wrapper className="m-0">
                {Validate().isNotEmpty(props.headerPart()) && <HeaderComponent ref={headerRef} className="d-flex flex-column">
                    {props.headerVisibility && props.headerPart()}
                </HeaderComponent>}
                <BodyComponent loading={props.loading} allRefs={{ headerRef }} className={`${props.bodyHeightClass ? props.bodyHeightClass : ""} body-height`} >
                     {!props.loading && props.bodyClassName ? <div className={`${ props.bodyClassName || 'm-0'}  `}>
                         {props.bodyVisibility && props.bodyPart()}
                     </div> : <React.Fragment>{(props.bodyVisibility && !props.loading) && props.bodyPart()}</React.Fragment> }
                </BodyComponent>
            </Wrapper>
        </div>
    </React.Fragment>
}

export default DetailModal;