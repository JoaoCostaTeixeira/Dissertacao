import React from 'react';
import { Cookies } from 'react-cookie';
import configRest from './endpointconfig.json';
import { Bar, defaults, Line, Doughnut, Radar} from 'react-chartjs-2';
import ReactAudioPlayer from 'react-audio-player';


import * as html2canvas from 'html2canvas'
import { jsPDF } from "jspdf";

class Stats extends React.Component {
     
    constructor(props) {
        super(props);
      
        this.state ={
            name : "",
            foto : "",
            id: 0,
            email : "",


            loading : true,
            loading2 : true,


            participants : null,


            speekDurantion: null,
            articulation : null,
            rateofspeech:null,

            data : null,
            data2 : null,
            
            speechLineGraph : null,


            RatingGraph:null,
            RatingGraphLoading:true,


            meetingGlobalInfo: null,
            meetingGlobalInfoLoading: true,

            meetingMeanConfidence: null,
            meetingMeanConfidenceLoading: true,


            participantsData : null,
            participantsDataLoading: true,


            meetingTime : null,
            meetingTimeLoading: true,


            meetid : "",
            pdfDisable : false,

          };
    }


    componentDidMount(){
        
        const windowUrl = window.location.search;
        const params = new URLSearchParams(windowUrl);

        this.setState({meetid :  params.get("id")})


        const cookies = new Cookies();

        this.setState({name : cookies.get('name'), email : cookies.get('email'),foto : cookies.get('foto'), id : cookies.get("id")})
        fetch(configRest.Stats + '/getMeetingTranscriptions?i=' +  params.get("id"))
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.valid){
                this.setState({data2:data, loading2:false})
            }
        }); 
        
        fetch(configRest.Stats + '/getStatistics?i=' + params.get("id"))
        .then(response => response.json())
        .then(data => {
            console.log(data)
          if(data.valid){
            var par = [];
            var sd = [];
            var art = [];
            var rp = [];
            par.push("Meeting Mean");
            sd.push(data.geral.speek_durationMean)
            art.push(data.geral.articulation)
            rp.push(data.geral.rateofspeech)
            data.individual.map((s)=>{
                par.push(s.name + "");
                sd.push(s.speak_duration);
                art.push(s.articulation);
                rp.push(s.rateofspeech)
                
                this.setState({participants:par, speekDurantion:sd,articulation:art, rateofspeech: rp});
            })

            this.setState({data:data, loading:false});
          }
        }); 

        

        fetch(configRest.Stats + '/getSpeechTimeTroughLength?i=' +  params.get("id"))
        .then(response => response.json())
        .then(data => {
            console.log(data)
                this.setState({speechLineGraph:data})
        }); 

        fetch(configRest.Stats + '/getMeetingUserSimpleStats?i=' +  params.get("id"))
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.valid){
               
                this.setState({participantsData:data, participantsDataLoading:false})
            }
                
        }); 

        fetch(configRest.Stats + '/getMeetingStats1?i=' +  params.get("id"))
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.valid){
                this.setState({meetingGlobalInfo:data, meetingGlobalInfoLoading:false})
            }
        }); 


        fetch(configRest.Stats + '/getMeetingConfidence?i=' +  params.get("id"))
        .then(response => response.json())
        .then(data => {
            console.log(data)
            console.log("caga")
            if(data.valid){
                this.setState({meetingMeanConfidence:data, meetingMeanConfidenceLoading:false})
            }
        }); 



        fetch(configRest.Stats + '/getRatingGraph?i=' +  params.get("id"))
        .then(response => response.json())
        .then(data => {
            
                this.setState({RatingGraph:data, RatingGraphLoading:false})
        }); 

        fetch(configRest.Stats + '/getMeetingTime?i=' +  params.get("id"))
        .then(response => response.json())
        .then(data => {
           
                this.setState({meetingTime:data, meetingTimeLoading:false})
        }); 

    }

    render() {





          const options = {
            plugins: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 30
                        }
                    },
                
                }
            },
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 3,
                    min: 1,
                    stepSize: 50,
                }
            }
          };


         const ref = React.createRef();

        if(this.state.meetingTimeLoading || this.state.participantsDataLoading || this.state.loading || this.state.loading2 || this.state.RatingGraphLoading || this.state.meetingGlobalInfoLoading || this.state.meetingMeanConfidenceLoading){
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
                    </ul>
                </nav>
            </div>
        </aside>
            <div class="page-container">
                <header class="header-desktop">
                    <div class="section__content section__content--p30">
                        <div class="container-fluid">
                            <div class="header-wrap">
                            <button class="btn btn-primary" disabled={this.state.pdfDisable} onClick={()=>{ 

                                this.setState({pdfDisable:true})
                                html2canvas(document.getElementById("myPage")) .then((canvas) => {
                                    const img = canvas.toDataURL('image/jpg');
                                    var pdf = new jsPDF({
                                        orientation: 'p', // landscape
                                        unit: 'pt', // points, pixels won't work properly
                                        format: [canvas.width, canvas.height] // set needed dimensions for any element
                                    });
                                    pdf.addImage(img, 'JPEG', 0, 0, canvas.width, canvas.height);
                                    pdf.save(this.state.meetid + '.pdf');
                                })

                                }}>Generate PDF</button>

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
                <div class="main-content" id="myPage">
                <div class="section__content section__content--p30">
                        <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card border border-primary">
                                    <div class="card-header">
                                        <strong class="card-title">Meeting:  {this.state.meetid}</strong>
                                    </div>
                                    <div class="card-body">
                                    <strong class="card-title">Description:</strong> {this.state.data2.data2.meeting}
                                    <div class="row" style={{marginTop:"20px"}}>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Total Audio Duration</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.meetingGlobalInfo.totalTime}
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Total Speech Duration</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.meetingGlobalInfo.totalSpeech}
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Number of Files Processed</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.meetingGlobalInfo.totalFiles}
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Mean transcription confidence</strong>
                                        </div>
                                        <div class="card-body">
                                            {this.state.meetingMeanConfidence.conf}
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Mood</strong>
                                        </div>
                                        <div class="card-body">
                                        {this.state.meetingMeanConfidence.mood}
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card-header">
                                            <strong class="card-title">Meeting Duration</strong>
                                        </div>
                                        <div class="card-body">
                                        {this.state.meetingTime.finalmin + "min"}
                                        </div>
                                    </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </div>



                            <div class="row">
                            <div class="col-md-2">
                                <div class="card" style={{height:"350px"}}>
                                    <div class="card-header" style={{backgroundColor: "#88adf7"}}>
                                        <strong class="card-title mb-3">Admin</strong>
                                    </div>
                                    <div class="card-body">
                                        <div class="mx-auto d-block">
                                            <img class="rounded-circle mx-auto d-block" src={this.state.participantsData.admin.foto} alt="Card image cap"/>
                                            <h5 class="text-sm-center mt-2 mb-1">{this.state.participantsData.admin.name}#{this.state.participantsData.admin.id}</h5>
                                        </div>
                                        <hr/>
                                        <h8>{this.state.participantsData.admin.mood}</h8>
                                        <hr/>
                                        <h8>Total Time: {Math.round(this.state.participantsData.admin.timeTotal * 10) / 10}</h8><br/>
                                        <h8>Speech Time: {Math.round(this.state.participantsData.admin.timeSpeech * 10) / 10}</h8>
                                    </div>
                                    </div>
                                </div>
                    

                           
                            {this.state.participantsData.participants.length>0 ?
                                this.state.participantsData.participants.map((data) => 
                                <div class="col-md-2">
                                <div class="card" style={{height:"350px"}}>
                                    <div class="card-header">
                                        <strong class="card-title mb-3">Participant</strong>
                                    </div>
                                    <div class="card-body">
                                        <div class="mx-auto d-block">
                                        <img class="rounded-circle mx-auto d-block" src={data.foto+ "&height=50&width=50&ext=1625393061&hash=AeT6JYDDtSjjn5fw4OE"} alt="Card image cap"/>
                                            <h5 class="text-sm-center mt-2 mb-1">{data.name + "#" + data.id}</h5>

                                        </div>
                                        <hr/>
                                        <h8>{data.mood}</h8>
                                        <hr/>
                                        <h8>Total Time: {Math.round(data.timeTotal * 10) / 10}</h8><br/>
                                        <h8>Speech Time: {Math.round(data.timeSpeech * 10) / 10}</h8>
                                    </div>
                                    </div>
                                </div>
                                )

                               :
                            <div></div>
                         }

                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <div class="card border border-primary">
                                    <div class="card-header">
                                        <strong class="card-title mb-3">Speech Duration</strong>
                                    </div>
                                    <div class="card-body">
                                        <Bar  data={ {
                                                labels:this.state.participantsData.partArray,
                                                datasets: [
                                                    {
                                                        label: 'Intervention Time',
                                                        data: this.state.participantsData.totalSpeech,
                                                        backgroundColor: [
                                                        'rgba(255, 99, 132, .6)',
                                                        ],
                                                        borderColor: [
                                                        'rgba(255, 99, 132, 1)',
                                                        ],
                                                        borderWidth: 1,
                                                    },
                                                {
                                                    label: 'Speaking Time',
                                                    data: this.state.participantsData.speech,
                                                    backgroundColor: [
                                                    'rgba(153, 255, 153, .6)',
                                                    ],
                                                    borderColor: [
                                                    'rgba(153, 255, 153, 1)',
                                                    ],
                                                    borderWidth: 1,
                                                }
                                                ],
                                                
    
                                                
                                            }}
                                            
                                            options= { {
                                                plugins: {
                                                    legend: {
                                                        labels: {
                                                            // This more specific font property overrides the global property
                                                            font: {
                                                                size: 30
                                                            }
                                                        },
                                                    
                                                    }
                                                },
                                                scale: {
                                                    ticks: {
                                                        font: {
                                                            size: 30
                                                        }
                                                    }
                                                }
                                            }}

                                            />
                                        </div>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="card border border-primary">
                                    <div class="card-header">
                                        <strong class="card-title mb-3">Rate of Speech</strong>
                                    </div>
                                    <div class="card-body">
                                        <Bar  data={{
                                            labels:this.state.participantsData.partArray,
                                            datasets: [
                                            {
                                                label:  'Rate of speech',
                                                data: this.state.participantsData.rate,
                                                yAxisID: 'B',
                                                backgroundColor: [
                                                'rgba(54, 236, 54, .6)',
                                                ],
                                                borderColor: [
                                                'rgba(54, 236, 54, 1)',
                                                ],
                                                borderWidth: 1,
                                            }
                                            ],
                                        }} 
                                        
                                        options= { {
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        // This more specific font property overrides the global property
                                                        font: {
                                                            size: 30
                                                        }
                                                    }
                                                }
                                            }
                                        }}/>
                                        </div>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="card border border-primary">
                                    <div class="card-header">
                                        <strong class="card-title mb-3">Individual speech time through the duration of the meeting</strong>
                                    </div>
                                    <div class="card-body">
                                        <Line  data={this.state.speechLineGraph.data}  options= { {
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        // This more specific font property overrides the global property
                                                        font: {
                                                            size: 30
                                                        }
                                                    }
                                                }
                                            }
                                        }} />
                                        </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card border border-primary">
                                    <div class="card-header">
                                        <strong class="card-title mb-3">Total Speech Time comparation</strong>
                                    </div>
                                    <div class="card-body">
                                        <Doughnut   data={this.state.speechLineGraph.data2} />
                                        </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card border border-primary">
                                    <div class="card-header">
                                        <strong class="card-title mb-3">Total Speech Time comparation</strong>
                                    </div>
                                    <div class="card-body">
                                    <Radar data={this.state.RatingGraph.data} options={options} />
                                        </div>
                                </div>
                            </div>
                            </div>
                        
                           
                              

                                <div class="row m-t-30">
                            <div class="col-md-12">
        
                                <div class="table-responsive m-b-40">
                                    <table class="table table-borderless table-data3">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Date</th>
                                                <th class="text-left">Text</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.data2!=null?
                                        this.state.data2.data.map((data) => 
                                            <tr>
                                                <td>{data.username + "#" + data.user}</td>
                                                <td>{new Date(parseInt(data.time)).toString()}</td>
                                                <td>{data.text}</td>
                                                <td> 
                                                <ReactAudioPlayer
                                                    src={"http://localhost:2000/" + data.audio}
                                                    controls
                                                    class="col-md-6"
                                                />
                                           </td>
                                            </tr>
                                          
                                          )

                                          :
                                       <div></div>
                                    }
                                        </tbody>
                                    </table>
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

  export default Stats;