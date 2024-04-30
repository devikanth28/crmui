import { useEffect, useState } from "react";
import { getStaticContent } from "../../helpers/AgentAppHelper";
import Validate from "../../helpers/Validate";

const SubscriptionTnC=(props)=>{

    const {planId} = props.match.params;
    const [contentLoading,setContentLoading] = useState(undefined);
    const htmlData = undefined;
    const validate = Validate();

    useEffect(()=>{
        const {contentLoading,content} = getStaticContent("PLAN_"+planId);
        if(validate.isNotEmpty(content)){
            setContentLoading(contentLoading);
            htmlData = parseHtmlResponse(content?.TNC,props?.history);
        }
    },[])

    return(
        <div>
        {!contentLoading && htmlData ?
            <section>
                <div className="p-3 mb-4 bg-white">
                    <div>
                    <div dangerouslySetInnerHTML={{__html : htmlData}}></div>
                    </div>
                </div>
            </section>:<h1>No Data Found</h1>
        }
        </div>
    )
}
export default SubscriptionTnC;