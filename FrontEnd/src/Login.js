import React from 'react';
import { Cookies } from 'react-cookie';
import FacebookLogin from 'react-facebook-login';
import './App.css';
import configRest from './endpointconfig.json';

class Login extends React.Component {
     
      constructor(props) {
        super(props);
        this.state ={
          name : "",
          loading : true
        };
      }

      componentDidMount(){
        const cookies = new Cookies();
        if(cookies.get('valid')==1){
          window.location.href='./';
        }else{
         this.setState({loading:false});
        }
      }


       responseFacebook = (response) => {
        const cookies = new Cookies();
        cookies.set('name', response.name);
        cookies.set('foto', response.picture.data.url);
        cookies.set('email', response.email);
        cookies.set('token', response.token);
         console.log(response.picture.data.url.split("&").join("_"))
        fetch(configRest.Auth + '/verify?e=' + response.email + '&f=' + response.picture.data.url.split("&").join("_f") + '&n=' + response.name)
                .then(response => response.json())
                .then(data => {
          
                  if(data.valid===1){
                    cookies.set('valid', 1);
                    cookies.set('id', data.id);
                    window.location.href='./';
                  }
                }); 
      }
    
    render() {
     
        if(this.state.loading){
          return (<h1>loading......</h1>)
        }else{
         
        
            return (
                <div class="page-wrapper">
                <div class="page-content--bge5">
                    <div class="container">
                        <div class="login-wrap">
                            <div class="login-content">
                                <div class="login-logo">
                                    <a href="#">
                                        <img src="images/icon/logo.png" alt="CoolAdmin"/>
                                    </a>
                                </div>
                                <div class="login-form">
                                    <form action="" method="post">
                                   
                                     
                                      
                                        <div class="social-login-content">
                                            <div class="social-button">
                                            <FacebookLogin
                                                appId="KEY"
                                                autoLoad={true}
                                                fields="name,email,picture"
                                                callback={this.responseFacebook}
                                                cssClass="btnFacebook"
                                            />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
            </div>
       
                );
          }
        }
        
       
    
  }

  export default Login;