import { useState, useEffect } from 'react';
import { categoryService, equipmentService } from '@/lib/api/services';

interface Category {
  categoryId: number;
  categoryName: string | null;
  equipmentCount?: number;
}

interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

interface FiltersDataState {
  categories: Category[];
  brands: string[];
  priceRange: PriceRange | null;
  loading: boolean;
  error: string | null;
  isReady: boolean; // True when categories, brands, and price range are loaded
}

/**
 * Custom hook to load Categories, Brands, and Price Range SEQUENTIALLY before Products
 * Prevents CORS errors from simultaneous API calls
 */
export function useFiltersData(): FiltersDataState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchFiltersData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Step 1: Loading Categories...');

        // Step 1: Load categories
        const categoriesResponse = await categoryService.getCategories();
        console.log('✅ Categories loaded:', categoriesResponse.data?.length || 0);

        if (!isMounted) return;

        if (categoriesResponse.statusCode === 200 && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        console.log('🔄 Step 2: Loading Brands...');

        // Step 2: Load brands (after categories)
        try {
          const brandsResponse = await equipmentService.getBrands();
          console.log('✅ Brands API Response:', brandsResponse);
          console.log('📦 Brands response.errors:', brandsResponse.errors);
          console.log('📦 Brands response.data:', brandsResponse.data);

          if (!isMounted) return;

          // Backend returns brands in "errors" field with statusCode 400 (backend mistake)
          // Will be fixed later, for now we handle both cases
          const brandsData = brandsResponse.errors || brandsResponse.data || [];
          
          console.log('🔍 Final brandsData:', brandsData);
          
          if (brandsData.length > 0) {
            setBrands(brandsData);
            console.log('✅ Brands SET to state:', brandsData.length, brandsData);
          } else {
            console.log('⚠️ No brands data found');
          }
        } catch (brandError: unknown) {
          console.error('❌ Error loading brands:', brandError);
          
          // WORKAROUND: Backend returns brands in error.errors field with statusCode 400
          // This is a backend bug - brands should be in response.data with statusCode 200
          if (brandError && typeof brandError === 'object' && 'errors' in brandError) {
            const errors = (brandError as { errors: string[] }).errors;
            if (Array.isArray(errors)) {
              console.log('🔧 Extracting brands from error.errors (backend workaround):', errors);
              setBrands(errors);
              console.log('✅ Brands SET from error:', errors.length, errors);
            }
          } else {
            console.log('⚠️ No brands found in error either');
          }
        }

        // Step 3: Mark as ready for Products to load
        if (isMounted) {
          setIsReady(true);
          console.log('✅ Filters ready - Products can now load');
        }

      } catch (err) {
        console.error('❌ Error loading filters:', err);
        if (isMounted) {
          setError('Failed to load filters');
          setIsReady(true); // Still allow products to load with fallback
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFiltersData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    brands,
    priceRange,
    loading,
    error,
    isReady,
  };
}
