# NovaCMS API - Quick Usage Guide

## 🚀 Getting Started

### Import Hooks
```typescript
import {
  // Equipment
  useEquipments,
  useEquipment,
  useFeaturedEquipment,
  
  // Rentals
  useCreateRentalOrder,
  useCheckAvailability,
  
  // Categories
  useCategories,
  
  // Dashboard
  useDashboardSummary,
  
  // Auth
  useLogin,
  useAuth,
} from '@/lib/react-query/hooks';
```

## 📖 Common Usage Patterns

### 1. Display Equipment List with Filters

```typescript
'use client';

import { useEquipments } from '@/lib/react-query/hooks';
import { useState } from 'react';

export default function EquipmentListPage() {
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 12,
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  const { data, isLoading, error } = useEquipments(filters);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Equipment</h1>
      <div className="grid grid-cols-3 gap-4">
        {data?.data.items.map((equipment) => (
          <EquipmentCard key={equipment.equipmentId} equipment={equipment} />
        ))}
      </div>
      <Pagination 
        current={data?.data.pageNumber} 
        total={data?.data.totalPage} 
        onChange={(page) => setFilters({ ...filters, pageNumber: page })}
      />
    </div>
  );
}
```

### 2. Equipment Detail Page

```typescript
'use client';

import { useEquipment } from '@/lib/react-query/hooks';
import { useParams } from 'next/navigation';

export default function EquipmentDetailPage() {
  const params = useParams();
  const equipmentId = Number(params.id);
  
  const { data, isLoading } = useEquipment(equipmentId);

  if (isLoading) return <LoadingSkeleton />;

  const equipment = data?.data;

  return (
    <div>
      <h1>{equipment?.name}</h1>
      <p>{equipment?.description}</p>
      <p>Price: ${equipment?.pricePerDay}/day</p>
      <ImageGallery images={equipment?.images} />
      <RentalForm equipmentId={equipmentId} />
    </div>
  );
}
```

### 3. Check Availability Before Booking

```typescript
'use client';

import { useCheckAvailability } from '@/lib/react-query/hooks';
import { useState } from 'react';

export default function BookingForm({ equipmentId }: { equipmentId: number }) {
  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
  });

  const { data: availability, isLoading } = useCheckAvailability(
    equipmentId,
    dates.startDate,
    dates.endDate,
    1 // quantity
  );

  return (
    <form>
      <DateRangePicker value={dates} onChange={setDates} />
      
      {isLoading && <p>Checking availability...</p>}
      
      {availability?.data.isAvailable ? (
        <button type="submit">Book Now</button>
      ) : (
        <p className="text-red-500">Not available for selected dates</p>
      )}
    </form>
  );
}
```

### 4. Create Rental Order

```typescript
'use client';

import { useCreateRentalOrder } from '@/lib/react-query/hooks';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const createOrder = useCreateRentalOrder();

  const handleSubmit = async (formData: any) => {
    const orderData = {
      userId: 1, // From auth state
      items: [{
        equipmentId: formData.equipmentId,
        quantity: 1,
        rentalStartDate: formData.startDate,
        rentalEndDate: formData.endDate,
      }],
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
      },
      deliveryInfo: {
        deliveryAddress: formData.address,
        deliveryDate: formData.deliveryDate,
        pickupDate: formData.pickupDate,
      },
      paymentInfo: {
        paymentMethod: formData.paymentMethod,
      },
      note: formData.note,
    };

    createOrder.mutate(orderData, {
      onSuccess: (response) => {
        router.push(`/orders/${response.data.orderId}`);
      },
      onError: (error) => {
        alert('Order failed: ' + error.message);
      },
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
      {/* Form fields */}
      <button type="submit" disabled={createOrder.isPending}>
        {createOrder.isPending ? 'Creating Order...' : 'Place Order'}
      </button>
    </form>
  );
}
```

### 5. User's Rental Orders (Dashboard)

```typescript
'use client';

import { useUserRentalOrders } from '@/lib/react-query/hooks';
import { useAuth } from '@/lib/react-query/hooks';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const { data, isLoading } = useUserRentalOrders(user?.userId || 0);

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1>My Rental Orders</h1>
      <div className="space-y-4">
        {data?.data.items.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}
      </div>
    </div>
  );
}
```

### 6. Featured Equipment Section (Home Page)

```typescript
'use client';

import { useFeaturedEquipment } from '@/lib/react-query/hooks';

export default function FeaturedSection() {
  const { data } = useFeaturedEquipment(8); // Get 8 featured items

  return (
    <section>
      <h2>Featured Equipment</h2>
      <div className="grid grid-cols-4 gap-4">
        {data?.data.map((equipment) => (
          <EquipmentCard key={equipment.equipmentId} equipment={equipment} />
        ))}
      </div>
    </section>
  );
}
```

