"use client";

import React from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { WEBSITE_LOGIN } from '@/app/routes/UserWebsite';
import { logout } from '@/store/reducer/authReducer';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post('/api/auth/logout');

      if (!logoutResponse.success) {
        throw new Error(logoutResponse.message);
      }

      dispatch(logout()); // dispatch logout action
      showToast('success', logoutResponse.message);
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast('error', error?.response?.data?.message || error.message);
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
      <AiOutlineLogout className="mr-2" color="red" />
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutButton;
