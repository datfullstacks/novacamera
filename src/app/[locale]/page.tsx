import Link from 'next/link';

export default function LocaleHome() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '60px 40px', 
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '20px',
          color: '#1D3557'
        }}>
          🎥 Nova Camera
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#666',
          marginBottom: '40px'
        }}>
          Dịch vụ cho thuê thiết bị nhiếp ảnh chuyên nghiệp
        </p>
        <Link 
          href="/landing" 
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: '#E63946',
            color: 'white',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '20px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(230, 57, 70, 0.4)',
            transition: 'transform 0.2s',
          }}
        >
          Xem Landing Page →
        </Link>
      </div>
    </div>
  );
}
