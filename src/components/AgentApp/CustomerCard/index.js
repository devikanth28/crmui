import Validate from "../../../helpers/Validate";

export default (props) => {
    const {customer} = props;
    if(Validate().isEmpty(customer)){
        return <div></div>
    }
    return <div className="card border card-hover mb-3 p-12" >
        <div className="h-100">
            <div className="d-flex">
                <div className="flex-fill">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                            <div className="flex-column">
                                <p className="font-14  mb-0">
                                    {customer?.displayName}
                                </p>
                                <p className="font-12 text-secondary">
                                    {customer?.age && `${customer.age} Yrs/${customer.gender?`${customer.gender}`:`x`}`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="d-flex flex-wrap justify-content-between">
                            {customer.customerId && <div className="d-flex flex-column content-width mb-3">
                                <span className="font-12 text-secondary">MedPlus ID</span>
                                <span className="font-14">{customer.customerId}</span>
                            </div>}
                            {customer.mobile && <div className="d-flex flex-column content-width">
                                <span className="font-12 text-secondary">Mobile Number</span>
                                <span className="font-14">{customer.mobile}</span>
                            </div>}
                            {customer.email && <div className="d-flex flex-column">
                                <span className="font-12 text-secondary">Email ID</span>
                                <span className="font-14">{customer.email}</span>
                            </div>}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}