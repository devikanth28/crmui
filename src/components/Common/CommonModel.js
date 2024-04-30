import React, { useContext, useEffect, useState } from "react";
import { DetailModelOpened } from "../Contexts/UserContext";
import { Modal, ModalBody, UncontrolledTooltip } from "reactstrap";
import Validate from "../../helpers/Validate";
import LabActionsModal from "./LabActionsModal";
import { Button } from "react-bootstrap";
import ActionsModal from "./ActionsModal";


export const DataGridComponent = ({ children, ...props }) => {
    return (
        <React.Fragment>
            <div className={`datagrid mobile-datagrid border ${props.props.className ? props.props.className : null}`}>
                {
                    <React.Fragment>
                        {props.props.children}
                    </React.Fragment>
                }
            </div>
        </React.Fragment>
    )
}

export const HeaderComponent = ({ children, ...props }) => {
    return (
        <React.Fragment>
            <div style={props.props.style ? props.props.style : null} className={`header action-buttons-header ${props.props.className ? props.props.className : null}`}>
                <React.Fragment>
                    {props.props.children}
                </React.Fragment>
            </div>
        </React.Fragment>
    )
}

export const FormsComponent = ({ children, ...props }) => {
    const { selectedFormsSection, setSelectedFormsSection } = useContext(DetailModelOpened)
    return (
        <React.Fragment>
            <div className={`forms mobile-forms border ${props.props.className ? props.props.className : ''}`}>
                {!selectedFormsSection ?
                    <React.Fragment>
                        {props.props.children}
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <header className="d-flex align-items-center gap-2 flex-column justify-content-center card border-0 p-2">
                            <button onClick={() => { setSelectedFormsSection(!selectedFormsSection) }} type="button" id="formsOpenIcon" className="rounded-5 icon-hover mx-lg-3 btn btn-link hide-on-mobile">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                    <g id="forms-icn-18" transform="translate(-20 -431)">
                                        <rect id="Rectangle_9937" data-name="Rectangle 9937" width="18" height="18" transform="translate(20 431)" fill="none" />
                                        <g id="forms-icn" transform="translate(21 432)">
                                            <path id="Path_47202" data-name="Path 47202" d="M37.5,264.63H52.86v.512H37.5Z" transform="translate(-37.244 -261.272)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                            <path id="Path_47203" data-name="Path 47203" d="M34.366,34.7H19.006a.256.256,0,0,1-.256-.256V18.956a.256.256,0,0,1,.256-.256h15.36a.256.256,0,0,1,.256.256V34.444A.256.256,0,0,1,34.366,34.7Zm-15.1-.512H34.11V19.212H19.263Z" transform="translate(-18.75 -18.7)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                            <path id="Path_47204" data-name="Path 47204" d="M142.561,142.472h-1.269a.256.256,0,1,1,0-.512h1.269a.256.256,0,0,1,0,.512Z" transform="translate(-139.366 -140.277)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                            <path id="Path_47205" data-name="Path 47205" d="M327.821,142.472h-1.269a.256.256,0,1,1,0-.512h1.269a.256.256,0,1,1,0,.512Z" transform="translate(-322.097 -140.277)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                            <path id="Path_47206" data-name="Path 47206" d="M584.806,142.472H579.1a.256.256,0,0,1,0-.512h5.71a.256.256,0,1,1,0,.512Z" transform="translate(-571.193 -140.277)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                            <path id="Path_47207" data-name="Path 47207" d="M162.18,524.976h-1.724a.256.256,0,0,1-.256-.256V523a.256.256,0,0,1,.256-.256h1.724a.256.256,0,0,1,.256.256v1.724a.256.256,0,0,1-.256.256Zm-1.468-.512h1.212v-1.212h-1.212Z" transform="translate(-158.269 -515.858)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                            <path id="Path_47208" data-name="Path 47208" d="M162.18,778.106h-1.724a.256.256,0,0,1-.256-.256v-1.724a.256.256,0,0,1,.256-.256h1.724a.256.256,0,0,1,.256.256v1.724A.256.256,0,0,1,162.18,778.106Zm-1.468-.512h1.212v-1.212h-1.212Z" transform="translate(-158.269 -765.532)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                            <path id="Path_47209" data-name="Path 47209" d="M421.667,524.976h-8.041a.256.256,0,0,1-.256-.256V523a.256.256,0,0,1,.256-.256h8.041a.256.256,0,0,1,.256.256v1.724a.256.256,0,0,1-.256.256Zm-7.785-.512h7.529v-1.212h-7.529Z" transform="translate(-407.982 -515.858)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                            <path id="Path_47210" data-name="Path 47210" d="M421.667,778.106h-8.041a.256.256,0,0,1-.256-.256v-1.724a.256.256,0,0,1,.256-.256h8.041a.256.256,0,0,1,.256.256v1.724A.256.256,0,0,1,421.667,778.106Zm-7.785-.512h7.529v-1.212h-7.529Z" transform="translate(-407.982 -765.532)" fill="#404040" stroke="#404040" stroke-width="0.05" />
                                        </g>
                                    </g>
                                </svg>
                                <UncontrolledTooltip placement="bottom" target={"formsOpenIcon"}>
                                    {props.props.tooltipText ? props.props.tooltipText:"Delivery & Order Information"}
                                </UncontrolledTooltip>
                            </button>
                            {Validate().isNotEmpty(props.props.headerText) &&
                                <div onClick={() => { setSelectedFormsSection(!selectedFormsSection) }} className="rotation-text-clockwise">
                                    <p className="mx-auto">{props.props.headerText}</p>
                                </div>
                            }
                            <button onClick={() => { setSelectedFormsSection(!selectedFormsSection) }} type="button" id="formsOpenIcon" className="rounded-5 icon-hover mx-lg-3 btn btn-link forms-toggle-button">
                                {selectedFormsSection &&
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <g id="bottomchevron_black_icon_18px" transform="translate(-762 -906.838)">
                                            <rect id="Rectangle_4721" data-name="Rectangle 4721" width="18" height="18" transform="translate(762 906.838)" fill="none" />
                                            <path id="Path_23400" data-name="Path 23400" d="M61.559,501.985l4.049-4.049a.917.917,0,0,0-1.3-1.3l-3.4,3.39-3.4-3.4a.921.921,0,0,0-1.569.649.912.912,0,0,0,.272.649l4.049,4.059A.922.922,0,0,0,61.559,501.985Z" transform="translate(710.032 416.557)" fill="#080808" />
                                        </g>
                                    </svg>
                                }
                                <UncontrolledTooltip placement="bottom" target={"formsOpenIcon"}>
                                    {props.props.tooltipText ? props.props.tooltipText : "Delivery & Order Information"}
                                </UncontrolledTooltip>
                            </button>
                        </header>
                    </React.Fragment>

                }
            </div>
        </React.Fragment>
    )
}

