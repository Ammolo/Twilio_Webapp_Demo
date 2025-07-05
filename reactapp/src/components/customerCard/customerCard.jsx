import React, { Component} from 'react';

import axios from "axios";

export default class CustomerCardComponenet extends Component
{ 
    
    /** uploaded file */
    file = null;

    /** state variables for the inpu form */
    state = {
        disabled: true,
    } 

    /** function that updates the state(field) during input */
    inputChange = (e) => {
        console.log({[e.target.id]: e.target.value})
        this.setState({[e.target.id]: e.target.value})
    }

    /** updates file state */
    handleFile = (e) => {
        this.file = e.target.files[0]
    };

    /** fucntion to send a get request to retrieve next customer */
    loadData = () => {                
        axios.get('http://localhost:8000/card/getCC',{
            headers:{
                "ngrok-skip-browser-warning": "true"
              }
        })
        .then((response) => {
            this.setState(response.data)               
        })
        .catch(function(error) {
            console.log(error);
        });  
    };

    toggleDisplay = () => {
        this.setState({ disabled: !this.state.disabled });
    }

    sendData = (type) => {        
        let path = 'http://localhost:8000/card/import'

        const data = new FormData();

        //Post file to SQL database in backend
        const headers = {
            'Content-Type': 'multipart/form-data',
        }
        
        /** checks if file or form has been passed */
        if (type.target.name == 'csv'){
            /** appends the data from the file that user uploaded */
            data.append('csv', this.file)
        } else {
            Object.entries(this.state).forEach(([key, value]) => {
                console.log(value)
                data.append(key, value);
            });
        }

        /** Axios call that sends the csv data */
        axios.post(path, data, {
            headers
          })
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
            console.log(error);
        });
    };

    call = (number) => {
        this.props.dialCustomer(number)
    }
    
    render(){
        return(
            <div className=" w-full h-full content-center grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
                    <input onChange={this.inputChange} type="text" id="firstName" value={this.state.firstName} disabled={this.state.disabled} className="input_field h-20"/>
                </div>
                <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                    <input onChange={this.inputChange} type="text" id="lastName" value={this.state.lastName} disabled={this.state.disabled} className="input_field h-20"/>
                </div>
                    
                <div>
                    <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                    <input onChange={this.inputChange} type="text" id="age" value={this.state.age} disabled={this.state.disabled} className="input_field h-20"/>
                </div>  
                    
                <div>
                    <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                    <input onChange={this.inputChange} type="text" id="gender" value={this.state.gender} disabled={this.state.disabled} className="input_field h-20"/>
                </div>
                    
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input onChange={this.inputChange} type="text" id="email" value={this.state.email} disabled={this.state.disabled} className="input_field h-20"/>
                </div>
                    
                <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                    <div className='flex gap-2'>
                        <input onChange={this.inputChange} type="text" id="phone" value={this.state.phone} disabled={this.state.disabled} className="input_field h-20"/>

                        <button className='bg-green-500 hover:bg-green-600 w-20 rounded-lg h-20' onClick={() => this.call(this.state.phone)}>Call</button>
                    </div>
                </div>
                    
                <div>
                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                    <input onChange={this.inputChange} type="text" id="address" value= {this.state.address} disabled={this.state.disabled} className="input_field h-20"/>
                </div>

                <div>
                    <label htmlFor="zipcode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zipcode</label>
                    <input onChange={this.inputChange} type="text" id="zipcode" value= {this.state.zipcode} disabled={this.state.disabled} className="input_field h-20"/>
                </div> 
                    
                <div>
                    <button onClick={this.loadData} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-3.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full h-full rounded-lg'>Get Next Customer</button>
                </div>

                <div className="flex gap-2">
                    <button onClick={this.toggleDisplay} className='text-white bg-blue-700 hover:bg-blue-800 font-medium text-sm px-5 py-3.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg w-full'>Edit Customer Card</button>
                    <button onClick={this.sendData} className='text-white bg-blue-700 hover:bg-blue-800 font-medium text-sm px-5 py-3.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg w-full'>Send Customer Card</button>
                </div>

                {/* Upload csv */}
                <div className='text-white bg-blue-700 hover:bg-blue-800 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg w-full h-20'>
                    <label htmlFor="csv_file">Import Customer Card from CSV:</label>
                    <input type="file" id="csv" name="csv" onChange={this.handleFile}/>
                </div>

                <div>
                    <button onClick={this.sendData} name="csv" className='text-white bg-blue-700 hover:bg-blue-800 font-medium text-sm px-5 py-3.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg w-full h-20'>Send CSV</button> 
                </div>
            </div>
        );
    }
}