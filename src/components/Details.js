import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import {Tab, Tabs, TabList, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import '../Styles/details.css';
import queryString from "query-string";
import axios from "axios";
import Modal from 'react-modal';
import GooglePayButton from '@google-pay/button-react';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'bisque',
    border: 'solid 1px darkmagenta',
    width:'500px'
  },
};




class Details extends React.Component {
constructor(){
  super();
  this.state={
    restaurant:{},
    menu_items:[],
    menuModalIsOpen : false,
    formModelIsOpen:false,
    resId:undefined,
    subTotal:0,
     userName : undefined,
     userMail : undefined,
     userContact : undefined,
     userAddress : undefined
  }
}

    componentDidMount(){
      const qs = queryString.parse(this.props.location.search);
      const {restaurant} = qs;

      axios({
        method:'GET',
        url:`http://localhost:8090/restaurants/${restaurant}`,
        headers:{'Content-Type':'application/json'}
  
      })
      .then(response =>{
        this.setState({restaurant:response.data,resId:restaurant})
      })
      .catch(err=> console.log(err))
    }
    // handleOrder = (resId)=>{
    //   axios({
    //     method:'GET',
    //     url:`http://localhost:8090/getmenu/${resId}`,
    //     headers:{'Content-Type':'application/json'}
  
    //   })
    //   .then(response =>{
    //     this.setState({menu_items:response.data})
    //   })
    //   .catch(err=> console.log(err))
    // }

    handleModal=(state, value)=>{
      const {resId} = this.state; 

      axios({
        method:'GET',
        url:`http://localhost:8090/getmenu/${resId}`,
        headers:{'Content-Type':'application/json'}
  
      })
      .then(response =>{
        this.setState({menu_items:response.data.menu_items})
      })
      .catch(err=> console.log(err))
      this.setState({[state]:value})
    }

