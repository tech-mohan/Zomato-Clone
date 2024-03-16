import React from 'react';
import '../Styles/home.css';
import { withRouter } from 'react-router-dom';



class QuickSearchItems extends React.Component {
  handleNavigate = (mealtypeId)=>{
    const locationId = sessionStorage.getItem('locationId');
    if(locationId){
    this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`)

    }
    else{
    this.props.history.push(`/filter?mealtype=${mealtypeId}`)

    }
  }
    render(){
        const {name,content,image,mealtype_id} = this.props.QSitems;
    return (
    <div className='quickSearchItems' onClick={() => this.handleNavigate(mealtype_id)}>
      <div className = "qsitems">
         <img src={image} alt='not found' className='qsiimg'/>
        <div className="left">
         <h2>{name}</h2>
         <h4 className='content'>{content}</h4>
        </div>
      </div>
    </div>
    )
}
}

export default withRouter(QuickSearchItems);
