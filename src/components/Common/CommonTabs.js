import React, { useState } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from 'classnames';

function CommonTabs() {
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const toggle = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }
    return (
        <React.Fragment>
            <div className="border rounded crm-modal">
                <div className={`custom-tabs-forms   d-flex justify-content-between`}>
                    <Nav tabs className="">
                        <NavItem>
                            <NavLink className={classnames({ active: currentActiveTab === '1' })} onClick={() => { toggle('1'); }} >
                                Order Status
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: currentActiveTab === '2' })} onClick={() => { toggle('2'); }} >
                                Track Order
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: currentActiveTab === '3' })} onClick={() => { toggle('3'); }} >
                                Return Request
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <button className="btn btn-sm text-primary btn-light m-2">
                        <svg  className="me-3" id="ticket_black_icon_18px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <rect id="Rectangle_3652" data-name="Rectangle 3652" width="16" height="16" fill="none" />
                            <g id="ticket" transform="translate(0.5 1.214)">
                                <path id="Subtraction_50" data-name="Subtraction 50" d="M-2590.536-17225.637a.193.193,0,0,1-.177-.109l-2.778-2.5h-3.2a1.408,1.408,0,0,1-1.406-1.406v-3.021a3.221,3.221,0,0,0,.563-.094v3.115a.855.855,0,0,0,.844.844h3.305a.245.245,0,0,1,.173.074l2.393,2.141v-1.934a.3.3,0,0,1,.281-.281h2.5a.855.855,0,0,0,.844-.844v-5.762a.855.855,0,0,0-.844-.844h-7.059a3.254,3.254,0,0,0-.1-.562h7.163a1.408,1.408,0,0,1,1.406,1.406v5.8a1.408,1.408,0,0,1-1.406,1.406h-2.215v2.289a.276.276,0,0,1-.177.246A.127.127,0,0,1-2590.536-17225.637Zm.844-4.643h-3.729a.3.3,0,0,1-.277-.281.3.3,0,0,1,.277-.281h3.729a.305.305,0,0,1,.281.281A.305.305,0,0,1-2589.692-17230.279Zm0-1.969h-5.417a.269.269,0,0,1-.242-.281.305.305,0,0,1,.281-.281h5.378a.305.305,0,0,1,.281.281A.305.305,0,0,1-2589.692-17232.248Zm0-1.934h-5.417a.269.269,0,0,1-.242-.281.305.305,0,0,1,.281-.281h5.378a.305.305,0,0,1,.281.281A.305.305,0,0,1-2589.692-17234.182Z" transform="translate(2601.635 17239.213)" fill="#1c3ffd" />
                                <g id="Group_33186" data-name="Group 33186" transform="translate(0 0)">
                                    <g id="Group_33185" data-name="Group 33185" transform="translate(0 0)">
                                        <path id="Path_50477" data-name="Path 50477" d="M231.278,346.686a3.278,3.278,0,1,1,3.278-3.278A3.282,3.282,0,0,1,231.278,346.686Zm0-6.07a2.793,2.793,0,1,0,2.792,2.793A2.8,2.8,0,0,0,231.278,340.616Z" transform="translate(-228 -340.13)" fill="#1c3ffd" />
                                        <path id="Path_50478" data-name="Path 50478" d="M307.779,350.563a.242.242,0,0,1-.2-.1l-1.247-1.781a.243.243,0,0,1,.4-.278l1.247,1.781a.242.242,0,0,1-.06.338A.239.239,0,0,1,307.779,350.563Z" transform="translate(-304.178 -348.076)" fill="#1c3ffd" />
                                        <path id="Path_50479" data-name="Path 50479" d="M351.326,347.918a.242.242,0,0,1-.2-.1l-1.143-1.631a.243.243,0,1,1,.4-.278l1.143,1.631a.242.242,0,0,1-.06.338A.239.239,0,0,1,351.326,347.918Z" transform="translate(-346.652 -345.648)" fill="#1c3ffd" />
                                        <path id="Path_50480" data-name="Path 50480" d="M303.138,486.484a.24.24,0,0,1-.171-.071,1.277,1.277,0,0,0-1.8,0,.243.243,0,0,1-.343-.343,1.762,1.762,0,0,1,2.49,0,.243.243,0,0,1-.172.414Z" transform="translate(-298.787 -481.634)" fill="#1c3ffd" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                        Create Ticket
                    </button>
                </div>
                <TabContent activeTab={currentActiveTab} >
                    <TabPane tabId="1" className="h-100 p-3  ">
                        <div className="row m-0">
                            <div className="col-6">
                                <h5 class="modal-title mb-3">Order Status Details</h5>
                                <table class="table border">
                                    <thead>
                                        <tr className="table-light">
                                            <th scope="col">Status</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">UserName</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span class="badge-created badge rounded-pill">Created</span>
                                            </td>
                                            <td>23 Jan 2023 - 16:33</td>
                                            <td>Yelgoi Sandeep Guptha (O27728)</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge-created badge rounded-pill">Created</span>
                                            </td>
                                            <td>23 Jan 2023 - 16:33</td>
                                            <td>Yelgoi Sandeep Guptha (O27728)</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <div className="col-6">
                                <h5 class="modal-title mb-3">Order Status Details</h5>
                                <table class="table border">
                                    <thead>
                                        <tr className="table-light">
                                            <th scope="col">Status</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">UserName</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span class="badge-created badge rounded-pill">Created</span>
                                            </td>
                                            <td>23 Jan 2023 - 16:33</td>
                                            <td>Yelgoi Sandeep Guptha (O27728)</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge-created badge rounded-pill">Created</span>
                                            </td>
                                            <td>23 Jan 2023 - 16:33</td>
                                            <td>Yelgoi Sandeep Guptha (O27728)</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <div className="col-12">
                                <h5 class="modal-title mb-3">Order Location Details</h5>
                                <table class="table border">
                                    <thead>
                                        <tr className="table-light">
                                            <th scope="col">Location Lat/Long</th>
                                            <th scope="col">Config Id</th>
                                            <th scope="col">Hub Id</th>
                                            <th scope="col">Warehouse Id</th>
                                            <th scope="col">Pickstore Id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>17.4465872,78.3913768</td>
                                            <td>34044</td>
                                            <td>INAPHYD00457</td>
                                            <td>INAPHYD00457</td>
                                            <td>2INAPHYD00457</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tabId="2" className="h-100 p-3">
                        <div>Tab 2</div>
                    </TabPane>
                    <TabPane tabId="3" className="h-100 p-3">
                        <div>Tab 3</div>
                    </TabPane>
                </TabContent>
            </div>
        </React.Fragment>

    );
}

export default CommonTabs;
