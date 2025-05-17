// Mock data for benches

// Define a function to get local assets using require
// This is needed because require statements must be static and can't be dynamic
const getBenchImage = () => require('../assets/bench.png');
const getUserImage = () => require('../assets/user.png');

export const mockBenches = [
  {
    id: "1",
    name: "Victoria Park Bench",
    description: "A peaceful bench overlooking the lake at Victoria Park. Perfect for watching ducks and enjoying the scenery.",
    location: "Victoria Park, 32 Schneider Ave, Kitchener, ON",
    latitude: 43.4491,
    longitude: -80.4937,
    rating: 4.8,
    tier: "premium",
    features: ["Backrest", "Armrests", "Shade from trees", "Lake view", "Quiet area"],
    images: [
      getBenchImage(),
      getBenchImage(),
      getBenchImage(),
    ],
    reviews: [
      {
        userName: "Sarah M.",
        userAvatar: getUserImage(),
        rating: 5,
        text: "This is my favorite bench in Kitchener! The view of the lake is absolutely stunning, especially at sunset. The bench is comfortable and well-maintained.",
        date: "May 15, 2023",
      },
      {
        userName: "Michael T.",
        userAvatar: getUserImage(),
        rating: 4,
        text: "Great spot for reading a book or just relaxing. The only reason I'm not giving 5 stars is because it can get crowded on weekends.",
        date: "April 30, 2023",
      },
      {
        userName: "Jessica L.",
        userAvatar: getUserImage(),
        rating: 5,
        text: "Perfect place to unwind after work. The bench is clean and the view is therapeutic.",
        date: "April 12, 2023",
      },
    ],
  },
  {
    id: "2",
    name: "Kitchener City Hall Bench",
    description: "A classic wooden bench in the heart of downtown Kitchener. Great for people watching and taking a break.",
    location: "Kitchener City Hall, 200 King St W, Kitchener, ON",
    latitude: 43.4515,
    longitude: -80.4929,
    rating: 4.5,
    tier: "good",
    features: ["Wooden construction", "Backrest", "Central location", "Near fountain", "High foot traffic"],
    images: [
      getBenchImage(),
      getBenchImage(),
      getBenchImage(),
    ],
    reviews: [
      {
        userName: "David K.",
        userAvatar: getUserImage(),
        rating: 5,
        text: "I proposed to my wife on this bench! It will always be special to us. It's in a beautiful location with lots of activity around.",
        date: "June 2, 2023",
      },
      {
        userName: "Emma R.",
        userAvatar: getUserImage(),
        rating: 4,
        text: "Great bench for people watching. It can get a bit busy, but that's part of the charm.",
        date: "May 20, 2023",
      },
    ],
  },
  {
    id: "3",
    name: "McLennan Park Bench",
    description: "A secluded bench with panoramic views of Kitchener from the hill. Perfect for photography enthusiasts.",
    location: "McLennan Park, 901 Ottawa St S, Kitchener, ON",
    latitude: 43.4188,
    longitude: -80.4708,
    rating: 4.9,
    tier: "premium",
    features: [
      "Panoramic view",
      "Secluded location",
      "Stone construction",
      "Sunrise/sunset spot",
      "Photography hotspot",
    ],
    images: [
      getBenchImage(),
      getBenchImage(),
      getBenchImage(),
    ],
    reviews: [
      {
        userName: "Alex P.",
        userAvatar: getUserImage(),
        rating: 5,
        text: "The best view in Kitchener, hands down! I come here to take photos all the time. The bench is perfectly positioned.",
        date: "June 10, 2023",
      },
      {
        userName: "Olivia S.",
        userAvatar: getUserImage(),
        rating: 5,
        text: "A hidden gem! Not many people know about this spot, which makes it even better. The bench is comfortable and the view is breathtaking.",
        date: "May 28, 2023",
      },
      {
        userName: "Ryan M.",
        userAvatar: getUserImage(),
        rating: 4,
        text: "Great spot for a date or just to clear your head. The only downside is that it can get windy up here.",
        date: "May 15, 2023",
      },
    ],
  },
  {
    id: "4",
    name: "Kiwanis Park Bench",
    description:
      "A simple bench in a friendly neighborhood park. Great for watching kids play or chatting with neighbors.",
    location: "Kiwanis Park, 601 Kiwanis Dr, Kitchener, ON",
    latitude: 43.4424,
    longitude: -80.4782,
    rating: 3.8,
    tier: "basic",
    features: ["Near playground", "Metal construction", "No shade", "Family-friendly area", "Dog-friendly"],
    images: [
      getBenchImage(),
      getBenchImage(),
    ],
    reviews: [
      {
        userName: "Jennifer L.",
        userAvatar: getUserImage(),
        rating: 4,
        text: "Great bench for watching my kids play. It could use some shade though, gets hot in the summer.",
        date: "June 5, 2023",
      },
      {
        userName: "Mark B.",
        userAvatar: getUserImage(),
        rating: 3,
        text: "It's a basic bench that serves its purpose. Nothing special but gets the job done.",
        date: "May 22, 2023",
      },
    ],
  },
  {
    id: "5",
    name: "Huron Natural Area Bench",
    description: "A charming bench surrounded by beautiful native flora in one of Kitchener's natural conservation areas.",
    location: "Huron Natural Area, 801 Trillium Dr, Kitchener, ON",
    latitude: 43.4027,
    longitude: -80.5126,
    rating: 4.7,
    tier: "good",
    features: ["Natural setting", "Surrounded by wildflowers", "Shaded area", "Peaceful environment", "Bird watching spot"],
    images: [
      getBenchImage(),
      getBenchImage(),
      getBenchImage(),
    ],
    reviews: [
      {
        userName: "Sophie W.",
        userAvatar: getUserImage(),
        rating: 5,
        text: "The most beautiful bench setting in Kitchener! I love coming here with a book and spending hours surrounded by nature.",
        date: "June 15, 2023",
      },
      {
        userName: "Thomas H.",
        userAvatar: getUserImage(),
        rating: 5,
        text: "A perfect spot for meditation and reflection. The park staff keep this area immaculate.",
        date: "June 1, 2023",
      },
      {
        userName: "Lily R.",
        userAvatar: getUserImage(),
        rating: 4,
        text: "Beautiful location! The bench itself is a bit hard, but the surroundings more than make up for it.",
        date: "May 18, 2023",
      },
    ],
  },
]
