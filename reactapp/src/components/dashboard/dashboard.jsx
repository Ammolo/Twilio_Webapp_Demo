import React from 'react';

import { Device } from '@twilio/voice-sdk';

import CustomerCard from '../customerCard/customerCard';
import NotesComponent from '../helpers/notes';
import CallHistoryComponent from '../callhistory/callhistory';
import http from "../../http-common";
import Header from './header'

/** Grid and widget system */
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";

/** Css import to enable the resizing of components */
import 'react-grid-layout/css/styles.css';
import MountedComponent from '../mounted_component';

const ResponseGridLayout = WidthProvider(Responsive);

export default class DashboardComponent extends MountedComponent{

  /* Twilio device attribute*/
	activeConnection = undefined;
	activeCall = undefined;

  device = undefined;
	start_time = undefined;
  
  // Link pathname
  method = 'get';
  path = '/dialer/token';
  
  headers = {
    'ngrok-skip-browser-warning': 'true'
  }
  
  /** state to see if dashboard is in editing mode */
  state = {  
    call: null,
    muted: false, 
    editing: false,
    phone: "",
    'calling': false
  }
  
  /** constructor */
  constructor(props){
    super(props)
  }

  /** add witgets to import here */
  widgets = [
    /** 2 */
    CallHistoryComponent,
    /** 3 */
    NotesComponent,
  ]

  /** common attributes for all props */
  static defaultProps = {
    
    compactType: null,
    
    preventCollision: true,
    
    maxRows: 11,

    /** TODO: write a function to make this also claucalte optimal row height and max rows
     * basd on the grid specifications
    */    
    rowHeight: (window.innerHeight - (12))/12,
    
    /** defines the breakpoints for different screen sizes */
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    
    /** Number of colums for th different types of breakpoints */
    cols: { lg: 20, md: 8, sm: 6, xs: 4, xxs: 2 },

    /** Standard screen layouts for the different breakpoints */
    layouts: {
      lg: [
        /** --------- Left Column --------- */
        /** Call History  */
        { i: '0', x: 0, y: 7, w: 14, h: 4 },
        
        /** Notes */
        { i: '1', x: 14, y: 1, w: 6, h: 10 },
        
        /** --------- MID COLUMN --------- */
        /** Customer Card */
        { i: 'CustomerCard', x: 0, y: 1, w: 14, h: 6 },

        /** Dialer Status  */
        { i: 'DialerStatus', x: 0, y: 0, w: 17, h: 1 },
        
        /** Settings Panel */
        { i: 'settings', x: 17, y: 0, w: 3, h: 1, static: true},
        
      ],
    }
  };

  /** Generated elements based off the imported component list */
  generateWidgets() {
    return this.widgets.map((Widget, index) => (              
        <div key={index} className=' bg-gray-500 rounded-lg shadow-lg p-4 relative'>
            <Widget />
        </div>          
    ));
  } 

  /** enables and diables the edition of the dashboard components */
  editMode = () => {
    this.setState({["editing"]: !this.state.editing})
  }
  
  // Loader for the twilio device
  loadDevice(data)
	{
		
		console.log('Token:', data.token);

		const device = new Device(data.token, {

			// Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
			// providing better audio quality in restrained network conditions. Opus will be default in 2.0.
			codecPreferences: ["opus", "pcmu"],
			
			// Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
			// but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
			// a second time and sending the tone twice. This will be default in 2.0.
			fakeLocalDTMF: true,
			
			// Use `enableRingingState` to enable the device to emit the `ringing`
			// state. The TwiML backend also needs to have the attribute
			// `answerOnBridge` also set to true in the `Dial` verb. This option
			// changes the behavior of the SDK to consider a call `ringing` starting
			// from the connection to the TwiML backend to when the recipient of
			// the `Dial` verb answers.
			enableRingingState: true,
			
			debug: true,
		})
		
		/** state catch functions */
		device.on("ready", device => {
      console.log("Twilio.Device Ready!")}
    );
		
    device.on("error", error => {
      console.log("Twilio.Device Error: " + error.message)});
		
    device.on("connect", connection => {
      console.log('Successfully established call ! ')
    });		
		
    device.on("disconnect", connection => {
      console.log("Call ended.")}
    );	

		/** Save the device */
		this.device = device;
	}

