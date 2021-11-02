import React from 'react';
import { Cookies } from 'react-cookie';
import configRest from './endpointconfig.json';
import ReactAudioPlayer from 'react-audio-player';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import socketIOClient from "socket.io-client";

class Active_meet extends React.Component {
     
    constructor(props) {
        super(props);
      
        this.state ={
            name : "",
            foto : "",
            id: 0,
            email : "",
            loading : true,
            data : null,
            owner : false,
            stats : null,
            invite : false,
            alldata: null,
            text: "",
            
            meetid : "",
            searchResult : null,

            hasData : false,
            aud : null,
          };
    }


    componentDidMount(){
        const windowUrl = window.location.search;
        const params = new URLSearchParams(windowUrl);
        addResponseMessage('Welcome to ' + params.get("id") + " chat!");
        this.setState({meetid :  params.get("id")})

        fetch(configRest.upload + '/hasData?meeting=' + params.get("id"))
        .then(response => response.json())
        .then(data => {
            this.setState({hasData : data.hasMeet})
        });

        const cookies = new Cookies();


        this.setState({name : cookies.get('name'), email : cookies.get('email'),foto : cookies.get('foto'), id : cookies.get("id")})
       
        fetch(configRest.Create + '/getMeet?i=' + params.get("id"))
        .then(response => response.json())
        .then(data => {
          if(data.valid===1){
            this.setState({data:data, loading:false});
          }
          if(data.admin.data[0].id == cookies.get('id') ){
            this.setState({owner: true });
          }
        }); 



        const ENDPOINT = "http://localhost:4001/";
        const socket = socketIOClient(ENDPOINT);
        console.log( params.get("id"))
        socket.on("" + params.get("id"), data => {
            var aux = data.split("_");
            console.log(data)
            if(aux[0]!== ""+this.state.id){
                addResponseMessage(aux[1]);
            }
          
        })

        
    
    }

    handleNewUserMessage = (response) => {
       const ENDPOINT = "http://localhost:4001/";
       const socket = socketIOClient(ENDPOINT);
       console.log()
       socket.emit("chat", this.state.meetid + "_" + this.state.id + "_" +  response)
      }

    onCalendarChange3 = (response) => {
     
        this.setState({text:response.target.value})

      }

    onCalendarChange10 = (response) => {
    
        var admin = this.state.id;
        var meetingid = this.state.meetid;
 
        var part = this.state.data.participant.data;
        var g = "";
        for(var i = 0; i< part.length; i++){
            g += ("-" + part[i].id);
        }

        fetch(configRest.upload + '/?users=' + admin + g + "&meeting=" + meetingid)
      
    }


