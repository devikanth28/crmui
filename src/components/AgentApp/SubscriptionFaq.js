import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import React, { useEffect, useState } from "react";
import { UncontrolledCollapse } from 'reactstrap';
import { getStaticContent, parseHtmlResponse } from "../../helpers/AgentAppHelper";
import Validate from "../../helpers/Validate";

const SubscriptionFaq=(props)=>{
    const {planId} = props.match.params;
    const validate = Validate();
    const [keysList, setKeysList] = useState([]);
    const [paragraph,setParagraph] = useState(null);
    const [staticContent, setStaticContent] = useState(undefined);
    const [contentLoading, setContentLoading] = useState(undefined);

    useEffect(() =>{
        const {contentLoading,content} = getStaticContent("PLAN_"+planId);
        if(validate.isEmpty(content)){
            setContentLoading(false);
        }
        setStaticContent(content);
        setContentLoading(contentLoading);
    }, [])

    useEffect(() =>{
        getFaqContent();
    }, [staticContent,contentLoading])

    const getFaqContent =()=>{
        if(staticContent && staticContent.FAQ) {
            parseFaqContent(staticContent.FAQ);
        }
    }

    const parseFaqContent = (faqContent) => {
        let parser = new DOMParser()
        let faqHtml= parser.parseFromString(faqContent, 'text/html');
        let questions =faqHtml.getElementsByTagName('section');
        let paragraph = faqHtml.getElementsByClassName('question-container');
        setParagraph(validate.isNotEmpty(paragraph)?paragraph:null);
        setKeysList([...questions]); 
    }

    const getDisplayContent = () =>{
        if(validate.isEmpty(paragraph) || (validate.isNotEmpty(paragraph) && validate.isEmpty(paragraph[0]?.children))){
            return false;
        }
        return paragraph[0]?.children[0]?.tagName==='SPAN';
    }

    return (
        <React.Fragment>
            {!contentLoading && keysList.length == 0 && <section className="shadow-none text-center">
                <div className="div-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                        <g id="No_Data_Found" data-name="No Data Found" transform="translate(-1018 -4181)" clip-path="url(#clip-path)">
                            <g id="No_Data_Found-2" data-name="No Data Found" transform="translate(145.001 82)">
                                <g id="No_Health_Records" data-name="No Health Records" transform="translate(875.998 4099)">
                                    <path id="Union_124" data-name="Union 124" d="M132.061-3852.314,124-3860.382a12.1,12.1,0,0,1-12.075.456H91.251a.7.7,0,0,1-.7-.7h0v-4.534H85.272a.7.7,0,0,1-.7-.7v-4.371H79.031a.7.7,0,0,1-.7-.7V-3914.8a.7.7,0,0,1,.7-.705h31.643a.7.7,0,0,1,.7.7h0v4.37h5.538a.7.7,0,0,1,.705.7h0v7.7a.737.737,0,0,1-.031.148l5.726,5.785a.705.705,0,0,1,.294.57c0,.024-.012.045-.014.071v14.122a12.154,12.154,0,0,1,4.6,16.561c-.088.157-.181.312-.277.465l8.066,8.066a2.726,2.726,0,0,1,.1,3.76.6.6,0,0,1-.046.071l-.1.1a2.745,2.745,0,0,1-3.883,0h0Zm-6.9-8.887,7.892,7.892a1.379,1.379,0,0,0,1.9,0l.043-.045a1.337,1.337,0,0,0,0-1.892l0,0-7.892-7.893a12.213,12.213,0,0,1-1.939,1.943Zm-18.394-9.535a10.8,10.8,0,0,0,10.8,10.8,10.8,10.8,0,0,0,10.8-10.8,10.8,10.8,0,0,0-10.8-10.8,10.81,10.81,0,0,0-10.8,10.8Zm-14.812,9.4H109.8a12.2,12.2,0,0,1-1.659-17.168,12.2,12.2,0,0,1,14.053-3.524v-12.8h-8.174a.7.7,0,0,1-.7-.7v-8.266H91.958Zm-5.977-9.61v4.373H90.55v-37.919a.7.7,0,0,1,.705-.7h22.763c.016,0,.029.007.042.007a.726.726,0,0,1,.188.038c.021.009.045.015.066.024a.692.692,0,0,1,.195.133.008.008,0,0,1,.007,0h0l1.7,1.715v-5.753H85.979Zm-6.243-.7h4.836v-38.085a.7.7,0,0,1,.7-.7h24.7v-3.665H79.738Zm34.983-24.584h6.487l-6.487-6.553Zm-6.1,25.491a8.952,8.952,0,0,1,8.953-8.951,8.952,8.952,0,0,1,8.951,8.953,8.952,8.952,0,0,1-8.951,8.951,8.963,8.963,0,0,1-8.956-8.953Zm1.407,0a7.545,7.545,0,0,0,7.546,7.546,7.545,7.545,0,0,0,7.546-7.546,7.545,7.545,0,0,0-7.546-7.546h0a7.558,7.558,0,0,0-7.549,7.546Zm-15.167,3.057a.7.7,0,0,1-.69-.717.7.7,0,0,1,.69-.69h7.428a.7.7,0,0,1,.717.69.7.7,0,0,1-.689.717H94.857Zm0-7.895a.7.7,0,0,1-.7-.7.7.7,0,0,1,.7-.7h10.425a.7.7,0,0,1,.7.7.7.7,0,0,1-.7.7Zm0-7.823a.7.7,0,0,1-.716-.69.7.7,0,0,1,.69-.715h19.632a.7.7,0,0,1,.689.715.7.7,0,0,1-.689.69Zm0-5.276a.7.7,0,0,1-.7-.7v-10.634a.706.706,0,0,1,.7-.705h8.737a.7.7,0,0,1,.7.705v10.637a.7.7,0,0,1-.7.7Zm.7-1.405h7.33v-9.229h-7.33Z" transform="translate(-78.329 3915.503)" fill="#cecece" />
                                </g>
                                <path id="Path_42895" data-name="Path 42895" d="M493.725,597.291a.542.542,0,0,0-.762,0l-2.364,2.364-2.364-2.364a.539.539,0,0,0-.762.762l2.364,2.371-2.364,2.364a.542.542,0,0,0,0,.762.538.538,0,0,0,.762,0l2.364-2.364,2.364,2.364a.538.538,0,0,0,.762,0,.542.542,0,0,0,0-.762l-2.364-2.364,2.364-2.371a.542.542,0,0,0,0-.762Z" transform="translate(424.799 3543.105)" fill="#cecece" />
                            </g>
                        </g>
                    </svg>
                    <h5 className="mt-2 font-weight-bold">No Data Found</h5>
                </div>
            </section>}
            {!contentLoading && keysList.length > 0 && <section className="shadow-none p-3 my-2 bg-white">
                {getDisplayContent() && <span dangerouslySetInnerHTML={{ __html: paragraph[0]?.children[0]?.innerHTML }} className="font-14 text-secondary"></span>}
                <div className="question-container newquestion-container">
                    {keysList.map((value, index) => {
                        return <FaqStructure faq={value} index={index} history={props?.history} />
                    })}
                </div>
            </section>}
            {contentLoading && 
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" />
                </div>
            }
        </React.Fragment>
    )
}
export default SubscriptionFaq;

const FaqStructure = (props) => {
    const { faq, index } = props;
    const faqtext = faq.firstElementChild.innerText;
    const answertext = parseHtmlResponse(faq.children[1].innerHTML, props?.history);
    const events = ['click'];
    const [openedSections, setOpenedSections] = useState([]);
    const handleClick = e => {
        let id = e.target.id;
        if(openedSections.indexOf(id) === -1){
            let tempArray = [...openedSections];
            tempArray.push(id);
            setOpenedSections(tempArray);
        }else{
            let tempArray = openedSections.filter(each => each !== id);
            setOpenedSections(tempArray);
        }
    }

    let newElem = <section className="shadow-none">
        <a id={'answer' + index}  onClick={(e) => handleClick(e)} title="Click to open answer">
            {faqtext}
            <span>
                <svg className={ openedSections.indexOf('answer'+index) !== -1 ? "collapse-arrow rotate-bottom" : "collapse-arrow rotate-up"} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <g transform="translate(-762 -906.838)">
                        <rect fill="none" width="18" height="18" transform="translate(762 906.838)" />
                        <path fill="#080808" d="M61.559,501.985l4.049-4.049a.917.917,0,0,0-1.3-1.3l-3.4,3.39-3.4-3.4a.921.921,0,0,0-1.569.649.912.912,0,0,0,.272.649l4.049,4.059A.922.922,0,0,0,61.559,501.985Z" transform="translate(710.032 416.557)" />
                    </g>
                </svg>
            </span>
        </a>
        <UncontrolledCollapse toggler={'#answer' + index} toggleEvents={events}>
            <div className="faq-answer" dangerouslySetInnerHTML={{ __html: answertext }} />
        </UncontrolledCollapse>
    </section>
    return newElem
}