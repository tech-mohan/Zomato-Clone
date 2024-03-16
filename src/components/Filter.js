import React from "react";
import '../Styles/filter.css'
import queryString from "query-string";
import axios from "axios";

class Filter extends React.Component {

    constructor(){
        super();
        this.state = {
            restaurants : [],
            location:undefined,
            mealtype:undefined,
            locations:[],
            cuisine:[],
            lcost:undefined,
            hcost:undefined,
            sort:1,
            page:1
        }
    }

    componentDidMount(){
        const qs = queryString.parse(this.props.location.search);
        const { mealtype,location } = qs;


        let filterObj = {
            mealtype_id : mealtype,
            locations : location,
        };

        axios({
            method:'POST',
            url:'http://localhost:8090/filter',
            headers:{'Content-Type':'application/json'},
            data : filterObj
      
          })
          .then(response =>{
            this.setState({restaurants:response.data.restaurants,mealtype,  pageCount:response.data.pageCount})
          })
          .catch(err=> console.log(err))
          axios({
            method:'GET',
            url:'http://localhost:8090/locations',
            headers:{'Content-Type':'application/json'}
      
          })
          .then(response =>{
            this.setState({locations:response.data})
          })
          .catch(err=> console.log(err))
        }
      
    handleLocationChange=(event)=>{
        const location =event.target.value;
        
        const{cuisine, mealtype,lcost, hcost, sort, page}=this.state;
        

        const filterObj = {
            mealtype_id : mealtype,
            locations : location,
            cuisine : cuisine.length == 0 ? undefined:cuisine,
            lcost,
            hcost,
            sort,
            page
        }
        axios({
            method:'POST',
            url:'http://localhost:8090/filter',
            headers:{'Content-Type':'application/json'},
            data : filterObj
      
          })
          .then(response =>{
            this.setState({restaurants:response.data.restaurants,location,  pageCount:response.data.pageCount})
          })
          .catch(err=> console.log(err))
    }
    handleCuisine=(cuisineId)=>{
        const{location, mealtype,cuisine,lcost, hcost, sort, page}=this.state;

        let index = cuisine.indexOf(cuisineId)
        if(index == -1){
        cuisine.push(cuisineId);
        }
        else{
            cuisine.splice(index, 1)
        }

       const filterObj = {
           mealtype_id : mealtype,
           locations : location,
           cuisine : cuisine.length <=0 ? undefined:cuisine,
           lcost,
           hcost,
           sort,
           page,
           pageCount:[]
       }
       axios({
           method:'POST',
           url:'http://localhost:8090/filter',
           headers:{'Content-Type':'application/json'},
           data : filterObj
     
         })
         .then(response =>{
           this.setState({restaurants:response.data.restaurants, pageCount:response.data.pageCount})
         })
         .catch(err=> console.log(err))

    }
    handleCost = (lcost, hcost) => {
        const{location, mealtype,cuisine, sort, page}=this.state;

       const filterObj = {
           mealtype_id : mealtype,
           locations : location,
           cuisine : cuisine.length <=0 ? undefined:cuisine,
           lcost,
           hcost,
           sort,
           page
       }
       axios({
           method:'POST',
           url:'http://localhost:8090/filter',
           headers:{'Content-Type':'application/json'},
           data : filterObj
     
         })
         .then(response =>{
           this.setState({restaurants:response.data.restaurants,lcost,hcost,  pageCount:response.data.pageCount})
         })
         .catch(err=> console.log(err))


    }
    handleSort = (sort)=>{
        const{location, mealtype,cuisine, lcost, hcost, page}=this.state;

        const filterObj = {
            mealtype_id : mealtype,
            locations : location,
            cuisine : cuisine.length <=0 ? undefined:cuisine,
            lcost,
            hcost,
            sort,
            page
        }
        axios({
            method:'POST',
            url:'http://localhost:8090/filter',
            headers:{'Content-Type':'application/json'},
            data : filterObj
      
          })
          .then(response =>{
            this.setState({restaurants:response.data.restaurants,sort,  pageCount:response.data.pageCount})
          })
          .catch(err=> console.log(err))
 
    }
    handleNavigate=(resId)=>{
    this.props.history.push(`/details?restaurant=${resId}`);
      

    }
  render() {
    const { restaurants,locations,pageCount } = this.state;
    return (
    <div className="filterpage">
        <div className="leftside">
        <h1>Breakfast</h1>
        <h1>Filters</h1>
        <select id="loc" onChange={this.handleLocationChange}>
            <option value='0'>Select</option>
                 { locations.map((item)=>{
                 return <option value={item.location_id}>{`${item.name},${item.city}`}</option>
                  })}
            </select>
        <h3>Cuisines</h3>
            <input type="checkbox" onChange={()=> this.handleCuisine(1)}/>North Indian<br/>
            <input type="checkbox" onChange={()=> this.handleCuisine(2)}/>South Indian<br/>
            <input type="checkbox" onChange={()=> this.handleCuisine(3)}/>Chinese<br/>
            <input type="checkbox" onChange={()=> this.handleCuisine(4)}/>Fastfood<br/>
            <input type="checkbox" onChange={()=> this.handleCuisine(5)}/>Streetfood
        <h3>Cost for Two</h3>
            <input type="radio" name="cost" onChange={() => this.handleCost(1, 500)} />Less than Rs.500<br/>
            <input type="radio" name="cost" onChange={() => this.handleCost(500, 1000)} />Rs.500-1000<br/>
            <input type="radio" name="cost" onChange={() => this.handleCost(1000, 1500)} />Rs.1000-1500<br/>
            <input type="radio" name="cost" onChange={() => this.handleCost(1500, 2000)} />Rs.1500-2000<br/>
            <input type="radio" name="cost" onChange={() => this.handleCost(2000, 50000)} />Rs.2000+
        <h3>Sort</h3>
            <input type="radio" name="sort" onChange={()=> this.handleSort(1)}/>Price low to high<br/>
            <input type="radio" name="sort" onChange={()=> this.handleSort(-1)} />Price high to low<br/>
        </div>
        <div className="rightside">
        {restaurants.map(item =>{
            return <div className="shops" onClick={()=> this.handleNavigate(item._id)}>
                <div className="FRow">
                <img className="img" src={`./${item.image}`} />
                <div className="text">
                    <h2>{item.name}</h2>
                    <h3>{item.locality}</h3>
                    <h5>{item.city}</h5>
                </div>
                </div>
                <div className="SRow">
                    <h5>Cuisines : {item.cuisine.map(cuisineitem => {return `${cuisineitem.name},`})}</h5>
                    <h5>Cost for Two : {item.min_price}</h5>
                </div>
                </div>
        })}
        {restaurants.length > 0 ?
        <div class="b">
          <span className="page-num">&#8592;</span>
            {pageCount.map(pageNo=>{
              return <span className="page-num">{pageNo}</span>
            })}
            <span className="page-num">&#8594;</span>

        </div> : <div className="NoRecords">No Results Found...</div>}
        </div>


        </div>
        
    )
  }
}

export default Filter;
