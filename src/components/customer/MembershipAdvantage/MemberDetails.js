import React, { useContext, useState } from "react";
import { getGenderString } from "../../../helpers/CommonHelper"
import Validate from "../../../helpers/Validate"
import { CustomerContext } from "../../Contexts/UserContext";
import { Input } from "reactstrap";
import { FloatingLabel, Form, FormGroup } from "react-bootstrap";
import { StackedImages } from "@medplus/react-common-components/DynamicForm";

export default ({ member, ...props }) => {
    const validate = Validate();
    const { subscription } = useContext(CustomerContext);
    const [documentType, setDocumentType] = useState((validate.isNotEmpty(member) && validate.isNotEmpty(member.kycs)) ? member.kycs[0].kycType : '');
    const [documentId, setDocumentId] = useState((validate.isNotEmpty(member) && validate.isNotEmpty(member.kycs)) ? member.kycs[0].attributes[0].attributeValue : '');
    const [images, setImages] = useState((validate.isNotEmpty(member) && validate.isNotEmpty(member.kycs) && validate.isNotEmpty(member.kycs[0]) && validate.isNotEmpty(member.kycs[0].imageFile)) ? member.kycs[0].imageFile.imageInfoList:[]);

    const handleKycTypeChange = (value) => {
        setDocumentType(value);
        if (validate.isNotEmpty(member.kycs)) {
            let kyc = member.kycs.filter(kyc => kyc.kycType == value)[0];
            if (validate.isNotEmpty(kyc)) {
                setDocumentId(kyc.attributes[0].attributeValue);
                if (validate.isNotEmpty(kyc.imageFile))
                    setImages(kyc.imageFile.imageInfoList);
            } else {
                setDocumentId('');
                setImages([]);
            }
        }
    }
    return <React.Fragment>
        {validate.isNotEmpty(member) &&
            <div>
                <div className="d-flex flex-wrap mb-3">
                    <div className="col-6 col-lg-4">
                        <label className="font-12 text-secondary">Name</label>
                        <p className="font-14  mb-0">
                            {member.patientName}
                        </p>
                        <p className="font-14 ">
                            Age - {member.age ? member.age : 0} Yrs / {getGenderString(member.gender)}
                        </p>
                    </div>

                    {validate.isNotEmpty(member.relationship) && <div className="col-6 col-lg-4">
                        <label className="font-12 text-secondary">Relationship</label>
                        <p className="font-14 mb-0">{member.relationship.name}</p>
                    </div>}

                    <div className="col-6 col-lg-4">
                        {validate.isNotEmpty(member.email) && <><label className="font-12 text-secondary">Email Id</label>
                            <p className="font-14 mb-0">{member.email}</p></>}
                    </div>

                </div>
                <div className="d-lg-flex">
                    <div className="col-12 col-lg-6">
                        <h4 className="h6 custom-fieldset mb-2 text-start">Document Type</h4>
                        <div className="d-flex mb-3">
                            <div className="d-flex gap-3">
                                {validate.isNotEmpty(subscription.kycTypes) && subscription.kycTypes.map(
                                    kycType => {
                                        return <FormGroup check>
                                            <Input type="radio" name="documentType" id={kycType.kycType} className="me-2" checked={kycType.kycType == documentType} onChange={(e) => { handleKycTypeChange(kycType.kycType) }} />
                                            <label htmlFor={kycType.kycType}>{kycType.kycName}</label>
                                        </FormGroup>
                                    }
                                )}
                            </div>
                        </div>
                        <div className="d-flex align-items-sm-end">
                            {validate.isNotEmpty(documentType) && <div className="col-6">
                                <h6 className="h6 custom-fieldset mb-2 text-start">Document ID</h6>
                                <div className="d-flex mb-3">
                                    <span >{validate.isNotEmpty(documentId) ? documentId : '--'}</span>
                                </div>
                            </div>}
                            {validate.isNotEmpty(images) &&
                                <div className="col-6">
                                    <div className="d-flex p-2">
                                        <StackedImages includeLightBox images={images} maxImages="4" />
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        }
    </React.Fragment>
}