      onCalendarChange4 = (response) => {
        fetch(configRest.Create + '/searchParticipant?i=' + this.state.text)
        .then(response => response.json())
        .then(data => {

          if(data.valid){
            this.setState({searchResult:data.data[0]});
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
        {this.state.invite?
<div class="modal fade show" id="largeModal" tabindex="-1" role="dialog" aria-labelledby="largeModalLabel" style={{display: "block", paddingRight: "17px"}}>
                                <div class="modal-dialog modal-lg" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="largeModalLabel">Invite</h5>
                                            <button  onClick={()=>this.setState({invite:false})} type="button" class="close" data-dismiss="modal" aria-label="Close" >
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                        <input onChange={this.onCalendarChange3} id="cc-name" name="cc-name" type="text" class="form-control cc-name valid" data-val="true" data-val-required="Please enter the name on card" autocomplete="cc-name" aria-required="true" aria-invalid="false" aria-describedby="cc-name-error"/>
                                            {
                                                this.state.searchResult!=null?
                                                <div class="row" style={{marginTop:"10px"}}>
                                                <div class="col-md-2">
                                                    <img class="rounded-circle mx-auto d-block" src={this.state.searchResult.foto+ "&height=50&width=50&ext=1625393061&hash=AeT6JYDDtSjjn5fw4OE"} alt="Card image cap"/>
                                                </div>
                                                <div class="col-md-6" style={{marginTop:"10px"}}>
                                                     <h3>{this.state.searchResult.name}#{this.state.searchResult.id}</h3>
                                                </div>
                                                <div class="col-md-2" style={{marginTop:"10px"}}>
                                                <button type="button" onClick={()=>{
                                                    fetch(configRest.Create + '/addParticipant?i=' + this.state.searchResult.id + "&id=" +  this.state.data.data[0].id)
                                                    .then(response => { window.location.href='./room?id=' + this.state.data.data[0].id})
                                                }} class="btn btn-primary">Invite</button>
                                                </div>
                                                
                                                </div>
                                                :
                                                <div></div>
                                            }
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={()=>this.setState({invite:false})}>Cancel</button>
                                            <button type="button" onClick={this.onCalendarChange4 } class="btn btn-primary">Search</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                    :
                                    <div></div>

                                }
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
                            <a href="/endedmeets" type="button" class="btn btn-outline-secondary" style={{color:'black', height:"55px"}}>Meetings History</a>
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
                            <div class="row">
                            <div class="col-md-12">
                                <div class="card border border-primary">
                                    <div class="card-header">
                                        <strong class="card-title">{this.state.data.data[0].id}</strong>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">{this.state.data.data[0].desc}</p>
                                        <hr/>
                                        <p class="card-text">{new Date(parseInt(this.state.data.data[0].time_stamp)).toString()}</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div class="row">
                            <div class="col-md-12">
                                <div class="card border border-primary">
                                    <div class="card-header">
                                        <strong class="card-title">Join Meeting with name: {this.state.id}</strong>
                                    </div>
                                    <div class="card-body">
                                         <iframe allow="camera; microphone; fullscreen; display-capture; autoplay" src={"https://meet.jit.si/"+this.state.data.data[0].id} style={{height: "800px", width: "100%", border: "0px"}}></iframe>
            
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div class="row">
                            <div class="col-md-1.5" style={{marginRight:"20px"}}>
                                  <div class="card border border-primary">
                                      <div class="card-header">
                                          <strong class="card-title">Statistics</strong>
                                      </div>
                                      <div class="card-body">
                                      <button type="button" class="btn btn-primary"  onClick={() => window.open("http://localhost:3000/stats?id=" + this.state.meetid, "_blank")}>Open</button>
                                      </div>
                                  </div>
                              </div>     
                            {this.state.owner? 
                          
                              <div class="col-md-1.5">
                                  <div class="card border border-primary">
                                      <div class="card-header">
                                          <strong class="card-title">Analyser</strong>
                                      </div>
                                      <div class="card-body">
                                      <button type="button" class="btn btn-primary"  onClick={() => window.open("http://localhost:9001/room.html?n="+ this.state.data.data[0].id+"&p=", "popup",'width=1000,height=700,scrollbars=no,resizable=no')}>Open</button>
                                      </div>
                                  </div>
                              </div>

                                :
                                
                                <div></div>
                                }

                       

                           
                                      
                        {this.state.owner? 
                          
                          <div class="col-md-1.5" style={{marginRight:"20px", marginLeft:"20px"}}>
                              <div class="card border border-primary">
                                  <div class="card-header">
                                      <strong class="card-title">Meeting</strong>
                                  </div>
                                  <div class="card-body">
                                  <button type="button" class="btn btn-primary"onClick={()=>{
                                        fetch(configRest.alert + '/hasStarted?i=' + this.state.meetid) }}>Start</button>
                                    <button type="button" class="btn btn-primary" style={{marginLeft:"10px"}} onClick={()=>{
                                        fetch(configRest.alert + '/hasEnded?i=' + this.state.meetid) }}>End</button>
                                  </div>
                              </div>
                          </div>

                            :
                            
                            <div></div>
                            } 
                             

                            {this.state.hasData?
                                <div class="col-md-2">
                                    <div class="card border border-primary">
                                        <div class="card-header">
                                            <strong class="card-title">Upload Data</strong>
                                        </div>
                                        <div class="card-body">
                                        <button onClick={this.onCalendarChange10} type="button" class="btn btn-primary">Upload</button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div></div>
                        }  

{this.state.owner? 
                          
                          <div class="col-md-1.5" style={{marginRight:"20px"}}>
                              <div class="card border border-primary">
                                  <div class="card-header">
                                      <strong class="card-title">Members</strong>
                                  </div>
                                  <div class="card-body">
                       
                                  <button type="button" class="btn btn-primary" onClick={()=>this.setState({invite:true})}>Invite</button>
                                  </div>
                              </div>
                        

                          </div>
                            

                            :
                            
                            <div></div>
                            }     

{this.state.owner? 
                          
                          <div class="col-md-1.5">
                              <div class="card border border-primary">
                                  <div class="card-header">
                                      <strong class="card-title">Notications</strong>
                                  </div>
                                  <div class="card-body">
                       
                                  
                            <button type="button" class="btn btn-primary" style={{backgroundColor:"#ff9900"}} onClick={()=>{
                                 fetch(configRest.alert + '/aboutToStart?i=' + this.state.meetid)
                               
                            }} class="btn btn-primary"><i class="fa fa-bell"></i></button>
                                   
                            <button style={{marginLeft:"20px"}} type="button" class="btn btn-primary" onClick={()=>{
                                window.open("http://localhost:4000/?n="+ this.state.data.data[0].id+"&p=", "popup",'width=400,height=300,scrollbars=no,resizable=no')
                                
                               
                            }} class="btn btn-primary"><i class="fa fa-cog"></i></button>
                             </div>
                              </div>
                        

                          </div>
                            


                            :
                            
                            <div></div>
                            }        

                        </div>
                            <div class="row">
                            <div class="col-md-2">
                                <div class="card">
                                    <div class="card-header" style={{backgroundColor: "#88adf7"}}>
                                        <strong class="card-title mb-3">Admin</strong>
                                    </div>
                                    <div class="card-body">
                                        <div class="mx-auto d-block">
                                            <img class="rounded-circle mx-auto d-block" src={this.state.data.admin.data[0].foto} alt="Card image cap"/>
                                            <h5 class="text-sm-center mt-2 mb-1">{this.state.data.admin.data[0].name}#{this.state.data.admin.data[0].id}</h5>
                                        </div>
                                        <hr/>

                                    </div>
                                    </div>
                                </div>
                            </div>


                            <div class="row">
                            {this.state.data.participant.valid ?
                                this.state.data.participant.data.map((data) => 
                                <div class="col-md-2">
                                <div class="card">
                                    <div class="card-header">
                                        <strong class="card-title mb-3">Participant</strong>
                                    </div>
                                    <div class="card-body">
                                        <div class="mx-auto d-block">
                                        <img class="rounded-circle mx-auto d-block" src={data.foto+ "&height=50&width=50&ext=1625393061&hash=AeT6JYDDtSjjn5fw4OE"} alt="Card image cap"/>
                                            <h5 class="text-sm-center mt-2 mb-1">{data.name + "#" + data.id}</h5>

                                        </div>
                                        <hr/>

                                    </div>
                                    </div>
                                </div>
                                )

                               :
                            <div></div>
                         }

                        </div>
                         {this.state.stats!=null?
                                this.state.stats.data.map((data) => 
                                <div class="row">
                                <div class="col-md-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="mx-auto d-block">
                                        <img class="rounded-circle mx-auto d-block" src={data.foto} alt="Card image cap"/>
                                            <h5 class="text-sm-center mt-2 mb-1">{data.name + "#" + data.user}</h5>
                                            <h5 class="text-sm-center mt-2 mb-1">{data.transcription_text}</h5>
                                        </div>
                                        <hr/>
                                        <div class="row">
                                        <div class="col-md-6">
                                            <p>{new Date(parseInt(data.timeStamp)).toString()}</p>
                                        </div>
                                     
                                        
                                        <div class="col-md-6">
                                            <p>Gender: {data.genre} Mood: {data.mood} Confidence: {data.confidence} Service: {data.service} </p>
                                        </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12" style={{marginTop:"10px", marginBottom:"-5px"}}>
                                                <ReactAudioPlayer
                                                src={"http://localhost:2000/" + data.id}
                                                controls
                                                class="col-md-12"
                                            />
                                           
                                            </div>
                                            
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                )

                               :
                            <div></div>
                         }
                           
    
                          

                        </div>
                    </div>
                </div>
            </div>
            <Widget
                 handleNewUserMessage={this.handleNewUserMessage}
                 title=""
                 subtitle=""
                 
            />
        </div>);
        }
    }
  }

  export default Active_meet;