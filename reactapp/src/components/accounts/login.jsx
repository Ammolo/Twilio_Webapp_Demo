import { Component } from "react";
import { Navigate } from 'react-router-dom';
import http from "../../http-common";

import create_submission from "../../services/form_service";

export default class LoginComponent extends Component
{
    state = {
        'redirect': false,
		'error': false
    }

    render()
    {
		const submit = create_submission(
			response => {
				let data = response.data;

				http.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

				// Initialize the access & refresh token in localstorage.      
				localStorage.clear();
				localStorage.setItem('access_token' , data.access );
				localStorage.setItem('refresh_token', data.refresh);
		
				this.setState({ 'redirect': true, 'error': false });
			},
			error => {
				this.setState({ 'redirect': false, 'error': true });
			},
			{ withCredentials: true }
		);

        return <>
            { this.state.redirect ? <Navigate to="/dashboard" /> : '' }
			
			{/* IF SIGNED IN REDIRECT TO DASHBOARD */}

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                      	Sign in to your account 
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					
					{ this.state.error ? (
						<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 light:bg-gray-800 light:text-red-400" role="alert">
							<span className="font-medium">Email and password doesn't match.</span> 
						</div>
					) : '' }

                    <form 
						className="space-y-6" 
						onSubmit={submit} 
						method="post"
						action="/accounts/token"
					>
                      	<div>
							<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
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
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
									Password
								</label>
								
								{/*Todo: Redirect to reset password*/} 

								<div className="text-sm">
									<a href="#" className="font-semibold text-primary hover:text-secondary">
										Forgot password?
									</a>
								</div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary 0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							>
								Sign in
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm text-gray-500">
						Not a member?{' '}
						<a href="#" className="font-semibold leading-6 text-primary hover:text-secondary">
							Start a 14 day free trial
						</a>
					</p>
				</div>
			</div>
        </>;
    }
}
