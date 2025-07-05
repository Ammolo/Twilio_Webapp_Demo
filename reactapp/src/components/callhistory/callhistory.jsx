import React from 'react';
import { Link } from 'react-router-dom';

import MountedComponent from '../mounted_component';

export default class CallHistoryComponent extends MountedComponent {
    path = '/call/callhistory';

    constructor() {
        super();
    }

    loaded(details) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 h-full overflow-auto rounded-lg">
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                                        >
                                            ID
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Answer Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Start
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Duration
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Managed By
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Received By
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {details.map((detail, index) => (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                {detail.id}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.answer_type}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.start}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.duration}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.manage_by}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.receive_by}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
