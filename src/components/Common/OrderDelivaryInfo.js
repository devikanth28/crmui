import React from 'react'
import edit_icon from '../../images/edit_icon.svg';
import { Button } from 'react-bootstrap';
import add_icon from '../../images/add-icn-16.svg';
const OrderDelivaryInfo = () => {
  return (
    <div className='card mb-3'>
                        <div className='p-3 border-bottom'>
                            <h4 className='fs-6'>Delivary & Order Information</h4>
                            <p className="mb-0">Expected Delivery Date - <span className='text-success'>24 Jan 2023</span></p>
                        </div>
                        <div className='p-3 border-bottom'>
                            <div className='d-flex justify-content-between'>
                                <p className='text-secondary small'>Customer Details</p>
                                <div>
                                <Button variant="light" className='me-2'><img src={add_icon} alt="add Order Details"/></Button>
                                <Button variant='light'><img src={edit_icon} alt="edit customer details" /></Button>
                                </div>
                            </div>
                            <div>
                                <h6 className='mb-2 font-12'>Shiva Krishna Reddy</h6>
                                <address>
                                    <small className='text-secondary'>Lodha Building <br />#14, Gachibowli, Hyderabad - 500075 <br />Ph.no - <a href="tel:+7730946373" title="Contact Us" className='text-decoration-none'>7730946373 </a> | Email -<a href="mailto:abcd17@gmail.com" title='Feel free to wright us' classname="text-decoration-none">abcd17@gmail.com</a> </small>
                                </address>
                            </div>
                            <div>
                                <p className='text-secondary small'>Patient Details</p>
                                <h6 className='mb-2 font-14'>Shiva Krishna Reddy</h6>
                                <p className='font-12 fw-normal'>Age 12 Years / Male</p>
                            </div>
                            <hr style={{ "border": "1px dashed" }} />
                            <div>
                                <p className='text-secondary small mb-2'>Doctor Details</p>
                                <h6 className='mb-2 font-14'>Shiva Krishna Reddy</h6>
                                <hr style={{ "border": "1px dashed" }} />
                            </div>
                            <div class="input-group custom-file-button ">
                                <div class="form-floating"><input aria-label="file input" type="text" id="Select SMS" class="form-control form-control-sm" value="Customer is not reachable/responding" /><span></span><label for="Select SMS">Select SMS</label></div>
                                <label class="input-group-text uploadAction" for="inputGroupFile">
                                    <svg xmlns="http://www.w3.org/2000/svg" id="sms_black_icon_18px" width="18" height="18" viewBox="0 0 18 18">
                                        <rect id="Rectangle_3652" data-name="Rectangle 3652" width="18" height="18" fill="none" />
                                        <g id="sms-icn" transform="translate(2 2)">
                                            <path id="Path_50458" data-name="Path 50458" d="M303.613,315.517a.158.158,0,0,0,.129-.043.323.323,0,0,0,.215-.3v-2.792h2.705a1.723,1.723,0,0,0,1.718-1.718v-7.086a1.723,1.723,0,0,0-1.718-1.718H296.1a1.723,1.723,0,0,0-1.718,1.718v7.043a1.723,1.723,0,0,0,1.718,1.718h3.908l3.393,3.049a.236.236,0,0,0,.215.129Zm3.049-12.969a1.045,1.045,0,0,1,1.031,1.031v7.043a1.045,1.045,0,0,1-1.031,1.031h-3.049a.369.369,0,0,0-.344.344v2.362l-2.92-2.62a.328.328,0,0,0-.215-.086H296.1a1.045,1.045,0,0,1-1.031-1.031v-7.043a1.045,1.045,0,0,1,1.031-1.031Z" transform="translate(-294.38 -301.86)" fill="#11b094" />
                                            <path id="Path_50459" data-name="Path 50459" d="M442.8,413.187h6.614a.344.344,0,0,0,0-.687h-6.571a.369.369,0,0,0-.344.344.332.332,0,0,0,.3.344Z" transform="translate(-439.15 -409.966)" fill="#11b094" />
                                            <path id="Path_50460" data-name="Path 50460" d="M442.8,516.307h6.614a.344.344,0,1,0,0-.687h-6.571a.369.369,0,0,0-.344.344.332.332,0,0,0,.3.344Z" transform="translate(-439.15 -510.724)" fill="#11b094" />
                                            <path id="Path_50461" data-name="Path 50461" d="M442.844,621.307H447.4a.344.344,0,0,0,0-.687h-4.552a.344.344,0,1,0,0,.687Z" transform="translate(-437.132 -613.319)" fill="#11b094" />
                                        </g>
                                    </svg>
                                    <span class="ms-2 font-14" style={{ "color": "#11b094" }}>Send</span>
                                </label>
                            </div>
                        </div>
                        <div className='p-3'>
                            <div className='d-flex justify-content-between'>
                                <p className='text-secondary mb-0 font-12'>Order Status</p>
                                <p className='text-secondary mb-0 font-12'>Order Date</p>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <span className="badge-pending badge rounded-5" size="sm" >
                                    Payment Confirmation Awaited
                                </span>
                                <p className='font-14 mb-1'>23 Jan 2023</p>
                            </div>
                            <small className='text-secondary'>Pick Store</small>
                            <p className='font-12'>INTGHYD00646 - MEDPLUS GACHIBOWLI TELECOM NAGAR</p>
                            <hr style={{ "border": "1px dashed" }} />
                            <div className='d-flex align-items-center'>
                                <p className='text-primary flex-grow-1 pointer mb-0'>Send to Doctor</p>
                                <Button className="rounded-1  px-3 brand-secondary" variant="light">
                                    Cancel
                                </Button>
                                <Button variant="success" className='ms-2'>Approve Order</Button>
                            </div>
                        </div>
                    </div>
  )
}

export default OrderDelivaryInfo