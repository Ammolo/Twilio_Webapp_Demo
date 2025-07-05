import React from 'react';
import PeriodSelect from './stat_widgets/PeriodSelect';
import MountedComponent from "../mounted_component";
import AverageCallDuration from './stat_widgets/AverageCallDuration';
import CallCountDisplay from './stat_widgets/CallCountDisplay';


const periods = [
    { period: "All time" },
    { period: "Today" },
    { period: "Last 7 days" },
    { period: "Last 14 days" },
    { period: "Last 30 days" },
    { period: "Last 90 days" },
    { period: "Last 365 days" }
];


export default class StatisticsComponent extends MountedComponent {

    constructor() {
        super();
        this.state = {
            selectedPeriod: null,
            error: null,
        };
    }



    handlePeriodSelect = (selectedPeriod) => {
        this.setState({ selectedPeriod });
    };
 

    render() {
        return (
            <div className="flex flex-col items-center justify-center min-h-full px-4 lg:px-8">
            {/* Title */}
            <div className="w-full mb-8">
                <div className="flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-center">Statistics</h1>
                </div>
            </div>
    
            {/* Selection and campaign box */}
            <div className="flex flex-row w-full mb-4 p-4 items-center justify-center">
                {/* Selection Box */}
                <div className="w-full mb-8 flex flex-col gap-y-2 items-center justify-center">
                    <div>
                        <PeriodSelect periods={periods} onPeriodSelect={this.handlePeriodSelect} />
                    </div>
                </div>
            </div>
    
                {/* Stats */}
                {this.state.selectedPeriod && (
                    <div className="flex flex-col items-center w-auto"> {/* Use flex-wrap for responsiveness */}

                        <div className="px-4 py-2 m-2 text-center transform scale-100 lg:scale-90 w-full"> {/* Adjust scale here */}
                            <h3 className="text-xl font-bold mb-4">Average Call Duration</h3>
                            <AverageCallDuration period_selection={this.state.selectedPeriod.period}/>
                        </div>


                        <div className="px-4 py-2 m-2 text-center transform scale-75 lg:scale-90 w-auto"> {/* Adjust scale and width as necessary */}
                            <h3 className="text-xl font-bold mb-4 transform scale-125 lg:scale-110" >Call Count Breakdown</h3>
                            <CallCountDisplay period={this.state.selectedPeriod.period}
                            // Props for CallCountDisplay as needed
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    }


