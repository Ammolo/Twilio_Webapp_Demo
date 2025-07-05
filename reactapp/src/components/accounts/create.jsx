import { Component } from "react";
import { Navigate } from 'react-router-dom';

import create_submission from "../../services/form_service";

export default class CreateComponent extends Component
{
    state = {
        'redirect': false,
		'error': undefined
    }

    render()
    {
        const submit = create_submission(
			response => { this.setState({ 'redirect': true , 'error': undefined }); },
			error    => { this.setState({ 'redirect': false, 'error': error.response.data }); }
		);
        
        return <>
            { this.state.redirect ? <Navigate to="/dashboard" /> : '' }

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                      	Create user
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

					{ this.state.error != undefined && this.state.error.detail != undefined ? (
						<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 light:bg-gray-800 light:text-red-400" role="alert">
							<span className="font-medium">{ this.state.error.detail }</span> 
						</div>
					) : '' }

                    <form 
						className="space-y-6" 
						action="/accounts/create"
                        method="post" 
                        onSubmit={submit}
					>
                      	<div>
						  	{ this.state.error != undefined && this.state.error.email != undefined ? (
								<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 light:bg-gray-800 light:text-red-400" role="alert">
									<span className="font-medium">{ this.state.error.email }</span> 
								</div>
							) : '' }

							<label htmlFor="id_email" className="block text-sm font-medium leading-6 text-gray-900">
								Email address
							</label>
							<div className="mt-2">
								<input
									id="id_email"
									name="email"
									type="email"
									autoComplete="email"
									maxLength="255"
									autoFocus
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

                        <div>
							{ this.state.error != undefined && this.state.error.password2 != undefined ? (
								<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 light:bg-gray-800 light:text-red-400" role="alert">
									<span className="font-medium">{ this.state.error.password2 }</span> 
								</div>
							) : '' }

							<div className="flex items-center justify-between">
								<label htmlFor="id_password1" className="block text-sm font-medium leading-6 text-gray-900">
									Password
								</label>

							</div>
							<div className="mt-2">
								<input
									id="id_password1"
									name="password1"
									type="password"
									autoComplete="new-password"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label htmlFor="id_password2" className="block text-sm font-medium leading-6 text-gray-900">
									Confirm password
								</label>
					
							</div>
							<div className="mt-2">
								<input
									id="id_password2"
									name="password2"
									type="password"
									autoComplete="new-password"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							>
								Update
							</button>
						</div>
					</form>

				</div>
			</div>
        </>;
    }
}
