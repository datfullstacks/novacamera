'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { EquipmentManagement } from '@/components/organisms/equipment';

interface Equipment {
  id: string;
  name: string;
  code: string;
  status: 'available' | 'rented' | 'maintenance' | 'repair';
  price: string;
  usage: string;
  image?: string;
}

export default function EquipmentPage() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('equipment');
  const [activeView, setActiveView] = useState('platform');

  // Mock data - in real app, this would come from API
  const equipment: Equipment[] = [
    {
      id: '1',
      name: 'Canon EOS R5',
      code: '#R5-01',
      status: 'available',
      price: '950.000₫',
      usage: '88%',
      image: 'https://placehold.co/60x60',
    },
    {
      id: '2',
      name: 'Sony A7III',
      code: '#A7-10',
      status: 'rented',
      price: '850.000₫',
      usage: '92%',
      image: 'https://placehold.co/60x60',
    },
    {
      id: '3',
      name: 'DJI Ronin-S',
      code: '#GIM-3',
      status: 'maintenance',
      price: '450.000₫',
      usage: '76%',
      image: 'https://placehold.co/60x60',
    },
    {
      id: '4',
      name: 'Nikon Z6 II',
      code: '#Z6-05',
      status: 'available',
      price: '750.000₫',
      usage: '72%',
      image: 'https://placehold.co/60x60',
    },
    {
      id: '5',
      name: 'Canon 70-200mm f/2.8',
      code: '#LENS-12',
      status: 'repair',
      price: '350.000₫',
      usage: '45%',
      image: 'https://placehold.co/60x60',
    },
    {
      id: '6',
      name: 'Blackmagic Pocket 6K',
      code: '#BMP-02',
      status: 'available',
      price: '1.200.000₫',
      usage: '65%',
      image: 'https://placehold.co/60x60',
    },
  ];

  const handleAddEquipment = () => {
    console.log('Add equipment clicked');
    // Implementation: Open add equipment modal/form
  };

  const handleEditEquipment = (equipment: Equipment) => {
    console.log('Edit equipment:', equipment);
    // Implementation: Open edit equipment modal/form
  };

  const handleDeleteEquipment = (equipment: Equipment) => {
    console.log('Delete equipment:', equipment);
    // Implementation: Show confirmation dialog and delete
  };

  const handleViewEquipment = (equipment: Equipment) => {
    console.log('View equipment:', equipment);
    // Implementation: Navigate to equipment detail page
  };

  return (
    <ProtectedRoute>
      <DashboardTemplate
        activeSidebarItem={activeSidebarItem}
        onSidebarItemClick={setActiveSidebarItem}
        activeView={activeView}
        onViewChange={setActiveView}
        userName="Alex Morgan"
        userRole="Quản trị viên nền tảng"
      >
        <EquipmentManagement
          equipment={equipment}
          onAddEquipment={handleAddEquipment}
          onEditEquipment={handleEditEquipment}
          onDeleteEquipment={handleDeleteEquipment}
          onViewEquipment={handleViewEquipment}
        />
      </DashboardTemplate>
    </ProtectedRoute>
  );
}