     addItems = (index, operationType) => {
          let total = 0;
          const items = [...this.state.menu_items];
          const item = items[index];
  
          if (operationType === 'add'){
              item.qty += 1;
          }
          else {
              item.qty -= 1;
          }
          items[index] = item;
          console.log(items)
         
          items.map((item)=>{
              total += item.qty * item.price;
          })
          this.setState({menu_items: items,subTotal: total});
      }
      handleFormDataChange = (event,state) => {
        this.setState({[state] : event.target.value});
    }
  
    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]'
    }
  
    isObj = (val) => {
        return typeof val === 'object'
    }
  
    stringifyValue = (val) => {
        if (this.isObj(val)&&!this.isDate(val)) {
            return JSON.stringify(val)
        }else {
            return val
        }
    }
  
    buildForm = ({action, params}) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)
  
        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }
  
    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }
    getData = async (data) => {
      try {
        const response = await fetch('http://localhost:8090/payment', {
          method: "POST", headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        return await response.json();
      } catch (err) {
        return console.log(err);
      }
  }
  
  handlePayment = () => {
      const {subTotal, userMail} = this.state;
  
      if (!userMail) {
          alert('Please fill this fields and then proceed')
      }
      else {
      const paymentObj = {
          amount : subTotal,
          userMail : userMail
  
      };
  
      this.getData(paymentObj).then (response => {
          var information = {
              action : "https://securegw-stage.paytm.in/order/process",
              params : response
          }
          this.post(information)
      })
  }
}
  render() {
    const { restaurant ,menu_items, menuModalIsOpen, formModelIsOpen,subTotal} =this.state;
    return (
    <div>
        <Carousel 
        showThumbs = {false}
        showIndicators={false}
        className="carosel">
         <img className="img1" src={`./${restaurant.image}`} alt="not found"/>
         <img className="img1" src={`./${restaurant.image}`} alt="not found"/>
        </Carousel>
        <div className="top">
          <div className="heading">
            {restaurant.name}
            </div>
          <button className="btn-order" onClick={()=> this.handleModal('menuModalIsOpen', true)}>Place Order</button>
        </div>
                
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Contact</Tab>
          </TabList>

          <TabPanel>
            
            <div className="about"><b>About this place</b></div>
             <div className="det">
                <div className="head">Cuisine : </div>
                <div className="value">Bakery, Fast-food</div>
             </div>
             <div className="cost">  
                <div className="head">Average cost : </div>
                <div className="value">&#8377;
                {restaurant.min_price}  for two people(approx)</div>
            </div>
          </TabPanel>
          <TabPanel>
              <div className="contact">
                 <div className="head">Phone Number : </div>
                <div className="value">{restaurant.contact_number}</div>
              </div>  
                <div className="value"><b>{restaurant.name}</b></div>
                <div className="value">{restaurant.locality},{restaurant.city}</div>
          </TabPanel>
        </Tabs>
        <Modal
        isOpen={menuModalIsOpen}
        style={customStyles}
        >
         
                     <div>
                    <div className = "glyphicon glyphicon-remove" 
                      style={{float:'right', marginBottom:'10px', fontSize:'xx-large',cursor:'pointer' }} 
                      onClick={()=>this.handleModal('menuModalIsOpen', false)}>&#215;</div>
                        <div>
                            <h1 className="restaurant-name" style={{ marginLeft:'10px', color:'red'}}>{restaurant.name}</h1>
                            <h3 className="item-total" style={{ marginLeft:'10px'}}>Total : {subTotal}</h3>
                            <button className="pay-button" 
                             onClick={() => { this.handleModal('formModelIsOpen', true)}}
                        >Pay Now</button>
{menu_items.map((item, index) => {
  return (
  <div key={index} style={{ width: '30rem', borderBottom: '2px solid #db8d8' }}>
      <div className="card" style={{ width: '30rem', margin: 'auto' }}>
          <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
              <div className="col-xs-9 col-sm-9 col-md-9" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                  <div className="card-body" style={{height:'100px'}} >
                      <h2 className="item-name" >{item.name}</h2>
                      <h4 className="item-price">&#8377;{item.price}</h4>
                      <p className="item-descp" >{item.des}</p>
                  </div>
              </div>
              <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <img className="card-img-center title-img" src={`../${item.image}`} alt="not found" style={{
                      height: '80px',
                      width: '80px',
                      borderRadius: '20px',
                      marginTop: '40px',
                      marginLeft: '3px',
                  }} />
                  {item.qty === 0 ? (
                      <div  className="add-button">
                          <button  onClick={() => this.addItems(index, 'add')}> Add</button>
                      </div>
                  ) : (
                      <div className="add-number">
                          <button onClick={() => this.addItems(index, 'subtract')}>-</button>
                          <span style={{ backgroundColor: 'white' }}>{item.qty}</span>
                          <button onClick={() => this.addItems(index, 'add')}>+</button>
                      </div>
                  )}
              </div>
          </div><br/>
      </div>
  </div>
);
})}
                  </div>
                  
                     </div>
        </Modal>
        <Modal
                    isOpen = {formModelIsOpen} 
                    style={customStyles}
                ><div className="form-modal">

                    <div class = "glyphicon glyphicon-remove" style={{float:'right', marginBottom:'10px', fontSize:'xx-large',cursor:'pointer'}}
                     onClick={()=>this.handleModal('formModelIsOpen', false)}>&#215;</div>
                    <h2>{restaurant.name}</h2>

                    <div>
                        <label className="label">Name : </label>
                        <input className = 'input' style={{width : '400'}} type = "text" placeholder="Enter your Name" onChange={(event) => this.handleFormDataChange(event, 'userName')}></input>
                    </div>

                    <div>
                        <label className="label">Email : </label>
                        <input className = 'input' style={{width : '400'}} type = "text" placeholder="Enter your Email" onChange={(event) => this.handleFormDataChange(event, 'userMail')}></input>
                    </div>
                    <div>
                        <label className="label">Address : </label>
                        <input className = 'input' style={{width : '400'}} type = "text" placeholder="Enter your Address" onChange={(event) => this.handleFormDataChange(event, 'userAddress')}></input>
                    </div>
                    <div>
                        <label className="label">Number : </label>
                        <input className = 'input' style={{width : '400'}} type = "tel" placeholder="Enter your Number" onChange={(event) => this.handleFormDataChange(event, 'userContact')}></input>
                    </div>
                    {/* <button class = "btn btn-success" style={{float : 'right', marginTop : '20px'}} onClick={this.handlePayment}>Proceed</button> */}
               <GooglePayButton
                 environment="TEST"
                 paymentRequest={{
                   apiVersion: 2,
                   apiVersionMinor: 0,
                   allowedPaymentMethods: [
                     {
                       type: 'CARD',
                       parameters: {
                         allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                         allowedCardNetworks: ['MASTERCARD', 'VISA'],
                       },
                       tokenizationSpecification: {
                         type: 'PAYMENT_GATEWAY',
                         parameters: {
                           gateway: 'example',
                           gatewayMerchantId: 'exampleGatewayMerchantId',
                         },
                       },
                     },
                   ],
                   merchantInfo: {
                     merchantId: '139613961396',
                     merchantName: 'Demo',
                   },
                   transactionInfo: {
                     totalPriceStatus: 'FINAL',
                     totalPriceLabel: 'Total',
                     totalPrice: '100.00',
                     currencyCode: 'USD',
                     countryCode: 'US',
                   },
                 }}
                 onLoadPaymentData={paymentRequest => {
                   console.log('load payment data', paymentRequest);
                 }}

                 buttonType='pay'
                 buttonSizeMode="static"
                 style={{marginLeft:'3rem'}}
              />               
               
               </div>
                </Modal>

    </div>
    )
  }
}

export default Details;