	// Call callback ; This method is called when the user executes the call
	call(phoneNumber)
	{
		console.log("Calling:", phoneNumber);
		
		// Setup start time
		this.start_time = new Date();

		// Update the calling state
		this.state.calling = true;
		
    this.setState({
      calling: true,
      phone: phoneNumber
    });

		if ( this.device != undefined ) 
		{
			this.activeConnection = this.device.connect({ params: {To: phoneNumber }});

			/** Outgoing connection establish*/ 
			this.activeConnection.then(call => {
      this.activeCall = call
      
      /** if recipient disconnects run hangup function */
      call.on('disconnect', (connection) => {
        this.hangup()
      })        
      
      /** Error callback */
      call.on('error', error => {
        console.error("Twilio.Call: Application error!");
        this.hangup();
      })

				console.log(this.device.calls);
			});
		}
	}
  
  /**mutes the User */
  mute(){
    /** Cheks to see if there is an active call */
    if (this.activeCall){
      /**Mutes User */
      this.activeCall.mute(!this.state.muted)
      this.setState({muted: !this.state.muted})
    } else {
      this.setState({muted: !this.state.muted})
    }
  }

	// Hangup callback ; This method is called when the user ends the call
	hangup() 
	{ 
    /** disconnects all connections from device */
    this.device.disconnectAll()
    
		// Save the call in db
		http.post('/call/create', {
			'start': this.start_time.toISOString(), 
			'duration': Math.ceil( (new Date() - this.start_time) / 1000 )
		});
		
		/** Updates the calling state and reset active call and connection */
		this.state.calling = false
    this.activeCall = undefined
    this.activeConnection = undefined

		this.setState(this.state)
	}

  loaded(data){    
    
    /** Loads twilio device if not loaded */
    if (this.device == undefined){
      this.loadDevice(data)
    }

    /** Should create a standard layout */
    return (
      <>  
        <div className=' overflow-hidden'>
          <ResponseGridLayout
              
            /** definition for the standard layout and state of widgets */
            layouts = {this.layouts}
            
            onLayoutChange = {this.onLayoutChange}

            /** variables that decide if the widgets are editable */
            isDraggable = {this.state.editing}
            isResizable = {this.state.editing}

            /** imports the default properties */
            {...this.props} 
            >

            {/* Generates all the Widgets */}
            {this.generateWidgets()}

            {/* Settings Bar */}
            <div key={'settings'} className=' bg-gray-500 rounded-lg shadow-lg p-4 relative'>
              <button onClick={this.editMode} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full h-full rounded-lg'>
                {this.state.editing ? 'Disable Edit Mode' : 'Enable Edit Mode'}
              </button>
            </div>  

            <div key={'CustomerCard'} className=' bg-gray-500 rounded-lg shadow-lg p-4 relative'>
              <CustomerCard 
              dialCustomer = {(phoneNumber) => this.call(phoneNumber)}/> 
            </div>
            
            <div key={'DialerStatus'} className=' bg-gray-500 rounded-lg shadow-lg p-4 relative'>
             
              <Header
                callNumber = {this.state.phone}
                calling = {this.state.calling}
                muted = {this.state.muted}

                call = {(phoneNumber) => this.call(phoneNumber)} 
                
                hangUp ={() => this.hangup()}
                muting = {() => this.mute()}

                setName = {(fullName) => this.setName(fullName)}
                
              /> 
            </div>
          </ResponseGridLayout>
        </div>
    </>
  );
  }
}
