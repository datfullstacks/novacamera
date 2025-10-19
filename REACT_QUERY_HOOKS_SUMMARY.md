# React Query Hooks Integration Summary

## Overview
Complete implementation of React Query hooks for NovaCMS API integration. All hooks follow consistent patterns and leverage the service layer for type-safe API calls.

## Created Hooks

### 1. Equipment Hooks (`useEquipment.ts`)
**Purpose**: Query equipment/camera data

**Hooks**:
- `useEquipments(params, options)` - Get paginated equipment list with filters
- `useEquipment(id, options)` - Get single equipment detail
- `useFeaturedEquipment(take, options)` - Get featured equipment
- `usePopularEquipment(take, options)` - Get popular equipment
- `useNewEquipment(take, options)` - Get new equipment
- `useSearchEquipment(searchTerm, take, options)` - Search equipment
- `useFilterMetadata(options)` - Get filter metadata (categories, brands, etc.)
- `useBrands(options)` - Get available brands

**Usage Example**:
```typescript
import { useEquipments, useEquipment } from '@/lib/react-query/hooks';

// In component
const { data, isLoading } = useEquipments({ 
  pageNumber: 1, 
  pageSize: 12,
  brands: ['Canon'],
  minPrice: 100,
  maxPrice: 500
});

const { data: equipment } = useEquipment(123);
```

### 2. Rental Order Hooks (`useRentals.ts`)
**Purpose**: Manage rental orders and availability

**Query Hooks**:
- `useUserRentalOrders(userId, params, options)` - Get user's rental orders
- `useAdminRentalOrders(params, options)` - Get all orders (admin)
- `useRentalOrder(id, options)` - Get single order detail
- `useCalculateOrder(orderData, options)` - Calculate order summary/pricing
- `useCheckAvailability(equipmentId, startDate, endDate, quantity, options)` - Check availability
- `useCalendarAvailability(equipmentId, startDate, endDate, options)` - Get calendar availability
- `useCheckSelectedDates(equipmentId, data, options)` - Check specific dates

**Mutation Hooks**:
- `useCreateRentalOrder()` - Create new rental order
- `useUpdateOrderStatus()` - Update order status
- `useCancelPayment()` - Cancel payment

**Usage Example**:
```typescript
import { useRentalOrder, useCreateRentalOrder } from '@/lib/react-query/hooks';

// Query
const { data: order } = useRentalOrder(456);

// Mutation
const createOrder = useCreateRentalOrder();
const handleSubmit = (orderData) => {
  createOrder.mutate(orderData, {
    onSuccess: () => {
      // Navigate to success page
    }
  });
};
```

### 3. Category Hooks (`useCategories.ts`)
**Purpose**: Fetch equipment categories

**Hooks**:
- `useCategories(options)` - Get all categories

**Usage Example**:
```typescript
import { useCategories } from '@/lib/react-query/hooks';

const { data: categories } = useCategories();
```

### 4. Dashboard Hooks (`useDashboard.ts`)
**Purpose**: Fetch dashboard statistics and data

**Hooks**:
- `useDashboardSummary(options)` - Get dashboard summary statistics
- `useUpcomingRentals(options)` - Get upcoming rentals (next 7 days)

**Usage Example**:
```typescript
import { useDashboardSummary, useUpcomingRentals } from '@/lib/react-query/hooks';

const { data: summary } = useDashboardSummary();
const { data: upcoming } = useUpcomingRentals();
```

### 5. Chat/AI Hooks (`useChat.ts`)
**Purpose**: AI-powered chat with RAG (Retrieval-Augmented Generation)

**Hooks**:
- `useAskAI()` - Ask AI a question (mutation)
- `useIndexEquipment()` - Index equipment for RAG (admin only, mutation)

**Usage Example**:
```typescript
import { useAskAI } from '@/lib/react-query/hooks';

const askAI = useAskAI();

const handleAskQuestion = (question: string) => {
  askAI.mutate(question, {
    onSuccess: (response) => {
      console.log('AI Response:', response.data.answer);
    }
  });
};
```

### 6. Auth Hooks (`useAuth.ts`) - Pre-existing, maintained
**Purpose**: Authentication and user management

**Hooks**:
- `useCurrentUser()` - Get current authenticated user
- `useLogin()` - Login mutation
- `useRegister()` - Register mutation
- `useLogout()` - Logout mutation
- `useAuth()` - Get auth state from Redux

## Query Keys Structure

All query keys are centralized in `query-keys.ts`:

