import DynamicForm, { ALERT_TYPE, CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { TabContent, TabPane } from 'reactstrap'
import { SubscriptionBenefitType, photoIdInputMaxLength } from '../../../constants/AgentAppConstants'
import { changeDOBFormatOfsuscribedMemberIds, checkIfSelectedKyCTypeExistsInVerifiedList, getPlanType, isUpcomingSubscription, prepareKycObjectAndSaveIntoMember, reverseFormatDate, setVerifiedKycTypeIntoMember, useMembers } from '../../../helpers/AgentAppHelper'
import DateValidator from '../../../helpers/DateValidator'
import Validate from "../../../helpers/Validate"
import AgentAppService from '../../../services/AgentApp/AgentAppService'
import { AGENT_UI, MA_API_URL } from '../../../services/ServiceConstants'
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../../Common/CommonStructure'
import { AgentAppContext, AlertContext } from '../../Contexts/UserContext'
import NavTabs from '../common/NavTabs'
import UploadPhotoProof from '../common/UploadPhotoProof'
import Checkbox from '../common/checkBox'
import AddNewMemberDetailComponent from './AddMembers/AddNewMemberDetail'
import PrimaryMember from './PrimaryMember'
import SubscriptionMemberDetailComponent from './SubscriptionMemberDetailComponent'

const MAMembersForm = ({ helpers, ...props }) => {
    const { tpaTokenId } = useContext(AgentAppContext);
    const agentAppService = AgentAppService(tpaTokenId);
    const dateValidator = DateValidator();
    const [kycTypes, setKycTypes] = useState(undefined);
    const [relations, setRelations] = useState(undefined);
    const [subcribedMemberIds, setSubcribedMemberIds] = useState([])
    const [isAddMembers, setIsAddMembers] = useState(false);
    const [activeTab, setActiveTab] = useState('2');
    const [initialLoader, setInititalLoader] = useState(true);
    const [errorMsg, setErrorMsg] = useState({});
    const currentEditFormRef = useRef(null);
    const refs = useRef({});
    const [topCustomer, setTopCustomer] = useState(undefined);
    const [topCustomerMail, setTopCustomerMail] = useState(null);
    const [file, setFile] = useState(undefined);
    const [imagePath, setImagePath] = useState(undefined);
    const [showRetry, setShowRetry] = useState(false);
    const [backDropLoader, setBackDropLoader] = useState(false);
    const [addMemberFee, setAddMemberFee] = useState(0.00);
    const [addMemberMrp, setAddMemberMrp] = useState(0.00);
    const [maxMembers, setMaxMembers] = useState(-1);
    const [currentMembers, setCurrentMembers] = useState(1);
    const [minMembers, setMinMembers] = useState(1);
    const [disableRegister, setDisableRegister] = useState(false);
    const [memberRegions, setMemberRegions] = useState(undefined);
    const [planInfo, setPlanInfo] = useState(undefined);
    const selectedPlanId = props.match.params.planId;
    const latLong = props.match.params.latLong;
    const [progressLoader, setProgressLoader] = useState(false);
    const [percentageCompleted, setPercentCompleted] = useState(0);
    const [planType, SetPlanType] = useState("")
    const [localityState, setLocalityState] = useState({});
    const [membersWithoutPhotoId, setMembersWithoutPhotoId] = useState([])
    const [customer, setCustomer] = useState({})
    const [tabId, setTabId] = useState('1')
    const headerRef = useRef();
    const footerRef = useRef();
    const { setAlertContent, setToastContent } = useContext(AlertContext);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);
    const setFormLoading = props.setFormLoading;
    const [locality,setLocality] = useState("")
    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
        if (numToString == '2') {
            handleAddNewDetails()
        } if (numToString == '1') {
            setActiveTab('1')
        }
    }
    const tabs = [
        "Existing Members",
        "Add New Members",
    ]
    const [members, setMembers, selectedMemberIds, setSelectedMemberIds, selectedMembers, setSelectedMembers, newMembers, setNewMembers,
        newMembersImagePathList, setNewMembersImagePathList, newMembersFileList, setNewMembersFileList, existingMembersFileList, setExistingMembersFileList,
        existingMembersImagePath, setExistingMembersImagePath, newMembersErrorList, setNewMembersErrorList, existingMembersErrorMap, setExistingMembersErrorMap,
        addNewMember, removeNewCustomer, removeSelectedCustomer, setSelectedMembersIntoState, removeErrorFromSelectedMembers, removeErrorFromNewMemberList,
        currentEditMember, setCurrentEditMember, isFormEdit, setIsFormEdit
    ] = useMembers({});

    const validate = Validate();
    const emailPattern = /^[A-Za-z0-9-_.@]+$/;

    useEffect(() => {
        if (validate.isEmpty(selectedPlanId)) {
            setToastContent({ toastMessage: "Invalid Plan ID" });
            setTimeout(() => props.history.push(`${AGENT_UI}/planList`), 2000);
            return;
        }
        getPlanDetails()
    }, [])

    useEffect(() => {
        let totalMembers = 1;
        if (selectedMemberIds && selectedMemberIds.length > 0) {
            totalMembers = totalMembers + selectedMemberIds.length;
        }
        if (newMembers && newMembers.length > 0) {
            totalMembers = totalMembers + newMembers.length;
        }
        setCurrentMembers(totalMembers);

    }, [selectedMemberIds, newMembers]);

    useEffect(() => {
        if ((validate.isNotEmpty(topCustomer) && !validateCustomer()) || !isErrorsEmpty()) {
            setDisableRegister(true);
        } else {
            setDisableRegister(false);
        }
    }, [topCustomer, file, errorMsg]);

    const isErrorsEmpty = () => {

        if (validate.isNotEmpty(errorMsg["customerName"])) {
            return false;
        }
        if (topCustomer !== undefined && topCustomer.kycType !== undefined && validate.isNotEmpty(topCustomer.kycType) && validate.isNotEmpty(errorMsg["photoIDNumber"])) {
            return false;
        }
        if (validate.isNotEmpty(errorMsg["emailID"])) {
            return false;
        }
        if (validate.isNotEmpty(errorMsg["yearOfBirth"])) {
            return false;
        }
        return true;
    }



    const validateCustomer = () => {
        let isValid = true;
        if (validate.name(topCustomer.patientName)) {
            return false;
        }
        if (validate.isEmpty(topCustomer.gender)) {
            return false;
        }
        if (validate.isNotEmpty(topCustomer.kycType)) {
            if (!checkIfSelectedKyCTypeExistsInVerifiedList(topCustomer, topCustomer.kycType) && validatePhotoIdNumber(topCustomer.kycRefNo)) {
                return false;
            }

        }
        if ((planType === "I" || planType === "IC") && validate.email(topCustomer.email)) {
            return false;
        }
        if (dateValidator.validateDate(topCustomer.dob, topCustomer)) {
            return false;
        }
        return isValid;
    }


    const getPlanDetails = () => {
        agentAppService.getPlanDetails({ planId: selectedPlanId }).then(data => {
            let planDetails = null
            if (data && "SUCCESS" === data.statusCode && validate.isNotEmpty(data.responseData)) {
                if (data.responseData.isMemberSubscribed && !data.dataObject.isRenewalAllowed) {
                    setAlertContent({ alertMessage: "You are already subscribed to a subscription plan ,again not allowed to subscribe any different plan", alertType: ALERT_TYPE.WARNING });
                    setTimeout(() => props.history.push(`${AGENT_UI}/plansList`), 2000);
                }
                planDetails = data.responseData.plan;
                setPlanInfo(planDetails);
                SetPlanType(getPlanType(planDetails))
                props?.setPlanName?.(planDetails?.displayName ? planDetails.displayName : '');
                if (validate.isNotEmpty(planDetails.fees) && validate.isNotEmpty(planDetails.fees[1])) {
                    setAddMemberFee(parseInt(planDetails.fees[1].price));
                    setAddMemberMrp(parseInt(planDetails.fees[1].mrp));
                }

                setMaxMembers(data.responseData.maxMembers);
                setMinMembers(data.responseData.minMembers);
            } else {
                setAlertContent({ alertMessage: "please select plan before adding members" });
                setTimeout(() => props.history.push(`${AGENT_UI}/plansList`), 2000);
            }
            checkForRenewalMembersAndGetMembers(planDetails)
        });
    }

    const checkForRenewalMembersAndGetMembers = async (planDetails) => {
        const subscriptionObject = await getSubscriptionDetails(planDetails);
        let subscribedMembers = [];
        if (validate.isNotEmpty(subscriptionObject) && subscriptionObject.renewalAllowed && (subscriptionObject.plan.id === selectedPlanId)) {
            subscribedMembers = [...subscriptionObject.members];
        }
        let memberIds = [];
        subscribedMembers.map(member => {
            memberIds.push(member.patientId);
        });
        getMembers(memberIds, subscriptionObject);

    }

    const getPrimayMemberObject = (customer) => {
        let topMember = {};
        if (customer.firstName != customer.mobileNumber)
            topMember["patientName"] = `${customer.firstName} ${(validate.isNotEmpty(customer.lastName) && (customer.firstName !== customer.lastName)) ? customer.lastName : ''}`;
        else
            topMember["patientName"] = '';
        topMember["email"] = `${validate.isNotEmpty(customer.emailId) ? customer.emailId : ''}`;
        topMember["gender"] = `${customer.gender}`;
        return topMember;

    }

    const checkAndSetMembersInState = (members, selectedMemberIds) => {
        let selectedMembersList = [];
        let selectedMemberIdsList = [];
        selectedMemberIds.forEach(memberId => {
            members.every(member => {
                if (validate.isEmpty(member.relationship) || member.relationship.relationshipType !== "SELF") {
                    if (memberId == member.patientId) {
                        selectedMembersList.push(member);
                        selectedMemberIdsList.push(memberId);
                        return false;
                    }
                } else {
                    setTopCustomer(member);
                    setTopCustomerMail(member.email);
                }
                return true;
            });
        });
        setSelectedMembers(selectedMembersList);
        setSelectedMemberIds(selectedMemberIdsList);
    }

    const getMembers = (selectedMembersIds, subscriptionObject) => {
        agentAppService.getMembers({}).then(data => {
            if (data && "SUCCESS" == data.statusCode && validate.isNotEmpty(data.responseData)) {
                var customer = {}
                if (validate.isNotEmpty(data.responseData.primaryCustomer)) {
                    customer = data.responseData.primaryCustomer
                    setCustomer(data.responseData.primaryCustomer)
                }
                if (validate.isEmpty(customer)) {
                    setToastContent({ toastMessage: "No primary patient found" });
                    return;
                }
                let membersObject = [];
                if (validate.isNotEmpty(data.responseData.members)) {
                    let member = data.responseData.members[0];
                    if (validate.isEmpty(member.relationship) || member.relationship.relationshipType !== "SELF") {
                        membersObject.push(getPrimayMemberObject(customer));
                    } else {
                        if (customer.firstName != customer.mobileNumber)
                            member.patientName = `${customer.firstName} ${(validate.isNotEmpty(customer.lastName) && (customer.firstName !== customer.lastName)) ? customer.lastName : ''}`;
                        else
                            member.patientName = '';
                        member.email = `${validate.isNotEmpty(customer.emailId) ? customer.emailId : (validate.isNotEmpty(member.email) ? member.email : '')}`;
                    }
                    data.responseData.members[0] = member;
                    membersObject = [...membersObject, ...data.responseData.members];
                    let membersWithoutPhotoId = []
                    data.responseData.members.map(each => {
                        if (validate.isEmpty(each.verifiedKycTypes)) {
                            membersWithoutPhotoId.push(each.patientId)
                        }
                    })
                    setMembersWithoutPhotoId(membersWithoutPhotoId)
                }
                if (validate.isNotEmpty(data.responseData.suscribedMemberIds)) {
                    setSubcribedMemberIds(data.responseData.suscribedMemberIds)
                }

                if (validate.isNotEmpty(membersObject) && membersObject.length > 0) {
                    changeDOBFormatOfsuscribedMemberIds(membersObject)
                    setVerifiedKycTypeIntoMember(membersObject, data.responseData.kycTypes);
                    setMembers(membersObject);
                    setActiveTab('1');
                    if (validate.isNotEmpty(selectedMembersIds)) {
                        if (selectedMembersIds.length > 1) {
                            setIsAddMembers(true);
                        }
                        checkAndSetMembersInState(membersObject, selectedMembersIds);
                    } else {
                        let topCustomer = { ...membersObject[0] };
                        setTopCustomerMail(topCustomer.email);
                        setTopCustomer({ ...topCustomer });

                    }
                }

                if (validate.isNotEmpty(data.responseData.kycTypes))
                    setKycTypes(data.responseData.kycTypes);
                if (validate.isNotEmpty(data.responseData.relations))
                    setRelations(data.responseData.relations);
                if (validate.isNotEmpty(data.responseData.memberRegions)) {
                    setMemberRegions(data.responseData.memberRegions);
                    let selectedState = {};
                    Object.entries(data.responseData.memberRegions).map((value, index) => {
                        let locality = data.responseData.localityState
                        setLocality(locality)
                        if(!locality){
                            setToastContent({toastMessage:"Medplus Advantage is not available in your Location. Please try again..!"})
                            props.history.push(`${AGENT_UI}/searchCustomer`)
                        }
                        else if (locality.toLowerCase() == value[1].toLowerCase()) {
                            selectedState.stateSubName = value[0];
                            selectedState.stateName = value[1];
                            return
                        }
                    })
                    setLocalityState(selectedState);
                }

            } else if (data && "NO_MEMBERS_FOUND" == data.message) {
                if (validate.isNotEmpty(data.responseData.kycTypes))
                    setKycTypes(data.responseData.kycTypes);
                if (validate.isNotEmpty(data.responseData.relations))
                    setRelations(data.responseData.relations);
            } else {
                setToastContent({ toastMessage: "Unable to get Member Details" });
                setShowRetry(true);
            }
            setInititalLoader(false);
            setFormLoading(false);
        })
    }

    const getSubscriptionDetails = async (planDetails) => {

        const subscriptionObject = await agentAppService.getSubscriptions({}).then(data => {

            if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.responseData)) {
                let subscriptionObject = {};
                data.responseData = data.responseData.filter((each) => !isUpcomingSubscription(each));
                subscriptionObject = { ...data.responseData.find((each) => each.benefitType == SubscriptionBenefitType.HEALTHCARE && planDetails && planDetails.benefitType != SubscriptionBenefitType.PHARMA) }
                if (validate.isEmpty(subscriptionObject)) {
                    subscriptionObject = { ...data.responseData.find((each) => each.benefitType == SubscriptionBenefitType.PHARMA) }
                }
                return subscriptionObject;
            }
            return;
        });

        return subscriptionObject;
    }

    const handleKeyUp = (e) => {
        e.preventDefault();
        const keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            switch (e.target.name) {
                case "photoIDNumber": refs.current["emailID"].focus(); return;
                case "emailID": refs.current['yearOfBirth'].focus(); return;
                case "customerName": refs.current['photoIDNumber'].focus(); return;
                default: return;
            }
        }
        return;
    }

    const handleOnChange = (payload) => {
        const event = payload[0]
        let maxLength = event.target.maxLength;
        handleInputChange(event);
        if (maxLength && event.target.value.length > maxLength) {
            return;
        } else if (event.target.id == "customerName" && validate.isNotEmpty(event.target.value) && !validate.isAlphaWithSpace(event.target.value)) {
            return;
        } else {
            let customer = { ...topCustomer };
            if (event.target.id === 'customerName') {
                customer.patientName = event.target.value;
            }
            if (event.target.id === 'yearOfBirth') {
                customer.dob = event.target.value;
            }
            if (event.target.id === 'photoIDNumber') {
                if (validate.isEmpty(event.target.value)) {
                    customer.kycRefNo = '';
                } else if (customer.kycType.kycType === "AADHAAR_CARD" && validate.isNumeric(event.target.value)) {
                    customer.kycRefNo = event.target.value;
                } else if (customer.kycType.kycType !== "AADHAAR_CARD" && validate.isAlphaNumericWithSpace(event.target.value)) {
                    customer.kycRefNo = event.target.value;
                }
            }
            if (event.target.id === 'emailID') {
                if (validate.isEmpty(event.target.value)) {
                    customer.email = '';
                } else if (event.target.value.match(emailPattern)) {
                    customer.email = event.target.value;
                }
            }
            setTopCustomer(customer);
        }
    }

    const setGenderToCustomer = (value) => {
        let customer = { ...topCustomer };
        customer.gender = value;
        setTopCustomer(customer);
    }

    const updateKycType = (kycType) => {
        let customer = { ...topCustomer };
        if (validate.isEmpty(kycType) || (validate.isNotEmpty(customer.kycType) && customer.kycType.kycType !== kycType.kycType)) {
            customer.kycRefNo = '';
            setFile(undefined);
            setImagePath(undefined);
            let errorMessage = { ...errorMsg, ['photoIDNumber']: '' }
            setErrorMsg(errorMessage)
            if(validate.isNotEmpty(helpers)){
                helpers.updateErrorMessage("", 'photoIDNumber');
            }
        }
        customer.kycType = kycType;
        setTopCustomer(customer);
    }

    const saveMembers = (object, processType) => {
        agentAppService.saveMembers(object).then(data => {
            if (data && "SUCCESS" == data.statusCode && validate.isNotEmpty(data.responseData)) {
                let members = data.responseData;
                let memberIds = [];
                if (members) {
                    members.map(each => {
                        if ("SUCCESS" == each.status) {
                            memberIds.push(each.member.patientId);
                        }
                    })
                }
                props.history.push(`${AGENT_UI}/orderReview/${processType}`)
            } else if (data && data.message) {
                if (validate.isNotEmpty(data.responseData)) {
                    if ("MEMBERS_ERROR" === data.message) {
                        const keys = Object.keys(data.responseData);
                        let selectedMembersErrorMap = {};
                        let newMembersErrorList = {};
                        keys.map(index => {
                            if (index == 0) {
                                let showMessage = data.responseData[0][0];
                                if (validate.isNotEmpty(showMessage) && showMessage === "Id proof already in use, please enter unique id") {
                                    let errMessage = { ...errorMsg, ["photoIDNumber"]: showMessage };
                                    setErrorMsg(errMessage);
                                } else {
                                    setAlertContent({ alertMessage: showMessage });
                                }
                            }
                            if (index > 0 && selectedMemberIds && index <= selectedMemberIds.length) {
                                selectedMembersErrorMap[index - 1] = data.responseData[index][0];
                            }
                            if ((selectedMemberIds && index > selectedMemberIds.length) || (!selectedMemberIds && index > 0)) {
                                let length = (selectedMemberIds) ? selectedMemberIds.length + 1 : 1;
                                newMembersErrorList[index - length] = data.responseData[index][0];

                            }
                        })
                        setNewMembersErrorList(newMembersErrorList);
                        setExistingMembersErrorMap(selectedMembersErrorMap)
                    }
                    if ("PLAN_SUBSCRIPTION_ERROR" == data.message) {
                        setAlertContent({ alertMessage: data.responseData[0] });
                    }
                    if ("MEMBER_EXCEPTION" == data.message) {
                        setAlertContent({ alertMessage: data.responseData });
                    }

                } else {
                    setToastContent({ toastMessage: "unable to save members, please try again" })
                }
                setBackDropLoader(false);
            }
        })

    }

    const handleUploadFile = (file, uploadedImageObject) => {
        setFile(file);
        setImagePath(uploadedImageObject);
    }

    const showEmailInputContent = (className) => {
        return (
            (planType === "I" || planType === "IC") && <div className={`form-group has-float-label   ${className ? className : 'mb-3'}`}>
                <label htmlFor="emailID" className="select-label text-capitalize font-14 text-secondary">Email ID <sup className="text-danger"> *</sup></label>
                <input ref={element => { refs.current['emailID'] = element }} name="emailID" id="emailID" maxLength={45} placeholder=" " type="text" autoComplete="off" className={`form-control ${validate.isNotEmpty(errorMsg["emailID"]) ? "is-invalid" : ''}`} onFocus={handleValidation} onChange={(e) => handleOnChange(e)} onKeyUp={(e) => handleKeyUp(e)} onBlur={handleInputChange} value={validate.isNotEmpty(topCustomer.email) ? topCustomer.email : ''} />
                <div className="invalid-feedback">{errorMsg["emailID"]}</div>
            </div>
        )
    }

    const validateTopCustomer = () => {
        let isValid = true;
        if (validate.name(topCustomer.patientName)) {
            let errMessage = { ...errorMsg, 'customerName': "Please provide valid name" }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage("Please provide valid name", "customerName")
            isValid = false;
        }
        if (validate.isEmpty(topCustomer.gender)) {
            setAlertContent({ alertMessage: "Please select your gender" })
            isValid = false;
            return isValid;
        }
        if (validate.isNotEmpty(topCustomer.kycType)) {
            if (!checkIfSelectedKyCTypeExistsInVerifiedList(topCustomer, topCustomer.kycType) && validatePhotoIdNumber(topCustomer.kycRefNo)) {
                let errMessage = { ...errorMsg, 'photoIDNumber': `Please enter validate ${topCustomer.kycType.kycName}` }
                setErrorMsg(errMessage);
                isValid = false;
            }
        }
        if ((planType === "I" || planType === "IC") && validate.email(topCustomer.email)) {
            let errMessage = { ...errorMsg, 'emailID': `please enter valid emailID` }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage(`please enter valid emailID`, 'emailID')
            isValid = false;
        }
        if (dateValidator.validateDate(topCustomer.dob)) {
            let errMessage = { ...errorMsg, 'yearOfBirth': dateValidator.validateDate(customer.dob) }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage(dateValidator.validateDate(customer.dob), 'yearOfBirth')
            isValid = false;
        }
        return isValid;
    }

    const register = async () => {
        if (!validateTopCustomer()) {
            return;
        }
        if (isAddMembers) {
            if (isFormEdit) {
                if (validate.isNotEmpty(currentEditFormRef) && validate.isNotEmpty(currentEditFormRef.current)) {
                    currentEditFormRef.current.scrollIntoView();
                }
                setAlertContent({ alertMessage: `Please save or cancel pending member details`, alertType: ALERT_TYPE.INFO })
                return;
            }
            if (minMembers > currentMembers) {
                setAlertContent({ alertMessage: `Minimum members for plan is ${minMembers}`, alertType: ALERT_TYPE.INFO })
                return;
            }
        } else {
            if (minMembers > 1) {
                setAlertContent({ alertMessage: `Minimum members for plan is ${minMembers}`, alertType: ALERT_TYPE.INFO })
                return;
            }
        }
        if (validate.isNotEmpty(existingMembersErrorMap) || validate.isNotEmpty(newMembersErrorList)) {
            return;
        }
        setBackDropLoader(true);
        let mainCustomer = { ...topCustomer }
        if (planType === "O" || planType === "OC") {
            mainCustomer.corporateEmail = corporateEmailId;
            if (validate.isEmpty(mainCustomer.email)) {
                mainCustomer.email = corporateEmailId;
            }
        }
        mainCustomer.mobile = customer.mobileNumber
        relations.map(relation => {
            if (relation.relationshipType === "SELF") {
                mainCustomer.relationship = relation;
            }
        })
        if (validate.isNotEmpty(imagePath) && validate.isNotEmpty(mainCustomer.kycType) && !checkIfSelectedKyCTypeExistsInVerifiedList(mainCustomer, mainCustomer.kycType)) {
            mainCustomer.imageFile = imagePath;
        }
        let selectedMembersList = []
        if (selectedMembers && selectedMembers.length > 0) {
            selectedMembersList = JSON.parse(JSON.stringify(selectedMembers));
        }
        let newMembersList = []
        if (newMembers && newMembers.length > 0) {
            newMembersList = JSON.parse(JSON.stringify(newMembers));
        }

        let allCustomers = [];
        mainCustomer = { ...mainCustomer, "stateSubName": localityState.stateSubName };
        allCustomers.push(mainCustomer);
        if (isAddMembers) {
            if (selectedMembersList) {
                allCustomers = [...allCustomers, ...selectedMembersList];
            }
            if (newMembersList) {
                allCustomers = [...allCustomers, ...newMembersList];
            }
        }
        allCustomers.map(customer => {
            if (validate.isNotEmpty(customer.dob)) {
                customer.dob = dateValidator.getDateObject(customer.dob);
            }
            if (validate.isNotEmpty(customer.kycType) && !checkIfSelectedKyCTypeExistsInVerifiedList(customer, customer.kycType)) {
                prepareKycObjectAndSaveIntoMember(customer);
            } else {
                customer.kycs = null;
            }
        })
        let membersObj = {};
        membersObj['planId'] = selectedPlanId;
        membersObj['members'] = allCustomers;
        membersObj['latLong'] = latLong;
        saveMembers(membersObj, "N");
    }

    const handleValidation = (e) => {
        let errorMessage = { ...errorMsg, [e.target.id]: '' }
        setErrorMsg(errorMessage)
        helpers.updateErrorMessage('', e.target.id)
    }

    const handleAddNewDetails = () => {
        if (maxMembers <= 0 || (currentMembers < maxMembers) || (validate.isNotEmpty(newMembers) && newMembers.length > 0)) {
            setActiveTab('2');
        } else {
            setAlertContent({ alertMessage: "Maximum members selected", alertType: ALERT_TYPE.INFO })
        }
    }

    const handleInputChange = (event) => {
        let feildName = event.target.id;
        let errMsg = validateInputs(event);
        if (errMsg) {
            let errMessage = { ...errorMsg, [feildName]: errMsg }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage(errMsg, feildName)
        } else {
            let errMessage = { ...errorMsg, [feildName]: '' }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage('', feildName)
        }
    }

    const validateInputs = (e) => {
        if (e.target.id.indexOf('photoIDNumber') > -1) {
            return validatePhotoIdNumber(e.target.value);
        } else if (e.target.id.indexOf('customerName') > -1) {
            return validate.name(e.target.value, "Name", 30);
        } else if (e.target.id.indexOf('yearOfBirth') > -1) {
            return dateValidator.validateDate(e.target.value, topCustomer);
        } else if (e.target.id.indexOf('emailID') > -1) {
            return validate.email(e.target.value);
        }
    }

    const validatePhotoIdNumber = (value) => {
        if (validate.isEmpty(topCustomer.kycType)) {
            return "Select photo ID";
        }
        switch (topCustomer.kycType.kycType) {
            case "AADHAAR_CARD": return validateAadhaarCardNo(value);
            case "PAN_CARD": return validate.panCardNo(value);
            case "DRIVING_LICENSE": return validate.drivingLicense(value);
            case "PASSPORT": return validate.passport(value);
            case "PENSION_PASSBOOK": return validate.pensionPassbook(value);
            case "NPR_SMART_CARD": return validate.nprSmartCard(value);
            case "VOTER_ID": return validate.voterId(value);
            default: return validate.isEmpty(value);
        }

    }

    const validateAadhaarCardNo = (aadhaarCardNo) => {
        var errorMsg;
        if (validate.isEmpty(aadhaarCardNo) || !validate.isNumeric(aadhaarCardNo)) {
            errorMsg = "Please enter a valid Aadhaar card number.";
        } else if (aadhaarCardNo.trim().length != 12) {
            errorMsg = "Aadhaar card number must be 12 digits.";
        } else {
            errorMsg = undefined;
        }
        return errorMsg;
    }

    const deleteMember = (mId) => {
        if (validate.isNotEmpty(mId)) {
            agentAppService.deleteMember({ memberId: mId }).then(data => {
                if (data && "SUCCESS" === data.statusCode) {
                    if (validate.isNotEmpty(selectedMemberIds))
                        removeSelectedCustomer({ "patientId": mId });
                    let membersList = [...data.responseData];
                    changeDOBFormatOfsuscribedMemberIds(membersList)
                    setVerifiedKycTypeIntoMember(membersList, kycTypes)
                    setMembers(membersList);
                    setActiveTab('1');
                    setToastContent({ toastMessage: "Member deleted successfully" });
                } else {
                    setToastContent({ toastMessage: data.message });
                }
            }).catch(error => {
                console.log(error)
                setToastContent({ toastMessage:  "Unable to delete member" });
            })
        }
    }


    const handleInputDateChange = (payload) => {
        const date = payload[0].target.value
        let customerStateObject = { ...topCustomer };
        let feildName = "yearOfBirth"
        if (date) {
            const formattedDate = formatDate(date);
            let errMsg = dateValidator.validateDate(formattedDate, topCustomer);
            if (errMsg) {
                let errMessage = { ...errorMsg, [feildName]: errMsg }
                setErrorMsg(errMessage);
                helpers.updateErrorMessage(errMsg, feildName);
            } else {
                let errMessage = { ...errorMsg, [feildName]: '' }
                setErrorMsg(errMessage);
                helpers.updateErrorMessage("", feildName);
            }
            customerStateObject.dob = formattedDate
        }else{
            let errMessage = { ...errorMsg, [feildName]: "Invalid date" }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage("Invalid date", feildName);
            customerStateObject.dob = date
        }
        setTopCustomer(customerStateObject); 
    }

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const updateValues = () => {
        helpers.showElement("photoIDType")
        helpers.hideElement("photoIDNumber")
        setVerifiedToPhotoId(topCustomer.verifiedKycTypes)
        let formValues = {}
        if(validate.isNotEmpty(topCustomer.kycType) && (topCustomer.verifiedKycTypes && topCustomer.verifiedKycTypes.length > 0)){  
            formValues = { ...formValues, "photoIDType": topCustomer.kycType.kycType }
        }
        if (validate.isNotEmpty(topCustomer.patientName)) {
            formValues = { ...formValues, "customerName": topCustomer.patientName }
        }
		if (validate.isNotEmpty(topCustomer.dob)) {
			formValues = { ...formValues, "yearOfBirth": reverseFormatDate(topCustomer.dob) }
		}
        if (validate.isNotEmpty(topCustomer.gender)) {
            formValues = { ...formValues, "gender": topCustomer.gender }
        }
        if (validate.isNotEmpty(locality)) {
            helpers.showElement("state")
            formValues = { ...formValues, "state": localityState.stateName }
        }else{
            helpers.hideElement("state")
        }
        if (validate.isNotEmpty(topCustomer.email)) {
            formValues = { ...formValues, "emailID": topCustomer.email }
        }
        helpers.updateSpecificValues(formValues, "addMembersToPlan");
    }

    const setVerifiedToPhotoId = (verifiedKycTypes) => {
        const photoIdElement = helpers.getHtmlElement("photoIDType");
        photoIdElement.values.map(option => {
            if (verifiedKycTypes && verifiedKycTypes.indexOf(option.value) != -1) {
                if (!option.verified) {
                    option.actualDisplayValue = option.displayValue;
                    option.displayValue = `${option.displayValue} (verified)`;
                    option.verified = true;
                }
            }
            else {
                if (option.verified) {
                    option.verified = false;
                    option.displayValue = option.actualDisplayValue;
                }
            }
        })
    }

    const handleChange = (payload) => {
        const event = payload[0]
        setGenderToCustomer(event.target.value)
    }

    const enableAndValidatePhotoId = (payload) =>{
        const event = payload[0]
        if(event.target.value!=="NONE"){
            kycTypes && kycTypes.map((kycType) =>{
                if(event.target.value === kycType.kycType){
                    updateKycType(kycType);
                    const maxLength = validate.isNotEmpty(kycType) && validate.isNotEmpty(photoIdInputMaxLength[kycType.kycType]) ? photoIdInputMaxLength[kycType.kycType] : 16
                    helpers.updateSingleKeyValueIntoField("maxLength",maxLength, "photoIDNumber");
                    if(checkIfSelectedKyCTypeExistsInVerifiedList(topCustomer, kycType)){
                        helpers.hideElement("photoIDNumber");
                        setShowDocumentUpload(false)
                    }else{
                        helpers.showElement("photoIDNumber");
                    }
    
                }
            })
            
        }else{
            updateKycType('')
            setShowDocumentUpload(false)
            helpers.hideElement("photoIDNumber");
        }
        helpers.updateValue('','photoIDNumber',false);
        setShowDocumentUpload(false)
    }

    const observersMap = {
        'addMembersToPlan': [['load', updateValues]],
        'customerName': [['change', handleOnChange]],
        'gender': [['click', handleChange]],
        'yearOfBirth': [['change', handleInputDateChange]],
        'emailID': [['change', handleOnChange]],
        'photoIDType': [['click', enableAndValidatePhotoId]],
        'photoIDNumber' : [['change', (payload)=>{handleInputPhotoIdChange(payload)}]],
    }
    const updateValuesForRenewal = () => {
        helpers.hideElement("customerName");
        helpers.hideElement("yearOfBirth");
        helpers.hideElement("emailID");
        helpers.hideElement("photoIDNumber");
        helpers.hideElement("state");
        helpers.hideElement("gender");
    }

    const renewalObserversMap = {
        'addMembersToPlan': [['load', updateValuesForRenewal]],
        'photoIDType': [['click', enableAndValidatePhotoId]],
        'photoIDNumber' : [['change', (payload)=>{handleInputPhotoIdChange(payload)}]],

    }

    const handleBackPageRedirection = () => {
        props.history.goBack();
    }

	const handleInputPhotoIdChange = (payload) =>{
        const event = payload[0]
        let maxLength = event.target.maxLength;
        let errMsg = validateInputs(event);
        if (errMsg) {
            let errMessage = { ...errorMsg, ["photoIDNumber"]: errMsg }
           setErrorMsg(errMessage);
            helpers.updateErrorMessage(errMsg,"photoIDNumber");
        }else {
            let errMessage = { ...errorMsg, ["photoIDNumber"]: '' }
           setErrorMsg(errMessage);
            helpers.updateErrorMessage("","photoIDNumber");
        }
        if (maxLength && event.target.value.length > maxLength) {
            return;
        }else{
            let customer = { ...topCustomer };
            if (event.target.id === 'photoIDNumber') {
                if (validate.isEmpty(event.target.value)) {
                    customer.kycRefNo = '';
                } else if (customer.kycType.kycType === "AADHAAR_CARD" && validate.isNumeric(event.target.value)) {
                    customer.kycRefNo = event.target.value;
                } else if (customer.kycType.kycType !== "AADHAAR_CARD" && validate.isAlphaNumericWithSpace(event.target.value)) {
                    customer.kycRefNo = event.target.value;
                }
            }
            setTopCustomer(customer);
            if(validate.isEmpty(errMsg) && photoIdInputMaxLength[customer.kycType.kycType] === event.target.value.length){
                setShowDocumentUpload(true)
            }else{
                setShowDocumentUpload(false)
            }
        }
    }

    const showPhotoIdProof = () => {
        if(!subcribedMemberIds.includes(topCustomer.patientId)){
            if(validate.isNotEmpty(topCustomer.kycType) && (topCustomer.verifiedKycTypes && topCustomer.verifiedKycTypes.length > 0)){
                return (
                    <div className="col-lg-5 col-12 my-3">
                        <label htmlFor='photoIDType' className='d-block my-0 small text-secondary'>Photo ID Type</label>
                        <p className="font-14  mb-0">
                            {topCustomer.kycType.kycName}&nbsp;(<span className="text-success">verified</span>)
                        </p>
                    </div>
                )
            }else{
                return(
                    showDocumentUpload ?
                    <UploadPhotoProof kycType={topCustomer.kycType} updateKycType={updateKycType} kycTypes={kycTypes} topCustomer={topCustomer} selectedFile={file} handleImagePathAndFile={handleUploadFile} setBackDropLoader={setBackDropLoader} progressLoader={progressLoader} percentageCompleted={percentageCompleted} setProgressLoader={setProgressLoader} setPercentCompleted={setPercentCompleted} errorMsg={errorMsg && errorMsg["photoIDNumber"] ? errorMsg["photoIDNumber"] : ""} kycRefNo={topCustomer.kycRefNo} handleOnChange={handleInputPhotoIdChange} id="photoIDNumber" headers={props.headers}/> : <></>
                )
            }
        }
    }

    const DynamicFormLoader = () => {
        return (
            <div className="d-flex justify-content-center align-items-center h-100 d-none">
                <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"} />
            </div>
        )
    }

    return (
        <Wrapper>
            <HeaderComponent ref={headerRef} className="p-12 border-bottom">
                {planInfo && `Add Members to ${planInfo.name}`}
            </HeaderComponent>

            <BodyComponent className="body-height" allRefs={{ headerRef, footerRef }}>
                {/* {backDropLoader ?
                    <CustomSpinners spinnerText={"Add Members"} className={" page-loader"} innerClass={"invisible"} />
                    : ''} */}
                {validate.isNotEmpty(topCustomer) && <div className={`${subcribedMemberIds.includes(topCustomer.patientId) ? ' pt-3 ' : ''} vacine-registration-container`} style={{ "font": "1rem" }}>
                    {!subcribedMemberIds.includes(topCustomer.patientId) &&
                        <>
                            <DynamicForm requestUrl={`${MA_API_URL}/memberRegistration`} helpers={helpers} requestMethod={'GET'} observers={observersMap} headers={props.headers} Loader={DynamicFormLoader} />
                            {showDocumentUpload ?
                                <UploadPhotoProof kycType={topCustomer.kycType} updateKycType={updateKycType} kycTypes={kycTypes} topCustomer={topCustomer} selectedFile={file} handleImagePathAndFile={handleUploadFile} setBackDropLoader={setBackDropLoader} progressLoader={progressLoader} percentageCompleted={percentageCompleted} setProgressLoader={setProgressLoader} setPercentCompleted={setPercentCompleted} errorMsg={errorMsg && errorMsg["photoIDNumber"] ? errorMsg["photoIDNumber"] : ""} kycRefNo={topCustomer.kycRefNo} handleOnChange={handleInputPhotoIdChange} id="photoIDNumber" headers={props.headers} /> : <></>}
                            {/* {showPhotoIdProof()} */}
                        </>}

                    {subcribedMemberIds.includes(topCustomer.patientId) && subcribedMemberIds.includes(topCustomer.patientId) &&
                        <div className="p-12 mb-3 card">
                            <PrimaryMember memberInfo={topCustomer} topCustomerMail={topCustomerMail} showEmailInputContent={showEmailInputContent("mt-2")}/>
                            {localityState.stateName && <p className={`${validate.isNotEmpty(topCustomer.kycType) && checkIfSelectedKyCTypeExistsInVerifiedList(topCustomer, topCustomer.kycType) ? 'mb-1' : 'mb-0'} small`}><span class="text-secondary">State - </span><span>{localityState.stateName}</span></p>}
                            {validate.isNotEmpty(topCustomer.kycType) && checkIfSelectedKyCTypeExistsInVerifiedList(topCustomer, topCustomer.kycType) ?
                                <p className="mb-0 small"><span class="text-secondary">Photo ID Proof - </span><span>{kycTypes.find((each) => each.kycType == topCustomer.kycType.kycType).kycName} (<span className="text-success">verified</span>)</span></p> :
                                <>
                                    <hr className="border-bottom-0 border-dashed-all border-secondary" />
                                    <DynamicForm requestUrl={`${MA_API_URL}/memberRegistration`} helpers={helpers} requestMethod={'GET'} observers={renewalObserversMap} headers={props.headers} />
                                    {showDocumentUpload ? <UploadPhotoProof kycType={topCustomer.kycType} updateKycType={updateKycType} kycTypes={kycTypes} topCustomer={topCustomer} selectedFile={file} handleImagePathAndFile={handleUploadFile} setBackDropLoader={setBackDropLoader}progressLoader={progressLoader} percentageCompleted={percentageCompleted} setProgressLoader={setProgressLoader} setPercentCompleted={setPercentCompleted} errorMsg={errorMsg && errorMsg["photoIDNumber"] ? errorMsg["photoIDNumber"] : ""} kycRefNo={topCustomer.kycRefNo} handleOnChange={handleInputPhotoIdChange} id="photoIDNumber" /> : <></>}
                                    
                                </>}
                        </div>
                    }
                    {(maxMembers < 0 || maxMembers > 1) && <div className='mt-3'><Checkbox label={"Add Member"} checked={isAddMembers} name="addMore" onChange={() => setIsAddMembers(isAddMembers => !isAddMembers)} /></div>}
                    {isAddMembers && (maxMembers < 0 || maxMembers > 1) && validate.isNotEmpty(members) && members.length > 1 && <div className={`card`}>
                        <NavTabs tabs={tabs} onTabChange={handleTabId} />
                        <TabContent  className='p-12' activeTab={tabId}>
                            <TabPane tabId="1">
                                <div>
                                    {(activeTab === '1') && members.map((member, index) => {
                                        if (index == 0) {
                                            return <React.Fragment></React.Fragment>
                                        } else {
                                            return (<div className='col-lg-4 col mb-3'>
                                                <SubscriptionMemberDetailComponent showCheckBox membersWithoutPhotoId={membersWithoutPhotoId} currentEditMember={currentEditMember} subcribedMemberIds={subcribedMemberIds} setCurrentEditMember={setCurrentEditMember} removeErrorFromSelectedMembers={removeErrorFromSelectedMembers} errorIndex={selectedMemberIds ? selectedMemberIds.indexOf(member.patientId) : undefined} errorInfo={(selectedMemberIds && selectedMemberIds.indexOf(member.patientId) > -1) && existingMembersErrorMap ? existingMembersErrorMap[selectedMemberIds.indexOf(member.patientId)] : undefined} maxMembers={maxMembers} currentMembers={currentMembers} setBackDropLoader={setBackDropLoader} existingMembersFileList={existingMembersFileList} existingMembersImagePath={existingMembersImagePath} relations={relations} member={member} isSelected={(selectedMemberIds && selectedMemberIds.indexOf(member.patientId) > -1)} removeSelectedCustomer={removeSelectedCustomer} setSelectedMembersIntoState={setSelectedMembersIntoState} index={index} kycTypes={kycTypes} deleteMember={deleteMember} setIsFormEdit={setIsFormEdit} ref={currentEditFormRef} headers={props.headers} />
                                            </div>)
                                        }
                                    })}
                                </div>
                            </TabPane>
                            <TabPane tabId="2">
                                {(activeTab === '2') && <AddNewMemberDetailComponent removeErrorFromNewMemberList={removeErrorFromNewMemberList} errorMap={newMembersErrorList} maxMembers={maxMembers} currentMembers={currentMembers} newMembersFileList={newMembersFileList} newMembersImagePathList={newMembersImagePathList} relations={relations} kycTypes={kycTypes} newMembers={newMembers} addNewCustomer={addNewMember} removeCustomer={removeNewCustomer} setIsFormEdit={setIsFormEdit} headers={props.headers} />}
                            </TabPane>
                        </TabContent>
                    </div>}
                </div>}
                {isAddMembers && (validate.isEmpty(members) || members.length <= 1) && <AddNewMemberDetailComponent removeErrorFromNewMemberList={removeErrorFromNewMemberList} errorMap={newMembersErrorList} maxMembers={maxMembers} currentMembers={currentMembers} newMembersFileList={newMembersFileList} newMembersImagePathList={newMembersImagePathList} relations={relations} kycTypes={kycTypes} newMembers={newMembers} addNewCustomer={addNewMember} removeCustomer={removeNewCustomer} setIsFormEdit={setIsFormEdit} headers={props.headers} />}
            </BodyComponent>
            <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-end justify-content-lg-end">
                <button role="button" aria-label='Back' type="button" class="px-2 brand-secondary btn px-lg-4 me-2" onClick={handleBackPageRedirection}>Back</button>
                <button role="button" aria-label="Proceed To Verification" type="button" class="px-2 btn-brand btn px-lg-4 " disabled={initialLoader || disableRegister || progressLoader || backDropLoader} onClick={register}>{backDropLoader? <CustomSpinners spinnerText={"Locate Me"} className={" spinner-position"} innerClass={"invisible"} />: "Proceed" }<span className='btn-text-hide'>To Verification</span></button>
            </FooterComponent>
        </Wrapper>
    )
}

export default withFormHoc(MAMembersForm);
