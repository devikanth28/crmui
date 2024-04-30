import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import { useState } from "react";
import Validate from "../../../../helpers/Validate";
import { API_URL } from "../../../../services/ServiceConstants";

const NewDoctorRegistration = (props) => {
  const { helpers } = props;
  const [clinicName, setClinicName] = useState('');
  const setDoctorDetails = props.setDoctorDetails
  const validate = Validate();

  const handleQualificationChange = (payload) => {
    const event = payload[0];
    const input = event.target.value;
    if (input.trim() === '') {
      setDoctorDetails((prevDetails) => {
        const { qualification, ...updatedDetails } = prevDetails;
        return updatedDetails;
      });
    } else {
      setDoctorDetails((prevDetails) => ({
        ...prevDetails,
        qualification: input.trim(),
      }));
    }
  };

  const handleSpecializationChange = (payload) => {
    const event = payload[0];
    const input = event.target.value;
    if (input.trim() === '') {
      setDoctorDetails((prevDetails) => {
        const { specilization, ...updatedDetails } = prevDetails;
        return updatedDetails;
      });
    } else {
      setDoctorDetails((prevDetails) => ({
        ...prevDetails,
        specilization: input.trim(),
      }));
    }
  };

  const handleClinicNameChange = (payload) => {
    const event = payload[0];
    const input = event.target.value;

    setClinicName(input);

    setDoctorDetails((prevDetails) => {
      if (input.trim() === '') {
        const { clinicName, ...updatedDetails } = prevDetails;
        return updatedDetails;
      } else {
        return {
          ...prevDetails,
          clinicName: input.trim(),
        };
      }
    });

    if (input.trim().length > 0) {
      helpers.showElement("address");
      helpers.showElement("city");
      helpers.showElement("states");
      helpers.showElement("pincode");
    } else {
      helpers.hideElement("address");
      helpers.hideElement("city");
      helpers.hideElement("states");
      helpers.hideElement("pincode");
      helpers.updateValue('','address',false);
      helpers.updateValue('','city',false);
      helpers.updateValue(null,'states',false);
      helpers.updateValue('','pincode',false);
      setDoctorDetails((prevDetails) => {
        const { address, city, state, pincode, ...updatedDetails } = prevDetails;
        return updatedDetails;
      });
    }
  };


  const handleAddressChange = (payload) => {
    const event = payload[0];
    const input = event.target.value;

    setDoctorDetails((prevDetails) => {
      if (input.trim() === '') {
        const { address, ...updatedDetails } = prevDetails;
        return updatedDetails;
      } else {
        return {
          ...prevDetails,
          address: input.trim(),
        };
      }
    });
  };


  const handleCityChange = (payload) => {
    const event = payload[0];
    const input = event.target.value;

    setDoctorDetails((prevDetails) => {
      if (input.trim() === '') {
        const { city, ...updatedDetails } = prevDetails;
        return updatedDetails;
      } else {
        return {
          ...prevDetails,
          city: input.trim(),
        };
      }
    });
  };


  const updateValues = () => {
    if (validate.isEmpty(clinicName)) {
      helpers.hideElement("address");
      helpers.hideElement("city");
      helpers.hideElement("states");
      helpers.hideElement("pincode");
    } else {
      helpers.showElement("address");
      helpers.showElement("city");
      helpers.showElement("states");
      helpers.showElement("pincode");
    }
  };

  const onSelectState = (payload) => {
    const event = payload[0];
    const selectedState = event.target.value;

    setDoctorDetails((prevDetails) => {
      if (selectedState && selectedState.length > 0) {
        return {
          ...prevDetails,
          state: selectedState[0],
        };
      } else {
        const { state, ...updatedDetails } = prevDetails;
        return updatedDetails;
      }
    });
  };


  const handlePincodeChange = (payload) => {
    const event = payload[0];
    const input = event.target.value;
    if (input === "") {
      setDoctorDetails((prevDetails) => {
        const { pincode, ...updatedDetails } = prevDetails;
        return updatedDetails;
      });
      helpers.updateErrorMessage("", 'pincode');
      return;
    }
    if (/^[1-9][0-9]{5}$/.test(input)) {
      setDoctorDetails((prevDetails) => ({
        ...prevDetails,
        pincode: input,
      }));
      helpers.updateErrorMessage("", 'pincode');
    } else {
      setDoctorDetails((prevDetails) => {
        const { pincode, ...updatedDetails } = prevDetails;
        return updatedDetails;
      });
      helpers.updateErrorMessage("Invalid Pincode", 'pincode');
    }
  };

  const handleStateChange = (payload) => {
    const event = payload[0];
    const input = event.target.value;
    const states = helpers.getHtmlElement("states")?.values?.map((state) => state.displayValue);
  
    if (input === "" || !states.includes(input)) {
      setDoctorDetails((prevDetails) => {
        const { state, ...updatedDetails } = prevDetails;
        return updatedDetails;
      });
    } else {
      setDoctorDetails((prevDetails) => ({
        ...prevDetails,
        state: input.trim(),
      }));
    }
  };


  const observersMap = {
    doctorRegistrationForm: [["load", updateValues]],
    qualification: [["change", handleQualificationChange]],
    specialization: [["change", handleSpecializationChange]],
    clinicName: [["change", handleClinicNameChange]],
    address: [["change", handleAddressChange]],
    city: [["change", handleCityChange]],
    states: [["select", onSelectState], ["change",handleStateChange]],
    pincode: [["change", handlePincodeChange]],
  };

  return (
    <>
      <DynamicForm requestUrl={`${API_URL}getDoctorRegistrationForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />
    </>
  );
};

export default withFormHoc(NewDoctorRegistration);
