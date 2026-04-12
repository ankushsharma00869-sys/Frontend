import { SignedIn, UserButton } from '@clerk/clerk-react';
import { Menu, MenuIcon, Share2Icon, Wallet, XIcon } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';
import CreditsDisplay from './CreditsDisplay';
import { useEffect } from 'react';
import { UserCreditsContext } from '../context/UserCreditsContext';

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSidemenu] = useState(false);
    const { credits, fetchUserCredits } = useContext(UserCreditsContext);

    useEffect(() => {
        fetchUserCredits();
    }, [fetchUserCredits]);

    return (
        <div className="flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30 ">


            {/* left side - menu button and tittle */}
            <div className="flex items-center gap-5">
                <button
                    onClick={() => setOpenSidemenu(!openSideMenu)}
                    className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors">
                    {openSideMenu ? (
                        <XIcon className="text-2xl" />
                    ) : (
                        <MenuIcon className="text-2xl" />

                    )}
                </button>
                <div className="flex items-center gap-2">
                    <Share2Icon className="text-blue-600" />
                    <span className="text-lg font-medium text-black truncate">
                        Cloud Share
                    </span>
                </div>

            </div>





            {/* Right  side - credits and user button */}

            <SignedIn>
                <div className="flex itms-center gap-4">
                    <Link to="/subscription">
                        <CreditsDisplay credits={credits} />
                    </Link>
                    <div className="relative">
                        <UserButton />
                    </div>
                </div>
            </SignedIn>



            {/* mobile side menu*/}
            {openSideMenu && (
                <div className="fixed top-18.25 left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20">
                    {/*  Side menu bar*/}
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}

        </div>
    )
}

export default Navbar;
