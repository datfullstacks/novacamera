/**
 * Helper để tạo câu hỏi tự nhiên từ dữ liệu wizard
 */

export interface WizardData {
  photographyType?: string;
  skillLevel?: string;
  budget?: number;
  preferences?: {
    brands?: string[];
    features?: string[];
  };
}

/**
 * Chuyển wizard data thành câu hỏi tự nhiên cho AI
 */
export function generateQuestionFromWizard(data: Record<string, unknown>): string {
  const wizardData = data as WizardData;
  
  let question = "Tôi cần tư vấn thiết bị chụp ảnh. ";

  // Step 1: Photography Type
  if (wizardData.photographyType) {
    const typeMap: Record<string, string> = {
      'portrait': 'chân dung',
      'landscape': 'phong cảnh',
      'wildlife': 'động vật hoang dã',
      'sports': 'thể thao',
      'wedding': 'cưới hỏi',
      'street': 'đường phố',
      'product': 'sản phẩm',
      'event': 'sự kiện',
    };
    const type = typeMap[wizardData.photographyType] || wizardData.photographyType;
    question += `Tôi chủ yếu chụp ${type}. `;
  }

  // Step 2: Skill Level
  if (wizardData.skillLevel) {
    const skillMap: Record<string, string> = {
      'beginner': 'người mới bắt đầu',
      'amateur': 'nghiệp dư',
      'intermediate': 'trung cấp',
      'advanced': 'nâng cao',
      'professional': 'chuyên nghiệp',
    };
    const skill = skillMap[wizardData.skillLevel] || wizardData.skillLevel;
    question += `Tôi là ${skill}. `;
  }

  // Step 3: Budget
  if (wizardData.budget) {
    const budget = wizardData.budget;
    question += `Ngân sách của tôi là ${budget.toLocaleString('vi-VN')}₫. `;
  }

  // Step 4: Preferences
  if (wizardData.preferences) {
    const { brands, features } = wizardData.preferences;
    
    if (brands && brands.length > 0) {
      question += `Tôi thích các thương hiệu: ${brands.join(', ')}. `;
    }
    
    if (features && features.length > 0) {
      const featureMap: Record<string, string> = {
        'autofocus': 'lấy nét tự động nhanh',
        'stabilization': 'chống rung',
        'weather-sealed': 'chống thấm nước',
        '4k-video': 'quay video 4K',
        'high-iso': 'ISO cao',
        'full-frame': 'cảm biến Full-frame',
      };
      const mappedFeatures = features.map(f => featureMap[f] || f);
      question += `Tôi cần các tính năng: ${mappedFeatures.join(', ')}. `;
    }
  }

  question += "Bạn có thể gợi ý thiết bị phù hợp cho tôi không?";

  return question;
}

/**
 * Mapping wizard data keys
 */
export const WIZARD_KEYS = {
  PHOTOGRAPHY_TYPE: 'photographyType',
  SKILL_LEVEL: 'skillLevel',
  BUDGET: 'budget',
  PREFERENCES: 'preferences',
} as const;

/**
 * Example wizard data format
 */
export const EXAMPLE_WIZARD_DATA: WizardData = {
  photographyType: 'portrait',
  skillLevel: 'beginner',
  budget: 5000000,
  preferences: {
    brands: ['Sony', 'Canon'],
    features: ['autofocus', 'stabilization'],
  },
};

/**
 * Generate example question
 * Output: "Tôi cần tư vấn thiết bị chụp ảnh. Tôi chủ yếu chụp chân dung. 
 *          Tôi là người mới bắt đầu. Ngân sách của tôi là 5.000.000₫. 
 *          Tôi thích các thương hiệu: Sony, Canon. 
 *          Tôi cần các tính năng: lấy nét tự động nhanh, chống rung. 
 *          Bạn có thể gợi ý thiết bị phù hợp cho tôi không?"
 */
