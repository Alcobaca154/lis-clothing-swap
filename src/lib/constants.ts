export const CATEGORIES = [
  { id: 'official_secondary', label: 'Official Secondary' },
  { id: 'official_primary', label: 'Official Primary' },
  { id: 'pe_secondary', label: 'PE Secondary' },
  { id: 'pe_preschool_primary', label: 'PE Preschool/Primary' },
  { id: 'daily_secondary', label: 'Daily Secondary' },
  { id: 'daily_preschool_primary', label: 'Daily Preschool/Primary' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export const PRIMARY_SIZES = ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'] as const
export const SECONDARY_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

export const ITEM_TYPES = [
  'Polo Short-Sleeve',
  'Polo Long-Sleeve',
  'T-Shirt',
  'Shirt',
  'Sweatshirt',
  'Cardigan',
  'Fleece Jacket',
  'Chinos',
  'Jeans',
  'Skirt',
  'Skort',
  'Shorts',
  'Leggings',
  'Tracksuit Bottoms',
  'Pique Dress',
  'Raincoat',
  'Hat',
  'Panama Hat',
] as const

export const GENDERS = ['boys', 'girls', 'unisex'] as const

export type Gender = (typeof GENDERS)[number]

export function getSizesForCategory(categoryId: string): readonly string[] {
  if (categoryId.includes('secondary')) {
    return SECONDARY_SIZES
  }
  return PRIMARY_SIZES
}
