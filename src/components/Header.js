import React from 'react'
import '../Styles/header.css'
import Modal from 'react-modal';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'antiquewhite',
    border:' solid 1px darkslategray'
  },
};

class Header extends React.Component{
  constructor(){
    super();
    this.state={
      backgroundColor : '',
      display :'none',
      loginModalIsOpen: false,
      isLogedin : false,
      logedInUser: undefined
    }
  }
  componentDidMount(){
    const path = this.props.history.location.pathname;
    this.setAttributes(path);
  }
  setAttributes=(path)=>{
    let bg, display;
    if (path =='/'){
      bg = 'black';
      display="none"
    }
    else{
      bg = 'red';
      display='inline-block'
    }
    this.setState({backgroundColor : bg, display:display})
  }
  handleLogin=()=>{
    this.setState({loginModalIsOpen:true})
  }
  handleLogout=()=>{
    this.setState({isLogedin:false,logedInUser:undefined})
  }

  handleCancel=()=>{
    this.setState({loginModalIsOpen:false})
    
  }
  handleHome = ()=>{
    this.props.history.push('/')
  }
    render(){
      const {backgroundColor,loginModalIsOpen,isLogedin,logedInUser} = this.state;
  return (

    
      <div className="navbar" style={{backgroundColor : backgroundColor}}>
        <div className="circle" onClick={this.handleHome}>
            <span className="circle-text">e!</span>
        </div>
        {!isLogedin ?
        <div className="auth-buttons">
            <button className="login-button" onClick={this.handleLogin}>Login</button>
            <button className="create-account-button">Create Account</button>
        </div> :
          <div className="auth-buttons">
          <button className="login-button">{logedInUser}</button>
          <button className="create-account-button" onClick={this.handleLogout}>Log Out</button>
      </div>
    }
        <Modal
        isOpen={loginModalIsOpen}
        style={customStyles}
      >
        <div className='LoginModal'>
        <h2 >Login</h2>
        <input type='text' placeholder='EMail'/>
        <br/>
        <input type='text' placeholder='Password'/>
         <div className='btn'>
          <button>Login</button>
          <button onClick={this.handleCancel}>Cancel</button>
         
          </div>
          <div className='googleLogin'>
          
          <GoogleOAuthProvider clientId="1070849281653-0tioil7thk6tnkhshci01nlesq31vr0u.apps.googleusercontent.com">
          

            <GoogleLogin
              onSuccess={credentialResponse => { 
                
                const decoded = jwtDecode(credentialResponse.credential)
                console.log(decoded.name);
                this.setState({isLogedin:true, logedInUser:decoded.name, loginModalIsOpen:false})
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
            />
          </GoogleOAuthProvider>
            
          
         </div>
        </div>
        
      </Modal>
      </div>
    
  )
    }
}

export default Header
