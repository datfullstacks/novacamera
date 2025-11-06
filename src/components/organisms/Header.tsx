'use client';

import { useState } from 'react';
import { Navigation } from '../molecules';
import { CartPreview } from '../molecules/cart/CartPreview';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLogout } from '@/hooks/api/useAuth';
import { useRouter } from '@/i18n/routing';
import { getAuthDataFromCookies } from '@/lib/utils/cookies';
import { useEffect, useState as useStateHook } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const t = useTranslations('landing.navigation');
  
  // Authentication state
  const authState = useSelector((state: RootState) => state.auth);
  const logoutMutation = useLogout();
  const router = useRouter();
  const [cookieData, setCookieData] = useStateHook<{
    authToken: string | undefined;
    refreshToken: string | undefined;
    tokenExpiry: number | undefined;
    isAuthenticated: boolean;
  }>({
    authToken: undefined,
    refreshToken: undefined,
    tokenExpiry: undefined,
    isAuthenticated: false,
  });

  // Update cookie data when auth state changes
  useEffect(() => {
    const data = getAuthDataFromCookies();
    setCookieData(data);
  }, [authState, setCookieData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Check if user is authenticated (both Redux and cookies should agree)
  const isAuthenticated = authState.isAuthenticated && cookieData.isAuthenticated;

  const handleLogout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      await logoutMutation.mutateAsync();
      
      // Force refresh cookie data after logout
      const freshCookieData = getAuthDataFromCookies();
      setCookieData(freshCookieData);
      
      console.log('✅ Logout completed, redirecting...');
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('rental'), href: '/rental' },
    // { label: t('pricing'), href: '/pricing' },
    { label: t('aiAdvisor'), href: '/ai-advisor' },
    // { label: t('support'), href: '/support' },
    // { label: t('courses'), href: '/courses' },
    // { label: t('consignment'), href: '/consignment' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
            <Image src="/logo.png" alt="Nova Camera"  width={250} height={32} className=" w-auto" />
          
          {/* Desktop Navigation */}
          <Navigation links={navLinks} />
          
          {/* Desktop Login & Language Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <CartPreview />
            
            {/* Authentication-based UI */}
            {isAuthenticated ? (
              <div className="relative profile-dropdown">
                {/* Profile Button */}
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Profile Avatar */}
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {authState.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {/* Dropdown Arrow */}
                  <svg 
                    className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Xin chào,</p>
                      <p className="font-medium text-gray-900">{authState.user?.fullName}</p>
                      <p className="text-sm text-gray-500">{authState.user?.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <Link 
                        href="/dashboard" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Dashboard
                      </Link>
                      
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hồ sơ cá nhân
                      </Link>

                      <Link 
                        href="/orders" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Đơn hàng
                      </Link>

                      <hr className="my-1 border-gray-100" />
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {logoutMutation.isPending ? 'Đăng xuất...' : 'Đăng xuất'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('login')}
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
            
            {/* <LanguageSwitcher variant="dropdown" /> */}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
                <div className="flex justify-center">
                  <CartPreview />
                </div>
                
                {/* Mobile Authentication UI */}
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-blue-600 py-2 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="text-center text-sm text-gray-600 py-2">
                      Xin chào, <span className="font-medium">{authState.user?.fullName}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {logoutMutation.isPending ? 'Đăng xuất...' : 'Đăng xuất'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-blue-600 py-2 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
                
                {/* <LanguageSwitcher variant="inline" /> */}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Debug Info in Development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border-t border-yellow-300 px-4 py-1 text-xs">
          <span className="text-yellow-800">
            🔧 Auth: Redux={authState.isAuthenticated ? '✅' : '❌'} | 
            Cookie={cookieData.isAuthenticated ? '✅' : '❌'} | 
            Combined={isAuthenticated ? '✅' : '❌'} | 
            User={authState.user?.fullName || 'N/A'} |
            Token={cookieData.authToken ? '🟢' : '🔴'}
          </span>
        </div>
      )} */}
    </header>
  );
}