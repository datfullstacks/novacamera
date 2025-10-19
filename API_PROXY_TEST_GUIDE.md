# Hướng dẫn Test API Proxy

## Cấu hình hiện tại

```env
NEXT_PUBLIC_API_URL=/api/proxy
API_BACKEND_URL=https://api.mmoshop.site
```

## Cách hoạt động

Tất cả API calls từ frontend sẽ đi qua proxy route:

```
Frontend Request: /api/proxy/Auth/login
        ↓
Next.js Proxy: Forward to https://api.mmoshop.site/Auth/login
        ↓
Backend API: https://api.mmoshop.site/Auth/login
        ↓
Response quay về Frontend (không có CORS error)
```

## Test API Endpoints

### 1. Test Login API

Mở Browser DevTools (F12) → Console, chạy:

```javascript
// Test login endpoint
fetch('/api/proxy/Auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@novacamera.com',
    password: 'Admin@123'
  })
})
.then(res => res.json())
.then(data => console.log('Login response:', data))
.catch(err => console.error('Login error:', err));
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": "123",
      "email": "admin@novacamera.com",
      "fullName": "Admin User"
    }
  },
  "success": true
}
```

### 2. Test Equipment List API

```javascript
// Test equipment list
fetch('/api/proxy/Equipment?pageNumber=1&pageSize=10')
.then(res => res.json())
.then(data => console.log('Equipment list:', data))
.catch(err => console.error('Equipment error:', err));
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "data": [
      {
        "equipmentId": "1",
        "equipmentName": "Sony Alpha A7III",
        "dailyRate": 850000,
        // ... more fields
      }
    ],
    "totalRecords": 50,
    "currentPage": 1,
    "pageSize": 10
  },
  "success": true
}
```

### 3. Test Equipment Detail API

```javascript
// Test equipment detail
fetch('/api/proxy/Equipment/1')
.then(res => res.json())
.then(data => console.log('Equipment detail:', data))
.catch(err => console.error('Equipment detail error:', err));
```

### 4. Test Dashboard Summary API

```javascript
// Test dashboard summary
fetch('/api/proxy/Dashboard/summary', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(res => res.json())
.then(data => console.log('Dashboard summary:', data))
.catch(err => console.error('Dashboard error:', err));
```

## Kiểm tra trong Network Tab

1. Mở **Chrome DevTools** (F12)
2. Chuyển sang tab **Network**
3. Thực hiện login hoặc navigate đến trang equipment
4. Kiểm tra requests:

### ✅ Đúng - Request qua proxy:
```
Request URL: http://localhost:3000/api/proxy/Auth/login
Request Method: POST
Status Code: 200 OK
```

### ❌ Sai - Request trực tiếp (sẽ bị CORS):
```
Request URL: https://api.mmoshop.site/Auth/login
Request Method: POST
Status Code: (failed) CORS error
```

## Test với React Query Hooks

### Test useLogin hook:

Trong component login:

```typescript
import { useLogin } from '@/lib/react-query/hooks';

function LoginForm() {
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginMutation.mutateAsync({
        email: 'admin@novacamera.com',
        password: 'Admin@123'
      });
      
      console.log('Login successful:', result);
      // Should redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {loginMutation.isError && (
        <div>Error: {loginMutation.error.message}</div>
      )}
    </form>
  );
}
```

### Test useEquipments hook:

Trong equipment page:

```typescript
import { useEquipments } from '@/lib/react-query/hooks';

function EquipmentPage() {
  const { data, isLoading, error } = useEquipments({
    pageNumber: 1,
    pageSize: 10
  });

  console.log('Equipment data:', data);
  // Should show data without CORS errors

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Equipment Count: {data?.data?.totalRecords}</div>;
}
```

## Troubleshooting

### 1. Vẫn thấy CORS error

**Nguyên nhân:** Next.js dev server chưa restart sau khi thay đổi `.env`

**Giải pháp:**
```bash
# Dừng server (Ctrl+C)
npm run dev
```

### 2. API trả về 404 Not Found

**Nguyên nhân:** Proxy route chưa được tạo đúng cấu trúc

**Kiểm tra:**
```
src/app/api/proxy/[...path]/route.ts ✅ phải tồn tại
```

### 3. API trả về 500 Internal Server Error

**Nguyên nhân:** Backend API `https://api.mmoshop.site` đang down hoặc endpoint sai

**Kiểm tra:**
```bash
# Test trực tiếp backend API
curl https://api.mmoshop.site/Equipment
```

### 4. Token không được gửi lên

**Nguyên nhân:** Authorization header không được forward

**Kiểm tra proxy route** có forward header Authorization:

```typescript
// Trong proxy route
request.headers.forEach((value, key) => {
  if (!key.toLowerCase().startsWith('host')) {
    headers.set(key, value); // ✅ Phải forward Authorization
  }
});
```

## Logs để Debug

Thêm logging vào proxy route để debug:

```typescript
// src/app/api/proxy/[...path]/route.ts

async function proxyRequest(...) {
  console.log('=== PROXY REQUEST ===');
  console.log('Method:', method);
  console.log('Target URL:', url);
  console.log('Headers:', Object.fromEntries(headers.entries()));
  
  const response = await fetch(url, { method, headers, body });
  
  console.log('=== PROXY RESPONSE ===');
  console.log('Status:', response.status);
  console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
  
  return NextResponse.json(responseData, { status: response.status });
}
```

Sau đó check terminal logs khi call API.

## Kết luận

✅ **Đã setup xong CORS proxy** - Tất cả API calls giờ đi qua `/api/proxy/*`  
✅ **Backend API**: `https://api.mmoshop.site` với endpoints `/Auth/*`, `/Equipment/*`, `/RentalOrder/*`  
✅ **Frontend gọi**: `/api/proxy/Auth/login`, `/api/proxy/Equipment`, etc.  
✅ **Không còn CORS errors** vì request đi từ Next.js server (server-to-server)
