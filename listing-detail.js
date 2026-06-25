const listings = {
  'providence-gardens-apt': {
    title: 'Providence Gardens Apt.',
    type: '2 BR · 2 BA',
    price: 'G$180,000/mo',
    address: 'Lot 12, Providence Gardens, EBD',
    description: 'Bright and spacious two-bedroom apartment with polished floors, open entertaining spaces, and a calm private patio ideal for evening relaxation.',
    features: ['1,050 sq ft', 'In-unit laundry', 'Private patio', '1 covered parking'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80'
    ]
  },
  'garden-view-unit': {
    title: 'Garden View Unit',
    type: '1 BR · 1 BA',
    price: 'G$110,000/mo',
    address: 'Lot 4, Providence Gardens, EBD',
    description: 'A comfortable one-bedroom home with modern finishes, a walk-in closet, and easy access to community paths and local amenities.',
    features: ['720 sq ft', 'Updated kitchen', 'Walk-in closet', 'Street parking'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80'
    ]
  },
  'massiah-executive-home': {
    title: 'Massiah Executive Home',
    type: '3 BR · 2 BA',
    price: 'G$280,000/mo',
    address: 'Lot 67, Providence Gardens, EBD',
    description: 'A premium executive home with generous indoor-outdoor living, a fenced compound, and a dedicated garage for convenient family living.',
    features: ['1,600 sq ft', 'Garage & carport', 'Fenced compound', 'Generator hookup'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=900&q=80',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80'
    ]
  },
  'providence-studio-flat': {
    title: 'Providence Studio Flat',
    type: 'Studio · 1 BA',
    price: 'G$75,000/mo',
    address: 'Lot 5, Providence Gardens, EBD',
    description: 'A practical and stylish studio with useful built-in storage, garden views, and an inviting open layout.',
    features: ['480 sq ft', 'Garden views', 'Utilities included', 'Secure compound'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=900&q=80'
    ]
  },
  'demerara-terrace': {
    title: 'Demerara Terrace',
    type: '2 BR · 1 BA',
    price: 'G$145,000/mo',
    address: 'Lot 33, Providence Gardens, EBD',
    description: 'A contemporary two-bedroom terrace home with a sleek kitchen design, comfortable living zones, and close access to the community pool.',
    features: ['890 sq ft', 'Modern kitchen', 'Community pool', '2 parking spots'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80'
    ]
  },
  'essequibo-loft': {
    title: 'Essequibo Loft',
    type: '1 BR · 1 BA',
    price: 'G$125,000/mo',
    address: 'Lot 9, Providence Gardens, EBD',
    description: 'An airy loft-style residence featuring high ceilings, abundant natural light, and an efficient open plan that feels larger than it is.',
    features: ['810 sq ft', 'High ceilings', 'Natural ventilation', 'Off-street parking'],
    images: [
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=900&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80'
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const listingKey = params.get('listing') || 'providence-gardens-apt';
const listing = listings[listingKey];

const detailImage = document.getElementById('detailImage');
const detailTitle = document.getElementById('detailTitle');
const detailType = document.getElementById('detailType');
const detailPrice = document.getElementById('detailPrice');
const detailAddress = document.getElementById('detailAddress');
const detailDescription = document.getElementById('detailDescription');
const detailFeatures = document.getElementById('detailFeatures');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

if (!listing) {
  detailTitle.textContent = 'Listing not found';
  detailDescription.textContent = 'This listing could not be found. Please return to the main listings page.';
} else {
  let currentIndex = 0;

  const renderListing = () => {
    detailTitle.textContent = listing.title;
    detailType.textContent = listing.type;
    detailPrice.textContent = listing.price;
    detailAddress.textContent = listing.address;
    detailDescription.textContent = listing.description;
    detailFeatures.innerHTML = '';
    listing.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      detailFeatures.appendChild(li);
    });

    detailImage.src = listing.images[currentIndex];
    detailImage.alt = `${listing.title} image ${currentIndex + 1}`;

    dotsContainer.innerHTML = '';
    listing.images.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot${index === currentIndex ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Show image ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        renderListing();
      });
      dotsContainer.appendChild(dot);
    });
  };

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + listing.images.length) % listing.images.length;
    renderListing();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % listing.images.length;
    renderListing();
  });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % listing.images.length;
    renderListing();
  }, 6000);

  renderListing();
}
