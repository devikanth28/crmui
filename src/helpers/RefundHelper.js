

export const getRefundDisplayStatusName = (status) =>{
    switch (status) {
        case 'I':
            return "Created"
        case 'D':
            return "Completed"
        case 'P':
            return "Processing"
        default:
            return status
    }
}

export const getRefundPaymentType = (paymentType) => {
    switch ( paymentType) {
        case 'PAY_ONLINE':
            return "Online"
        case 'COSC':
            return "Cash On Collection"
        default:
            return paymentType
    }
}

export const getRefundOrderType = (orderType) => {
    switch (orderType) {
        case "LAB_ORDER":
            return "LabOrder"
        case "DOCTOR_CONSULTATION":
            return "DoctorConsultation"
        default:
            return "Membership"
    }
}