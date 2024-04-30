const reasons = [
    {id:0,reason:"Select Reason"},
    
    {id:1,group:"Stores",reason:"Timings"},
    {id:2,group:"Stores",reason:"Phone Nos"},
    {id:3,group:"Stores",reason:"Location"},
    {id:4,group:"Stores",reason:"Suggestions"},
    {id:5,group:"Stores",reason:"General Products"},
    {id:6,group:"Stores",reason:"Others"},
    
    {id:7,group:"Medicines",reason:"Medicine Availability"},
    {id:8,group:"Medicines",reason:"Alternative Medicines"},
    {id:9,group:"Medicines",reason:"Medicine Prices/ Discounts"},
    {id:10,group:"Medicines",reason:"Medicine details/ Composition"},
    {id:11,group:"Medicines",reason:"How to use Medicine/ General Products"},
    {id:12,group:"Medicines",reason:"New Product"},
    {id:12,group:"Medicines",reason:"Others"},

    {id:13,group:"Order",reason:"Sale Order"},
    {id:14,group:"Order",reason:"Order Status"},
    {id:15,group:"Order",reason:"Edit Order"},
    {id:16,group:"Order",reason:"Cancel Order"},
    {id:17,group:"Order",reason:"Prescriptions Uploaded"},  
    {id:18,group:"Order",reason:"Additional Discount"},
    {id:19,group:"Order",reason:"Regarding old Order details"},
    {id:20,group:"Order",reason:"Others"},

    {id:21,group:"Complaints",reason:"Bad Service/ Behaviour by staff"},
    {id:22,group:"Complaints",reason:"Bad Infra at Store"},
    {id:23,group:"Complaints",reason:"Do Not Disturb/ Call"},
    {id:24,group:"Complaints",reason:"Exchange/ Return of product"},
    {id:25,group:"Complaints",reason:"MRP Difference"},
    {id:26,group:"Complaints",reason:"Forgot to collect the balance after paying the bill"},
    {id:27,group:"Complaints",reason:"Faulty/ Damaged product"},
    {id:28,group:"Complaints",reason:"Delivery Complaint"},
    {id:29,group:"Complaints",reason:"Credit/ Debit Card issues"},
    {id:30,group:"Complaints",reason:"Bill Not issued"},
    {id:31,group:"Complaints",reason:"Duplicate Bill"},
    {id:32,group:"Complaints",reason:"Loose Tablets"},
    {id:33,group:"Complaints",reason:"Wrong medicines/ substitutes"},
    {id:34,group:"Complaints",reason:"System Billing"},
    {id:35,group:"Complaints",reason:"Not getting any offers/ promotions/ discounts"},
    {id:36,group:"Complaints",reason:"Ritecheck Glucometes n BP meter"},
    {id:37,group:"Complaints",reason:"Non-availability of products"},
    {id:38,group:"Complaints",reason:"Gift Complaints"},
    {id:39,group:"Complaints",reason:"Points Blocked"},
    {id:40,group:"Complaints",reason:"Expiry Product"},
    {id:41,group:"Complaints",reason:"Non-Availability"},
    {id:42,group:"Complaints",reason:"Not Working/Damaged"},
    {id:43,group:"Complaints",reason:"Medicine Details"},
    {id:44,group:"Complaints",reason:"Points Blocked-ID Verifiction"},
    {id:45,group:"Complaints",reason:"Points Blocked-Phone Verification"},
    {id:46,group:"Complaints",reason:"Points Blocked-Staff ID"},
    {id:47,group:"Complaints",reason:"Points Blocked-Staff Used Cust ID"},
    {id:49,group:"Complaints",reason:"Others"},

    {id:50,group:"Lab",reason:"Tech No"},
    {id:51,group:"Lab",reason:"Clinic No"},
    {id:52,group:"Lab",reason:"Clinic/ Path Lab Locations"},
    {id:53,group:"Lab",reason:"Path lab Camps"},
    {id:54,group:"Lab",reason:"Test Details"},
    {id:55,group:"Lab",reason:"Test Booking"},
    {id:56,group:"Lab",reason:"No Response from Lab Tech when customer calls"},
    {id:57,group:"Lab",reason:"Technician Late/ unavailable at the Centre"},
    {id:58,group:"Lab",reason:"Report Status"},
    {id:59,group:"Lab",reason:"Delay in Reports"},
    {id:60,group:"Lab",reason:"Wrong Reports"},
    {id:61,group:"Lab",reason:"Clinic/Report Queries/Centres"},
    {id:62,group:"Lab",reason:"Booked But No Tech Update"},
    {id:63,group:"Lab",reason:"No Collection Center"},
    {id:64,group:"Lab",reason:"Others"},

    {id:65,group:"Bio Updation",reason:"Create New Cust Id"},
    {id:66,group:"Bio Updation",reason:"Mobile/ Phone no update"},
    {id:67,group:"Bio Updation",reason:"Address Update"},
    {id:68,group:"Bio Updation",reason:"Shipping/ Delivery Address Update"},
    {id:69,group:"Bio Updation",reason:"Name Update"},
    {id:70,group:"Bio Updation",reason:"DOB Update"},
    {id:71,group:"Bio Updation",reason:"Email Update"},
    {id:72,group:"Bio Updation",reason:"Others"},

    {id:73,group:"Redemption",reason:"Gift Booking"},
    {id:74,group:"Redemption",reason:"Status on Gift (Arrangement)"},
    {id:75,group:"Redemption",reason:"Customer wants medicines for VPP"},
    {id:76,group:"Redemption",reason:"Points Missing"},
    {id:77,group:"Redemption",reason:"Gift Not Redeemed"},
    {id:78,group:"Redemption",reason:"Exchange - Points Not Added"},
    {id:79,group:"Redemption",reason:"General (points/ Gifts)"},
    {id:80,group:"Redemption",reason:"Points accumulated before set date"},
    {id:81,group:"Redemption",reason:"Points not Added"},
    {id:82,group:"Redemption",reason:"Points Added as Mis-used"},
    {id:83,group:"Redemption",reason:"Points not added due to exchange for medicines"},
    {id:84,group:"Redemption",reason:"Extra points Added"},
    {id:85,group:"Redemption",reason:"Extra points Removed"},
    {id:86,group:"Redemption",reason:"Block"},
    {id:87,group:"Redemption",reason:"UnBlock"},
    {id:88,group:"Redemption",reason:"Customer Order"},
    {id:89,group:"Redemption",reason:"Non-Availability"},
    {id:90,group:"Redemption",reason:"Others"},
    

    {id:91,group:"Promotions",reason:"Paper Advertisement"},
    {id:92,group:"Promotions",reason:"Pamphlets"},
    {id:93,group:"Promotions",reason:"SMS"},
    {id:94,group:"Promotions",reason:"Call Center"},
    {id:95,group:"Promotions",reason:"Others"},

    {id:96,group:"Proactive",reason:"Revenue Generation"},
    {id:97,group:"Proactive",reason:"Fraud Check"},
    {id:98,group:"Proactive",reason:"Redemption Calls  (Y)"},
    {id:99,group:"Proactive",reason:"Redemption Calls  (N)"},
    {id:100,group:"Proactive",reason:"Redemption Calls  (N-A)"},
    {id:101,group:"Proactive",reason:"Others"},

    {id:102,group:"Appreciation",reason:"Store Staff"},
    {id:103,group:"Appreciation",reason:"Call Center Staff"},
    {id:104,group:"Appreciation",reason:"Order Delivery"},
    {id:105,group:"Appreciation",reason:"Products"},
    {id:106,group:"Appreciation",reason:"Redemption"},
    {id:107,group:"Appreciation",reason:"Others"},
    
    {id:108,group:"MwalletRefund",reason:"Document Verification"},
    {id:108,group:"MwalletRefund",reason:"Others"}
  ]; 
  
 /* const sampleData = [{"categoryName":"Men","children":[{"categoryName":"Apparel","categoryValue":"Men:Apparel"},{"categoryName":"Fragrances","categoryId":2746}]}

  ,{"categoryName":"Women","children":[{"categoryName":"Apparel","categoryId":2742},{"categoryName":"Fragrances","categoryId":2746}]}] */

  var sampleData=[];
  function dataFormChange(reasons){
    
    var categoryName="";
    var childrenList={}
    var children=[];
    for(let reasonIndex in reasons){
        if(reasons[reasonIndex].group==categoryName)
        {
        var eachReason={};
            
            categoryName=reasons[reasonIndex].group;
            eachReason["eachReason"]=reasons[reasonIndex].reason;
            eachReason["fullReason"]=reasons[reasonIndex].group+" : "+reasons[reasonIndex].reason
            children.push(eachReason);
            if(childrenList["categoryName"]==categoryName)
            childrenList["children"]=children;
        }
        else{
            childrenList["categoryName"]=reasons[reasonIndex].group;
            var children=[];
            var eachReason={};
            categoryName=reasons[reasonIndex].group;
            eachReason["eachReason"]=reasons[reasonIndex].reason;
            eachReason["fullReason"]=reasons[reasonIndex].group+" : "+reasons[reasonIndex].reason
            children.push(eachReason);
            childrenList["children"]=children;
            sampleData.push(childrenList);
            childrenList={}
        }
        
    }
  }
  dataFormChange(reasons);
  export default sampleData;