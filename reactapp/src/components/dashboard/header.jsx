import React from 'react';
import CallComponent from '../call/call';
import DialerComponent from '../helpers/dialer';
import axios from 'axios';

import {
  PhoneIcon,
  PhoneXMarkIcon,
  MicrophoneIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid'

import Timer from '../helpers/timer';


export default class headerComponent extends React.PureComponent{
 
  state = {
    showDialer: false,
    fullName: "",
  };

  loadData = () => {     
    axios.get('http://localhost:8000/card/getInfo',{
      params: {
        phone: this.props.callNumber
      },
      headers: {
          "ngrok-skip-browser-warning": "true"
      }
    })
    .then((response) => {
        console.log(response.data)
        this.setState({fullName: response.data})
    })
    .catch(function(error) {
        console.log(error);
    });  
  };

  render(){    
    
    if (this.props.calling) {
      this.loadData()
    }
    
    console.log(this.props.muted)

    return (
      <>  

        <div className="call-status-bar flex justify-between items-center text-white h-full">
            
            {/* Casll Information */}
            <div className="call-info flex h-full w-1/3 gap-4 items-center">
              
              {/* Profile picture */}
              <img className="h-full rounded-full" src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg" alt="Rounded avatar"></img>

              <div > 
                <p>Name: {this.state.fullName}</p>
                <p>Calling: {this.props.callNumber}</p>
              </div>

            </div>

            {/* Call duration */}
            <div className="call-info w-1/3 text-center">
                <p className='text-xl m-auto'>Duration: <Timer started={this.props.calling}/></p>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons flex w-1/3 gap-4 h-full justify-end">
              
              <button className="bg-red-600 hover:bg-red-700 h-full rounded-lg w-20" onClick={this.props.hangUp} disabled={!this.props.calling}>
                <PhoneXMarkIcon className="h-10 w-10 place-content-center m-auto" aria-hidden="true"></PhoneXMarkIcon>
              </button>

              <button onClick={this.props.muting} className={"h-full rounded-lg w-20 " + (this.props.muted ? "bg-red-600 hover:bg-red-700 " : "bg-blue-600 hover:bg-blue-700")}>Mute</button>

              <button onClick={() => this.setState({showDialer: !this.state.showDialer})} className="bg-blue-600 hover:bg-blue-700 h-full rounded-lg w-20">Dialer</button>

              {/* Render Popup Dialer */}
              <div className={this.state.showDialer ? '' : 'hidden'}>
              
              <DialerComponent 
							  calling={this.props.calling}
							  onCall={(number) => this.props.call(number)}
                onHangUp={this.props.hangUp}
						  />

            </div>  

              {/* {this.state.showDialer && <CallComponent onClose={() => this.setState({ showPopupDialer: false })} />} */}

            </div>

        </div>
    </>
  );
  }
}
