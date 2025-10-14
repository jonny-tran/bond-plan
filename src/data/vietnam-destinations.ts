import { Destination } from './types';

export const vietnamDestinations: Destination[] = [
  {
    id: 'vung-tau',
    city: 'Vung Tau',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    attractions: [
      { id: 'vt-bai-truoc', name: 'Front Beach', description: 'Central park and beach area.', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', lat: 10.344, lng: 107.078 },
      { id: 'vt-bai-sau', name: 'Back Beach', description: 'Popular beach for swimming.', imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600', lat: 10.330, lng: 107.093 },
      { id: 'vt-christ-the-king', name: 'Christ the King', description: 'Panoramic city view.', imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', lat: 10.323, lng: 107.087 },
      { id: 'vt-lighthouse', name: 'The Lighthouse', description: 'Beautiful spot for sunset.', imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600', lat: 10.334, lng: 107.081 },
      { id: 'vt-nghinh-phong', name: 'Nghinh Phong Cape', description: 'Heaven’s gate and sea views.', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', lat: 10.320, lng: 107.088 }
    ]
  },
  {
    id: 'da-lat',
    city: 'Da Lat',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    attractions: [
      { id: 'dl-xuan-huong', name: 'Xuan Huong Lake', description: 'Swan boats and lakeside walks.', imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600', lat: 11.940, lng: 108.438 },
      { id: 'dl-crazy-house', name: 'Crazy House', description: 'Surreal tree-like architecture.', imageUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600', lat: 11.938, lng: 108.418 },
      { id: 'dl-langbiang', name: 'Langbiang Mountain', description: 'Peak with valley views.', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', lat: 11.983, lng: 108.467 },
      { id: 'dl-datanla', name: 'Datanla Waterfall', description: 'Alpine coaster and hiking.', imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600', lat: 11.913, lng: 108.438 },
      { id: 'dl-valley-love', name: 'Valley of Love', description: 'Flower fields and lake.', imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600', lat: 11.923, lng: 108.458 }
    ]
  }
];
