import React, { useContext, useEffect, useRef, useState } from "react";
import dateFormat from "dateformat";
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import LabOrderService from "../../../../services/LabOrder/LabOrderService";
import { isResponseSuccess } from "../../../../helpers/CommonHelper";
import { AlertContext, CustomerContext } from "../../../Contexts/UserContext";
import Validate from "../../../../helpers/Validate";
import { CollectionType } from "../../Constants/CustomerConstants";
import { Roles } from "../../../../constants/RoleConstants";
import useRole from "../../../../hooks/useRole";

const LabOrderTimeSlots = (props) => {

	const modalData = {
		"presentDate": dateFormat(new Date(), "yyyy-mm-dd"),
		"presentHour": new Date().getHours()
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

	const selected = {
		color: '#f9f9f9',
		backgroundColor: '#1C3FFD',
		boxShadow: '0px 3px 6px #00000029'
	}

	const refSlot = useRef();
	const validate = Validate();
	const labOrderService = LabOrderService();
	const [isPathlabAgent] = useRole([Roles.ROLE_CRM_PHLEBOTOMIST_PATHLAB_AGENT]);
	const { customerId } = useContext(CustomerContext);
	const { setStackedToastContent } = useContext(AlertContext);
	const [selectedNow, setSelectedNow] = useState(false);
	const [latestTimeSlotForAgent, setLatestTimeSlotForAgent] = useState(undefined);
	const [index, setIndex] = useState(0);
	const [timeSlots, setTimeSlots] = useState([]);
	const [loader, setLoader] = useState(true);
	const [filteredTimeSlots, setFilteredTimeSlots] = useState({});

	useEffect(() => {
		props.jumpToTab('timeSlots');
		getSlotDetails();
	}, []);

	const getSlotDetails = () => {
		setLoader(true);
		const config = { headers: { customerId: customerId }, params: { customerId: customerId, homeOrLab: props.visitType } }
		labOrderService.getSlotDetails(config).then((response) => {
			if (isResponseSuccess(response) && validate.isNotEmpty(response.responseData)) {
				prepareTimeSlots(response.responseData.availableTimeSlotsMap);
				prepareLatestSlotForAgent(response.responseData.availableTimeSlotsMap);
				if (validate.isNotEmpty(response.responseData.selectedSlotInfo)) {
					props.setSelectedSlotInfo(response.responseData.selectedSlotInfo);
					addSampleCollectionInfoToCart();
					props.setShowReportDeliveryNav(true);
				} else {
					props.setSelectedSlotInfo({});
					props.setShowReportDeliveryNav(false);
				}
			} else {
				setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
			}
			setLoader(false);
		}).catch((error) => {
			console.log(error);
			setStackedToastContent({ toastMessage: "Unable to get time slots!" });
			setLoader(false);
		});
	}

	const prepareLatestSlotForAgent = (timeSlots) => {
		const currentDate = dateFormat(new Date(), "yyyy-mm-dd");
		let tomorrowDate = new Date();
		tomorrowDate = dateFormat(tomorrowDate.setDate(tomorrowDate.getDate() + 1), "yyyy-mm-dd");
		let todaySlot = {};
		let tomorrowSlot = {};
		Object.entries(timeSlots).map((eachDate) => {
			if (eachDate[0] == currentDate) {
				todaySlot.slotDate = eachDate[0];
				todaySlot.slotId = eachDate[1][0]?.slotId;
				todaySlot.slotDisplayName = eachDate[1][0]?.displayName;
			} else if (eachDate[0] == tomorrowDate) {
				tomorrowSlot.slotDate = eachDate[0];
				tomorrowSlot.slotId = eachDate[1][0]?.slotId;
				tomorrowSlot.slotDisplayName = eachDate[1][0]?.displayName;
			}
		});

		if (validate.isNotEmpty(todaySlot) && validate.isNotEmpty(todaySlot.slotDate) && validate.isNotEmpty(todaySlot.slotId)) {
			setLatestTimeSlotForAgent(todaySlot);
			return;
		} 
		if (validate.isNotEmpty(tomorrowSlot) && validate.isNotEmpty(tomorrowSlot.slotDate) && validate.isNotEmpty(tomorrowSlot.slotId)) {
			setLatestTimeSlotForAgent(tomorrowSlot);
			return;
		} 
	}

	const prepareTimeSlots = (timeSlots) => {
		const slotsPerPage = 7;
		const modifiedTimeSlots = [];
		for (let i = 0; i < Object.keys(timeSlots).length; i += slotsPerPage) {
			const slots = Object.keys(timeSlots).slice(i, i + slotsPerPage);
			const obj = {};
			slots.forEach(key => {
				obj[key] = timeSlots[key];
			});
			modifiedTimeSlots.push(obj);
		}
		setTimeSlots(modifiedTimeSlots);
		setFilteredTimeSlots(modifiedTimeSlots[index]);
	}

	const handleClick = (labSlot, slotDate) => {
		let timeSlot = { slotDate: slotDate, slotId: labSlot.slotId, slotDisplayName: labSlot.displayName }
		if (props.selectedSlotInfo.slotId === labSlot.slotId && props.selectedSlotInfo.slotDate === slotDate && props.selectedSlotInfo.slotDisplayName === labSlot.displayName) {
			return;
		}
		const config = { headers: { customerId: customerId }, params: { customerId: customerId, homeOrLab: props.visitType, timeSlot: timeSlot, visitType: props.visitType } }
		addTimeSlotToCart(config);
		setSelectedNow(false);
		props.setSelectedSlotInfo({ ...props.selectedSlotInfo, slotId: labSlot.slotId, slotDate: slotDate, slotDisplayName: labSlot.displayName });
	}

	const addTimeSlotToCart = (config) => {
		labOrderService.addTimeSlotToCart(config).then((response) => {
			if (isResponseSuccess(response)) {
				//setStackedToastContent({ toastMessage: "Successfully added slot to cart." });
				addSampleCollectionInfoToCart();
			} else {
				setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
			}
		}).catch((error) => {
			setStackedToastContent({ toastMessage: "Unable to add slot to cart!" });
			console.log(error);
		});
	}

	const addSampleCollectionInfoToCart = () => {
		const config = { headers: { customerId: customerId }, params: { customerId: customerId, visitType: props.visitType } }
		labOrderService.addSampleCollectionInfoToCart(config).then((response) => {
			if (isResponseSuccess(response)) {
				//setStackedToastContent({ toastMessage: "Successfully added sample collection info." });
				props.setShowReportDeliveryNav(true);
			} else {
				setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
			}
		}).catch((error) => {
			setStackedToastContent({ toastMessage: "Unable to add sample collection info!" });
			console.log(error);
		});
	}

	const handleTimeSlotSliderClick = (index) => {
		setIndex(index);
		setFilteredTimeSlots(timeSlots[index]);
	}

	const addLatestSlotToSampleCollection = () => {
		let timeSlot = { slotDate: latestTimeSlotForAgent.slotDate, slotId: latestTimeSlotForAgent.slotId, slotDisplayName: latestTimeSlotForAgent.slotDisplayName }
		const config = { headers: { customerId: customerId }, params: { customerId: customerId, homeOrLab: props.visitType, timeSlot: timeSlot, visitType: props.visitType } }
		addTimeSlotToCart(config);
		setSelectedNow(true);
		props.setSelectedSlotInfo({ ...props.selectedSlotInfo, slotId: latestTimeSlotForAgent.slotId, slotDate: latestTimeSlotForAgent.slotDate });
	}

	return (
		<React.Fragment>
			<div id='timeSlots' className='scrolling-tabs p-12'>
				<label className='d-block pb-0 font-weight-bold custom-fieldset mb-2'>Select Time Slot</label>
				{loader ? <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
					<CustomSpinners outerClassName={"align-items-center d-flex custom-spinner"} animation="border" variant="brand" />
				</div> :
					validate.isNotEmpty(timeSlots) ?
						<div className='card'>
							<div className="time-slots-container card border-0 h-100">
								<div class="header p-3 border-bottom d-flex justify-content-between" ref={refSlot}>
									<p className="mb-0 d-flex align-items-center">Select a time slot</p>
									<div className="order-controls">
										<a href="javascript:void(0)" title="Previous Order" className={`btn me-3  btn-sm btn-link text-primary ${index != 0 ? '' : 'disabled'} `} onClick={() => { handleTimeSlotSliderClick(0) }} disabled={index == 0}>
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
												<g transform="translate(-868.477 786) rotate(-90)">
													<rect fill="none" width="24" height="24" transform="translate(762 868.477)"></rect>
													<path fill="#1C3FFD" d="M61.848,465.874l-5.541,5.541a1.256,1.256,0,1,0,1.776,1.776l4.653-4.64,4.655,4.655a1.261,1.261,0,0,0,2.149-.888,1.248,1.248,0,0,0-.373-.888l-5.543-5.556A1.26,1.26,0,0,0,61.848,465.874Z" transform="translate(711.498 410.651)"></path>
												</g>
											</svg>
											<span class="ml-2 hide-on-mobile">Previous 7 Days</span>
										</a>
										<a href="javascript:void(0)" title="Next Order" className={`btn   btn-sm btn-link text-primary ${index == 0 ? '' : 'disabled'} `} onClick={() => { handleTimeSlotSliderClick(1) }} disabled={index != 0}>
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
								{(!loader && validate.isNotEmpty(filteredTimeSlots)) && <div className="p-2 overflow-y-auto" style={{ height: `calc(100% - ${300}px)` }}>
									{(isPathlabAgent && props.collectionType == CollectionType.HOME_COLLECTION && (props.isAgentReferenceOrder || (validate.isNotEmpty(latestTimeSlotForAgent) && validate.isNotEmpty(latestTimeSlotForAgent.slotId) && validate.isNotEmpty(latestTimeSlotForAgent.slotDate)))) &&
										<>
											<div className="each-time-slot" onClick={() => props.isAgentReferenceOrder ? addSampleCollectionWithReferenceOrder() : addLatestSlotToSampleCollection()}>

												{(validate.isNotEmpty(props.selectedSlotInfo) && latestTimeSlotForAgent.slotId == props.selectedSlotInfo.slotId && latestTimeSlotForAgent.slotDate == props.selectedSlotInfo.slotDate && selectedNow) ?
													<div className="now-slot slot-selected">Take the Samples Now</div>
													: <div className="now-slot">Take the Samples Now</div>}
											</div>
											<div class="mt-3">
												<div class="position-relative py-2">
													<hr class="border-style-dashed" />
													<span class="separator-or-badge">OR</span>
												</div>
											</div>
										</>
									}
									{Object.keys(filteredTimeSlots).map(eachSlot => {
										return <div className="mb-2">
											<div className="ps-2">{dateFormat(eachSlot, "mmm d, yyyy")}</div>
											<div className="each-time-slot">
												{filteredTimeSlots[eachSlot].map((labSlot) => {
													if (eachSlot < modalData.presentDate || (eachSlot == modalData.presentDate && parseInt(labSlot.fromTime.split(":")[0]) <= modalData.presentHour))
														return <div className="content bg-secondary-subtle unavailable" >{labSlot.displayName}</div>;
													else if (validate.isNotEmpty(props.selectedSlotInfo) && labSlot.slotId == props.selectedSlotInfo.slotId && eachSlot == props.selectedSlotInfo.slotDate && !selectedNow)
														return <div className="content selected" style={selected} onClick={() => handleClick(labSlot, eachSlot)}>{labSlot.displayName}</div>;
													else
														return <div className="content unselected" onClick={() => handleClick(labSlot, eachSlot)}>{labSlot.displayName}</div>;
												})}
											</div>
										</div>
									})}
								</div>}
								<div className="footer p-3 border-top d-flex align-items-center overflow-x-auto overflow-y-hidden mobile-compatible-tabs">
									<label className="me-3 text-secondary font-14">Slots </label>
									<label className="align-items-center d-flex gap-2 me-3"><div className='bg-secondary-subtle' style={square.squreDisabled}> </div> Disabled </label>
									<label className="align-items-center d-flex gap-2 me-3"><div style={square.squreNotSelected}> </div> Available </label>
									<label className="align-items-center d-flex gap-2"><div style={square.squreSelected}></div>Selected</label>
								</div>
							</div>
						</div> :
						<div className={` card me-0 d-flex justify-content-center`} style={{ "minHeight": "10rem" }}>
							<div className="bg-info-light card p-12 text-center">
								<p className="mb-0">
									No Time Slots Available
								</p>
							</div>
						</div>}
			</div>
		</React.Fragment>
	);
}

export default LabOrderTimeSlots;