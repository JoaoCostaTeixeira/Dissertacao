import React from 'react';
import { Cookies } from 'react-cookie';
import configRest from './endpointconfig.json';

class Globalstats extends React.Component {
     
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

            pArtRate : 0,
            pSpeechDur: 0,
            pNumberOfSyl : 0,
          };
    }

    componentDidMount(){
       

        const cookies = new Cookies();

        this.setState({id:cookies.get('id'),name : cookies.get('name'), email : cookies.get('email'),foto : cookies.get('foto')})

        fetch(configRest.Stats + '/getAllStats')
        .then(response => response.json())
        .then(data => {
            if(data.valid){
                this.setState({data:data.data, loading:false})
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
                        <li>
                            <a href="/globalstats" type="button" class="btn btn-secondary" style={{color:'white', height:"55px"}}>Global Stats</a>
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
                                            <strong class="card-title">Ariticulation Rate Mean</strong>
                                        </div>
                                        <div class="card-body">
                                           
                                            {this.state.data.artrate} &nbsp;&nbsp;&nbsp;&nbsp;
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Speech Duration Mean per Intervation</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.data.speak_duration_mean} &nbsp;&nbsp;&nbsp;&nbsp;
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Speech Duration Total</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.data.speak_duration_total} &nbsp;&nbsp;&nbsp;&nbsp;
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Number of Sylables Mean per Intervation</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.data.number_of_sylables_mean} &nbsp;&nbsp;&nbsp;&nbsp;
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Number of Sylables Total</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.data.number_of_sylables_total} 
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Total Number of Audios Analysed</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.data.total_number_of_audios_analysed} 
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Meetings Created</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.data.total_number_of_meetings_created} 
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Meetings Active</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.data.number_of_meetings_active} 
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Meetings Inactive</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.data.number_of_meeting_inactive} 
                                        </div>
                                    </div>
                                    </div>
                               
                                    </div>
                                </div>
                            </div>
                            </div>

                        </div>
            </div>
            </div>
        </div>

    </div>);
    }
}
  }

  export default Globalstats;