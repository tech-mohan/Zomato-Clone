import React from 'react';
import '../Styles/home.css';
import {withRouter} from 'react-router-dom';

import axios from 'axios';
class Walpaper extends React.Component{
  constructor(){
    super();
    this.state = {
      Restaurants:[],
      inputTxt:"",
      suggestion:[]
    }
  }
  handleLocation=(event)=>{
    const locationId = event.target.value;
    sessionStorage.setItem('locationId', locationId)
  
  axios({
    method:'GET',
    url:`http://localhost:8090/locations/${locationId}`,
    headers:{'Content-Type':'application/json'}

  })
  .then(response =>{
    this.setState({Restaurants:response.data})
  })
  .catch(err=> console.log(err))
  }
handleSearch=(event)=>{
  const inputTxt = event.target.value;
  const { Restaurants } = this.state;
  const suggestion = Restaurants.filter(item => item.name.toLowerCase().includes(inputTxt.toLowerCase()));
  this.setState({suggestion, inputTxt });
}
showSuggestion = () =>{
  const {suggestion, inputTxt} = this.state;
  if (suggestion.length == 0 && inputTxt == undefined){
    return null;
  }
  if (suggestion.length > 0 && inputTxt ==''){
    return null;
  }
  if (suggestion.length == 0 && inputTxt){
    return <ul>
      <li>No search results found</li>
    </ul>
  }
  else
  return( 
  <ul>
      {
        suggestion.map((item, index) => ( <li key={index} onClick={() => this.selectingRestaurent(item)}>{`${item.name} -  ${item.locality},${item.city}`}</li>))
      }
    </ul>
  );
 
}
selectingRestaurent = (resObj) =>{
  this.props.history.push(`/details?restaurant=${resObj._id}`);
}
  render(){
    const { locationsData } = this.props;
  

      
  return (
    
    <div>
    <img className='walpaper' src="../Assets/walpaper1.avif"/>
    <div id="top">
     <h3 className="heading">Find The Best Restaurants,Cafes and Bars.</h3>
     <div className='inputs'>
     <div className='locationInput'> 
     <select id='city' className='searchLocation' onClick={this.handleLocation}>
      <option value='0'>Select</option>
        { locationsData.map((item)=>{
        return <option value={item.location_id}>{`${item.name},${item.city}`}</option>
         })}

    </select>
    </div>
    <div className='searchInput'>
    <input type = "text"  className='searchRestaurent' placeholder = "Search For Restaurants" onChange={this.handleSearch} />
    {this.showSuggestion()}
    </div>
    </div>
    </div>
    </div>
  )
}
}



export default withRouter(Walpaper);
