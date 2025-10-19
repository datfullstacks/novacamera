# CORS Issue và Giải Pháp

## Vấn đề

Backend API tại `https://api.mmoshop.site` chưa được cấu hình CORS (Cross-Origin Resource Sharing), dẫn đến lỗi khi frontend Next.js cố gắng gọi API trực tiếp từ browser:

```
Access to fetch at 'https://api.mmoshop.site/Auth/login' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Lưu ý:** `https://api.mmoshop.site` đã là API base URL, các endpoints như `/Auth/login`, `/Equipment`, `/RentalOrder` sẽ được gọi trực tiếp từ base URL này.

## Giải pháp đã áp dụng: Next.js API Proxy Route

### Cách hoạt động:
1. **Frontend** gọi API qua Next.js proxy route: `/api/proxy/*`
2. **Next.js Server** (không bị giới hạn CORS) forward request đến backend: `https://api.mmoshop.site/*`
3. **Backend** trả về response cho Next.js Server
4. **Next.js Server** forward response về Frontend

### Ưu điểm:
- ✅ Bypass CORS hoàn toàn
- ✅ Không cần thay đổi backend
- ✅ Bảo mật hơn (có thể thêm authentication, rate limiting ở proxy layer)
- ✅ Có thể cache responses
- ✅ Có thể transform data trước khi gửi về frontend

### Cấu trúc:

```
Frontend (Browser)
    ↓ fetch('/api/proxy/Auth/login')
Next.js API Route (/api/proxy/[...path]/route.ts)
    ↓ fetch('https://api.mmoshop.site/Auth/login')
Backend API (https://api.mmoshop.site)
```

**Ví dụ API endpoints:**
- Login: `https://api.mmoshop.site/Auth/login` → `/api/proxy/Auth/login`
- Equipment List: `https://api.mmoshop.site/Equipment` → `/api/proxy/Equipment`
- Equipment Detail: `https://api.mmoshop.site/Equipment/123` → `/api/proxy/Equipment/123`

## Cách sử dụng

### 1. Environment Variables (.env)

```env
# Frontend sẽ gọi API qua proxy route
NEXT_PUBLIC_API_URL=/api/proxy

# Backend URL (chỉ dùng server-side)
API_BACKEND_URL=https://api.mmoshop.site
```

### 2. API Client tự động sử dụng proxy

```typescript
// Trước: https://api.mmoshop.site/Auth/login
// Sau:  /api/proxy/Auth/login (Next.js server sẽ forward đến backend)

const response = await apiClient.post('/Auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

### 3. Proxy Route xử lý tất cả HTTP methods

- GET - Lấy dữ liệu
- POST - Tạo mới
- PUT - Cập nhật toàn bộ
- PATCH - Cập nhật một phần
- DELETE - Xóa

## Giải pháp khác (nếu có quyền truy cập Backend)

### Cấu hình CORS trên Backend C# (.NET)

Nếu bạn có quyền thay đổi backend API (NovaCMS-API-Csharp), thêm CORS configuration:

#### Program.cs hoặc Startup.cs:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",      // Development
            "https://yourdomain.com"      // Production
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Use CORS middleware
app.UseCors("AllowFrontend");

app.Run();
```

## Testing

### Test proxy route:

```bash
# Test GET
curl http://localhost:3000/api/proxy/Equipment/GetAllEquipments

# Test POST
curl -X POST http://localhost:3000/api/proxy/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Kiểm tra trong Browser DevTools:

1. Mở **Network tab**
2. Thực hiện login hoặc API call
3. Kiểm tra request URL - phải là `/api/proxy/*` thay vì `https://api.mmoshop.site/*`
4. Kiểm tra response - không còn CORS error

## Troubleshooting

### Lỗi vẫn còn sau khi setup:

1. **Restart Next.js dev server**:
   ```bash
   # Dừng server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache và cookies**

3. **Kiểm tra .env file** đã được load:
   ```typescript
   console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
   ```

4. **Kiểm tra proxy route có được tạo**:
   ```
   src/app/api/proxy/[...path]/route.ts
   ```

### Debug proxy requests:

Thêm logging vào proxy route:

```typescript
console.log('Proxying request:', {
  method,
  url,
  headers: Object.fromEntries(headers.entries())
});
```

## Lưu ý bảo mật

1. **Rate Limiting**: Thêm rate limiting vào proxy route
2. **Authentication**: Validate token trước khi forward request
3. **Whitelist endpoints**: Chỉ cho phép một số endpoints cụ thể
4. **Request validation**: Validate request body trước khi forward

## Kết luận

Proxy route là giải pháp tốt nhất khi không có quyền thay đổi backend API. Nó giải quyết hoàn toàn vấn đề CORS và còn mang lại nhiều lợi ích về bảo mật, caching và monitoring.
