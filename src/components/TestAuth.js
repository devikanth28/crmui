import React, { useEffect, useState } from "react";
import UserService from "../services/Common/UserService";
const TestAuth = (props)=> {

    const [customerData,setCustomerData] = useState(null);
    const [isLoading,setLoading] = useState(false);

    console.log(props);
    const userService = UserService();

    useEffect(()=> {
        (async()=>{
            setLoading(true);
            try{
            const customerId = props.match.params.customerId;
            const paramsObj={name:'rohith',age:23};
            const config={headers:{customerId:customerId},params:paramsObj};
            const response  =await userService.testAuth(config);
            console.log(response);
            // const {data,status}  =await  axios.get("/crm-api/getLocationDeliveryDetails",{headers:{customerId:26259247,role:'ADMIN'}});
           setCustomerData(response);
        }
        catch(err){
            console.log(err);
            if(err.response.status == 401){
                window.alert('UnAuthorized');
            }
            setCustomerData(null);
        }
        setLoading(false);
        })();
    },[])

    return(
    <React.Fragment>
       <h1>Testing auth </h1> 
       {isLoading &&<h2>Loading ....</h2>}
       {!isLoading && customerData && JSON.stringify(customerData)}
    </React.Fragment>)
}

export default TestAuth;