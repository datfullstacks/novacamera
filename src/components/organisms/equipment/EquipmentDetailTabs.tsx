'use client';

import { HTMLAttributes, useState } from 'react';
import { TabButton } from '../../molecules/equipment';

interface Tab {
  readonly id: string;
  readonly label: string;
  readonly content: React.ReactNode;
}

interface EquipmentDetailTabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: ReadonlyArray<Tab>;
  defaultTab?: string;
}

export default function EquipmentDetailTabs({
  tabs,
  defaultTab,
  className = '',
  ...props
}: EquipmentDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTabData?.content}
      </div>
    </div>
  );
}

