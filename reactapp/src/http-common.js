import axios from "axios";

// Axios factorized configuration
const instance = axios.create({
	// Url used for the backedn calls
	baseURL: "http://localhost:8000",

	// The headers to include for all calls
	headers: {
		"Content-type": "application/json",
		"ngrok-skip-browser-warning": "true",
	},
});


// Set the access token (if it exists) to the header by default
let access_token = localStorage.getItem('access_token');

if ( access_token !== null )
{
	instance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
}

// Automatic token refresh interceptor
let refresh = false;

instance.interceptors.response.use(
	response => response, 
	async error => { 
		
		// Get the current access token
		let access_token = localStorage.getItem('access_token');

		// If the query has been refused (401) for a login user (access_token != null).
		if (error.response.status === 401 && !refresh && access_token !== null )
		{
			refresh = true;

			// Send and wait a token refresh query
			const refresh_res = await instance.post(
				'/accounts/token/refresh', 
				{ refresh: localStorage.getItem('refresh_token') }, 
				{ withCredentials: true }
			);
				
			if (refresh_res.status === 200)
			{
				const authorization = `Bearer ${refresh_res.data['access']}`;

				instance.defaults.headers.common['Authorization'] = authorization;
				error.config.headers.Authorization = authorization;

				localStorage.setItem('access_token' , refresh_res.data.access );
				localStorage.setItem('refresh_token', refresh_res.data.refresh);
				
				// Re-run the previous query
				return instance(error.config);
			}
		}
		
		// Raise the current error.
		refresh = false;
		return Promise.reject(error);
	
	}
);

export default instance;