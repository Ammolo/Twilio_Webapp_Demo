import { Component } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import LoginComponent from './components/accounts/login';
import LogoutComponent from './components/accounts/logout';
import ProfileComponent from './components/accounts/profile';
import CreateComponent from './components/accounts/create';
import DashboardComponent from './components/dashboard/dashboard';
import PasswordChangeComponent from './components/accounts/password_change';

import CallComponent from './components/call/call';
import CallHistoryComponent from './components/callhistory/callhistory';

import StatisticsComponent from './components/statistics/stats';


class App extends Component {


	render() {
		return (
			<>
				<main className="lg:pl-20 dark:bg-gray-700 h-screen overflow-hidden">
						
					<Routes>
						
						{/* Root Path Navigates to Login Page if user not logged in */}
						{/* Maybe here to check if user is logged in?? */}
						<Route exact path="/" element={<Navigate to="/accounts/login" replace />}/>

						{/* Routes for dashboard functions */}
						<Route exact path="/Dashboard" element={<DashboardComponent/>} />
						
						{/* Routes for account functions */}
						<Route exact path="/accounts/login" element={<LoginComponent />} />
						<Route exact path="/accounts/profile" element={<ProfileComponent />} />
						<Route exact path="/accounts/logout" element={<LogoutComponent />}/>
						<Route exact path="/accounts/create" element={<CreateComponent />}/>
						<Route exact path="/accounts/password/change" element={<PasswordChangeComponent />}/>
						
						{/* Routes for calling functions */}
						<Route exact path="/call" element={<CallComponent/>} />
						<Route exact path="/callhistory" element={<CallHistoryComponent/>} />

						{/* Routes for statistics */}
						<Route exact path="/statistics" element={<StatisticsComponent/>} />
						
						{/* Routes for CustomerCard */}
						{/* <Route exact path="/card/import" element={CustomerCardComponenet}/> */}
						</Routes>
				</main>
			</>
		)
	}
}

export default App;


