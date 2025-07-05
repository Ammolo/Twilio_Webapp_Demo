import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import http from "../http-common";

import LoadingComponent from './helpers/loading';
import { ViewColumnsIcon } from '@heroicons/react/20/solid';

/**
 * MountedComponent: Generic component helping linked the react app with the django server
 * Overload possibilities:
 * - authentication_required (boolean): true is the authentication is required
 * - method (enum): the query method
 * - path (string): the query pathname
 * - headers (object): the query headers
 * - parameters (function () => object): must return the query parameters (object)
 * - loaded(data): method called when the data has been retrieved.
 */
export default class MountedComponent extends Component
{
    // Overload possibilities
    authentication_required = true;
    
    /** why is the account login standard? */
    method = 'get';
    path = '/accounts/login';

    /** Headers for most of the http calls. */
    /** Cant add or overwrite headers from this property */
    headers = {}

    parameters = (() => {});

    // State object
    state = {};

    // Constructor method : initialize the current mounted state.
    constructor()
    {
        super();

        this.state.details = {};
        this.state.loaded  = false;
    }
    
    // Querying method : run the query using the axios module.
    componentDidMount()
    {
        let data;

        http[this.method](this.path, this.parameters(), this.headers)
            .then(res => {
                data = res.data;
                
                // Update the current state
                let state = this.state;
                state.details = data;
                state.loaded  = true;

                this.setState(state);
            })
            .catch(err => {});
    }

    loaded(details)
    {
        return <>{ JSON.stringify(details) }</>;
    }

    // The effective rendering method: display the loading component until the data has been retrieved.
    render()
    {
        // Check authentication
        if ( this.authentication_required && localStorage.getItem('access_token') === null )
        {
            return <Navigate to="/accounts/login" />;
        }

        return <>{ !this.state.loaded ? <LoadingComponent /> : this.loaded(this.state.details) }</>;
    }
}
