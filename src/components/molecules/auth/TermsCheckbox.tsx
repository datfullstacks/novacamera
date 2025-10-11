'use client';

import React from 'react';
import { Checkbox } from '@/components/atoms/forms/Checkbox';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onChange,
  error
}) => {
  return (
    <div className="space-y-2">
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        label="Tôi đồng ý với các điều khoản của chính sách dịch vụ và quyền riêng tư"
        error={error}
      />
    </div>
  );
};

TermsCheckbox.displayName = 'TermsCheckbox';