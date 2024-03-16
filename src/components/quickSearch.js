import React from 'react';
import '../Styles/home.css';
import QuickSearchItems from './quickSearchItems';

class QuickSearch extends React.Component {
  
    render(){
      const { mealtypeData } = this.props;
  return (
    <div>
    <div className="quickHeading">
        <h2 className="color">Quick Searches</h2>
        <h3 className="qstxt">Discover Restaurants By Type of Meal.</h3>
    </div>
    <div className='mealtypes'>

      {mealtypeData.map((item)=>{
        return <QuickSearchItems QSitems = {item}/>
     
      })
      }
    
    </div>

    </div>
  )
}
}

export default QuickSearch;