```typescript
QUERY_KEYS = {
  AUTH: { ME, SESSION },
  USERS: { ALL, LIST, DETAIL, SEARCH },
  EQUIPMENT: { ALL, LIST, DETAIL, SEARCH, FEATURED, POPULAR, NEW, BRANDS, PRICE_RANGE, FILTER_METADATA },
  RENTAL: { ALL, LIST, USER_ORDERS, ADMIN_ORDERS, DETAIL, CALCULATE, CHECK_AVAILABILITY, CALENDAR },
  CATEGORY: { ALL, LIST },
  DASHBOARD: { SUMMARY, UPCOMING_RENTALS },
  CHAT: { ALL, ASK },
  PAYMENT: { ALL, WEBHOOK }
}
```

## Stale Time Configuration

Different hooks have different stale times based on data volatility:

- **30 minutes**: Categories, brands, filter metadata (rarely change)
- **15 minutes**: Featured/popular equipment
- **10 minutes**: Equipment details
- **5 minutes**: Equipment lists, dashboard summary, calendar availability
- **2 minutes**: Rental orders, upcoming rentals
- **1 minute**: Availability checks, order calculations

## Cache Invalidation Strategy

Mutations automatically invalidate related queries:

1. **Create Rental Order**:
   - Invalidates: `RENTAL.ALL`, `DASHBOARD.SUMMARY`

2. **Update Order Status**:
   - Invalidates: `RENTAL.DETAIL(orderId)`, `RENTAL.ALL`, `DASHBOARD.SUMMARY`

3. **Cancel Payment**:
   - Invalidates: `RENTAL.DETAIL(orderId)`, `RENTAL.ALL`

## Integration with Redux

Auth hooks integrate with Redux for state management:
- Login/Register success → Updates Redux `authSlice`
- Stores token in localStorage
- Updates queries via `queryClient.invalidateQueries`

## Type Safety

All hooks are fully typed with:
- Request parameters use API types from `@/types/api`
- Response types inferred from service layer
- Generic `UseQueryOptions` for flexible configuration

## Best Practices

1. **Enable conditions**: Hooks use `enabled` option to prevent unnecessary requests
   ```typescript
   enabled: !!id // Only fetch when id exists
   ```

2. **Type-safe parameters**: Use proper TypeScript types for all parameters
   ```typescript
   params?: EquipmentFilterParams
   ```

3. **Cache configuration**: Appropriate stale times based on data volatility

4. **Error handling**: Leverage React Query's built-in error states

5. **Optimistic updates**: Can be added to mutations for better UX

## Files Created/Modified

### Created:
- `src/lib/react-query/hooks/useEquipment.ts` (156 lines)
- `src/lib/react-query/hooks/useRentals.ts` (210 lines)
- `src/lib/react-query/hooks/useCategories.ts` (24 lines)
- `src/lib/react-query/hooks/useDashboard.ts` (42 lines)
- `src/lib/react-query/hooks/useChat.ts` (28 lines)

### Modified:
- `src/lib/react-query/query-keys.ts` - Added EQUIPMENT, RENTAL, CATEGORY, DASHBOARD, CHAT, PAYMENT keys
- `src/lib/react-query/hooks/index.ts` - Added exports for all new hooks

## Next Steps

1. **Update existing components** to use new hooks
2. **Add optimistic updates** for mutations where appropriate
3. **Implement error boundaries** for better error handling
4. **Add loading/skeleton states** in components
5. **Create custom wrappers** if specific patterns emerge
6. **Add tests** for critical hooks
7. **Monitor performance** and adjust stale times if needed

## Usage Pattern

All hooks can be imported from the central hooks directory:

```typescript
import {
  // Equipment
  useEquipments,
  useEquipment,
  useFeaturedEquipment,
  
  // Rentals
  useRentalOrder,
  useCreateRentalOrder,
  useCheckAvailability,
  
  // Categories
  useCategories,
  
  // Dashboard
  useDashboardSummary,
  useUpcomingRentals,
  
  // Chat
  useAskAI,
  
  // Auth
  useAuth,
  useLogin,
  useLogout,
} from '@/lib/react-query/hooks';
```

## Complete Integration Chain

```
Component → Hook → Service → API Client → NovaCMS API
    ↓         ↓        ↓          ↓
 UI Logic   Query   Type-Safe   HTTP
           Config  Functions   Requests
```

## Performance Considerations

1. **Parallel queries**: Multiple hooks can be used in same component
2. **Prefetching**: Can prefetch data on hover/route changes
3. **Background refetch**: Automatic refetch on window focus
4. **Retry logic**: Built-in retry for failed requests
5. **Cache deduplication**: Prevents duplicate requests

---

**Status**: ✅ Complete
**Date**: 2025
**Integration**: NovaCMS API v1
**Framework**: Next.js 14+ with TanStack Query v5
