import "./dialer.css"
import React, { Component } from 'react';

import {
  PhoneIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid'

/**
 * DialerComponent: Component rendering a number input.
 * Required props:
 * - 'calling': the current calling state,
 * - 'onCall': the call callback,
 * - 'onHangUp': the hangup callback.
 */
export default class DialerComponent extends Component
{
    // State object
    state = {
        // The current number
        number : ''
    }

    // Method called to update the calling state
	setCalling(calling)
	{
        if ( calling )
        {
            // Running the onCall callback
            this.props.onCall(this.state.number);
        }
        else
        {
            // Running the onHangUp callback
            this.props.onHangUp();
        }
	}
    
    /** Do not mutate state directly. Use setState() */
    // Render method
	render()
	{
        // Event's callback of the dial's alphanumeric buttons
        const numberInput = (event) => {
            this.state.number += event.target.innerText;
            this.setState(this.state);
        }

        // Event's callback of the dial's delete button
        const numberDelete = (event) => {
            this.state.number = this.state.number.slice(0, -1);
            this.setState(this.state);
        }

        // Event's callback of the dial's text input
        const numberChange = (event) => {
            this.state.number = event.target.value;
            this.setState(this.state);
        }

		return (
        <>
            <form className="max-w-sm mx-auto bg-slate-400 rounded-lg">
                
                <div className="relative">
                
                    <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 light:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
                            <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.    217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z"/>
                        </svg>
                    </div>
                
                    {/* Dial text input */}
                    <input 
                        type="text" 
                        id="phoneNumber" 
                        aria-describedby="helper-text-explanation" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500 h-16 " 
                        // pattern="[0-9]{8}" 
                        placeholder="12345678" 
                        required 
                        value={this.state.number}
                        onChange={numberChange}
                    />

                </div>

                {/* Dial keyboard */}
                <div className="keyboard mb-8 grid grid-cols-4 grid-rows-4 gap-1 w-full font-bold select-none">
                    
                    <button onClick={numberInput} type="button">7</button>
                    <button onClick={numberInput} type="button">8</button>
                    <button onClick={numberInput} type="button">9</button>
                
                    <button onClick={numberDelete} type="button" className="bg-red-500 hover:bg-red-700 text-white">
                        <ArrowLeftIcon className="h-6 w-6 shrink-0" aria-hidden="true"></ArrowLeftIcon>
                    </button>
                    
                    <button onClick={numberInput} type="button">4</button>
                    <button onClick={numberInput} type="button">5</button>
                    <button onClick={numberInput} type="button">6</button>
                    <button onClick={numberInput} type="button">+</button>

                    <button onClick={numberInput} type="button">1</button>
                    <button onClick={numberInput} type="button">2</button>
                    <button onClick={numberInput} type="button">3</button>

                    {/* Call (and hangup) button */}
                    <button 
                        type="button" 
                        className={"row-span-2 text-white " + (this.props.calling ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")} 
                        onClick={() => this.setCalling(!this.props.calling)}
                    >
                        <PhoneIcon className="h-6 w-6 shrink-0 phone" aria-hidden="true"></PhoneIcon>
                    </button>

                    <button onClick={numberInput} type="button">#</button>
                    <button onClick={numberInput} type="button">0</button>
                    <button onClick={numberInput} type="button">*</button>

                </div>
            </form>
        </>
		);
	}
}
