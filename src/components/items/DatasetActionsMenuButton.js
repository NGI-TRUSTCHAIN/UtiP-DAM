/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState } from 'react';

import { GiHamburgerMenu } from 'react-icons/gi';
import IssueReportForm from '../IssueReportForm';
import { useNavigate } from 'react-router-dom';

const DatasetActionsMenuButton = ({ className, dataset }) => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOnReportClick = (reportingTo) => {
    if (reportingTo === 'owner') {
      setOpenForm(true);
    } else {
      navigate('/contact');
    }
  };

  return openForm ? (
    <IssueReportForm
      dataset={dataset}
      isActive={openForm}
      onClose={() => setOpenForm(false)}
    />
  ) : (
    <div className={`relative ${className}`}>
      <div
        className="dropdown dropdown-bottom dropdown-end"
        onClick={toggleMenu}>
        <div
          role="button"
          tabIndex={0}
          className="btn btn-circle btn-sm"
          onClick={toggleMenu}>
          <GiHamburgerMenu className="swap-off fill-current" />
        </div>
        {
          <ul
            tabIndex={0}
            className="dropdown-content absolute z-[1] menu p-2 shadow border border-blue-200 bg-white rounded w-60">
            <li className="min-w-fit text-balance text-sm">
              <a href="#" onClick={() => handleOnReportClick('utip')}>
                Report a Problem to Utip-Dam
              </a>
            </li>
            <li className="min-w-fit text-balance text-sm">
              <a href="#" onClick={() => handleOnReportClick('owner')}>
                Contact Dataset Owners
              </a>
            </li>
          </ul>
        }
      </div>
    </div>
  );
};

export default DatasetActionsMenuButton;
