import React from 'react';
import { useState, useEffect } from 'react';

/**
 * Timer: function rendering a basic timer.
 * Required props:
 * - 'started': true if the timer is running, false otherwise.
 */
export default function Timer(props)
{
    // Elapsed time state
    const [elapsed, setElapsed] = useState(0);

    // Start time state
    const [start  , setStart  ] = useState(undefined);

    // If the started props has been update.
    if ( props.started && start == undefined )
    {
        setStart(Date.now());
    }

    let interval = undefined;
    
    useEffect(() => {
        if ( props.started )
        {
            // If the timer's running, recalcul the elapsed time every second.
            interval = setInterval(() => {
                
                setElapsed(() => ( Date.now() - start ) / 1000);
            }, 1000);
        }
        else
        {
            // Else, clear the timer.
            setStart(undefined);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [props.started]);


    // Effective rendering with the format HH:MM:SS
    return Object.values({
            Hours  : (elapsed / 3600) % 24,
            Minutes: (elapsed /   60) % 60,
            Seconds: (elapsed       ) % 60,
        })
        .map(element => String(Math.floor(element)).padStart(2, '0'))
        .join(':')
    ;
};
