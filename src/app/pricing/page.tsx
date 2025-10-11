import Header from '@/components/organisms/Header';

export default async function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Pricing Plans
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Choose the perfect rental plan for your photography needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Basic</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">$49/day</p>
              <ul className="text-gray-600 space-y-2">
                <li>• Basic camera body</li>
                <li>• Standard lens</li>
                <li>• Memory card</li>
                <li>• Basic support</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-500">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Professional</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">$99/day</p>
              <ul className="text-gray-600 space-y-2">
                <li>• Professional camera</li>
                <li>• Multiple lenses</li>
                <li>• Lighting equipment</li>
                <li>• Priority support</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Enterprise</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">$199/day</p>
              <ul className="text-gray-600 space-y-2">
                <li>• Complete equipment set</li>
                <li>• Full lighting setup</li>
                <li>• Audio equipment</li>
                <li>• 24/7 support</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}