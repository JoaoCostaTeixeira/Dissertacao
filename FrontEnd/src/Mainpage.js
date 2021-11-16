import React from 'react';
import { Cookies } from 'react-cookie';
import configRest from './endpointconfig.json';

class Mainpage extends React.Component {
     
    constructor(props) {
        super(props);
        this.state ={
            name : "",
            id : 0,
            foto : "",
            email : "",
            loading : true,
            loading2 : true,

            data : null,
            data2 : null,

          };
    }

    componentDidMount(){
       

        const cookies = new Cookies();

        this.setState({id:cookies.get('id'),name : cookies.get('name'), email : cookies.get('email'),foto : cookies.get('foto')})

        fetch(configRest.Stats + '/getAllStatsUser?i=' + cookies.get('id'))
        .then(response => response.json())
        .then(data => {
            
            if(data.valid){
                this.setState({data:data, loading:false})
            }
        }); 

        fetch(configRest.db + '/getNextMeetings?i=' + cookies.get('id'))
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.valid){
                this.setState({data2:data, loading2:false})
            }else{
                this.setState({data2:data, loading2:false})
            }
        }); 
        
    
    }

    render() {
        if(this.state.loading || this.state.loading2){
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
                        <a class="js-arrow" href="/activemeets"><i class="fas fa-tachometer-alt"></i>Active Meetings</a>
                        </li>
                        <li>
                        <a class="js-arrow" href="/endedmeets"><i class="fas fa-tachometer-alt"></i>Meetings History</a>
                        </li>
            
                    </ul>
                </div>
            </nav>
        </header>

        <aside class="menu-sidebar d-none d-lg-block">
            <div class="logo">
                <a href="#">
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
                            <a href="/endedmeets" type="button" class="btn btn-outline-secondary" style={{color:'black', height:"55px"}}>Meetings History</a>
                        </li>
                        <li>
                            <br/>
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
                                                <a className="logout" href="/logout" ><i class="zmdi zmdi-power"></i>Logout</a>
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
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card border border-primary">
                            
                                    <div class="card-body">
                                    <div class="row">
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Ariticulation Rate</strong>
                                        </div>
                                        <div class="card-body">
                                           
                                            {this.state.data.user.ArticulationRate} &nbsp;&nbsp;&nbsp;&nbsp;
                                            { 
                                                this.state.data.percentages.ArticulationRate<5 &&  this.state.data.percentages.ArticulationRate>-5?
                                                <a style={{color:"green", fontSize:"10pt"}}> {  this.state.data.percentages.ArticulationRate + "%"} </a>
                                                :
                                                <a style={{color:"red", fontSize:"10pt"}}> {  this.state.data.percentages.ArticulationRate + "%"} </a>
                                              
                                            }
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Speech Duration</strong>
                                        </div>
                                        <div class="card-body">
                                        {this.state.data.user.SpeakDuration} &nbsp;&nbsp;&nbsp;&nbsp;
                                            { 
                                                this.state.data.percentages.SpeakDuration<5 &&  this.state.data.percentages.SpeakDuration>-5?
                                                <a style={{color:"green", fontSize:"10pt"}}> {  this.state.data.percentages.SpeakDuration + "%"} </a>
                                                :
                                                <a style={{color:"red", fontSize:"10pt"}}> {  this.state.data.percentages.SpeakDuration + "%"} </a>
                                              
                                            }
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Number of Sylables</strong>
                                        </div>
                                        <div class="card-body">
                                        {this.state.data.user.NumberSyllables} &nbsp;&nbsp;&nbsp;&nbsp;
                                            { 
                                                this.state.data.percentages.NumberSyllables<5 &&  this.state.data.percentages.NumberSyllables>-5?
                                                <a style={{color:"green", fontSize:"10pt"}}> {  this.state.data.percentages.NumberSyllables + "%"} </a>
                                                :
                                                <a style={{color:"red", fontSize:"10pt"}}> {  this.state.data.percentages.NumberSyllables + "%"} </a>
                                              
                                            }
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Balance</strong>
                                        </div>
                                        <div class="card-body">
                                        {this.state.data.user.Balance} &nbsp;&nbsp;&nbsp;&nbsp;
                                            { 
                                                this.state.data.percentages.Balance<5 ||  this.state.data.percentages.Balance<-5?
                                                <a style={{color:"green", fontSize:"10pt"}}> {  this.state.data.percentages.Balance + "%"} </a>
                                                :
                                                <a style={{color:"red", fontSize:"10pt"}}> {  this.state.data.percentages.Balance + "%"} </a>
                                              
                                            }
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Number of Pauses</strong>
                                        </div>
                                        <div class="card-body">
                                        {this.state.data.user.NumberPauses} &nbsp;&nbsp;&nbsp;&nbsp;
                                            { 
                                                this.state.data.percentages.NumberPauses<5 ||  this.state.data.percentages.NumberPauses<-5?
                                                <a style={{color:"green", fontSize:"10pt"}}> {  this.state.data.percentages.NumberPauses + "%"} </a>
                                                :
                                                <a style={{color:"red", fontSize:"10pt"}}> {  this.state.data.percentages.NumberPauses + "%"} </a>
                                              
                                            }
                                        </div>
                                    </div>

                                    
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Intervation Duration</strong>
                                        </div>
                                        <div class="card-body">
                                        {this.state.data.user.OriginalDuration} &nbsp;&nbsp;&nbsp;&nbsp;
                                            { 
                                                this.state.data.percentages.OriginalDuration<5 ||  this.state.data.percentages.OriginalDuration<-5?
                                                <a style={{color:"green", fontSize:"10pt"}}> {  this.state.data.percentages.OriginalDuration + "%"} </a>
                                                :
                                                <a style={{color:"red", fontSize:"10pt"}}> {  this.state.data.percentages.OriginalDuration + "%"} </a>
                                              
                                            }
                                        </div>
                                    </div>


                                    </div>
                               
                                    </div>
                                </div>
                            </div>
                            </div>

                        </div>

                        <div class="row">
                            {this.state.data2.data.map((data) => 
                                    <div class="col-md-4">
                                    <div class="card" onClick={()=> window.location.href='./room?id=' + data.meeting}>
                                        <div class="card-header">
                                            <strong class="card-title">{data.meeting}
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
                                             <p style={{marginBottom:"8px"}}>{new Date(parseInt(data.timeStamp)).toDateString()}</p>
                                        </div>
                                        <br/>
                                    </div>
                                </div>
                            )}
                            
                            
                            </div>
            </div>
            </div>
        </div>

    </div>);
    }
}
  }

  export default Mainpage;