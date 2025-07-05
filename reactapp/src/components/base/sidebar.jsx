import { /*Fragment,*/ useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { Dialog, Transition } from '@headlessui/react'

import {
	Bars3Icon,
	CalendarIcon,
	ChartPieIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
	UsersIcon,
	PhoneIcon,
	ChartBarIcon,
	ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/outline'

// Adding elements to navigation bar done here
let navigation = [
	{ name: 'Dashboard', href: '/dashboard'			, icon: HomeIcon      		 			, current: false },
	{ name: 'Dialer'   , href: '/call'              , icon: PhoneIcon            			, current: false },
	{ name: 'Calendar' , href: '/callhistory' 		, icon: CalendarIcon       			  	, current: false },
	{ name: 'Documents', href: '/statistics'        , icon: ChartBarIcon		 			, current: false },
	{ name: 'Profile'  , href: '/accounts/profile'  , icon: UsersIcon            			, current: false },
	{ name: 'Logout'   , href: '/accounts/logout'  	, icon: ArrowLeftStartOnRectangleIcon   , current: false },
]

function classNames(...classes)
{
	return classes.filter(Boolean).join(' ')
}

export default function Sidebar() 
{
	// const [sidebarOpen, setSidebarOpen] = useState(false)
	const setSidebarOpen = useState(false)[1] // Avoid warning (we currently don't need sidebarOpen)

	const location = useLocation();

	navigation.forEach(tab => {
		tab.current = location.pathname == tab.href;
	});

	// Checking if the current route is '/home'
	if (location.pathname === "/home") 
	{
		// Don't render the sidebar on /home route
		return <></>;
	}
	
	return (
		<>
			{/* Static sidebar for desktop */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
			
				<div className="flex h-16 shrink-0 items-center justify-center">
					<img
						className="h-8 w-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
						alt="Your Company"
					/>
				</div>

				<nav className="mt-8">
					<ul className="flex flex-col items-center space-y-1">
						{navigation.map((item) => (
							<li key={item.name}>
							<Link to={item.href} className={classNames(
								item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
								'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold'
							)}>
								<item.icon className="h-6 w-6 shrink-0" aria-hidden="true"/>
								<span className="sr-only">{item.name}</span>
							</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">

				<button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
					<span className="sr-only">Open sidebar</span>
					<Bars3Icon className="h-6 w-6" aria-hidden="true" />
				</button>

				<div className="flex-1 text-sm font-semibold leading-6 text-white">
					Dashboard
				</div>
				
				{/* Link and image to profile page */}
				<Link to="/accounts/dashboard">
					<span className="sr-only">Your profile</span>
				</Link>
			</div>
		</>
	)
}