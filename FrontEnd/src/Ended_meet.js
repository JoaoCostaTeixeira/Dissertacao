import React from 'react';
import { Cookies } from 'react-cookie';
import configRest from './endpointconfig.json';

class Ended_meet extends React.Component {
     
    constructor(props) {
        super(props);
        this.state ={
            name : "",
            foto : "",
            email : "",
            loading : true,
            data : null,
            data2 : null,
          };
    }

    componentDidMount(){
       

        const cookies = new Cookies();

        this.setState({name : cookies.get('name'), email : cookies.get('email'),foto : cookies.get('foto'),id : cookies.get('id')})
        
        fetch(configRest.Create + '/getAllMeetingsEnded?i=' +  cookies.get('id'))
        .then(response => response.json())
        .then(data => {
          if(data.valid===1){
            this.setState({data:data.id, data2:data.id2, loading:false});
          }

        }); 

    
    }

    render() {
        if(this.state.loading){
            return(<div class="page-loader"><div class="page-loader__spin"></div></div>)
        }else{
            return (    
            <div class="page-wrapper">
    
            <header class="header-mobile d-block d-lg-none">
                <div class="header-mobile__bar">
                    <div class="container-fluid">
                        <div class="header-mobile-inner">
                            <a class="logo" href="index.html">
                                <img src="images/icon/logo.png" alt="CoolAdmin" />
                            </a>
                            <button class="hamburger hamburger--slider" type="button">
                                <span class="hamburger-box">
                                    <span class="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <nav class="navbar-mobile">
                <div class="container-fluid">
                    <ul class="navbar-mobile__list list-unstyled">
                    <a href="/create" class="au-btn au-btn-icon au-btn--blue" style={{color:'white'}}> New Meeting<div></div></a>
                        <li>
                        <button class="js-arrow" href="/activemeets">Active Meetings</button>
                        </li>
                        <li>
                        <a class="js-arrow" href="/endedmeets">Meetings History</a>
                        </li>
            
                    </ul>
                </div>
            </nav>
        </header>

        <aside class="menu-sidebar d-none d-lg-block">
            <div class="logo">
                <a href="/">
                    <img src="images/icon/logo.png" alt="Cool Admin" />
                </a>
            </div>
            <div class="menu-sidebar__content js-scrollbar1">
                <nav class="navbar-sidebar">
                    <ul class="list-unstyled navbar__list">
                        <li>
                            <a href="/create" class=" btn au-btn au-btn-icon au-btn--blue" style={{color:'white'}}> New Meeting<div></div></a>
                        </li>
                        <li>
                            <br/>
                        </li>
                        <li>
                            <a href="/activemeets" type="button" class="btn btn-outline-secondary" style={{color:'black', height:"55px"}}> Active Meetings</a>
                        </li>
                        <li>
                            <br/>
                        </li>
                        <li>
                            <a href="/endedmeets" type="button" class="btn btn-secondary" style={{color:'white', height:"55px"}}>Meetings History</a>
                        </li>
                        <li>
                            <br/>
                        </li>
                        <li>
                            <a href="/globalstats" type="button" class="btn btn-outline-secondary" style={{color:'black', height:"55px"}}>Global Stats</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
            <div class="page-container">
                <header class="header-desktop">
                    <div class="section__content section__content--p30">
                        <div class="container-fluid">
                            <div class="header-wrap">
                                <form class="form-header" action="" method="POST">
                                    
                                </form>
                                <div class="header-button">
                                    <div class="account-wrap">
                                        <div class="account-item clearfix js-item-menu">
                                            <div class="image">
                                                <img src={this.state.foto} alt="profilepic" />
                                            </div>
                                            <div class="content">
                                                <a class="js-acc-btn" href="#">{this.state.name + "#" + this.state.id}</a>
                                            </div>
                                            <div class="account-dropdown js-dropdown">
                                                <div class="info clearfix">
                                                    <div class="image">
                                                        <a href="#">
                                                            <img src={this.state.foto} alt="profilepic" />
                                                        </a>
                                                    </div>
                                                    <div class="content">
                                                        <h5 class="name">
                                                            <a href="#">{this.state.name + "#" + this.state.id}</a>
                                                        </h5>
                                                        <span class="email">{this.state.email}</span>
                                                    </div>
                                                </div>
                                                <div class="account-dropdown__body">
                                                    <div class="account-dropdown__item">
                                                        <a href="#">
                                                            <i class="zmdi zmdi-account"></i>Account</a>
                                                    </div>

                                                </div>
                                                <div class="account-dropdown__footer">
                                                    <a href="/logout">
                                                        <i class="zmdi zmdi-power"></i>Logout</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div class="main-content">
                <div class="section__content section__content--p30">
                        <div class="container-fluid">
                            <h3>Admin</h3>
                            <br/>
                            <div class="row">
                            {this.state.data.map((data) => 
                                    <div class="col-md-4">
                                    <div class="card" onClick={()=> window.location.href='./room?id=' + data.id}>
                                        <div class="card-header">
                                            <strong class="card-title">{data.id}
                                            {
                                                data.active==1?
                                                <small>
                                                    <span class="badge badge-success float-right mt-1">Active</span>
                                                </small>
                                                :
                                                <small>
                                                    <span class="badge badge-pill badge-danger float-right mt-1">Ended</span>
                                                </small>
                                            }
                                                
                                                
                                            </strong>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">{data.desc}</p>
                                        </div>
                                        <hr/>
                                        <div class="card-text text-sm-center">
                                             <p style={{marginBottom:"8px"}}>{new Date(parseInt(data.time_stamp)).toDateString()}</p>
                                        </div>
                                        <br/>
                                    </div>
                                </div>
                            )}
                            
                            
                            </div>


                            <h3>Invited</h3>
                            <br/>
                            <div class="row">
                            {this.state.data2.map((data) => 
                                    <div class="col-md-4">
                                    <div class="card" onClick={()=> window.location.href='./room?id=' + data.id}>
                                        <div class="card-header">
                                            <strong class="card-title">{data.id}
                                            
                                            
                                                <small>
                                                    <span class="badge badge-danger float-right mt-1">Ended</span>
                                                </small>
                                                
                                                
                                            </strong>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">{data.desc}</p>
                                        </div>
                                        <hr/>
                                        <div class="card-text text-sm-center">
                                             <p style={{marginBottom:"8px"}}>{new Date(parseInt(data.time_stamp)).toDateString()}</p>
                                        </div>
                                        <br/>
                                    </div>
                                </div>
                            )}
                            
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
        }
    }
  }

  export default Ended_meet;