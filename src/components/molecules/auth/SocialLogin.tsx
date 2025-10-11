'use client';

import React from 'react';
import { Button } from '@/components/atoms/forms/Button';
import { SocialIcon } from '@/components/atoms/icons/SocialIcon';

interface SocialLoginProps {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  loading?: boolean;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onGoogleLogin,
  onFacebookLogin,
  loading = false
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Divider */}
      <div className="flex items-center">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-4 text-sm text-gray-500 font-normal font-['ABeeZee'] leading-tight">
          hoặc tiếp tục với
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onGoogleLogin}
          disabled={loading}
          className="flex-1 h-10 gap-2"
        >
          <SocialIcon type="google" />
          <span className="text-sm font-normal font-['ABeeZee'] leading-none">
            Google
          </span>
        </Button>

        <Button
          variant="outline"
          onClick={onFacebookLogin}
          disabled={loading}
          className="flex-1 h-10 gap-2"
        >
          <SocialIcon type="facebook" />
          <span className="text-sm font-normal font-['ABeeZee'] leading-none">
            Facebook
          </span>
        </Button>
      </div>
    </div>
  );
};