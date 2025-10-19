export default function TestDeployPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test Deployment Page</h1>
      <p>If you can see this, the deployment is working!</p>
      <p>Date: {new Date().toISOString()}</p>
      <a href="/">Go to Home</a>
    </div>
  );
}
