(() => {
  'use strict';

  const image = (id, width = 1200, position = 'center') =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86&crop=${position}`;

  const IMAGE_BANK = {
    women: [
      'photo-1539109136881-3be0616acf4b', 'photo-1529139574466-a303027c1d8b',
      'photo-1490481651871-ab68de25d43d', 'photo-1509631179647-0177331693ae',
      'photo-1515886657613-9f3515b0c78f', 'photo-1543076447-215ad9ba6923',
      'photo-1525507119028-ed4c629a60a3', 'photo-1503342217505-b0a15ec3261c',
      'photo-1517841905240-472988babdf9', 'photo-1483985988355-763728e1935b',
      'photo-1551488831-00ddcb6c6bd3', 'photo-1520975954732-35dd22299614'
    ],
    men: [
      'photo-1552374196-c4e7ffc6e126', 'photo-1516257984-b1b4d707412e',
      'photo-1521572163474-6864f9cf17ab', 'photo-1598033129183-c4f50c736f10',
      'photo-1620799140408-edc6dcb6d633', 'photo-1618354691373-d851c5c3a990',
      'photo-1506629082955-511b1aa562c8', 'photo-1512436991641-6745cdb1723f',
      'photo-1523398002811-999ca8dec234', 'photo-1562157873-818bc0726f68',
      'photo-1551488831-00ddcb6c6bd3', 'photo-1520975954732-35dd22299614'
    ],
    bags: [
      'photo-1548036328-c9fa89d128fa', 'photo-1584917865442-de89df76afd3',
      'photo-1591561954557-26941169b49e', 'photo-1590874103328-eac38a683ce7',
      'photo-1566150905458-1bf1fc113f0d', 'photo-1559563458-527698bf5295',
      'photo-1585488434455-1e7b6b91c0ee', 'photo-1564422170194-896b89110ef8',
      'photo-1594223274512-ad4803739b7c', 'photo-1584917865442-de89df76afd3',
      'photo-1575890318083-4d7c6ebcd60f', 'photo-1594223274512-ad4803739b7c'
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff', 'photo-1543163521-1bf539c55dd2',
      'photo-1495555961986-6d4c1ecb7be3', 'photo-1525966222134-fcfa99b8ae77',
      'photo-1560769629-975ec94e6a86', 'photo-1549298916-b41d501d3772',
      'photo-1533867617858-e7b97e060509', 'photo-1600185365483-26d7a4cc7519',
      'photo-1539185441755-769473a23570', 'photo-1579338559194-a162d19bf842',
      'photo-1608231387042-66d1773070a5', 'photo-1552346154-21d32810aba3'
    ],
    accessories: [
      'photo-1523170335258-f5ed11844a49', 'photo-1522312346375-d1a52e2b99b3',
      'photo-1511499767150-a48a237f0083', 'photo-1509695507497-903c140c43b0',
      'photo-1583394838336-acd977736f90', 'photo-1606760227091-3dd870d97f1d',
      'photo-1591076482161-42ce6da69f67', 'photo-1577803645773-f96470509666',
      'photo-1511499767150-a48a237f0083', 'photo-1523779917675-b6ed3a42a561',
      'photo-1523170335258-f5ed11844a49', 'photo-1518544866330-95a2bfb4e9ba'
    ],
    jewelry: [
      'photo-1515562141207-7a88fb7ce338', 'photo-1599643478518-a784e5dc4c8f',
      'photo-1611652022419-a9419f74343d', 'photo-1535632066927-ab7c9ab60908',
      'photo-1602173574767-37ac01994b2a', 'photo-1599459183200-59c7687a0275',
      'photo-1573408301185-9146fe634ad0', 'photo-1605100804763-247f67b3557e',
      'photo-1619119069152-a2b331eb392a', 'photo-1596944924616-7b38e7cfac36',
      'photo-1617038220319-276d3cfab638', 'photo-1531995811006-35cb42e1a022'
    ],
    lifestyle: [
      'photo-1618221195710-dd6b41faaea6', 'photo-1616486338812-3dadae4b4ace',
      'photo-1600210492486-724fe5c67fb0', 'photo-1555041469-a586c61ea9bc',
      'photo-1505693416388-ac5ce068fe85', 'photo-1600566753190-17f0baa2a6c3',
      'photo-1615874694520-474822394e73', 'photo-1615529182904-14819c35db37',
      'photo-1616594039964-ae9021a400a0', 'photo-1600210491892-03d54c0aaf87',
      'photo-1616486338812-3dadae4b4ace', 'photo-1618220179428-22790b461013'
    ],
    gifts: [
      'photo-1549465220-1a8b9238cd48', 'photo-1607344645866-009c320b63e0',
      'photo-1513201099705-a9746e1e201f', 'photo-1602173574767-37ac01994b2a',
      'photo-1549465220-1a8b9238cd48', 'photo-1513883049090-d0b7439799bf',
      'photo-1602173574767-37ac01994b2a', 'photo-1573408301185-9146fe634ad0',
      'photo-1607344645866-009c320b63e0', 'photo-1549465220-1a8b9238cd48',
      'photo-1605100804763-247f67b3557e', 'photo-1513201099705-a9746e1e201f'
    ]
  };

  const CATEGORY_CONFIG = {
    women: {
      label: 'Women', base: 540,
      types: ['Dresses', 'Tailoring', 'Silk Shirts', 'Knitwear', 'Denim', 'Outerwear', 'Tops', 'Skirts'],
      nouns: ['Sculpted Gown', 'Satin Column Dress', 'Baroque Blazer', 'Silk Cady Shirt', 'Riviera Knit', 'High-Waist Jean', 'Leather Trench', 'Draped Top'],
      descriptors: ['Obsidian', 'Palazzo', 'Gilded', 'Serpentine', 'Celestial', 'Medallion', 'Luminous', 'Regal'],
      sizes: ['34', '36', '38', '40', '42', '44', '46']
    },
    men: {
      label: 'Men', base: 490,
      types: ['Shirts', 'Tailoring', 'Knitwear', 'Denim', 'Outerwear', 'T-Shirts', 'Trousers', 'Polos'],
      nouns: ['Silk Camp Shirt', 'Double-Breasted Jacket', 'Jacquard Polo', 'Straight Denim', 'Leather Overshirt', 'Embroidered Tee', 'Formal Trouser', 'Merino Cardigan'],
      descriptors: ['Nocturne', 'Imperial', 'Monogram', 'Vellum', 'Aureate', 'Palazzo', 'Sculpted', 'Signature'],
      sizes: ['44', '46', '48', '50', '52', '54', '56', '58']
    },
    bags: {
      label: 'Bags', base: 780,
      types: ['Top Handles', 'Totes', 'Shoulder Bags', 'Clutches', 'Crossbody Bags', 'Backpacks', 'Mini Bags', 'Travel'],
      nouns: ['Arcadia Top Handle', 'Palazzo Tote', 'Nox Shoulder Bag', 'Vela Clutch', 'Lira Crossbody', 'Atelier Backpack', 'Minerva Mini Bag', 'Grand Voyage Holdall'],
      descriptors: ['Studded', 'Quilted', 'Patent', 'Woven', 'Monogram', 'Sculpted', 'Embossed', 'Metallic'],
      sizes: ['ONE SIZE']
    },
    shoes: {
      label: 'Shoes', base: 430,
      types: ['Heels', 'Loafers', 'Sneakers', 'Sandals', 'Boots', 'Mules', 'Flats', 'Formal Shoes'],
      nouns: ['Giara Heel', 'Orfeo Loafer', 'Pivot Sneaker', 'Lido Sandal', 'Nerina Boot', 'Astra Mule', 'Silk Ballet Flat', 'Vittorio Derby'],
      descriptors: ['Crystal', 'Patent', 'Sculpted', 'Metallic', 'Medallion', 'Monogram', 'Satin', 'Studded'],
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
    },
    accessories: {
      label: 'Accessories', base: 250,
      types: ['Belts', 'Sunglasses', 'Watches', 'Scarves', 'Wallets', 'Hats', 'Tech', 'Small Leather Goods'],
      nouns: ['Ornament Belt', 'Luce Sunglasses', 'Aion Watch', 'Silk Carré', 'Vela Wallet', 'Palazzo Cap', 'Monogram Tech Case', 'Nox Card Holder'],
      descriptors: ['Gilded', 'Geometric', 'Chronograph', 'Printed', 'Embossed', 'Baroque', 'Leather', 'Crystal'],
      sizes: ['ONE SIZE']
    },
    jewelry: {
      label: 'Jewelry', base: 320,
      types: ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Brooches', 'Chains', 'Charms', 'Cuffs'],
      nouns: ['Solstice Necklace', 'Aurelia Earrings', 'Serpent Bracelet', 'Signet Ring', 'Palazzo Brooch', 'Nox Chain', 'Medallion Charm', 'Sculpted Cuff'],
      descriptors: ['Crystal', 'Gold-Tone', 'Silver-Tone', 'Enamel', 'Pearl', 'Pavé', 'Sculpted', 'Iconic'],
      sizes: ['ONE SIZE']
    },
    lifestyle: {
      label: 'Lifestyle', base: 180,
      types: ['Tableware', 'Textiles', 'Candles', 'Decor', 'Stationery', 'Games', 'Bath', 'Pet Accessories'],
      nouns: ['Palazzo Plate', 'Baroque Throw', 'Neroli Candle', 'Aureate Vase', 'Atelier Notebook', 'Marble Chess Set', 'Silk Bath Robe', 'Monogram Pet Collar'],
      descriptors: ['Porcelain', 'Jacquard', 'Scented', 'Sculptural', 'Leather-Bound', 'Inlaid', 'Cotton', 'Gilded'],
      sizes: ['ONE SIZE']
    },
    gifts: {
      label: 'Gifts', base: 210,
      types: ['For Her', 'For Him', 'Celebrations', 'Under $500', 'Signature Gifts', 'Home Gifts', 'Personalized', 'Collectors'],
      nouns: ['Silk Gift Edit', 'Gentleman Set', 'Celebration Case', 'Icon Miniature', 'House Signature Box', 'Palazzo Home Set', 'Monogram Keepsake', 'Collector Medallion'],
      descriptors: ['Curated', 'Limited', 'Festive', 'Iconic', 'Signature', 'Opulent', 'Personalized', 'Numbered'],
      sizes: ['ONE SIZE']
    }
  };

  const colors = [
    { name: 'Black', hex: '#111111' }, { name: 'Ivory', hex: '#eee9df' },
    { name: 'Gold', hex: '#a9873f' }, { name: 'Blue', hex: '#42647d' },
    { name: 'Red', hex: '#8f1d2c' }, { name: 'Pink', hex: '#d5a5ad' },
    { name: 'Green', hex: '#435b49' }, { name: 'Silver', hex: '#b7b7b4' },
    { name: 'Brown', hex: '#63483a' }, { name: 'White', hex: '#f7f7f5' }
  ];
  const fits = ['Regular', 'Slim', 'Relaxed', 'Oversized', 'Cropped', 'Tailored', 'Sculpted', 'Fluid'];
  const highlights = ['New In', 'Runway Edition', 'Online Exclusive', 'House Icon', '', '', 'Limited Series', ''];
  const materials = ['Silk', 'Cotton', 'Lambskin', 'Wool', 'Denim', 'Calf Leather', 'Viscose', 'Cashmere'];

  const hash = (text) => [...text].reduce((n, char) => ((n << 5) - n + char.charCodeAt(0)) | 0, 0);
  const money = (value) => Math.round(value / 5) * 5;

  const makeProduct = (category, index) => {
    const config = CATEGORY_CONFIG[category];
    const typeIndex = index % config.types.length;
    const descriptor = config.descriptors[(index * 3 + 1) % config.descriptors.length];
    const noun = config.nouns[typeIndex];
    const color = colors[(index * 7 + typeIndex) % colors.length];
    const material = materials[(index * 5 + typeIndex) % materials.length];
    const serial = String(index + 1).padStart(3, '0');
    const id = `${category}-${serial}`;
    const seed = Math.abs(hash(id));
    const bank = IMAGE_BANK[category];
    const primaryId = bank[index % bank.length];
    const secondaryId = bank[(index + 3 + typeIndex) % bank.length];
    const detailId = bank[(index + 6) % bank.length];
    const price = money(config.base + (seed % 1120) + typeIndex * 45);
    const title = `${descriptor} ${noun}`;
    const badge = highlights[(index + typeIndex) % highlights.length];

    return {
      id,
      category,
      categoryLabel: config.label,
      type: config.types[typeIndex],
      name: title,
      price,
      compareAt: index % 19 === 0 ? money(price * 1.18) : null,
      color: color.name,
      colorHex: color.hex,
      fit: fits[(index * 2 + typeIndex) % fits.length],
      badge,
      material,
      style: `AZ-${String(260000 + seed % 739999).padStart(6, '0')}-${serial}`,
      sizes: config.sizes,
      image: image(primaryId, 1000),
      image2: image(secondaryId, 1000),
      images: [
        image(primaryId, 1600),
        image(secondaryId, 1600),
        image(detailId, 1600),
        image(bank[(index + 8) % bank.length], 1600)
      ],
      description: `A precise expression of AURENZA's modern opulence, the ${title.toLowerCase()} is crafted in ${material.toLowerCase()} with a considered ${fits[(index * 2 + typeIndex) % fits.length].toLowerCase()} line. Signature hardware and atelier finishing bring architectural clarity to the silhouette.`,
      details: [
        `${material} construction`,
        `${fits[(index * 2 + typeIndex) % fits.length]} fit`,
        'Signature AURENZA hardware',
        'Designed in Accra, finished in Italy',
        'Specialist clean only'
      ],
      stock: 3 + (seed % 18),
      rating: (4.3 + (seed % 7) / 10).toFixed(1),
      editorial: index % 11 === 0,
      createdRank: 120 - index
    };
  };

  const products = Object.keys(CATEGORY_CONFIG).flatMap((category) =>
    Array.from({ length: 120 }, (_, index) => makeProduct(category, index))
  );

  const categoryCounts = Object.fromEntries(
    Object.keys(CATEGORY_CONFIG).map((category) => [category, products.filter((p) => p.category === category).length])
  );

  window.AURENZA = Object.freeze({
    products,
    categories: CATEGORY_CONFIG,
    categoryCounts,
    colors,
    fits,
    highlights: highlights.filter(Boolean),
    image,
    findProduct(id) {
      return products.find((product) => product.id === id) || products[0];
    },
    formatPrice(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    },
    productsFor(category) {
      return products.filter((product) => product.category === category);
    }
  });
})();
