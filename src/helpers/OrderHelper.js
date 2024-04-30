import Validate from "./Validate";

const OrderHelper = () => {

    const getStatusWithFirstLetterCapitalized = (status) => {
        if(Validate().isEmpty(status)){
            return "";
        }
        if(status==="Processing(TO  Approved)"){
            return status;
        }
        if(status==="PartiallyDecoded"){
            return "Partially Decoded";
        }
        let modifiedStatus = status;
        if(status.includes("_")){
            modifiedStatus = status.split("_")[0]+" "+status.split("_")[1]
        }
        return modifiedStatus.toLowerCase()[0].toUpperCase() + modifiedStatus.slice(1).toLowerCase();
    }

    const getBadgeColorClassForStatus = (status) => {
        const finishedStatus = ["approved", "delivered", "invoiced", "paid", "done", "closed", "success", "active", "invoiced", "vaccinated", "processing(to  approved)", "shipment approved", "order delivered", "already subscribed","payment_done","succeed"];
        const pendingStatus = ["pending", "unpaid", "open", "waiting", "awaited", "edited", "hold", "shipment edited", "out for delivery", "received at store","payment_pending","out of stock"];
        const rejectedStatus = ["rejected", "failed", "failure", "inactive", "shipment rejected", "shipment returned", "shipment failed", "shipment undelivered","order_withdrawn"];
        const cancelledStatus = ["cancelled", "cancel", "shipment canceled", "force canceled","order_cancelled","failed"]
        const createdStatus = ["created"]
        let badgeColorClass = "badge-created";
        if(Validate().isEmpty(status)){
            return badgeColorClass;
        }
        if("INITIATED"==status){
            return "badge bg-info";
        }
        if(createdStatus.includes(status.toLowerCase())){
            badgeColorClass = badgeColorClass;
        }
        if(finishedStatus.includes(status.toLowerCase())){
            badgeColorClass = "badge-approved";
        }

        if(pendingStatus.includes(status.toLowerCase())){
            badgeColorClass = "badge-pending";
        }

        if(cancelledStatus.includes(status.toLowerCase())){
            badgeColorClass = "badge-Cancelled";
        }

        if(rejectedStatus.includes(status.toLowerCase())){
            badgeColorClass = "badge-rejected";
        }

        if(status.toLowerCase().includes("decoded")){
            badgeColorClass = "badge-Decoded";
        }
        if(status.toLowerCase().includes("partiallydecoded")){
            badgeColorClass = "badge-PartiallyDecoded";
        }
        
        return badgeColorClass;
    }

    const getOrderDisplayStatus = (status) => {
        let orderDisplayStatus = "";
        switch (status) {
            case "I":
                orderDisplayStatus = "Created";
                break;
            case "A":
                orderDisplayStatus = "Approved";
                break;
            case "E":
                orderDisplayStatus = "Edited";
                break;
            case "C":
                orderDisplayStatus = "Cancelled";
                break;
            case "D":
                orderDisplayStatus = "Invoiced";
                break;
            case "SA":
                orderDisplayStatus = "Shipment Approved";
                break;
            case "SW":
                orderDisplayStatus = "Shipment Returned";
                break;
            case "SR":
                orderDisplayStatus = "Shipment Rejected";
                break;
            case "SD":
                orderDisplayStatus = "Order Delivered";
                break;
            case "T":
                orderDisplayStatus = "Received At Store";
                break;
            case "M":
                orderDisplayStatus = "Processing(TO  Approved)";
                break;
            case "X":
                orderDisplayStatus = "Force Canceled";
                break;
            case "SI":
                orderDisplayStatus = "Shipment Created";
                break;
            case "SU":
                orderDisplayStatus = "Shipment Undelivered";
                break;
            default:
                orderDisplayStatus = status;
        }
        return orderDisplayStatus;
    }

    const getShipmentDisplayStatus = (status) => {
        let shipmentDisplayStatus = "";
        switch (status) {
            case "I":
                shipmentDisplayStatus = "Created";
                break;
            case "A":
                shipmentDisplayStatus = "Approved";
                break;
            case "C":
                shipmentDisplayStatus = "Cancelled";
                break;
            case "R":
                shipmentDisplayStatus = "Rejected";
                break;
            case "W":
                shipmentDisplayStatus = "Returned";
                break;
            case "D":
                shipmentDisplayStatus = "Delivered";
                break;
            case "O":
                shipmentDisplayStatus = "Out for delivery";
                break;
            case "U":
                shipmentDisplayStatus = "UnDelivered";
                break;
            default:
                shipmentDisplayStatus = status;
        }
        return shipmentDisplayStatus;
    }

    const getProductDisplayStatus = (productStatus, orderStatus) => {
        let productDisplayStatus = "";
        switch (productStatus) {
            case "I":
                productDisplayStatus = "Created";
                break;

            case "A":
                productDisplayStatus = "Approved";
                break;

            case "C":
                productDisplayStatus = "Cancelled";
                break;

            case "E":
                productDisplayStatus = "Edited";
                break;

            case "T":
                productDisplayStatus = "Received At Store";
                break;

            case "M":
                productDisplayStatus = "Processing";
                break;

            case "D":
                if (productStatus === orderStatus) {
                    productDisplayStatus = "Invoiced";
                } else {
                    productDisplayStatus = getOrderDisplayStatus(orderStatus);
                }
                break;

            default:
                productDisplayStatus = orderStatus;
                break;
        }
        return productDisplayStatus;
    }

    const getPaymentMode = (status) => {
        let paymentMode = "";
        switch (status) {
        case "CC":
            paymentMode = "Credit Card";
            break;
        case "DC":
            paymentMode = "Debit Card";
            break;
        case "PPI":
            paymentMode = "Paytm Wallet";
            break;
        case "PPE":
            paymentMode = "Phonpe";
            break;
        case "PPES":
            paymentMode = "Phonpe";
            break;
        case "NB":
            paymentMode = "Net Banking";
            break;
        case "dd":
            paymentMode = "Demand Draft";
            break;
        case "PB":
            paymentMode = "PayBack Points";
            break;
        case "None":
            paymentMode = "None";
            break;
        default:
            paymentMode=status;
        }
        return paymentMode;
    }

    return Object.freeze({
        getStatusWithFirstLetterCapitalized,
        getBadgeColorClassForStatus,
        getOrderDisplayStatus,
        getShipmentDisplayStatus,
        getProductDisplayStatus,
        getPaymentMode
    });

}

export default OrderHelper;