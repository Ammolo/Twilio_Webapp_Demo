import { Device, Call } from '@twilio/voice-sdk';

import React from 'react';

import Timer from '../helpers/timer';
import DialerComponent from '../helpers/dialer';

import MountedComponent from "../mounted_component";

import http from "../../http-common";

/**
 * CallComponenent: MountedComponent representing the main component of the call page.
 * This component automatically loads information (dialer token) from the django server.
 * 
 * Link pathname: /dialer/token
 */
export default class CallComponent extends MountedComponent
{
	// Twilio device attribute
	device = undefined;

	start_time = undefined;

	//State object
	state = {
		// The current state of the call (true for the current call, false otherwise)
		'calling': false
	}

	//Link Pathnames
	method = 'get';
	path = '/dialer/token';

	headers = {
		'ngrok-skip-browser-warning': 'true'
	}

	constructor() {		
		super();
	}	
		
	// Loader for the twilio device
	loadDevice(data)
	{
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

		device.on("ready", device => console.log("Twilio.Device Ready!"));
		device.on("error", error => console.log("Twilio.Device Error: " + error.message));
		device.on("connect", connection => console.log('Successfully established call ! '));		
		device.on("disconnect", connection => console.log("Call ended."));	

		// Save
		this.device = device;
	}

	// Call callback; This method is called when the user executes the call
	call(phoneNumber)
	{
		console.log("Calling:", phoneNumber);
		
		// Setup start time
		this.start_time = new Date();

		// Update the calling state
		this.state.calling = true;
		this.setState(this.state);

		if ( this.device != undefined ) 
		{
			const outgoingConnection = this.device.connect({ params: {To: phoneNumber }});

			// Outgoing connection establish
			outgoingConnection.then(call => {

				// Error callback
				call.on('error', error => {
	
					console.error("Twilio.Call: Application error!");
					this.hangup();
				});

				console.log(this.device.calls);
			});

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
			'duration': Math.ceil((new Date() - this.start_time) / 1000 )
		});
		
		// Update the calling state
		this.state.calling = false;
		this.setState(this.state);
	}

	// Render method; this method is called every render
	// (each update of the state variable) after fetching data from the Django server
	loaded(data)
	{
		// Load the device if it is not loaded
		if ( this.device == undefined )
		{
			this.loadDevice(data);
		}

		return (
			<>
				<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<svg className="mx-auto h-10 w-auto text-gray-500 light:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
							<path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z"/>
						</svg>
						<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
							Call dial
						</h2>
					</div>
	
					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

						{/* Device loading error message */}
						{ this.device == undefined ? (
							<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 light:bg-gray-800 light:text-red-400" role="alert">
								<span className="font-medium">Can't create the twilio device.</span> 
							</div>
						) : '' }

						{/* Dial */}
						<DialerComponent 
							calling={this.state.calling}
							onCall={(number) => this.call(number)}
							onHangUp={() => this.hangup()}
						/>
	
						{/* Timer */}
						<div className="mb-8 text-center">
							<Timer started={this.state.calling} />
						</div>

					</div>
	
				</div>
			</>
		);
	}
}
