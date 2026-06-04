import { Product } from '../types';

export const CATEGORIES = [
  "Diagnostic & Monitoring",
  "Clinical & Hospital",
  "Mobility & Rehabilitation",
  "Laboratory",
  "Emergency & First Aid"
];

const createProduct = (data: Omit<Product, 'images'>): Product => ({
  ...data,
  images: [data.image] // Initialize gallery with the primary image
});

export const INITIAL_PRODUCTS: Product[] = [
  // Diagnostic
  createProduct({
    id: '1',
    name: 'MediHub Pro Digital BP Monitor',
    slug: 'medihub-pro-digital-bp-monitor',
    category: 'Diagnostic & Monitoring',
    price: 4500,
    stock: 50,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=BP+Monitor',
    shortDescription: 'Clinically accurate upper arm blood pressure monitor with large LCD.',
    longDescription: 'The MediHub Pro Digital BP Monitor offers precise readings with an easy-to-read display. Features irregular heartbeat detection, 2-user memory, and a comfortable wide-range cuff suitable for most arm sizes. Essential for home health monitoring.',
    specifications: { 'Type': 'Upper Arm', 'Power': '4xAA Batteries', 'Memory': '2 users x 60 readings' },
    rating: 4.8,
    reviews: 124,
    featured: true
  }),
  createProduct({
    id: '2',
    name: 'Fingertip Pulse Oximeter',
    slug: 'fingertip-pulse-oximeter',
    category: 'Diagnostic & Monitoring',
    price: 2500,
    stock: 120,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Oximeter',
    shortDescription: 'Accurate SpO2 and pulse rate measurement in seconds.',
    longDescription: 'Compact and lightweight, this Pulse Oximeter is perfect for sports enthusiasts and health management. It accurately determines your SpO2 (blood oxygen saturation levels) and pulse rate.',
    specifications: { 'Display': 'OLED', 'Auto-off': 'Yes', 'Battery': '2xAAA' },
    rating: 4.6,
    reviews: 89
  }),
  createProduct({
    id: '3',
    name: 'AccuSmart Glucometer Kit',
    slug: 'accusmart-glucometer-kit',
    category: 'Diagnostic & Monitoring',
    price: 3200,
    stock: 45,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Glucometer',
    shortDescription: 'Complete blood glucose monitoring system with strips and lancets.',
    longDescription: 'Keep your blood sugar in check with the AccuSmart Glucometer. Fast 5-second results, small blood sample requirement, and memory for 500 tests. Includes 50 test strips and lancets.',
    specifications: { 'Result Time': '5 seconds', 'Sample Size': '0.6 µL', 'Coding': 'No coding required' },
    rating: 4.7,
    reviews: 210
  }),
  createProduct({
    id: '4',
    name: 'Infrared Forehead Thermometer',
    slug: 'infrared-forehead-thermometer',
    category: 'Diagnostic & Monitoring',
    price: 3800,
    stock: 80,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Thermometer',
    shortDescription: 'Contactless digital thermometer for hygienic fever screening.',
    longDescription: 'Professional grade non-contact infrared thermometer. Ideal for hospitals, clinics, and home use. Provides instant readings with fever alarm and color-coded backlight.',
    specifications: { 'Distance': '1-5cm', 'Memory': '32 sets', 'Response': '1 second' },
    rating: 4.5,
    reviews: 56
  }),
  createProduct({
    id: '5',
    name: 'Portable ECG Monitor',
    slug: 'portable-ecg-monitor',
    category: 'Diagnostic & Monitoring',
    price: 18500,
    stock: 15,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=ECG+Monitor',
    shortDescription: 'Handheld ECG monitor for instant heart rhythm analysis.',
    longDescription: 'Detects arrhythmias and heart irregularities anywhere, anytime. Easy to use with immediate results displayed on a clear color screen. PC software included for report printing.',
    specifications: { 'Channels': 'Single', 'Battery': 'Rechargeable Li-ion', 'Connectivity': 'USB' },
    rating: 4.9,
    reviews: 32
  }),

  // Clinical
  createProduct({
    id: '6',
    name: 'Hydraulic Examination Bed',
    slug: 'hydraulic-examination-bed',
    category: 'Clinical & Hospital',
    price: 45000,
    stock: 5,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Exam+Bed',
    shortDescription: 'Adjustable height examination couch for clinical use.',
    longDescription: 'Heavy-duty steel frame with comfortable padding. Hydraulic height adjustment facilitates easy patient transfer and ergonomic working position for doctors.',
    specifications: { 'Max Load': '200kg', 'Adjustment': 'Hydraulic Foot Pump', 'Material': 'PU Leather' },
    rating: 5.0,
    reviews: 12
  }),
  createProduct({
    id: '7',
    name: 'Heavy Duty Suction Machine',
    slug: 'heavy-duty-suction-machine',
    category: 'Clinical & Hospital',
    price: 28000,
    stock: 10,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Suction+Machine',
    shortDescription: 'Powerful suction unit for surgical and emergency use.',
    longDescription: 'Designed for absorbing thick liquids such as blood and phlegm. Features a high negative pressure, large flux, and low noise level. Essential for operating theaters.',
    specifications: { 'Flow Rate': '20L/min', 'Bottle': '2500ml x 2', 'Noise': '<60dB' },
    rating: 4.8,
    reviews: 8
  }),
  createProduct({
    id: '8',
    name: 'Tabletop Autoclave Class B',
    slug: 'tabletop-autoclave-class-b',
    category: 'Clinical & Hospital',
    price: 120000,
    stock: 3,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Autoclave',
    shortDescription: '23L Sterilizer for medical and dental instruments.',
    longDescription: 'Fully automatic front-loading autoclave with vacuum cycles. Ensures complete sterilization of hollow and porous loads. Digital display and built-in printer.',
    specifications: { 'Capacity': '23 Liters', 'Chamber': 'Stainless Steel', 'Programs': '5 Preset' },
    rating: 4.9,
    reviews: 5
  }),
  createProduct({
    id: '9',
    name: 'Multi-Parameter Patient Monitor',
    slug: 'multi-parameter-patient-monitor',
    category: 'Clinical & Hospital',
    price: 85000,
    stock: 7,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Patient+Monitor',
    shortDescription: '12-inch screen monitor for ICU and OR.',
    longDescription: 'Monitors ECG, NIBP, SpO2, Resp, and Temp. High-resolution color TFT display. Suitable for adult, pediatric, and neonatal patients.',
    specifications: { 'Screen': '12.1" TFT', 'Battery': '4 hours backup', 'Alarm': 'Visual & Audio' },
    rating: 4.7,
    reviews: 15
  }),
  createProduct({
    id: '10',
    name: 'Nebulizer Compressor Kit',
    slug: 'nebulizer-compressor-kit',
    category: 'Clinical & Hospital',
    price: 4500,
    stock: 40,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Nebulizer',
    shortDescription: 'Effective medication delivery for respiratory conditions.',
    longDescription: 'Compact compressor nebulizer designed for efficient management of asthma, COPD, and other respiratory disorders. Includes mask and tubing.',
    specifications: { 'Particle Size': '3 µm', 'Noise': 'Low', 'Operation': 'One-button' },
    rating: 4.6,
    reviews: 98
  }),

  // Mobility
  createProduct({
    id: '11',
    name: 'Foldable Steel Wheelchair',
    slug: 'foldable-steel-wheelchair',
    category: 'Mobility & Rehabilitation',
    price: 15000,
    stock: 25,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Wheelchair',
    shortDescription: 'Durable chrome-plated steel wheelchair with leather seat.',
    longDescription: 'Standard lightweight wheelchair with fixed armrests and footrests. Folds easily for transport and storage. Maintenance-free solid tires.',
    specifications: { 'Frame': 'Chrome Steel', 'Seat Width': '46cm', 'Max Weight': '100kg' },
    rating: 4.8,
    reviews: 45,
    featured: true
  }),
  createProduct({
    id: '12',
    name: 'Aluminum Walker with Wheels',
    slug: 'aluminum-walker-wheels',
    category: 'Mobility & Rehabilitation',
    price: 6500,
    stock: 30,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Walker',
    shortDescription: 'Height adjustable folding walker with front wheels.',
    longDescription: 'Provides stability and support for those needing assistance walking. Lightweight aluminum frame with one-button folding mechanism.',
    specifications: { 'Material': 'Anodized Aluminum', 'Height': 'Adjustable', 'Type': 'Reciprocal' },
    rating: 4.7,
    reviews: 33
  }),
  createProduct({
    id: '13',
    name: 'Adjustable Elbow Crutches (Pair)',
    slug: 'adjustable-elbow-crutches',
    category: 'Mobility & Rehabilitation',
    price: 3500,
    stock: 60,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Crutches',
    shortDescription: 'Ergonomic aluminum forearm crutches.',
    longDescription: 'Double adjustable crutches for optimal fit. Comfortable hand grips and non-slip rubber tips ensure safety and comfort during use.',
    specifications: { 'Material': 'Aluminum', 'Cuff': 'Open', 'Weight Capacity': '110kg' },
    rating: 4.5,
    reviews: 28
  }),
  
  // Laboratory
  createProduct({
    id: '14',
    name: 'Binocular Compound Microscope',
    slug: 'binocular-compound-microscope',
    category: 'Laboratory',
    price: 35000,
    stock: 12,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Microscope',
    shortDescription: 'Professional biological microscope for lab analysis.',
    longDescription: 'High-quality optical system with 4 objectives (4x, 10x, 40x, 100x oil). LED illumination and mechanical stage. Ideal for clinical and educational labs.',
    specifications: { 'Head': 'Binocular Sliding', 'Magnification': '40x - 1000x', 'Light': 'LED Adjustable' },
    rating: 4.9,
    reviews: 14
  }),
  createProduct({
    id: '15',
    name: 'Digital Lab Centrifuge',
    slug: 'digital-lab-centrifuge',
    category: 'Laboratory',
    price: 22000,
    stock: 8,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Centrifuge',
    shortDescription: '8-place rotor centrifuge with timer and speed control.',
    longDescription: 'Low speed benchtop centrifuge for separation of blood and urine samples. Brushless motor ensures quiet operation and maintenance-free use.',
    specifications: { 'Max Speed': '4000 RPM', 'Capacity': '8 x 15ml', 'Timer': '0-99 mins' },
    rating: 4.7,
    reviews: 9
  }),

  // Emergency
  createProduct({
    id: '16',
    name: 'Professional First Aid Kit',
    slug: 'professional-first-aid-kit',
    category: 'Emergency & First Aid',
    price: 4500,
    stock: 100,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=First+Aid+Kit',
    shortDescription: 'Comprehensive kit for home, office, or vehicle.',
    longDescription: 'Contains essential supplies for treating minor injuries. Includes bandages, antiseptics, scissors, gloves, and more in a durable carrying case.',
    specifications: { 'Pieces': '120+', 'Case': 'Hard Plastic', 'Standard': 'KEBS Approved' },
    rating: 4.8,
    reviews: 150,
    featured: true
  }),
  createProduct({
    id: '17',
    name: 'Medical Oxygen Cylinder (10L)',
    slug: 'medical-oxygen-cylinder-10l',
    category: 'Emergency & First Aid',
    price: 18000,
    stock: 20,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Oxygen+Cylinder',
    shortDescription: 'Refillable steel oxygen tank with regulator.',
    longDescription: 'Seamless steel cylinder for medical oxygen storage. Comes with a flowmeter and humidifier bottle. Essential for emergency respiratory support.',
    specifications: { 'Capacity': '10 Liters', 'Material': 'Steel', 'Valve': 'Standard Medical' },
    rating: 5.0,
    reviews: 40
  }),
  createProduct({
    id: '18',
    name: 'Automated External Defibrillator (AED)',
    slug: 'aed-defibrillator',
    category: 'Emergency & First Aid',
    price: 180000,
    stock: 4,
    image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=AED',
    shortDescription: 'Life-saving device for sudden cardiac arrest.',
    longDescription: 'Portable AED with voice prompts for untrained users. Analyses heart rhythm and delivers shock if needed. Includes adult/pediatric pads.',
    specifications: { 'Waveform': 'Biphasic', 'Battery': '5 Year Standby', 'IP Rating': 'IP55' },
    rating: 5.0,
    reviews: 7
  })
];