export const DetailWrapper = (props) => {
    const [showActionModal, setShowActionModal] = useState(false);
    const [hasActions, setHasActions] = useState(false);

    const { selectedFormsSection } = useContext(DetailModelOpened);
    
    useEffect(() => {
        props.children.map((eachChild) => {
            if(eachChild.props.id == 'HeaderComp'){
                setHasActions(true);
            }
        });
    }, [props.children]);

    return (
        <React.Fragment>
            <div className={`custom_gridContainer h-100 m-0 ${props.className ? props.className : null} ${props.children.length ? selectedFormsSection ? "custom_gridContainer_rotate_anticlock" : "custom_gridContainer_rotate_crm" : null}`}>
                {props.children.map(eachChild => {
                    return <React.Fragment>
                        {eachChild.props.id == 'HeaderComp' ? <React.Fragment><HeaderComponent props={eachChild.props}></HeaderComponent></React.Fragment> : null}
                        {eachChild.props.id == 'FormsComp' ? <React.Fragment><FormsComponent props={eachChild.props} /></React.Fragment> :
                            eachChild.props.id == 'DataGridComp' ? <DataGridComponent props={eachChild.props} /> : null
                        }
                    </React.Fragment>
                })}
            </div>
            {hasActions && <div className="actions-button shadow">
                <button type="button" className="px-4 btn-dark btn" style={{ 'height': '50px' }} onClick={() => setShowActionModal(true)}>Actions</button>
            </div>}
            <Modal isOpen={showActionModal} className="modal-dialog modal-dialog-bottom" id="actionsModal" tabIndex="-1" role="dialog" aria-labelledby="actions-modal" aria-hidden="true">
                <div className="p-2 border-bottom">
                    <div className="d-flex gap-2 align-items-center">
                        <Button variant="link" className="icon-hover" type="button" onClick={() => setShowActionModal(false)} data-dismiss="modal" aria-label="Close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <g id="leftarrow_black_icon_18px" transform="translate(-48.941 -316.765)">
                                    <rect id="BG_Guide" data-name="BG Guide" width="16" height="16" transform="translate(48.941 316.765)" fill="none" />
                                    <path id="Path_22927" data-name="Path 22927" d="M55.719,319.236a.621.621,0,0,0-.4.154l-6.2,5.616a.591.591,0,0,0,0,.846l6.2,5.538a.645.645,0,0,0,.875-.077.59.59,0,0,0,0-.846l-4.929-4.462H64.305a.616.616,0,1,0,0-1.231H51.266l5.009-4.462a.541.541,0,0,0,.239-.461,1.072,1.072,0,0,0-.159-.462A3.691,3.691,0,0,0,55.719,319.236Z" transform="translate(0 -0.471)" fill="#080808" />
                                </g>
                            </svg>
                        </Button>
                        <h6 className="modal-title " id="actions">Actions</h6>
                    </div>
                </div>
                <ModalBody className="actions-container p-0">
                    {props.children.map(eachChild => {
                        return <React.Fragment>
                            {eachChild.props.id == 'HeaderComp' ? <ActionsModal modalType={props.modalType} showActionModal={showActionModal} closeActionsModal={() => { setShowActionModal(false) }} props={eachChild.props} /> : null}
                        </React.Fragment>
                    })}
                </ModalBody>
            </Modal>

        </React.Fragment>
    )
}

