'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';
import { Avatar } from '../../atoms/dashboard';

interface UserProfileProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  avatar?: string;
}

export default function UserProfile({
  name,
  role,
  avatar,
  className = '',
  ...props
}: UserProfileProps) {
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <Avatar src={avatar} name={name} size="md" className="mr-3" />
      <div>
        <Text variant="body" className="text-slate-800 text-base font-normal">
          {name}
        </Text>
        <Text variant="caption" className="text-slate-500 text-sm">
          {role}
        </Text>
      </div>
    </div>
  );
}
