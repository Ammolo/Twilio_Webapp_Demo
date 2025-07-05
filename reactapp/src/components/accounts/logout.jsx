import { Navigate } from 'react-router-dom';
import http from "../../http-common";

import MountedComponent from '../mounted_component';

export default class LogoutComponent extends MountedComponent
{
    method = 'post';
    path = '/accounts/logout';

    headers = { withCredentials: true };

    parameters = (() => ({ refresh_token: localStorage.getItem('refresh_token') }));

    constructor() { super(); }
    
    loaded(details)
    {
        localStorage.clear();
        
        http.defaults.headers.common['Authorization'] = null;

        return <Navigate to="/accounts/login" />;
    }
}
