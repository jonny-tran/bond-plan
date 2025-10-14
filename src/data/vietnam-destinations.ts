import { Destination, BudgetLevel } from '@/types';

export const vietnamDestinations: Destination[] = [
  {
    id: 'vung-tau',
    city: 'Vung Tau',
    imageUrl: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800',
    attractions: [
      { 
        id: 'vt-bai-truoc', 
        name: 'Front Beach', 
        description: 'Central park and beach area perfect for strolls and local food.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
        lat: 10.344, 
        lng: 107.078 
      },
      { 
        id: 'vt-bai-sau', 
        name: 'Back Beach', 
        description: 'The most popular beach for swimming and water sports.',
        imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600',
        lat: 10.330, 
        lng: 107.093 
      },
      { 
        id: 'vt-christ-the-king', 
        name: 'Christ the King Statue', 
        description: 'Climb 800 steps to the statue for panoramic city views.',
        imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600',
        lat: 10.323, 
        lng: 107.087 
      },
      { 
        id: 'vt-lighthouse', 
        name: 'The Lighthouse', 
        description: 'Historic lighthouse with stunning sunset and sunrise views.',
        imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600',
        lat: 10.334, 
        lng: 107.081 
      },
      { 
        id: 'vt-nghinh-phong-cape', 
        name: 'Nghinh Phong Cape', 
        description: 'Features the famous "heaven\'s gate" and breathtaking sea views.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        lat: 10.320, 
        lng: 107.088 
      }
    ]
  },
  {
    id: 'da-lat',
    city: 'Da Lat',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    attractions: [
      { 
        id: 'dl-xuan-huong-lake', 
        name: 'Xuan Huong Lake', 
        description: 'Central lake perfect for swan boat rides and lakeside walks.',
        imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600',
        lat: 11.940, 
        lng: 108.438 
      },
      { 
        id: 'dl-crazy-house', 
        name: 'Crazy House', 
        description: 'Unique architectural wonder with surreal tree-like structures.',
        imageUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600',
        lat: 11.938, 
        lng: 108.418 
      },
      { 
        id: 'dl-langbiang-mountain', 
        name: 'Langbiang Mountain', 
        description: 'Hike or jeep ride to the peak for panoramic valley views.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        lat: 11.983, 
        lng: 108.467 
      },
      { 
        id: 'dl-datanla-waterfall', 
        name: 'Datanla Waterfall', 
        description: 'Adventure park with alpine coaster and waterfall hiking.',
        imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600',
        lat: 11.913, 
        lng: 108.438 
      },
      { 
        id: 'dl-valley-of-love', 
        name: 'Valley of Love', 
        description: 'Romantic garden valley with flower fields and lake activities.',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
        lat: 11.923, 
        lng: 108.458 
      }
    ]
  },
  {
    id: 'nha-trang',
    city: 'Nha Trang',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    attractions: [
      { 
        id: 'nt-vinpearl-land', 
        name: 'VinPearl Land', 
        description: 'Island amusement park with rides, water park, and aquarium.',
        imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600',
        lat: 12.199, 
        lng: 109.218 
      },
      { 
        id: 'nt-ponagar-tower', 
        name: 'Po Nagar Cham Towers', 
        description: 'Ancient Hindu temples dating back to the 8th century.',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600',
        lat: 12.265, 
        lng: 109.196 
      },
      { 
        id: 'nt-dam-market', 
        name: 'Dam Market', 
        description: 'Bustling local market for food, souvenirs, and culture.',
        imageUrl: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=600',
        lat: 12.246, 
        lng: 109.192 
      },
      { 
        id: 'nt-long-son-pagoda', 
        name: 'Long Son Pagoda', 
        description: 'Buddhist temple with giant white Buddha statue on the hill.',
        imageUrl: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=600',
        lat: 12.261, 
        lng: 109.187 
      },
      { 
        id: 'nt-island-hopping', 
        name: 'Island Hopping Tour', 
        description: 'Visit multiple islands for snorkeling, swimming, and seafood.',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        lat: 12.220, 
        lng: 109.200 
      }
    ]
  },
  {
    id: 'da-nang',
    city: 'Da Nang',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    attractions: [
      { 
        id: 'dn-marble-mountains', 
        name: 'Marble Mountains', 
        description: 'Five marble and limestone hills with caves, temples, and views.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        lat: 16.004, 
        lng: 108.262 
      },
      { 
        id: 'dn-dragon-bridge', 
        name: 'Dragon Bridge', 
        description: 'Iconic bridge that breathes fire and water on weekends.',
        imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
        lat: 16.061, 
        lng: 108.227 
      },
      { 
        id: 'dn-ba-na-hills', 
        name: 'Ba Na Hills', 
        description: 'Mountain resort with Golden Bridge and French village theme park.',
        imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600',
        lat: 15.996, 
        lng: 107.997 
      },
      { 
        id: 'dn-my-khe-beach', 
        name: 'My Khe Beach', 
        description: 'One of the most beautiful beaches in the world for surfing.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
        lat: 16.040, 
        lng: 108.246 
      },
      { 
        id: 'dn-han-market', 
        name: 'Han Market', 
        description: 'Central market for local food, textiles, and handicrafts.',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600',
        lat: 16.072, 
        lng: 108.224 
      }
    ]
  },
  {
    id: 'hoi-an',
    city: 'Hoi An',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    attractions: [
      { 
        id: 'ha-ancient-town', 
        name: 'Ancient Town', 
        description: 'UNESCO World Heritage site with preserved architecture and lanterns.',
        imageUrl: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600',
        lat: 15.879, 
        lng: 108.327 
      },
      { 
        id: 'ha-japanese-bridge', 
        name: 'Japanese Covered Bridge', 
        description: 'Iconic 400-year-old bridge connecting Japanese and Chinese quarters.',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
        lat: 15.878, 
        lng: 108.328 
      },
      { 
        id: 'ha-an-bang-beach', 
        name: 'An Bang Beach', 
        description: 'Peaceful beach with beachfront restaurants and water activities.',
        imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600',
        lat: 15.912, 
        lng: 108.360 
      },
      { 
        id: 'ha-basket-boat', 
        name: 'Basket Boat Experience', 
        description: 'Traditional Vietnamese round boat ride in coconut palm forests.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
        lat: 15.865, 
        lng: 108.317 
      },
      { 
        id: 'ha-night-market', 
        name: 'Night Market', 
        description: 'Vibrant evening market with street food, crafts, and lanterns.',
        imageUrl: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=600',
        lat: 15.879, 
        lng: 108.326 
      }
    ]
  },
  {
    id: 'ha-noi',
    city: 'Ha Noi',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    attractions: [
      { 
        id: 'hn-old-quarter', 
        name: 'Old Quarter', 
        description: 'Historic district with narrow streets, street food, and shops.',
        imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600',
        lat: 21.036, 
        lng: 105.849 
      },
      { 
        id: 'hn-hoan-kiem-lake', 
        name: 'Hoan Kiem Lake', 
        description: 'Central lake with Ngoc Son Temple and legend of the turtle.',
        imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600',
        lat: 21.029, 
        lng: 105.852 
      },
      { 
        id: 'hn-temple-of-literature', 
        name: 'Temple of Literature', 
        description: 'Vietnam\'s first university, built in 1070 for Confucian scholars.',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600',
        lat: 21.028, 
        lng: 105.835 
      },
      { 
        id: 'hn-ho-chi-minh-mausoleum', 
        name: 'Ho Chi Minh Mausoleum', 
        description: 'Monumental tomb and memorial for Vietnam\'s founding father.',
        imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600',
        lat: 21.037, 
        lng: 105.835 
      },
      { 
        id: 'hn-train-street', 
        name: 'Train Street', 
        description: 'Famous narrow street where trains pass between cafes and homes.',
        imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
        lat: 21.023, 
        lng: 105.847 
      }
    ]
  },
  {
    id: 'sapa',
    city: 'Sapa',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    attractions: [
      { 
        id: 'sp-fansipan', 
        name: 'Fansipan Mountain', 
        description: 'Highest peak in Indochina, accessible by cable car.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        lat: 22.302, 
        lng: 103.775 
      },
      { 
        id: 'sp-cat-cat-village', 
        name: 'Cat Cat Village', 
        description: 'Traditional H\'mong village with waterfalls and handicrafts.',
        imageUrl: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600',
        lat: 22.334, 
        lng: 103.841 
      },
      { 
        id: 'sp-rice-terraces', 
        name: 'Rice Terraces', 
        description: 'Stunning stepped rice fields carved into mountain slopes.',
        imageUrl: 'https://images.unsplash.com/photo-1586508246567-c0ab64ce2b3f?w=600',
        lat: 22.340, 
        lng: 103.844 
      },
      { 
        id: 'sp-love-waterfall', 
        name: 'Love Waterfall', 
        description: 'Beautiful 100m waterfall surrounded by lush forest.',
        imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600',
        lat: 22.338, 
        lng: 103.772 
      },
      { 
        id: 'sp-night-market', 
        name: 'Sapa Night Market', 
        description: 'Evening market with ethnic minority crafts and street food.',
        imageUrl: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=600',
        lat: 22.336, 
        lng: 103.843 
      }
    ]
  },
  {
    id: 'hue',
    city: 'Hue',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    attractions: [
      { 
        id: 'hu-imperial-city', 
        name: 'Imperial City', 
        description: 'UNESCO site - former capital with royal palaces and citadel.',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600',
        lat: 16.467, 
        lng: 107.580 
      },
      { 
        id: 'hu-thien-mu-pagoda', 
        name: 'Thien Mu Pagoda', 
        description: 'Iconic seven-story pagoda overlooking the Perfume River.',
        imageUrl: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=600',
        lat: 16.454, 
        lng: 107.556 
      },
      { 
        id: 'hu-royal-tombs', 
        name: 'Royal Tombs', 
        description: 'Elaborate mausoleums of Nguyen Dynasty emperors.',
        imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600',
        lat: 16.437, 
        lng: 107.548 
      },
      { 
        id: 'hu-dong-ba-market', 
        name: 'Dong Ba Market', 
        description: 'Largest market in Hue for local food and handicrafts.',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600',
        lat: 16.474, 
        lng: 107.587 
      },
      { 
        id: 'hu-perfume-river-cruise', 
        name: 'Perfume River Cruise', 
        description: 'Boat ride with traditional music and riverside views.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
        lat: 16.463, 
        lng: 107.579 
      }
    ]
  },
  {
    id: 'phu-quoc',
    city: 'Phu Quoc',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    attractions: [
      { 
        id: 'pq-long-beach', 
        name: 'Long Beach', 
        description: 'Main beach with stunning sunsets and beachfront dining.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
        lat: 10.223, 
        lng: 103.967 
      },
      { 
        id: 'pq-vinpearl-safari', 
        name: 'VinPearl Safari', 
        description: 'Southeast Asia\'s largest wildlife conservation park.',
        imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600',
        lat: 10.370, 
        lng: 104.014 
      },
      { 
        id: 'pq-cable-car', 
        name: 'Cable Car to Hon Thom', 
        description: 'World\'s longest sea-crossing cable car with island views.',
        imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
        lat: 10.126, 
        lng: 103.934 
      },
      { 
        id: 'pq-night-market', 
        name: 'Dinh Cau Night Market', 
        description: 'Bustling market with seafood, souvenirs, and street food.',
        imageUrl: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=600',
        lat: 10.230, 
        lng: 103.969 
      },
      { 
        id: 'pq-snorkeling', 
        name: 'Snorkeling & Diving', 
        description: 'Explore coral reefs and marine life at multiple dive sites.',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        lat: 10.300, 
        lng: 104.000 
      }
    ]
  },
  {
    id: 'can-tho',
    city: 'Can Tho',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    attractions: [
      { 
        id: 'ct-floating-market', 
        name: 'Cai Rang Floating Market', 
        description: 'Largest floating market in Mekong Delta, early morning activity.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
        lat: 10.050, 
        lng: 105.795 
      },
      { 
        id: 'ct-ninh-kieu-wharf', 
        name: 'Ninh Kieu Wharf', 
        description: 'Riverside promenade with night market and boat tours.',
        imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600',
        lat: 10.034, 
        lng: 105.782 
      },
      { 
        id: 'ct-bang-lang-stork-garden', 
        name: 'Bang Lang Stork Garden', 
        description: 'Sanctuary with thousands of storks and diverse bird species.',
        imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600',
        lat: 10.007, 
        lng: 105.601 
      },
      { 
        id: 'ct-mekong-river-cruise', 
        name: 'Mekong River Cruise', 
        description: 'Boat tour through narrow canals and traditional villages.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
        lat: 10.030, 
        lng: 105.780 
      },
      { 
        id: 'ct-ong-pagoda', 
        name: 'Ong Pagoda', 
        description: 'Beautiful Chinese-style temple dedicated to Quan Cong.',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600',
        lat: 10.037, 
        lng: 105.779 
      }
    ]
  }
];

export const budgetLevels: BudgetLevel[] = [
  {
    key: "low",
    label: "Economical",
    description: "Under $25/person/day"
  },
  {
    key: "medium",
    label: "Moderate",
    description: "$25-60/person/day"
  },
  {
    key: "high",
    label: "Premium",
    description: "Above $60/person/day"
  }
];
