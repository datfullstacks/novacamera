'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { BookingManagement } from '@/components/organisms/booking';

interface Booking {
  readonly id: string;
  readonly orderCode: string;
  readonly customerName: string;
  readonly equipment: string;
  readonly timeRange: string;
  readonly status: 'renting' | 'confirmed' | 'returned' | 'cancelled';
  readonly deliveryStatus: 'delivered' | 'not-delivered';
}

export default function BookingsPage() {
  const router = useRouter();

  // Mock data - in real app, this would come from API
  const bookings: Booking[] = [
    {
      id: '1',
      orderCode: '#BK102',
      customerName: 'Trần Hoàng',
      equipment: 'Canon R5 + Lens 24-70',
      timeRange: '20/07 9:00 – 22/07 18:00',
      status: 'renting',
      deliveryStatus: 'delivered',
    },
    {
      id: '2',
      orderCode: '#BK103',
      customerName: 'Nguyễn Lan',
      equipment: 'Sony A7III',
      timeRange: '24/07 – 26/07',
      status: 'confirmed',
      deliveryStatus: 'not-delivered',
    },
    {
      id: '3',
      orderCode: '#BK101',
      customerName: 'Lê Minh',
      equipment: 'Nikon Z6 + Tripod',
      timeRange: '15/07 – 18/07',
      status: 'returned',
      deliveryStatus: 'delivered',
    },
    {
      id: '4',
      orderCode: '#BK100',
      customerName: 'Phạm Thảo',
      equipment: 'Fujifilm X-T4 + 3 Lens',
      timeRange: '10/07 – 12/07',
      status: 'cancelled',
      deliveryStatus: 'not-delivered',
    },
  ];

  const handleViewBooking = (booking: Booking) => {
    console.log('View booking:', booking);
    // Implementation: Navigate to booking detail page
  };

  const handleEditBooking = (booking: Booking) => {
    console.log('Edit booking:', booking);
    // Implementation: Navigate to edit booking page
  };

  const handleCancelBooking = (booking: Booking) => {
    console.log('Cancel booking:', booking);
    // Implementation: Show confirmation dialog and cancel booking
  };

  const handleConfirmBooking = (booking: Booking) => {
    console.log('Confirm booking:', booking);
    // Implementation: Confirm booking
  };

  const handleDeliverBooking = (booking: Booking) => {
    console.log('Deliver booking:', booking);
    // Implementation: Mark as delivered
  };

  const handleReturnBooking = (booking: Booking) => {
    console.log('Return booking:', booking);
    // Implementation: Mark as returned
  };

  const handleCreateBooking = () => {
    console.log('Create booking clicked');
    // Implementation: Navigate to create booking page
  };

  return (
    <ProtectedRoute>
      <DashboardTemplate
        activeSidebarItem="bookings"
        onSidebarItemClick={(item) => {
          if (item === 'bookings') router.push('/bookings');
        }}
        activeView="platform"
        onViewChange={() => {}}
        userName="Alex Morgan"
        userRole="Quản trị viên nền tảng"
      >
        <BookingManagement
          bookings={bookings}
          onViewBooking={handleViewBooking}
          onEditBooking={handleEditBooking}
          onCancelBooking={handleCancelBooking}
          onConfirmBooking={handleConfirmBooking}
          onDeliverBooking={handleDeliverBooking}
          onReturnBooking={handleReturnBooking}
          onCreateBooking={handleCreateBooking}
        />
      </DashboardTemplate>
    </ProtectedRoute>
  );
}
