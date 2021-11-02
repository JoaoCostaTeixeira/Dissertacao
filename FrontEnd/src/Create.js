import React from 'react';
import { Cookies } from 'react-cookie';
import configRest from './endpointconfig.json';

class Create extends React.Component {
     
    constructor(props) {
        super(props);
        this.state ={
            name : "",
            foto : "",
            id :0,
            email : "",
            loading : true,
            date : new Date(),
            description : ""
          };
    }

    componentDidMount(){
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

        const cookies = new Cookies();

        this.setState({id :  cookies.get('id'), name : cookies.get('name'), email : cookies.get('email'),foto : cookies.get('foto'), loading:false})


    
    }
    onCalendarChange = (response) => {
        var date2 = new Date(response.target.valueAsNumber);
        var date3 = this.state.date;
        date3.setDate(date2.getDate());
        date3.setMonth(date2.getMonth());
        date3.setFullYear(date2.getFullYear());
        this.setState({date:date3})
        console.log(date3.getTime())
      }

      onCalendarChange2 = (response) => {
        var date2 = new Date(response.target.valueAsNumber);
        var date3 = this.state.date;
        date3.setHours(date2.getHours()-1);
        date3.setMinutes(date2.getMinutes());
        this.setState({date:date3})
      }

      onCalendarChange3 = (response) => {
        this.setState({text:response.target.value})
      }

      onSubmit = (respoe) => {
          console.log("ASDASD")
        fetch(configRest.Create + '/create?i=' +  this.state.id + "&t=" + this.state.date.getTime() + "&d=" + this.state.text)
        .then(response => response.json())
        .then(data => {
          if(data.valid===1){
            window.location.href='./Active?name=' + data.name;
          }
        }); 
      }
    render() {
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
                            <div class="col-lg-12">
                           
                                 
                                        <hr/>
                                        <form action="" method="post" novalidate="novalidate">

                                            <div class="form-group has-success">
                                                <label for="cc-name" class="control-label mb-1">Description</label>
                                                <input onChange={this.onCalendarChange3} id="cc-name" name="cc-name" type="text" class="form-control cc-name valid" data-val="true" data-val-required="Please enter the name on card" autocomplete="cc-name" aria-required="true" aria-invalid="false" aria-describedby="cc-name-error"/>
                                                <span class="help-block field-validation-valid" data-valmsg-for="cc-name" data-valmsg-replace="true"></span>
                                            </div>
                                            <div class="row">
                                                <div class="col-6">
                                                    <div class="form-group">
                                                        <label for="cc-exp" class="control-label mb-1">Start Date</label>
                                                       
                                                            <input onChange={this.onCalendarChange} type="date" id="start" name="trip-start"/>
                                                            <input onChange={this.onCalendarChange2} type="time" id="start2" name="trip-start2"/>
         
                                                         <span class="help-block" data-valmsg-for="cc-exp" data-valmsg-replace="true"></span>
                                                    </div>  
                                                </div>
                
                                            </div>
                                           
                                        </form>
                                        <div>
                                                <button onClick={this.onSubmit} id="payment-button" type="submit" class="btn btn-lg btn-info btn-block">
                                                   &nbsp;
                                                    <span id="payment-button-amount">Create</span>
                                                    
                                                </button>
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

  export default Create;