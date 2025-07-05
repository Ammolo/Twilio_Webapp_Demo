import React, { useState } from 'react';

const CampaignDropdown = ({ campaigns, onCampaignSelect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCampaignChange = (campaign) => {
    onCampaignSelect(campaign);
    setSelectedCampaign(campaign);
    toggleDropdown();
  };

  return (
    <div className="relative">
      <button
        id="dropdownSearchButton"
        data-dropdown-toggle="dropdownSearch"
        data-dropdown-placement="bottom"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedCampaign ? selectedCampaign.name : 'Select Campaign'}
        <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {dropdownOpen && (
        <div id="dropdownSearch" className="z-10 absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700 mt-1">
          <div className="p-3">
            <label htmlFor="input-group-search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="text"
                id="input-group-search"
                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search campaign"
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <ul className="max-h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
            {filteredCampaigns.map(campaign => (
              <li key={campaign.id} className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 mr-2"
                  checked={selectedCampaign && selectedCampaign.id === campaign.id}
                  onChange={() => handleCampaignChange(campaign)}
                />
                <label className="w-full text-sm font-medium text-gray-900 dark:text-gray-300" onClick={() => handleCampaignChange(campaign)}>{campaign.name}</label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CampaignDropdown;
