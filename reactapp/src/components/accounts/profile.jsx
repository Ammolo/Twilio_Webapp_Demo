import React from 'react';
import { Link } from 'react-router-dom';
import MountedComponent from '../mounted_component';

export default class ProfileComponent extends MountedComponent {
    path = '/accounts/profile';

    constructor() {
        super();
    }

    loaded(details) {
        const user = details.current_user;

        return (
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 h-fit">
                <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="text-center">
                        <img
                                className="mx-auto h-24 w-24 rounded-full"
                                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                alt="User Avatar"
                            />
                            <h1 className="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                {"Agent Agentsson"}
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                {user.email}
                            </p>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Account Details
                            </h2>
                            <ul className="mt-2 space-y-4 text-gray-700">
                                <li>
                                    <span className="font-medium">Username:</span> {user.email}
                                </li>
                            </ul>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Settings
                            </h2>
                            <ul className="mt-2 space-y-4">
                                <li>
                                    <Link 
                                        to="/accounts/password/change"
                                        className="block w-full text-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Change Password
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/accounts/password/create"
                                        className="block w-full text-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Create User
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/accounts/logout"
                                        className="block w-full text-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                    >
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