### 7. Dashboard Statistics (Admin)

```typescript
'use client';

import { useDashboardSummary, useUpcomingRentals } from '@/lib/react-query/hooks';

export default function AdminDashboard() {
  const { data: summary } = useDashboardSummary();
  const { data: upcoming } = useUpcomingRentals();

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          title="Total Equipment" 
          value={summary?.data.totalEquipment} 
        />
        <StatCard 
          title="Active Rentals" 
          value={summary?.data.activeRentals} 
        />
        <StatCard 
          title="Pending Orders" 
          value={summary?.data.pendingOrders} 
        />
        <StatCard 
          title="Revenue This Month" 
          value={`$${summary?.data.monthlyRevenue}`} 
        />
      </div>

      <h2>Upcoming Rentals (Next 7 Days)</h2>
      <UpcomingRentalsList rentals={upcoming?.data} />
    </div>
  );
}
```

### 8. AI Chat Assistant

```typescript
'use client';

import { useAskAI } from '@/lib/react-query/hooks';
import { useState } from 'react';

export default function ChatAssistant() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const askAI = useAskAI();

  const handleAsk = () => {
    askAI.mutate(question, {
      onSuccess: (response) => {
        setConversation([
          ...conversation,
          { role: 'user', content: question },
          { role: 'assistant', content: response.data.answer },
        ]);
        setQuestion('');
      },
    });
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {conversation.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about equipment..."
        />
        <button onClick={handleAsk} disabled={askAI.isPending}>
          {askAI.isPending ? 'Asking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
```

### 9. Search Equipment

```typescript
'use client';

import { useSearchEquipment } from '@/lib/react-query/hooks';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const { data, isLoading } = useSearchEquipment(
    debouncedSearch,
    10 // limit results
  );

  return (
    <div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search equipment..."
      />
      
      {isLoading && <div>Searching...</div>}
      
      {data && (
        <div className="search-results">
          {data.data.map((equipment) => (
            <SearchResultItem key={equipment.equipmentId} equipment={equipment} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 10. Category Filter

```typescript
'use client';

import { useCategories } from '@/lib/react-query/hooks';

export default function CategoryFilter({ onChange }: { onChange: (ids: number[]) => void }) {
  const { data: categories } = useCategories();
  const [selected, setSelected] = useState<number[]>([]);

  const handleToggle = (categoryId: number) => {
    const newSelected = selected.includes(categoryId)
      ? selected.filter(id => id !== categoryId)
      : [...selected, categoryId];
    
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div>
      <h3>Categories</h3>
      {categories?.data.map((category) => (
        <label key={category.categoryId}>
          <input
            type="checkbox"
            checked={selected.includes(category.categoryId)}
            onChange={() => handleToggle(category.categoryId)}
          />
          {category.name} ({category.equipmentCount})
        </label>
      ))}
    </div>
  );
}
```

## 🎨 TypeScript Tips

### Access Response Data
```typescript
const { data } = useEquipment(123);

// data structure:
// {
//   success: boolean,
//   message: string,
//   data: EquipmentDetailResponse,
//   errors: null
// }

const equipment = data?.data; // The actual equipment object
```

### Handle Loading and Error States
```typescript
const { data, isLoading, error, refetch } = useEquipments();

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} onRetry={refetch} />;
if (!data) return <EmptyState />;

// Render data
```

### Mutation States
```typescript
const createOrder = useCreateRentalOrder();

// States available:
createOrder.isPending  // true while mutation is running
createOrder.isSuccess  // true after success
createOrder.isError    // true if error occurred
createOrder.error      // error object
createOrder.data       // response data
```

## 🔧 Configuration

### Adjust Stale Time
```typescript
const { data } = useEquipments(filters, {
  staleTime: 1000 * 60 * 10, // 10 minutes
});
```

### Disable Auto-Fetch
```typescript
const { data, refetch } = useEquipment(id, {
  enabled: false, // Don't fetch automatically
});

// Fetch manually when needed
<button onClick={() => refetch()}>Load Equipment</button>
```

### Add Callbacks
```typescript
const { data } = useEquipments(filters, {
  onSuccess: (data) => {
    console.log('Loaded equipment:', data);
  },
  onError: (error) => {
    console.error('Failed to load:', error);
  },
});
```

---

**Need more examples?** Check `REACT_QUERY_HOOKS_SUMMARY.md` for complete hook documentation.
