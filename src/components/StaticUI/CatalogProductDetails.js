import React ,{useContext,useRef,useState} from 'react'
import DataGridHelper from "../../helpers/DataGridHelper";
import DynamicGridHeight from "../Common/DynamicGridHeight";
import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import { BodyComponent, HeaderComponent } from '../Common/CommonStructure';
import NavTabs from '../Common/NavTabs';
import { TabContent, TabPane} from "reactstrap";
import CatalogDynamicForm from './CatalogDynamicForm';
import SuggestedProducts from './SuggestedProducts';
import MoleculeInfo from './CatalogMolecule';
import { UncontrolledTooltip } from 'reactstrap';
import CatalogLocationModel from './CatalogLocationModel';


const CatalogProductDetails=(props)=> {
    const productAlternatives = DataGridHelper().productAlternatives();
    const headerRef = useRef(null);
    const [tabId, setTabId] = useState('1')
    const[suggestedProductsflag,setSuggestedProductsflag]=useState(true);
    const [openlocationflag,setOpenlocationflag] =useState(false);
    const tabs=[
        "Domperidone",
        "Rabeprazole"
    ];
    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
    }
    const callBackMapping = {
        'renderStatusColumn' : renderStatusColumn
    }
    function renderStatusColumn(props){
        if(props.row.productDifference>0){
            return <div className='text-success'>{props.row.productDifference} %</div>
        } else{
            return <div className='text-red'>{props.row.productDifference} %</div>
        }
        
    }

    const productdetails=[
        {
            "productName" : "crocin",
            "productCompostition" : "paracetemol",
            "productManufacturer" : "cipla",
            "productForm" : "tablet",
            "productPacksize" : "10",
            "productMRP" : "79",
            "productDifference" : -33
        },
        {
            "productName" : "crocin",
            "productCompostition" : "paracetemol",
            "productManufacturer" : "cipla",
            "productForm" : "tablet",
            "productPacksize" : "10",
            "productMRP" : "79",
            "productDifference" : -33
        },
        {
            "productName" : "crocin",
            "productCompostition" : "paracetemol",
            "productManufacturer" : "cipla",
            "productForm" : "tablet",
            "productPacksize" : "10",
            "productMRP" : "79",
            "productDifference" : 33
        },
        {
            "productName" : "crocin",
            "productCompostition" : "paracetemol",
            "productManufacturer" : "cipla",
            "productForm" : "tablet",
            "productPacksize" : "10",
            "productMRP" : "79",
            "productDifference" : 33
        },
        {
            "productName" : "crocin",
            "productCompostition" : "paracetemol",
            "productManufacturer" : "cipla",
            "productForm" : "tablet",
            "productPacksize" : "10",
            "productMRP" : "79",
            "productDifference" : 33
        },
    ]
  return (
    <React.Fragment>
        <HeaderComponent ref={headerRef} className="d-flex align-items-center justify-content-between border-bottom p-12">
                                    <p className="mb-0 font-weight-bold" id='productIdtooltip'>Product ID - RAZO0004
                                    <UncontrolledTooltip placement="bottom" target={"productIdtooltip"}>        
                                    Product ID - RAZO0004    
                                    </UncontrolledTooltip>
                                    </p>
                                    
                                    <button type="button" class="btn btn-sm brand-secondary px-4 py-2">View MedPlus Advantage Plans</button>
                                </HeaderComponent>
                                {/* body section begins */}
                                <BodyComponent allRefs={{ headerRef}} className="body-height p-0">
                                    <div className="p-12">
                                        <div className="d-flex row g-3" >
                                            <div className='col'>
                                                <div className='row g-3'>
                                                    <div className="col-4">
                                                        <label className="font-12 text-secondary">Product / MFG Name</label>
                                                        <p className="mb-0 font-weight-bold text-truncate-2" id='productNametooltip'>Razo D Cap
                                                        <UncontrolledTooltip placement="bottom" target={"productNametooltip"}>        
                                                        Rapo D CAP
                                                    </UncontrolledTooltip>
                                                    </p>
                                                        <p className="mb-0 font-12 text-secondary">Dr Reddy Laboratories Ltd</p>
                                                    </div>
                                                    
                                                    <div className="col-5">
                                                        <label className="font-12 text-secondary">Composition</label>
                                                        <p className="mb-0 font-weight-bold text-truncate-2" id='compositionName'>Domperidone 30 MG+Rabeprazole 2</p>
                                                    </div>
                                                    <UncontrolledTooltip placement="bottom" target={"compositionName"}>        
                                                        Domperidone 30 MG+Rabeprazole 2
                                                    </UncontrolledTooltip>
                                                    <div className="col-3">
                                                        <label className="font-12 text-secondary">Drug Schedule</label>
                                                        <p className="mb-0 font-weight-bold text-red">H</p>
                                                    </div>
                                                    <div className="col-3">
                                                        <label className="font-12 text-secondary">Pack Size</label>
                                                        <p className="mb-0 font-weight-bold">10 Units / Pack</p>
                                                    </div>
                                                    <div  className="col-3">
                                                        <label className="font-12 text-secondary">MRP / Pack</label>
                                                        <p className="mb-0 font-weight-bold "><span className='rupee'>&#x20B9;</span>146.40</p>
                                                    </div>
                                                    <div  className="col-3">
                                                        <label className="font-12 text-secondary">Member Price</label>
                                                        <p className="mb-0 font-weight-bold "><span className='rupee'>&#x20B9;</span>39.40</p>
                                                    </div>
                                                    <div  className="col-3">
                                                        <label className="font-12 text-secondary">Regular Discount</label>
                                                        <p className="mb-0 font-weight-bold">20%</p>
                                                    </div>
                                                <div className="col-12">
                                                    <div className=''>
                                                    <CatalogDynamicForm ></CatalogDynamicForm>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                            {suggestedProductsflag && <div className='col-4'>
                                                <SuggestedProducts></SuggestedProducts>
                                            </div>}

                                        </div>
                                    </div>
                                    <hr className="border-style-dashed my-2"/>
                                    <div className="p-12">
                                        <div className="row g-0">
                                            <div className="col-4 pointer" onClick={()=>{setOpenlocationflag(!openlocationflag)}}>
                                                <div className="d-flex align-items-center p-12 border border-primary rounded">
                                                    <div className="me-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="11.564" height="16" viewBox="0 0 11.564 16"><g id="reset_black_icon_16px" transform="translate(-2.476 -1)"><g id="Group_34581" data-name="Group 34581" transform="translate(2.476 1)">
                                                            <path id="Union_130" data-name="Union 130" d="M.658,8.283a5.737,5.737,0,0,1,.909-6.62A5.626,5.626,0,0,1,5.719,0H5.88A5.613,5.613,0,0,1,10,1.662a5.738,5.738,0,0,1,.908,6.62A69.415,69.415,0,0,1,5.768,16,70.906,70.906,0,0,1,.658,8.283ZM2.32,2.38A4.693,4.693,0,0,0,1.58,7.8a60.9,60.9,0,0,0,4.191,6.457A59.581,59.581,0,0,0,9.985,7.8,4.7,4.7,0,0,0,9.244,2.38,4.507,4.507,0,0,0,5.88,1.04H5.719A4.494,4.494,0,0,0,2.32,2.38Zm.731,3.164a2.73,2.73,0,1,1,2.73,2.731A2.731,2.731,0,0,1,3.051,5.544Zm1.039,0A1.691,1.691,0,1,0,5.782,3.853,1.693,1.693,0,0,0,4.091,5.544Z" transform="translate(0)" fill="#080808"></path>
                                                            </g></g>
                                                        </svg>
                                                    </div>
                                                <div>
                                                <p class="mb-0 font-14">Also available at the</p><p class="mb-0 font-14">following stores near you</p>
                                            </div>
                                        </div>
                                    </div>
                                            <div class="col ms-3">
                                                <div class="d-flex align-items-center p-12 border border-success border rounded">
                                                    <div class="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15.998" viewBox="0 0 16 15.998">
                                                    <g id="reset_black_icon_16px" transform="translate(-2 -2)">
                                                    <path id="np_promotion_5208886_000000" d="M15.511,7.5a1.144,1.144,0,0,0-.615.2c-.18.1-.362.218-.535.337s-.338.238-.476.327a2.456,2.456,0,0,1-.251.138h-.285c-.163,0-.367-.025-.577-.042a5.393,5.393,0,0,0-.632-.027,1.1,1.1,0,0,0-.629.136,1.168,1.168,0,0,0-.438.479c-.107.176-.2.37-.292.56s-.176.376-.25.521c-.067.13-.138.232-.146.246s-.117.079-.246.146-.332.159-.521.25a6.284,6.284,0,0,0-.56.292,1.149,1.149,0,0,0-.476.435,1.163,1.163,0,0,0-.138.632c0,.205.021.423.027.632s.034.413.042.577v.285a1.183,1.183,0,0,1-.138.247c-.088.138-.207.306-.327.479s-.238.352-.337.532a1.171,1.171,0,0,0-.2.618,1.144,1.144,0,0,0,.2.615c.1.18.218.358.337.532s.238.342.327.479c.077.121.13.238.138.25a1.215,1.215,0,0,1,0,.285c0,.163-.025.367-.042.577a5.331,5.331,0,0,0-.027.629,1.107,1.107,0,0,0,.138.632,1.15,1.15,0,0,0,.476.435c.176.107.37.2.56.292s.376.178.521.254c.13.067.235.14.246.146s.079.115.146.243c.075.146.159.332.25.521a6.283,6.283,0,0,0,.292.56,1.173,1.173,0,0,0,.438.479,1.151,1.151,0,0,0,.629.138c.205,0,.423-.021.632-.027s.413-.034.577-.042h.285a2.53,2.53,0,0,1,.251.138c.138.088.3.207.476.327s.355.238.535.337a1.052,1.052,0,0,0,1.23,0c.18-.1.362-.218.535-.337s.338-.238.477-.327a2.457,2.457,0,0,1,.251-.138,1.177,1.177,0,0,1,.285,0c.163,0,.367.025.577.042a5.4,5.4,0,0,0,.632.027,1.094,1.094,0,0,0,.629-.138,1.161,1.161,0,0,0,.438-.479c.107-.176.2-.37.292-.56s.176-.376.25-.521a2.8,2.8,0,0,1,.146-.243c.021,0,.115-.079.246-.146.146-.075.332-.163.521-.254a6.284,6.284,0,0,0,.56-.292,1.066,1.066,0,0,0,.615-1.067c0-.205-.021-.419-.027-.629s-.034-.413-.042-.577v-.285a1.316,1.316,0,0,1,.138-.25c.088-.138.207-.306.327-.479s.238-.352.338-.532a1.057,1.057,0,0,0,0-1.233c-.1-.18-.218-.358-.338-.532s-.238-.342-.327-.479-.13-.235-.138-.247a1.22,1.22,0,0,1,0-.285c0-.163.025-.367.042-.577a5.4,5.4,0,0,0,.027-.632,1.107,1.107,0,0,0-.138-.632,1.151,1.151,0,0,0-.477-.435c-.176-.107-.37-.2-.56-.292s-.376-.176-.521-.25c-.13-.067-.234-.14-.246-.146s-.079-.117-.146-.246c-.075-.146-.159-.332-.25-.521a6.285,6.285,0,0,0-.292-.56,1.161,1.161,0,0,0-.438-.479,1.148,1.148,0,0,0-.629-.136c-.205,0-.423.021-.632.027s-.413.034-.577.042h-.285a2.529,2.529,0,0,1-.251-.138c-.138-.088-.3-.207-.477-.327s-.355-.238-.535-.337a1.159,1.159,0,0,0-.616-.2Zm0,.953c.032.021.094.032.163.069.126.069.286.174.452.288s.339.238.5.344a1.757,1.757,0,0,0,.514.254,1.72,1.72,0,0,0,.574.035c.195,0,.4-.027.6-.042a4.791,4.791,0,0,1,.539-.025c.077,0,.14.021.174.021a.854.854,0,0,1,.107.143c.074.124.159.294.247.477s.174.371.264.546a1.459,1.459,0,0,0,.8.8c.174.09.367.18.549.268s.353.171.476.247a.923.923,0,0,1,.143.107c0,.034.021.1.021.174a4.325,4.325,0,0,1-.025.539c-.021.2-.035.409-.046.6a2.017,2.017,0,0,0,.035.574,1.7,1.7,0,0,0,.257.514c.1.165.226.335.34.5s.223.329.292.455a1.036,1.036,0,0,1,.069.163c-.021.032-.032.092-.069.161-.069.126-.178.289-.292.455s-.235.339-.34.5a1.437,1.437,0,0,0-.293,1.088c0,.195.029.4.046.6a4.789,4.789,0,0,1,.025.539c0,.077-.021.14-.021.174a.854.854,0,0,1-.143.107c-.124.075-.294.159-.476.247s-.375.174-.549.264a1.72,1.72,0,0,0-.476.316,1.692,1.692,0,0,0-.32.479c-.09.174-.178.368-.264.549s-.171.353-.247.477a1,1,0,0,1-.107.143c-.034,0-.1.021-.174.021a4.324,4.324,0,0,1-.539-.025c-.2-.021-.409-.035-.6-.046a2.017,2.017,0,0,0-.574.035,1.7,1.7,0,0,0-.514.257c-.165.1-.338.226-.5.34s-.326.219-.452.288a1.3,1.3,0,0,1-.163.071c-.032-.021-.094-.034-.163-.071-.126-.069-.285-.174-.452-.288s-.339-.235-.5-.34a1.437,1.437,0,0,0-1.088-.293c-.195,0-.4.029-.6.046a4.789,4.789,0,0,1-.539.025c-.077,0-.14-.021-.174-.021a.854.854,0,0,1-.107-.143c-.075-.124-.159-.294-.247-.477s-.174-.375-.264-.549a1.719,1.719,0,0,0-.32-.479,1.686,1.686,0,0,0-.477-.316c-.174-.09-.367-.178-.549-.264s-.353-.171-.476-.247a.923.923,0,0,1-.143-.107c0-.034-.021-.1-.021-.174a4.325,4.325,0,0,1,.025-.539c.021-.2.035-.409.046-.6a2.017,2.017,0,0,0-.035-.574,1.7,1.7,0,0,0-.257-.514c-.107-.165-.226-.338-.34-.5s-.223-.329-.292-.455a1.131,1.131,0,0,1-.069-.161c.021-.032.032-.094.069-.163.069-.126.178-.289.292-.455s.235-.335.34-.5A1.437,1.437,0,0,0,9.455,13.3c0-.195-.029-.4-.046-.6a4.79,4.79,0,0,1-.025-.539c0-.077.021-.14.021-.174a.854.854,0,0,1,.143-.107c.124-.074.294-.159.476-.247s.375-.178.549-.268a1.457,1.457,0,0,0,.8-.8c.09-.174.178-.364.264-.546a5.322,5.322,0,0,1,.247-.477,1,1,0,0,1,.107-.143c.034,0,.1-.021.174-.021A4.325,4.325,0,0,1,12.7,9.4c.2.021.41.032.6.042a2.017,2.017,0,0,0,.574-.035,1.73,1.73,0,0,0,.514-.254c.165-.107.338-.23.5-.344s.326-.219.452-.288a.97.97,0,0,1,.163-.069Zm-2.244,3.236a1.571,1.571,0,1,0,1.113.458,1.569,1.569,0,0,0-1.113-.458Zm4.893.71h0a.435.435,0,0,0-.088,0,.473.473,0,0,0-.26.132L12.544,17.8h0a.471.471,0,1,0,.666.666L18.478,13.2a.472.472,0,0,0-.318-.8Zm-4.893.226a.635.635,0,1,1-.446.188.629.629,0,0,1,.446-.188Zm4.488,3.552a1.571,1.571,0,1,0,1.113.458,1.569,1.569,0,0,0-1.113-.458Zm0,.936a.635.635,0,1,1-.446.188.629.629,0,0,1,.446-.188Z" transform="translate(-5.512 -5.5)" fill="#080808"/>
                                                    </g>
                                                    </svg>
                                                        </div>
                                                        <div>
                                                            <p className='mb-0 font-14'>Get 10% off on orders up to  999.99</p>
                                                            <p className='mb-0 font-14'>Get 20% off on orders over 999.99</p>
                                                            </div></div></div></div>
                                    </div>
                                    <div className="p-12">
                                        <div className="border rounded p-3">
                                            <div>
                                                <p className="text-secondary mb-1">Delivery Information</p>
                                                <p className="mb-0">
                                                    <span>Ware house ID - <span className="font-weight-bold">INAPHYD00384</span></span>
                                                    <span className="mx-2 text-secondary">|</span>
                                                    <span>Available Quantity - <span className="font-weight-bold">290</span></span>
                                                    <span className="mx-2 text-secondary">|</span>
                                                    <span>Pick Up Time - <span className="font-weight-bold">Delivery By July 07,2023</span></span>
                                                </p>
                                            </div>
                                            </div>
                                                <p className="mb-1"><span className="text-danger font-12 ">**</span><span className="font-12 text-secondary">Delivery charges may apply</span></p>

                                    </div>
                                    <label class="d-block py-0 p-12 font-weight-bold custom-fieldset">Alternative Products</label>
                                    <div className='p-12'>
                                    <div className={`card mb-3 me-0 `}>
                                    <DynamicGridHeight id="ProductDetails" metaData={productAlternatives} dataSet={[...productdetails]} className="block-size-100">
                                        <CommonDataGrid {...productAlternatives} dataSet={[...productdetails]} callBackMap={callBackMapping}/>
                                    </DynamicGridHeight>
                                    </div>
                                    </div>
                                    <div>
                                        <label class="d-block py-0 p-12 font-weight-bold custom-fieldset">Product Information</label>
                                        <div className='p-12'>
                                        <div  className={`custom-tabs-forms d-flex pb-0 card`}>
                                        <NavTabs tabs={tabs} onTabChange={handleTabId}/>
                                        <TabContent activeTab={tabId}>
                                            <TabPane tabId="1">
                                                <div className='p-12 catalog-faq'>
                                                    <MoleculeInfo></MoleculeInfo>
                                                </div>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <div className='p-12 catalog-faq'>
                                                    <MoleculeInfo></MoleculeInfo>
                                                </div>
                                            </TabPane>

                                        </TabContent>
                                        </div>
                                        </div>

                                    </div>

                                    {openlocationflag && <CatalogLocationModel openlocationflag={openlocationflag} setOpenlocationflag={setOpenlocationflag} />}

                                </BodyComponent>

    </React.Fragment>
  )
}

export default CatalogProductDetails;