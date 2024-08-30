import { Link, useLocation } from 'react-router-dom';
import React, { Fragment, useState } from 'react';

import { BsThreeDotsVertical } from 'react-icons/bs';
import Cookies from 'universal-cookie';
import { NAV_PATH } from '../../utils/Constants';
import { authenticationActions } from '../../store/authentication';
import headerLogo from '../../assets/images/logos/utip_correlation_main_logo.png';
import { useDispatch } from 'react-redux';

const Header = () => {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [path, setPath] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let hasToken = !!cookies.get('token');
  let user = cookies.get('account');

  const handlePathChange = (e) => {
    return setPath(e.target.name);
  };
  const handleLogout = async () => {
    try {
      const loggedOut = await dispatch(authenticationActions.logout());
      if (loggedOut) setIsLoggedIn(false);
    } catch (err) {}
  };

  React.useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  React.useEffect(() => {
    const cookies = new Cookies();
    let hasToken = !!cookies.get('token');

    setIsLoggedIn(hasToken);
    setPath(pathname);
  }, [pathname, hasToken]);

  return (
    <div className="border-b-2">
      <nav className="bg-[#ffffff] inline-flex w-full justify-between items-center px-4 min-h-4">
        <a href="/" className="w-full h-fit bg-transparent">
          <img
            key="logo"
            className="md:w-[10rem] sm:w-[7rem] xs:w-[30%] bg-transparent"
            src={headerLogo}
            alt="UtiP-DAM Correlation Systems"
          />
        </a>
        <div
          id="nav-inline-menu"
          className="w-auto ml-3 sm:inline-flex xs:hidden items-center md:gap-6 sm:gap-4 lg:text-sm md:text-sm sm:text-xs xs:text-[10px]">
          {Object.entries(NAV_PATH).map(([key, navItem]) => (
            <Fragment key={key}>
              {key === 'login' && isLoggedIn && (
                <div
                  id="profile-menu-dropdown"
                  className="dropdown"
                  key={key + '-authenticated'}>
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-sm w-max text-xs btn-ghost p-1 tracking-wide hover:bg-slate-100 hover:ring-1 hover:ring-offset-2 hover:ring-accent">
                    {user?.username ?? 'User'}
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-max">
                    <li>
                      <Link
                        to={'/my-account'}
                        className="hover:ring-1 hover:ring-accent">
                        My Account
                      </Link>
                    </li>
                    <li>
                      <span
                        className="hover:ring-1 hover:ring-accent"
                        onClick={() => handleLogout()}>
                        Logout
                      </span>
                    </li>
                  </ul>
                </div>
              )}
              {!(key === 'login' && hasToken) && (
                <Link to={navItem.path} key={key + '-unauth'}>
                  <button
                    name={key}
                    className={`nav-tab-primary w-max ${path === navItem.path && 'nav-tab-primary-selected'} ${key === 'login' && 'mr-6'}`}
                    onClick={handlePathChange}>
                    <span className="">{navItem.label}</span>
                  </button>
                </Link>
              )}
              {key === 'login' && hasToken && (
                <span className="divider bg-slate-600 w-[1.5px]" />
              )}
            </Fragment>
          ))}
          <Link
            to="/about"
            className={`nav-tab-primary w-max md:hidden lg:hidden xl:hidden ${path === '/about' && 'nav-tab-primary-selected'}`}>
            <button>About Project</button>
          </Link>
        </div>
        <div id="nav-menu-mobile" className="sm:hidden dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost m-1 p-4">
            <BsThreeDotsVertical />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-40 mt-4 mr-4">
            {Object.entries(NAV_PATH).map(([key, navItem]) => (
              <li key={key}>
                <a href={navItem.path}>{navItem.label}</a>
              </li>
            ))}
            <li>
              <a href="/about">About Project</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
