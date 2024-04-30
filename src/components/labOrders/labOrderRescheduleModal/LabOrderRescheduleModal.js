import DynamicForm, { withFormHoc,CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert,  UncontrolledTooltip } from "reactstrap";
import Validate from '../../../helpers/Validate';
import LabOrderService from "../../../services/LabOrder/LabOrderService";
import { BodyComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import { AlertContext, DetailModelOpened } from "../../Contexts/UserContext";
import dateFormat from "dateformat";
import { DataGridComponent, DetailWrapper, FormsComponent } from '../../Common/CommonModel';
import CloseIcon from '../../../images/cross.svg';
import { Button } from 'react-bootstrap';

const LabOrderRescheduleModal = ({ helpers, ...props }) => {

	const labOrderService = LabOrderService();
	const validate = Validate();
	const headerRef = useRef(0);
    const [height, setHeight] = useState();
    const refSlot= useRef();
	const [modalAction,setModalAction] = useState(props.value.type);
	const orderId = props.value.orderId;

	const [modalData, setModalData] = useState({});
	const [otp, setOtp] = useState();
	const [asignbutton , showAssignButton] = useState(true)
	const [showTimeSlots, setShowTimeSlots] = useState(false);
	const [otpRequested, setOtpRequested] = useState(false);
	const [rescheduleReasons, setRescheduleReasons] = useState(undefined);
	const [labOrderObj, setLabOrderObj] = useState({ orderId: orderId });
	const [timeSlotButtonPrev, setTimeSlotButtonPrev] = useState(false);
	const [timeOutId, setTimeOutId] = useState();
	const {setAlertContent,setStackedToastContent} = useContext(AlertContext);
    const { selectedFormsSection, setSelectedFormsSection } = useContext(DetailModelOpened);
	const [otpRadioButton,setOtpRadioButton] = useState("withOtpOption");

	const [initialLoading, setInitialLoading] = useState(false);
	const [loading,setLoading] = useState(false);

	useEffect(() => {
		getModalData(orderId);
		getLabOrderRescheduleReasons();
		setSelectedFormsSection(false);
		// setHeight(refSlot.current?.offsetHeight)
	}, []);
	useEffect(()=>{
		setHeight(refSlot.current?.offsetHeight)
	},[labOrderObj])
	// setHeight(refSlot.current?.offsetHeight);
	
	const toggle = () => props.setShowOrderScheduleModal(!props.showOrderScheduleModal);
	
	const modalBuild = () => {
		if (modalAction) {
			initialFormLoad();
			switch (modalAction) {
				case "reassign":
					helpers.showElement("agentsGroup");
					break;
				case "reschedule":
					setShowTimeSlots(true);
					break;
				case "reAssignAndReschedule":
					helpers.showElement("agentsGroup");
					setShowTimeSlots(true);
					break;
				default:
					setStackedToastContent({toastMessage:"Invalid action"});
			}
		}
	}

	const initialFormLoad = () => {
		helpers.updateValue(validate.isNotEmpty(props.value.mobileNo) ? props.value.mobileNo : '', "mobileNo", false);
		helpers.updateSingleKeyValueIntoField("readOnly", true, "mobileNo");
		let agents = [];
		let allAgents = [];
		let reasons = [];
		if (validate.isNotEmpty(modalData) && validate.isNotEmpty(modalData.agents)) {
			if (validate.isNotEmpty(modalData.allAgents)) {
				modalData.allAgents.map(agent => {
					allAgents.push(helpers.createOption(agent.agentId, agent.name, agent.agentId));
					if (labOrderObj.agentId && agent.agentId == labOrderObj.agentId) {
						helpers.updateValue([agent.agentId], "allAgentsDropDown");
						helpers.updateValue("allAgentsDropDown", "selectagentDD");
						helpers.hideElement('agentDropDown');
						helpers.showElement('allAgentsDropDown');
					}
				})
			}
			modalData.agents.map(agent => {
				agents.push(helpers.createOption(agent.agentId, agent.name, agent.agentId));
				if (labOrderObj.agentId && agent.agentId == labOrderObj.agentId) {
					helpers.updateValue([agent.agentId], "agentDropDown");
					helpers.updateValue("agentsDropDown", "selectagentDD");
					helpers.hideElement('allAgentsDropDown');
					helpers.showElement('agentDropDown');
				}
			});
		}

		if (validate.isNotEmpty(rescheduleReasons)) {
			Object.keys(rescheduleReasons).map(reason => {
				reasons.push(helpers.createOption(reason, rescheduleReasons[reason], reason));
			})
		}
		helpers.updateSingleKeyValueIntoField("values", agents, "agentDropDown");
		helpers.updateSingleKeyValueIntoField("values", allAgents, "allAgentsDropDown");
		helpers.updateSingleKeyValueIntoField("values", reasons, "rescheduleReasons");
	}

	const getModalData = async (orderId) => {
		let obj = {
			orderId: orderId,
		}
		setInitialLoading(true);
		props.setDisableMode(true)
		await labOrderService.getRescheduleModalData(obj).then(data => {
			if (validate.isNotEmpty(data) && data.statusCode === 'SUCCESS' && validate.isNotEmpty(data.dataObject)) {
				setModalData(data.dataObject);
				if (data.dataObject.bookedSlotId && data.dataObject.bookedSlotDate && data.dataObject.bookedSlotToTime)
					setLabOrderObj({ ...labOrderObj, slotId: data.dataObject.bookedSlotId, slotDate: data.dataObject.bookedSlotDate, slotToTime: data.dataObject.bookedSlotToTime });
				if (data.dataObject.agentId)
					setLabOrderObj((previous) => ({ ...previous, agentId: data.dataObject.agentId }));
			}
			else{
				setStackedToastContent({toastMessage:data.message})
			}
			props.setDisableMode(false)
			setInitialLoading(false);
		}).catch((err) => {
			setInitialLoading(false);
			setStackedToastContent({ toastMessage: err });
			props.setDisableMode(false);
		});
	}

	const validPayload = (modalAction, labSlotId, agentId, slotDate, orderStatus) => {
		switch (modalAction) {
			case "reassign":
				if (validate.isEmpty(agentId) || agentId == "Select Agents") {
					setStackedToastContent({toastMessage:"Select Agent"});
					return false;
				}
				break;
			case "reschedule":
				if (validate.isEmpty(labSlotId) || validate.isEmpty(slotDate)) {
					setStackedToastContent({toastMessage:"Select valid slot"});
					return false;
				}
				if (orderStatus != 'A' && validate.isEmpty(agentId)) {
					setStackedToastContent({toastMessage:"Select Agent"});
					return false;
				}
				break;
			case "reAssignAndReschedule":
				if (validate.isEmpty(labSlotId) || validate.isEmpty(slotDate) || validate.isEmpty(agentId)) {
					setStackedToastContent({toastMessage:"Select proper details"});
					return false;
				}
				break;
			default:
				setStackedToastContent({toastMessage:"Invalid Action"});
				return false;
		}
		return true;
	}

	const getRescheduleResponse = async (paramObj) => {
		if (!validPayload(modalAction, paramObj.slotId, paramObj.agentId, paramObj.slotDate, modalData.orderStatus)) {
			return;
		}
		try {
			if (modalAction == "reassign") {
				return await labOrderService.assignAgent(paramObj);
			} else if (modalAction == "reschedule" && modalData.orderStatus == 'A') {
				return await labOrderService.rescheduleSlot(paramObj);
			} else if (modalAction == "reAssignAndReschedule" || (modalAction == "reschedule" && modalData.orderStatus != "A")) {
				if (!(modalData.bookedSlotId === paramObj.slotId && modalData.bookedSlotDate === paramObj.slotDate)) {
					return await labOrderService.rescheduleandReassign(paramObj);
				}
				else {
					return await labOrderService.assignAgent(paramObj);
				}
			}
		} catch (err) {
			setStackedToastContent({toastMessage:"Something went wrong"});
		}
	}

	const updateOrder = async () => {
		props.setDisableMode(true);
		const data = await getRescheduleResponse(labOrderObj);
		if (validate.isNotEmpty(data)) {
			setStackedToastContent({toastMessage:data.message});
			if (data.statusCode == 'SUCCESS'){
				if(props.from == "deliveryInfo"){
					props.setReloadPage(!props.reloadPage);
				}
				props.onSubmitClick(labOrderObj.orderId)
				props.setShowOrderScheduleModal(!props.showOrderScheduleModal)
			}
		}
		props.setDisableMode(false)
	}

	const handleOtpChange = (event) => {
		if (event[0].target.value.length > 0 && !validate.isNumeric(event[0].target.value)) {
			setStackedToastContent({toastMessage:"only numeric values are allowed for otp"});
			return;
		}
		setOtp(event[0].target.value);
	}

	const handleAgentSelect = (payload) => {
		const [event, htmlElement] = payload;
		let agentId = event.target.value;
		setLabOrderObj({ ...labOrderObj, agentId: agentId[0] });
	}

	const requestOtpForRescheduleSlot = async () => {
		if (!validPayload(modalAction, labOrderObj.slotId, labOrderObj.agentId, labOrderObj.slotDate, modalData.orderStatus)) {
			return
		}
		props.setDisableMode(true);
		await labOrderService.requestOtpForRescheduleSlot(labOrderObj).then(data => {
			setStackedToastContent({toastMessage:data.message});
			if (data.statusCode === 'SUCCESS') {
				setOtpRequested(true);
				if(validate.isNotEmpty(rescheduleReasons) && Object.keys(rescheduleReasons).length > 0){
					setTimeOutId(setTimeout(() => {
						helpers.showElement("withOutOtpTitleGroup"); 
						helpers.showElement("withOutOtpGroup");	
					}, 30000));
					helpers.updateValue("","withOutOtpOption");
					helpers.disableElement("rescheduleReasons");
					helpers.disableElement("cancelWithoutOtp");
					helpers.disableElement("proceed");
					helpers.disableElement("comment");
				}
				helpers.disableElement("requestOtp");
				helpers.showElement("withOtpTitleGroup");
				helpers.showElement("otpFormGroup");
				helpers.updateValue("withOtp","withOtpOption");
				helpers.updateSingleKeyValueIntoField("disabled",false,"otp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"resendOtp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"cancelOtp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"verifyOtp");
			}
			else{
				setStackedToastContent({toastMessage:data.message})
			}
			props.setDisableMode(false)
		}).catch(error => {
			setStackedToastContent({toastMessage:error});
			props.setDisableMode(false)
		});
	}

	const resendOtpForRescheduleSlot = async () => {
		props.setDisableMode(true)
		await labOrderService.resendOtpForRescheduleSlot(labOrderObj).then(data => {
			setStackedToastContent({toastMessage:data.message});
			props.setDisableMode(false)
		}).catch(error => {
			setStackedToastContent({toastMessage:error});
			props.setDisableMode(false)
		});
	}

	const verifyOtpForRescheduleSlot = async () => {
		if (validate.isEmpty(otp)) {
			setStackedToastContent({toastMessage:"please enter valid otp"});
			return false;
		}

		if (!validate.isNumeric(otp)) {
			setStackedToastContent({toastMessage:"only numeric values are allowed for otp"});
			return false;
		}
		if (!validPayload(modalAction, labOrderObj.slotId, labOrderObj.agentId, labOrderObj.slotDate, modalData.orderStatus)) {
			return
		}
		const payload = {
			orderId: labOrderObj.orderId,
			otp: otp
		}
		props.setDisableMode(true);
		await labOrderService.verifyOtpForRescheduleSlot(payload).then(data => {
			setStackedToastContent({toastMessage:data.message});
			if (validate.isNotEmpty(data) && data.statusCode == 'SUCCESS')
				updateOrder();
			else{
				setStackedToastContent({toastMessage:data.message})
			}
			props.setDisableMode(false)
		}).catch(error => {
			setStackedToastContent({toastMessage:error});
			props.setDisableMode(false)
		});
	}

	const getLabOrderRescheduleReasons = async () => {
		if (validate.isNotEmpty(rescheduleReasons))
			return;
		props.setDisableMode(true);
		await labOrderService.getLabOrderRescheduleReasons().then(data => {
			if (validate.isNotEmpty(data) && data.statusCode === 'SUCCESS')
				setRescheduleReasons(data.dataObject);
			else{
				setStackedToastContent({toastMessage:data.message});
			}
			props.setDisableMode(false)
		}).catch(error => {
			setStackedToastContent({toastMessage:error});
			props.setDisableMode(false)
		});
	}

	const getTimeSlots = async (ordId, collectionCenterId, slotIndex) => {
		setLoading(true);
		const obj = {
			orderId: ordId,
			collectionCenterId: collectionCenterId,
			slotIndex: slotIndex
		}
		props.setDisableMode(true);
		await labOrderService.getTimeSlots(obj).then(data => {
			if (validate.isNotEmpty(data) && data.statusCode === 'SUCCESS' && validate.isNotEmpty(data.dataObject)) {
				setTimeSlotButtonPrev(!timeSlotButtonPrev);
				setModalData({ ...modalData, ...data.dataObject })
			}
			else{
				setStackedToastContent({toastMessage:data.message})
			}
			props.setDisableMode(false)
		}).catch(error => {
			setStackedToastContent({toastMessage:"something went wrong"});
			props.setDisableMode(false)
		});
		setLoading(false);
	}

	const selectSlotforAgent = (slotId, slotDate, slotToTime) => {
		if (otpRequested)
			return;
		if (modalAction == 'reschedule' || modalAction == 'reAssignAndReschedule') {
			if (modalData.bookedSlotId === slotId && modalData.bookedSlotDate === slotDate) {
				helpers.hideElement("requestOtpGroup");
				showAssignButton(true);
			} else {
				helpers.showElement("requestOtpGroup");
				helpers.hideElement("done");
				showAssignButton(false)
			}
		}
		setLabOrderObj({ ...labOrderObj, slotId: slotId, slotDate: slotDate, slotToTime: slotToTime });
	}

	const cancelOtp = () => {
		setOtp('');
		helpers.hideElement("otpFormGroup");
		helpers.showElement("requestOtp");
		helpers.updateSingleKeyValueIntoField("disabled",false,"requestOtp");
		helpers.hideElement("withOutOtpGroup");
		helpers.hideElement("withOtpTitleGroup");
		helpers.hideElement("withOutOtpTitleGroup");
		clearTimeout(timeOutId);
		setOtpRequested(false);
	}

	const rescheduleModalHeader = () => {
		return (
			// 	<React.Fragment>
			// 	<h6> Order Booked Time Slot : {modalData.bookedSlotDate}, {modalData.bookedSlotTime}</h6>
			// 	<h6>Order belongs to {modalData.locality} Locality </h6>
			// </React.Fragment>
			<React.Fragment>
				<div className="card border-0" style={{'max-height':'100%'}}>
					<div className="p-2 border-bottom d-flex justify-content-between align-items-center">
						<div>
							<h4 className="mb-2 fs-6">Delivery &amp; Order Information</h4>
							<p className="small mb-0">Booked time slot: <span className="text-warning"> {dateFormat(modalData.bookedSlotDateStr,"mmm d, yyyy")} , {modalData.bookedSlotTime}</span></p>
						</div>
						<div>
							<button type="button" id="formsCloseIcon" className="rounded-5 icon-hover btn btn-link hide-on-mobile" onClick={() => { setSelectedFormsSection(!selectedFormsSection) }}>
								<svg id="notification-icn" xmlns="http://www.w3.org/2000/svg" width="16" height="15.956" viewBox="0 0 16 15.956">
									<circle id="Ellipse_1160" data-name="Ellipse 1160" cx="4" cy="4" r="4" transform="translate(4 4.001)" fill="#ebebeb" opacity="0" />
									<path id="noun-down-scale-3676807-404040" d="M48.682,57.011,44.722,61a1,1,0,0,1-.575.224A.82.82,0,0,1,43.572,61a.772.772,0,0,1,0-1.118l3.96-3.96-2.267.192a.8.8,0,0,1-.128-1.6l4.471-.415a.78.78,0,0,1,.862.862l-.415,4.471a.8.8,0,0,1-.8.734h-.064a.794.794,0,0,1-.734-.862Zm9.262-11.529-3.96,3.992.224-2.3a.8.8,0,0,0-1.6-.128L52.2,51.518a.794.794,0,0,0,.224.639.77.77,0,0,0,.575.224h.064l4.471-.415a.8.8,0,1,0-.128-1.6l-2.267.224,3.96-3.96a.772.772,0,0,0,0-1.118.841.841,0,0,0-1.15-.032Z" transform="translate(-43.333 -45.271)" fill="#3f3f3f" />
								</svg>
								<UncontrolledTooltip placement="bottom" target="formsCloseIcon">
									Hide Delivery & Order Information
								</UncontrolledTooltip>
							</button>
							<button type="button" id="formsCloseIcon" className="rounded-5 icon-hover btn btn-link forms-toggle-button" onClick={() => { setSelectedFormsSection(!selectedFormsSection) }}>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
									<g id="topchevron_black_icon_18px" transform="translate(-762 -868.477)">
										<rect id="Rectangle_4722" data-name="Rectangle 4722" width="18" height="18" transform="translate(762 868.477)" fill="none" />
										<path id="Path_23401" data-name="Path 23401" d="M60.371,465.782l-4.156,4.156a.942.942,0,0,0,1.332,1.332l3.49-3.48,3.491,3.491a.945.945,0,0,0,1.611-.666.936.936,0,0,0-.279-.666L61.7,465.782A.945.945,0,0,0,60.371,465.782Z" transform="translate(710.138 408.731)" fill="#080808" />
									</g>
								</svg>
							</button>
						</div>
					</div>
					<div className='overflow-y-auto'>
						<div className='laborder-datalist h-100'>
							<div class="p-12">
								Order belongs to
								<address className='mb-2'>
									<small class="text-secondary">
										{modalData.locality}
									</small>
								</address>
								{<DynamicForm requestUrl={'/customer-relations/getRescheduleOtpForm'} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}
							</div>
						</div>
						{((modalAction == 'reassign' ||  modalAction == 'reAssignAndReschedule') && asignbutton)  && <div className='footer p-12 text-end'>
							<button type="button" onClick={()=>{updateOrder()}} className="btn brand-secondary btn-sm ms-3">Assign Agent</button>
							<button type="button" onClick={()=>{setShowTimeSlots(true);setModalAction("reAssignAndReschedule")}} disabled={showTimeSlots} hidden={modalData.orderStatus == 'A'} className="btn brand-secondary btn-sm ms-3">Show Slots</button>
						</div>}
					</div>
				</div>
			</React.Fragment>);
	}

	const selected = {
		color: '#f9f9f9',
		backgroundColor: '#1C3FFD',
		boxShadow: '0px 3px 6px #00000029'
	}
	const unavailable = {
		opacity: '0.6',
		cursor: 'not-allowed'
	}
	const square = {
		squreSelected: {
			height: "1rem",
			width: "1rem", 
			borderRadius: "4px",
			backgroundColor: "#1C3FFD",
		},
		squreNotSelected: {
			height: "1rem",
			width: "1rem",
			borderRadius: "4px",
			backgroundColor: "#EDF0FF",
		},
		squreDisabled: {
			height: "1rem",
			width: "1rem",
			borderRadius: "4px",
			opacity: '0.6',
		}
	}
	const timeSlotsTable = (timeSlots) => {
		return (labOrderObj && <React.Fragment>
			{/*<button type="button" class="btn btn-sm btn-dark" onClick={() => getTimeSlots(orderId, modalData.collectionCenterId, 0)} disabled={!timeSlotButtonPrev ? 'disabled' : ''}>Previous</button>
		<button type="button" class="btn btn-sm btn-dark" onClick={() => getTimeSlots(orderId, modalData.collectionCenterId, 1)} disabled={timeSlotButtonPrev ? 'disabled' : ''}>Next</button>*/}
			{/* <table>
				<thead>
					<tr>
						<th>Day/Date</th>
						<th colspan={modalData.maxSlotsCountPerDay}>Time Slot</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(timeSlots).map(eachSlot => {
						return <tr>
							<td>{eachSlot}</td>
							{timeSlots[eachSlot].map((labSlot) => {
								if (eachSlot < modalData.presentDate || (eachSlot == modalData.presentDate && parseInt(labSlot.fromTime.split(":")[0]) <= modalData.presentHour))
									return <td style={unavailable}>{labSlot.displayName}</td>;
								else if (labSlot.slotId == labOrderObj.slotId && eachSlot == labOrderObj.slotDate)
									return <td style={selected} onClick={() => selectSlotforAgent(labSlot.slotId, eachSlot, labSlot.toTime)}>{labSlot.displayName}</td>;
								else
									return <td onClick={() => selectSlotforAgent(labSlot.slotId, eachSlot, labSlot.toTime)}>{labSlot.displayName}</td>;
							})}
						</tr>;
					})}
				</tbody>
			</table> */}
			<div className="time-slots-container card border-0 h-100">
				<div class="header p-3 border-bottom d-flex justify-content-between" ref={refSlot}>
				<p className="mb-0 d-flex align-items-center">Select a time slot</p>
					<div className="order-controls">
						<a href="javascript:void(0)" title="Previous Order" className={`btn me-3  btn-sm btn-link text-primary ${timeSlotButtonPrev ? '' : 'disabled'} `} onClick={() => {timeSlotButtonPrev && getTimeSlots(orderId, modalData.collectionCenterId, 0)}} disabled={!timeSlotButtonPrev ? 'disabled' : '' || props.disableMode }>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<g transform="translate(-868.477 786) rotate(-90)">
									<rect fill="none" width="24" height="24" transform="translate(762 868.477)"></rect>
									<path fill="#1C3FFD" d="M61.848,465.874l-5.541,5.541a1.256,1.256,0,1,0,1.776,1.776l4.653-4.64,4.655,4.655a1.261,1.261,0,0,0,2.149-.888,1.248,1.248,0,0,0-.373-.888l-5.543-5.556A1.26,1.26,0,0,0,61.848,465.874Z" transform="translate(711.498 410.651)"></path>
								</g>
							</svg>
							<span class="ml-2 hide-on-mobile">Previous 7 Days</span>
						</a>
						<a href="javascript:void(0)" title="Next Order" className={`btn   btn-sm btn-link text-primary ${!timeSlotButtonPrev ? '' : 'disabled'} `} onClick={() => {!timeSlotButtonPrev &&getTimeSlots(orderId, modalData.collectionCenterId, 1)}} disabled={timeSlotButtonPrev ? 'disabled' : '' || props.disableMode }>
							<span class="mr-2 hide-on-mobile">Next 7 Days</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<g transform="translate(-906.838 786) rotate(-90)">
									<rect fill="none" width="24" height="24" transform="translate(762 906.838)"></rect>
									<path fill="#1C3FFD" d="M63.432,503.859l5.4-5.4a1.223,1.223,0,0,0-1.73-1.73l-4.533,4.52-4.533-4.533a1.228,1.228,0,0,0-2.092.865,1.216,1.216,0,0,0,.363.865l5.4,5.411A1.229,1.229,0,0,0,63.432,503.859Z" transform="translate(711.356 418.584)"></path>
								</g>
							</svg>
						</a>
					</div>
				</div>
				{!loading ? <div className="p-2 overflow-y-auto"  style={{ height: `calc(100% - ${height}px)`}}>
				{/* <p className="label-text pt-2">Day/Date</p> */}
				{Object.keys(timeSlots).map(eachSlot => {
					return <div className="mb-2">
						<div className="ps-2">{dateFormat(eachSlot,"mmm d, yyyy")}</div>
						<div className="each-time-slot">
							{timeSlots[eachSlot].map((labSlot) => {
								if (eachSlot < modalData.presentDate || (eachSlot == modalData.presentDate && parseInt(labSlot.fromTime.split(":")[0]) <= modalData.presentHour))
									return <div className="content bg-secondary-subtle" style={unavailable}>{labSlot.displayName}</div>;
								else if (labSlot.slotId == labOrderObj.slotId && eachSlot == labOrderObj.slotDate)
									return <div className="content" style={selected} onClick={() => !props.disableMode && selectSlotforAgent(labSlot.slotId, eachSlot, labSlot.toTime)}>{labSlot.displayName}</div>;
								else
									return <div className="content" onClick={() => !props.disableMode && selectSlotforAgent(labSlot.slotId, eachSlot, labSlot.toTime)}>{labSlot.displayName}</div>;
							})}
						</div>
					</div>
				})}				
			</div> : <div style={{ display: "flex", justifyContent: "center", height:"100vh" }}>
			        <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner"} animation="border" variant="brand" />
		      </div>}

			
			<div className="footer p-3 border-top d-flex align-items-center overflow-x-auto overflow-y-hidden mobile-compatible-tabs">
					<label className="me-3 text-secondary font-14">Slots </label>
			        <label className="align-items-center d-flex gap-2 me-3"><div className='bg-secondary-subtle' style={square.squreDisabled}> </div> Disabled </label>					  
			        <label className="align-items-center d-flex gap-2 me-3"><div style={square.squreNotSelected}> </div> Available </label>					   
					<label className="align-items-center d-flex gap-2"><div style={square.squreSelected }></div>Selected</label>
				</div>
			</div>
		</React.Fragment>)
	}


	const handleRescheduleReason = (payload) => {
		let reasonId = payload[0].target.value[0];
		setOtp('');
		setLabOrderObj({ ...labOrderObj, reasonId: reasonId, otp: otp });
		if (reasonId == 5)
			helpers.showElement("comment");
		else
			helpers.hideElement("comment");
	}

	const proceedWithoutOTP = () => {
		if (validate.isEmpty(labOrderObj.reasonId) || (labOrderObj.reasonId == 5 && validate.isEmpty(labOrderObj.comments))) {
			setStackedToastContent({toastMessage:"Please select proper reason"});
			return;
		}
		updateOrder();
	}

	const handleAgentDropDown = (payload) => {
		if (payload[0].target.checked) {
			helpers.hideElement('agentDropDown');
			helpers.showElement('allAgentsDropDown');
		} else {
			helpers.hideElement('allAgentsDropDown');
			helpers.showElement('agentDropDown');
		}
	}

	const rescheduleWithoutOTPSection = (id) => {
		return (
			<div>
				<select onChange={handleRescheduleReason}>
					{rescheduleReasons && Object.keys(rescheduleReasons).map(reason => (
						<option value={reason}>{rescheduleReasons[reason]}</option>
					))}
				</select>
				<input class={id === '5' ? '' : 'd-none'} name={'comments'} onChange={(e) => setLabOrderObj({ ...labOrderObj, comments: e.target.value })} maxLength={120} placeholder={"Enter reason"}></input>
				<button class="btn btn-primary" onClick={() => !props.disableMode && proceedWithoutOTP()} >Proceed</button>
			</div>
		)
	}

	const handleOtpRadioButton = (payload) => {
		let radioId = payload[0].target.value;
		switch (radioId) {
			case "withOtp":
				helpers.updateSingleKeyValueIntoField("disabled",false,"otp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"resendOtp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"cancelOtp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"verifyOtp");
				helpers.updateValue("","withOutOtpOption");
				helpers.disableElement("rescheduleReasons");
				helpers.disableElement("comment");
				helpers.disableElement("cancelWithoutOtp");
				helpers.disableElement("proceed");
				break;

			case "withOutOtp":
				helpers.updateSingleKeyValueIntoField("disabled",false,"rescheduleReasons");
				helpers.updateSingleKeyValueIntoField("disabled",false,"comment");
				helpers.updateSingleKeyValueIntoField("disabled", false, "cancelWithoutOtp")
				helpers.updateSingleKeyValueIntoField("disabled",false,"proceed");
				helpers.updateValue("","withOtpOption");
				helpers.disableElement("otp");
				helpers.disableElement("resendOtp");
				helpers.disableElement("cancelOtp");
				helpers.disableElement("verifyOtp");
				break;

			default:
				helpers.updateSingleKeyValueIntoField("disabled",false,"otp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"resendOtp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"cancelOtp");
				helpers.updateSingleKeyValueIntoField("disabled",false,"verifyOtp");
				helpers.updateValue("","withOutOtpOption");
				helpers.disableElement("rescheduleReasons");
				helpers.disableElement("proceed");
		}

	}

	const observersMap = {
		'otp': [['change', handleOtpChange]],
		'requestOtp': [['click', requestOtpForRescheduleSlot]],
		'cancelOtp': [['click', cancelOtp]],
		'verifyOtp': [['click', verifyOtpForRescheduleSlot]],
		'resendOtp': [['click', resendOtpForRescheduleSlot]],
		'agentDropDown': [['select', handleAgentSelect],['change',()=>{setLabOrderObj({ ...labOrderObj, agentId: undefined })}]],
		'allAgentsDropDown': [['select', handleAgentSelect],['change',()=>{setLabOrderObj({ ...labOrderObj, agentId: undefined })}]],
		'done': [['click', updateOrder]],
		'rescheduleOtpForm': [['load', modalBuild]],
		'rescheduleReasons': [['select', handleRescheduleReason]],
		'comment': [['change', (payload) => { setLabOrderObj({ ...labOrderObj, comments: payload[0].target.value }) }]],
		'proceed': [['click', proceedWithoutOTP]],
		'cancelWithoutOtp': [['click', cancelOtp]],
		'selectagentDD': [['change', handleAgentDropDown]],
		'withOtpOption':[['click',handleOtpRadioButton]],
		'withOutOtpOption':[['click',handleOtpRadioButton]]
	}

	return(
		<div className="custom-modal header">
			<Wrapper className="m-0">
				<HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
					<div class=" d-flex align-items-center" style={{maxWidth: "90%"}}>						
						{props.value.type === "reassign" ?
							<p className='mb-0 text-truncate'><span className='hide-on-mobile'>Assign Agent for OrderId : </span><span className='fw-bold'>{props.value.orderId}</span> from Lab <span className='fw-bold'>{props.value.storeId}</span></p> :
							<p className='mb-0 text-truncate'><span className='hide-on-mobile'>Reschedule Slot for Order ID - </span><span className='fw-bold'>{props.value.orderId}</span> from Lab <span className='fw-bold'>{props.value.storeId}</span></p>
						}
					</div>
					<div className=" d-flex align-items-center">
                        <Button variant=" " disabled={props.disableMode} onClick={toggle} className="rounded-5 icon-hover btn-link">
                        <span className='custom-close-btn icon-hover'></span>
						</Button>
                    </div>
				</HeaderComponent>
				<BodyComponent loading={initialLoading} allRefs={{ headerRef }} className="body-height">
					{(!initialLoading && validate.isNotEmpty(modalData)) &&
						<div className={"h-100"}>
							<DetailWrapper>
								<FormsComponent headerText={"Delivery & Order Information"} id={"FormsComp"} className={`border overflow-y-auto h-100 shadow-none`}>
									{modalData && rescheduleModalHeader()}
									{/* {rescheduleReasons && rescheduleWithoutOTPSection(labOrderObj.reasonId)} */}
								</FormsComponent>
								<DataGridComponent id={"DataGridComp"} className={`h-100 overflow-y-auto shadow-none ${modalAction == "reassign" ? 'border-0' : ''}`}>
									{showTimeSlots && modalData && modalData.labSlots && timeSlotsTable(modalData.labSlots)}
								</DataGridComponent>
							</DetailWrapper>
						</div>
					}
				</BodyComponent>
			</Wrapper>
		</div>
		)
}

export default withFormHoc(LabOrderRescheduleModal);