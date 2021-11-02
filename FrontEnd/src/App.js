import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Cookies } from 'react-cookie';
import Mainpage from './Mainpage.js';
import Globalstats from './Globalstats.js';
import Login from './Login.js';
import Create from './Create.js';
import Active_meet from './Active_meet.js';
import Ended_meet from './Ended_meet.js';
import Room from './Room.js';
import Logout from './Logout.js';
import Stats from './Stats.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
import useSound from 'use-sound';
import boopSfx from './notification.mp3';
var done = false;
function App() {
  const [play] = useSound(boopSfx,{

    interrupt: true,
  });

  useEffect (()=>{
    if(!done){
      toast.configure();
      const ENDPOINT = "http://localhost:4000/";
      const cookies = new Cookies();
      const socket = socketIOClient(ENDPOINT);
      var count = 0;
      socket.emit("user", "" + cookies.get('id'))
      socket.on("" + cookies.get('id'), data => {
   
          var d = JSON.parse(data);
          count = count +1  ;
        
          switch(d.type){
              case "meetAboutoStart" : toast(d.message, {autoClose:false ,
                onClick:(()=>{fetch("http://localhost:4000/removeNotification?i="+cookies.get('id')+"&data="+d.notid).then(()=>window.location.href='./room?id=' + d.id)}) ,
                onClose:(()=>{fetch("http://localhost:4000/removeNotification?i="+cookies.get('id')+"&data="+d.notid);count--;(count==0?document.title = "MeetAnalyze"  :document.title = "(" + count +")MeetAnalyze"  ) })});  break; 
              case "meetStartes" : toast.warn(d.message, {autoClose:false ,
                onClick:(()=>{fetch("http://localhost:4000/removeNotification?i="+cookies.get('id')+"&data="+d.notid).then(()=>window.location.href='./room?id=' + d.id)}) ,
                onClose:(()=>{fetch("http://localhost:4000/removeNotification?i="+cookies.get('id')+"&data="+d.notid);count--;(count==0?document.title = "MeetAnalyze"  :document.title = "(" + count +")MeetAnalyze"  ) })});  break; 
              case "endedMeet" : toast.warn(d.message, {autoClose:false ,
                onClose:(()=>{fetch("http://localhost:4000/removeNotification?i="+cookies.get('id')+"&data="+d.notid);count--;(count==0?document.title = "MeetAnalyze"  :document.title = "(" + count +")MeetAnalyze"  ) })});  break; 
              case "confidence" : toast.warn(d.message, {autoClose:false ,
                onClose:(()=>{fetch("http://localhost:4000/removeNotification?i="+cookies.get('id')+"&data="+d.notid);count--;(count==0?document.title = "MeetAnalyze"  :document.title = "(" + count +")MeetAnalyze"  ) })});  break; 
        
                case "error" : toast.error(d.message);  break; 
          }
          document.title =  "(" + count +")MeetAnalyze"  ;
          play();
      }); 
      done = true;
    }
    const script = document.createElement('script');
        const script2 = document.createElement('script');
        const script3 = document.createElement('script');
        const script4 = document.createElement('script');
        const script5 = document.createElement('script');
        const script6 = document.createElement('script');
        const script7 = document.createElement('script');
        const script8 = document.createElement('script');
        const script9 = document.createElement('script');
        const script10 = document.createElement('script');
        const script11 = document.createElement('script');
        const script12 = document.createElement('script');
        const script13 = document.createElement('script');
        const script14 = document.createElement('script');

        script.src = "vendor/jquery-3.2.1.min.js";
        script.async = true;
        document.body.appendChild(script);

        script2.src = "vendor/bootstrap-4.1/popper.min.js";
        script2.async = true;
        document.body.appendChild(script2);

        script3.src = "vendor/bootstrap-4.1/bootstrap.min.js";
        script3.async = true;
        document.body.appendChild(script3);

        script4.src = "vendor/slick/slick.min.js";
        script4.async = true;
        document.body.appendChild(script4);

        script5.src = "vendor/wow/wow.min.js";
        script5.async = true;
        document.body.appendChild(script5);

        script6.src = "vendor/animsition/animsition.min.js";
        script6.async = true;
        document.body.appendChild(script6);

        script7.src = "vendor/bootstrap-progressbar/bootstrap-progressbar.min.js";
        script7.async = true;
        document.body.appendChild(script7);

        script8.src = "vendor/counter-up/jquery.waypoints.min.js";
        script8.async = true;
        document.body.appendChild(script8);

        script9.src = "vendor/counter-up/jquery.counterup.min.js";
        script9.async = true;
        document.body.appendChild(script9);

        script10.src = "vendor/circle-progress/circle-progress.min.js";
        script10.async = true;
        document.body.appendChild(script10);
        
        script11.src = "vendor/perfect-scrollbar/perfect-scrollbar.js";
        script11.async = true;
        document.body.appendChild(script11);

        script12.src = "vendor/chartjs/Chart.bundle.min.js";
        script12.async = true;
        document.body.appendChild(script12);

        script13.src = "vendor/select2/select2.min.js";
        script13.async = true;
        document.body.appendChild(script13);

        script14.src = "js/main.js";
        script14.async = true;
        document.body.appendChild(script14);
  })
  
  const cookies = new Cookies();
  if(cookies.get('valid')==1){
      return (
        <Router>
          <Switch>
          <Route path="/logout">
              <Logout />
          </Route>
          <Route path="/globalstats">
              <Globalstats />
          </Route>
          <Route path="/activemeets">
              <Active_meet />
          </Route>
          <Route path="/endedmeets">
              <Ended_meet />
            </Route>
          <Route path="/room">
              <Room />
          </Route>
          <Route path="/stats">
              <Stats />
            </Route>
          <Route path="/create">
              <Create />
            </Route>
            <Route path="/">
              <Mainpage />
            </Route>
          </Switch>
        </Router> 
    );
  }else{
      return (
        <Login />
    );
  }

  
}

export default App;
