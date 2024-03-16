import React from "react";
import "../Styles/home.css";
import Walpaper from "./walpaper";
import QuickSearch from "./quickSearch";
import axios from "axios";

class Home extends React.Component {
  constructor(){
    super();
    this.state={
      locations : [],
      mealtypes: []
    }
  }
  componentDidMount(){
    sessionStorage.clear();
    axios({
      method:'GET',
      url:'http://localhost:8090/locations',
      headers:{'Content-Type':'application/json'}

    })
    .then(response =>{
      this.setState({locations:response.data})
    })
    .catch(err=> console.log(err))
    // mealtypes
    axios({
      method:'GET',
      url:'http://localhost:8090/mealtypes',
      headers:{'Content-Type':'application/json'}

    })
    .then(response =>{
      this.setState({mealtypes:response.data})
    })
    .catch(err=> console.log(err))

  }
  render() {
     const { locations }=this.state;
     const { mealtypes }=this.state;

    return (
      <div>
        
        <Walpaper locationsData = { locations }/>

        <QuickSearch mealtypeData = { mealtypes }/>
      </div>
    );
  }
}

export default Home;
