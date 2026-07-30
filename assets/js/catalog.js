(() => {
  'use strict';

  /*
    AURENZA LOCAL-IMAGE CATALOG
    ---------------------------
    Replace your existing assets/js/catalog.js with this entire file.

    Every visual product has a fixed name, category, color and image stem.
    The hover image is always the same product photographed from another angle.

    Required folders:
      assets/images/products/women/
      assets/images/products/men/
      assets/images/products/bags/
      assets/images/products/shoes/
      assets/images/products/accessories/
      assets/images/products/jewelry/
      assets/images/products/lifestyle/
      assets/images/products/gifts/

    Example files for the first women's product:
      women-01-front.webp
      women-01-hover.webp
      women-01-back.webp
      women-01-detail.webp

    Change IMAGE_EXTENSION to 'jpg' or 'png' when needed.
    Set USE_EXTENDED_GALLERY to false when you only have front + hover images.
  */

  const PRODUCT_IMAGE_ROOT = 'assets/images/products';
  const IMAGE_EXTENSION = 'webp';
  const USE_EXTENDED_GALLERY = true;
  const EDITIONS_PER_STYLE = 10; // 12 styles × 10 editions = 120 products/category.

  const image = (path) => path;

  const COLORS = [
    { name: 'Black', hex: '#111111' },
    { name: 'Ivory', hex: '#eee9df' },
    { name: 'Gold', hex: '#a9873f' },
    { name: 'Blue', hex: '#42647d' },
    { name: 'Red', hex: '#8f1d2c' },
    { name: 'Pink', hex: '#d5a5ad' },
    { name: 'Green', hex: '#435b49' },
    { name: 'Silver', hex: '#b7b7b4' },
    { name: 'Brown', hex: '#63483a' },
    { name: 'White', hex: '#f7f7f5' }
  ];

  const COLOR_MAP = Object.fromEntries(COLORS.map((color) => [color.name, color]));
  const FITS = ['Regular', 'Slim', 'Relaxed', 'Oversized', 'Cropped', 'Tailored', 'Sculpted', 'Fluid'];
  const HIGHLIGHTS = ['New In', 'Runway Edition', 'Online Exclusive', 'House Icon', 'Limited Series'];
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  /*
    Each style below corresponds to ONE visual product and ONE image stem.
    Example: file: 'women-01' uses women-01-front.webp and women-01-hover.webp.
    Download an image that matches the exact product name and color.
  */
  const CATEGORY_CONFIG = {
    women: {
      label: 'Women',
      sizes: ['34', '36', '38', '40', '42', '44', '46'],
      styles: [
        { file: 'women-01', name: 'Black Silk Column Gown', type: 'Dresses', color: 'Black', material: 'Silk', fit: 'Sculpted', basePrice: 1890, search: 'black silk column evening gown female model luxury fashion product photography' },
        { file: 'women-02', name: 'Ivory Tailored Wool Blazer', type: 'Tailoring', color: 'Ivory', material: 'Wool', fit: 'Tailored', basePrice: 1450, search: 'ivory tailored womens wool blazer luxury ecommerce product photography' },
        { file: 'women-03', name: 'Gold Draped Satin Dress', type: 'Dresses', color: 'Gold', material: 'Satin', fit: 'Fluid', basePrice: 1720, search: 'gold draped satin midi dress luxury womens fashion product photography' },
        { file: 'women-04', name: 'Blue Silk Cady Shirt', type: 'Silk Shirts', color: 'Blue', material: 'Silk', fit: 'Relaxed', basePrice: 890, search: 'blue silk cady womens shirt luxury ecommerce product photography' },
        { file: 'women-05', name: 'Red High-Waist Wide-Leg Trousers', type: 'Tailoring', color: 'Red', material: 'Wool', fit: 'Tailored', basePrice: 980, search: 'red high waist wide leg womens trousers luxury product photography' },
        { file: 'women-06', name: 'Pink Cashmere Cropped Cardigan', type: 'Knitwear', color: 'Pink', material: 'Cashmere', fit: 'Cropped', basePrice: 1120, search: 'pink cashmere cropped cardigan womens luxury ecommerce photography' },
        { file: 'women-07', name: 'Green Leather Trench Coat', type: 'Outerwear', color: 'Green', material: 'Lambskin', fit: 'Regular', basePrice: 2890, search: 'green leather trench coat women luxury fashion product photography' },
        { file: 'women-08', name: 'Silver Crystal Evening Top', type: 'Tops', color: 'Silver', material: 'Viscose', fit: 'Slim', basePrice: 1240, search: 'silver crystal evening top women luxury fashion product photography' },
        { file: 'women-09', name: 'Brown Suede Pencil Skirt', type: 'Skirts', color: 'Brown', material: 'Suede', fit: 'Slim', basePrice: 1080, search: 'brown suede pencil skirt women luxury ecommerce product photography' },
        { file: 'women-10', name: 'White Cotton Poplin Shirt Dress', type: 'Dresses', color: 'White', material: 'Cotton', fit: 'Oversized', basePrice: 920, search: 'white cotton poplin shirt dress women luxury product photography' },
        { file: 'women-11', name: 'Blue Straight-Leg Denim Jeans', type: 'Denim', color: 'Blue', material: 'Denim', fit: 'Regular', basePrice: 680, search: 'blue straight leg womens denim jeans luxury ecommerce photography' },
        { file: 'women-12', name: 'Black Embellished Mini Dress', type: 'Dresses', color: 'Black', material: 'Viscose', fit: 'Sculpted', basePrice: 1580, search: 'black embellished mini dress women luxury fashion product photography' }
      ]
    },

    men: {
      label: 'Men',
      sizes: ['44', '46', '48', '50', '52', '54', '56', '58'],
      styles: [
        { file: 'men-01', name: 'Black Double-Breasted Wool Jacket', type: 'Tailoring', color: 'Black', material: 'Wool', fit: 'Tailored', basePrice: 1790, search: 'black double breasted wool blazer men luxury product photography' },
        { file: 'men-02', name: 'Ivory Cotton Camp-Collar Shirt', type: 'Shirts', color: 'Ivory', material: 'Cotton', fit: 'Relaxed', basePrice: 720, search: 'ivory cotton camp collar shirt men luxury ecommerce photography' },
        { file: 'men-03', name: 'Gold Jacquard Knit Polo', type: 'Polos', color: 'Gold', material: 'Viscose', fit: 'Slim', basePrice: 840, search: 'gold jacquard knit polo men luxury product photography' },
        { file: 'men-04', name: 'Blue Short-Sleeve Denim Shirt', type: 'Shirts', color: 'Blue', material: 'Denim', fit: 'Regular', basePrice: 790, search: 'blue short sleeve denim shirt men luxury ecommerce product photography' },
        { file: 'men-05', name: 'Red Pleated Formal Trousers', type: 'Trousers', color: 'Red', material: 'Wool', fit: 'Tailored', basePrice: 850, search: 'red pleated formal trousers men luxury product photography' },
        { file: 'men-06', name: 'Pink Merino Knit Cardigan', type: 'Knitwear', color: 'Pink', material: 'Merino Wool', fit: 'Relaxed', basePrice: 970, search: 'pink merino cardigan men luxury fashion product photography' },
        { file: 'men-07', name: 'Green Suede Overshirt', type: 'Outerwear', color: 'Green', material: 'Suede', fit: 'Regular', basePrice: 1680, search: 'green suede overshirt men luxury ecommerce photography' },
        { file: 'men-08', name: 'Silver Embroidered Cotton T-Shirt', type: 'T-Shirts', color: 'Silver', material: 'Cotton', fit: 'Regular', basePrice: 490, search: 'silver embroidered cotton t shirt men luxury product photography' },
        { file: 'men-09', name: 'Brown Leather Bomber Jacket', type: 'Outerwear', color: 'Brown', material: 'Lambskin', fit: 'Regular', basePrice: 2450, search: 'brown leather bomber jacket men luxury fashion product photography' },
        { file: 'men-10', name: 'White Cotton Poplin Dress Shirt', type: 'Shirts', color: 'White', material: 'Cotton', fit: 'Slim', basePrice: 620, search: 'white cotton poplin dress shirt men luxury ecommerce photography' },
        { file: 'men-11', name: 'Blue Straight-Leg Denim Jeans', type: 'Denim', color: 'Blue', material: 'Denim', fit: 'Regular', basePrice: 690, search: 'blue straight leg denim jeans men luxury product photography' },
        { file: 'men-12', name: 'Black Cashmere Turtleneck Sweater', type: 'Knitwear', color: 'Black', material: 'Cashmere', fit: 'Slim', basePrice: 1080, search: 'black cashmere turtleneck sweater men luxury ecommerce photography' }
      ]
    },

    bags: {
      label: 'Bags',
      sizes: ['ONE SIZE'],
      styles: [
        { file: 'bags-01', name: 'Black Sculpted Leather Top-Handle Bag', type: 'Top Handles', color: 'Black', material: 'Calf Leather', fit: 'Structured', basePrice: 1890, search: 'black sculpted leather top handle handbag luxury product photography' },
        { file: 'bags-02', name: 'Ivory Quilted Shoulder Bag', type: 'Shoulder Bags', color: 'Ivory', material: 'Lambskin', fit: 'Structured', basePrice: 1650, search: 'ivory quilted leather shoulder bag luxury ecommerce photography' },
        { file: 'bags-03', name: 'Gold Metallic Evening Clutch', type: 'Clutches', color: 'Gold', material: 'Metallic Leather', fit: 'Structured', basePrice: 1120, search: 'gold metallic evening clutch luxury handbag product photography' },
        { file: 'bags-04', name: 'Blue Woven Leather Tote', type: 'Totes', color: 'Blue', material: 'Calf Leather', fit: 'Relaxed', basePrice: 1480, search: 'blue woven leather tote bag luxury ecommerce photography' },
        { file: 'bags-05', name: 'Red Patent Mini Bag', type: 'Mini Bags', color: 'Red', material: 'Patent Leather', fit: 'Structured', basePrice: 980, search: 'red patent leather mini bag luxury product photography' },
        { file: 'bags-06', name: 'Pink Satin Crystal Pouch', type: 'Clutches', color: 'Pink', material: 'Satin', fit: 'Soft', basePrice: 890, search: 'pink satin crystal pouch bag luxury evening product photography' },
        { file: 'bags-07', name: 'Green Embossed Crossbody Bag', type: 'Crossbody Bags', color: 'Green', material: 'Calf Leather', fit: 'Structured', basePrice: 1250, search: 'green embossed leather crossbody bag luxury ecommerce photography' },
        { file: 'bags-08', name: 'Silver Chain-Mail Shoulder Bag', type: 'Shoulder Bags', color: 'Silver', material: 'Metal Mesh', fit: 'Fluid', basePrice: 1420, search: 'silver chainmail shoulder bag luxury fashion product photography' },
        { file: 'bags-09', name: 'Brown Suede Hobo Bag', type: 'Shoulder Bags', color: 'Brown', material: 'Suede', fit: 'Relaxed', basePrice: 1380, search: 'brown suede hobo shoulder bag luxury product photography' },
        { file: 'bags-10', name: 'White Canvas Leather-Trim Tote', type: 'Totes', color: 'White', material: 'Canvas', fit: 'Structured', basePrice: 1160, search: 'white canvas leather trim tote bag luxury ecommerce photography' },
        { file: 'bags-11', name: 'Black Leather Atelier Backpack', type: 'Backpacks', color: 'Black', material: 'Calf Leather', fit: 'Structured', basePrice: 1540, search: 'black leather luxury backpack designer product photography' },
        { file: 'bags-12', name: 'Brown Leather Weekender Holdall', type: 'Travel', color: 'Brown', material: 'Calf Leather', fit: 'Structured', basePrice: 2080, search: 'brown leather weekender holdall luxury travel bag photography' }
      ]
    },

    shoes: {
      label: 'Shoes',
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
      styles: [
        { file: 'shoes-01', name: 'Black Patent Leather Loafers', type: 'Loafers', color: 'Black', material: 'Patent Leather', fit: 'Regular', basePrice: 890, search: 'black patent leather loafers luxury shoe product photography' },
        { file: 'shoes-02', name: 'Ivory Leather Penny Loafers', type: 'Loafers', color: 'Ivory', material: 'Calf Leather', fit: 'Regular', basePrice: 850, search: 'ivory leather penny loafers luxury ecommerce product photography' },
        { file: 'shoes-03', name: 'Gold Metallic Slingback Heels', type: 'Heels', color: 'Gold', material: 'Metallic Leather', fit: 'Regular', basePrice: 920, search: 'gold metallic slingback high heels luxury product photography' },
        { file: 'shoes-04', name: 'Blue Suede Platform Sandals', type: 'Sandals', color: 'Blue', material: 'Suede', fit: 'Regular', basePrice: 860, search: 'blue suede platform sandals luxury shoe product photography' },
        { file: 'shoes-05', name: 'Red Satin Pointed-Toe Pumps', type: 'Heels', color: 'Red', material: 'Satin', fit: 'Regular', basePrice: 780, search: 'red satin pointed toe pumps luxury fashion product photography' },
        { file: 'shoes-06', name: 'Pink Crystal Ballet Flats', type: 'Flats', color: 'Pink', material: 'Satin', fit: 'Regular', basePrice: 740, search: 'pink crystal ballet flats luxury shoe product photography' },
        { file: 'shoes-07', name: 'Green Leather Low-Top Sneakers', type: 'Sneakers', color: 'Green', material: 'Calf Leather', fit: 'Regular', basePrice: 690, search: 'green leather low top sneakers luxury ecommerce photography' },
        { file: 'shoes-08', name: 'Silver Sculpted-Heel Mules', type: 'Mules', color: 'Silver', material: 'Metallic Leather', fit: 'Regular', basePrice: 880, search: 'silver sculpted heel mules luxury product photography' },
        { file: 'shoes-09', name: 'Brown Suede Chelsea Boots', type: 'Boots', color: 'Brown', material: 'Suede', fit: 'Regular', basePrice: 1040, search: 'brown suede chelsea boots luxury shoe product photography' },
        { file: 'shoes-10', name: 'White Leather Court Sneakers', type: 'Sneakers', color: 'White', material: 'Calf Leather', fit: 'Regular', basePrice: 670, search: 'white leather court sneakers luxury ecommerce product photography' },
        { file: 'shoes-11', name: 'Black Studded Leather Sandals', type: 'Sandals', color: 'Black', material: 'Calf Leather', fit: 'Regular', basePrice: 720, search: 'black studded leather sandals luxury product photography' },
        { file: 'shoes-12', name: 'Brown Polished Leather Derby Shoes', type: 'Formal Shoes', color: 'Brown', material: 'Calf Leather', fit: 'Regular', basePrice: 960, search: 'brown polished leather derby shoes luxury product photography' }
      ]
    },

    accessories: {
      label: 'Accessories',
      sizes: ['ONE SIZE'],
      styles: [
        { file: 'accessories-01', name: 'Black Embossed Leather Belt', type: 'Belts', color: 'Black', material: 'Calf Leather', fit: 'Regular', basePrice: 460, search: 'black embossed leather belt gold buckle luxury product photography' },
        { file: 'accessories-02', name: 'Ivory Cat-Eye Sunglasses', type: 'Sunglasses', color: 'Ivory', material: 'Acetate', fit: 'Regular', basePrice: 390, search: 'ivory cat eye sunglasses luxury eyewear product photography' },
        { file: 'accessories-03', name: 'Gold Chronograph Leather Watch', type: 'Watches', color: 'Gold', material: 'Stainless Steel', fit: 'Regular', basePrice: 1480, search: 'gold chronograph watch leather strap luxury product photography' },
        { file: 'accessories-04', name: 'Blue Printed Silk Scarf', type: 'Scarves', color: 'Blue', material: 'Silk', fit: 'Fluid', basePrice: 420, search: 'blue printed silk scarf luxury fashion product photography' },
        { file: 'accessories-05', name: 'Red Leather Zip Wallet', type: 'Wallets', color: 'Red', material: 'Calf Leather', fit: 'Structured', basePrice: 520, search: 'red leather zip wallet luxury ecommerce product photography' },
        { file: 'accessories-06', name: 'Pink Crystal Hair Clip', type: 'Hair Accessories', color: 'Pink', material: 'Crystal', fit: 'Regular', basePrice: 280, search: 'pink crystal hair clip luxury accessory product photography' },
        { file: 'accessories-07', name: 'Green Embroidered Baseball Cap', type: 'Hats', color: 'Green', material: 'Cotton', fit: 'Regular', basePrice: 310, search: 'green embroidered baseball cap luxury fashion product photography' },
        { file: 'accessories-08', name: 'Silver Metal Optical Glasses', type: 'Eyewear', color: 'Silver', material: 'Metal', fit: 'Regular', basePrice: 410, search: 'silver metal optical glasses luxury eyewear product photography' },
        { file: 'accessories-09', name: 'Brown Leather Card Holder', type: 'Small Leather Goods', color: 'Brown', material: 'Calf Leather', fit: 'Structured', basePrice: 260, search: 'brown leather card holder luxury ecommerce photography' },
        { file: 'accessories-10', name: 'White Monogram Phone Case', type: 'Tech', color: 'White', material: 'Calf Leather', fit: 'Structured', basePrice: 240, search: 'white monogram leather phone case luxury product photography' },
        { file: 'accessories-11', name: 'Black Leather Gloves', type: 'Gloves', color: 'Black', material: 'Lambskin', fit: 'Slim', basePrice: 380, search: 'black leather gloves luxury fashion product photography' },
        { file: 'accessories-12', name: 'Gold Sculpted Cufflinks', type: 'Cufflinks', color: 'Gold', material: 'Brass', fit: 'Regular', basePrice: 340, search: 'gold sculpted cufflinks luxury jewelry product photography' }
      ]
    },

    jewelry: {
      label: 'Jewelry',
      sizes: ['ONE SIZE'],
      styles: [
        { file: 'jewelry-01', name: 'Black Enamel Medallion Necklace', type: 'Necklaces', color: 'Black', material: 'Enamel', fit: 'Regular', basePrice: 690, search: 'black enamel medallion necklace luxury jewelry product photography' },
        { file: 'jewelry-02', name: 'Ivory Pearl Drop Earrings', type: 'Earrings', color: 'Ivory', material: 'Pearl', fit: 'Regular', basePrice: 520, search: 'ivory pearl drop earrings luxury jewelry product photography' },
        { file: 'jewelry-03', name: 'Gold Sculpted Chain Necklace', type: 'Necklaces', color: 'Gold', material: 'Gold-Tone Brass', fit: 'Regular', basePrice: 780, search: 'gold sculpted chain necklace luxury product photography' },
        { file: 'jewelry-04', name: 'Blue Crystal Cocktail Ring', type: 'Rings', color: 'Blue', material: 'Crystal', fit: 'Regular', basePrice: 460, search: 'blue crystal cocktail ring luxury jewelry photography' },
        { file: 'jewelry-05', name: 'Red Enamel Signet Ring', type: 'Rings', color: 'Red', material: 'Enamel', fit: 'Regular', basePrice: 390, search: 'red enamel signet ring luxury jewelry product photography' },
        { file: 'jewelry-06', name: 'Pink Pavé Hoop Earrings', type: 'Earrings', color: 'Pink', material: 'Crystal', fit: 'Regular', basePrice: 540, search: 'pink pave hoop earrings luxury jewelry product photography' },
        { file: 'jewelry-07', name: 'Green Stone Pendant Necklace', type: 'Necklaces', color: 'Green', material: 'Stone', fit: 'Regular', basePrice: 610, search: 'green stone pendant necklace luxury jewelry photography' },
        { file: 'jewelry-08', name: 'Silver Serpent Cuff Bracelet', type: 'Cuffs', color: 'Silver', material: 'Silver-Tone Brass', fit: 'Regular', basePrice: 580, search: 'silver serpent cuff bracelet luxury jewelry product photography' },
        { file: 'jewelry-09', name: 'Brown Leather Gold-Tone Bracelet', type: 'Bracelets', color: 'Brown', material: 'Leather', fit: 'Regular', basePrice: 420, search: 'brown leather gold bracelet luxury jewelry product photography' },
        { file: 'jewelry-10', name: 'White Crystal Brooch', type: 'Brooches', color: 'White', material: 'Crystal', fit: 'Regular', basePrice: 490, search: 'white crystal brooch luxury jewelry product photography' },
        { file: 'jewelry-11', name: 'Gold Medallion Charm Bracelet', type: 'Bracelets', color: 'Gold', material: 'Gold-Tone Brass', fit: 'Regular', basePrice: 650, search: 'gold medallion charm bracelet luxury jewelry photography' },
        { file: 'jewelry-12', name: 'Silver Pavé Drop Earrings', type: 'Earrings', color: 'Silver', material: 'Crystal', fit: 'Regular', basePrice: 570, search: 'silver pave drop earrings luxury jewelry product photography' }
      ]
    },

    lifestyle: {
      label: 'Lifestyle',
      sizes: ['ONE SIZE'],
      styles: [
        { file: 'lifestyle-01', name: 'Black Porcelain Decorative Plate', type: 'Tableware', color: 'Black', material: 'Porcelain', fit: 'Regular', basePrice: 290, search: 'black porcelain decorative plate luxury home product photography' },
        { file: 'lifestyle-02', name: 'Ivory Jacquard Throw Blanket', type: 'Textiles', color: 'Ivory', material: 'Wool', fit: 'Regular', basePrice: 680, search: 'ivory jacquard throw blanket luxury home product photography' },
        { file: 'lifestyle-03', name: 'Gold Scented Candle', type: 'Candles', color: 'Gold', material: 'Wax', fit: 'Regular', basePrice: 190, search: 'gold luxury scented candle product photography' },
        { file: 'lifestyle-04', name: 'Blue Sculptural Ceramic Vase', type: 'Decor', color: 'Blue', material: 'Ceramic', fit: 'Regular', basePrice: 520, search: 'blue sculptural ceramic vase luxury decor product photography' },
        { file: 'lifestyle-05', name: 'Red Leather-Bound Notebook', type: 'Stationery', color: 'Red', material: 'Calf Leather', fit: 'Regular', basePrice: 180, search: 'red leather bound notebook luxury stationery product photography' },
        { file: 'lifestyle-06', name: 'Pink Velvet Decorative Cushion', type: 'Textiles', color: 'Pink', material: 'Velvet', fit: 'Regular', basePrice: 260, search: 'pink velvet decorative cushion luxury home product photography' },
        { file: 'lifestyle-07', name: 'Green Marble Chess Set', type: 'Games', color: 'Green', material: 'Marble', fit: 'Regular', basePrice: 890, search: 'green marble chess set luxury game product photography' },
        { file: 'lifestyle-08', name: 'Silver Sculptural Table Lamp', type: 'Lighting', color: 'Silver', material: 'Metal', fit: 'Regular', basePrice: 760, search: 'silver sculptural table lamp luxury interior product photography' },
        { file: 'lifestyle-09', name: 'Brown Leather Valet Tray', type: 'Decor', color: 'Brown', material: 'Calf Leather', fit: 'Regular', basePrice: 310, search: 'brown leather valet tray luxury home product photography' },
        { file: 'lifestyle-10', name: 'White Cotton Bath Robe', type: 'Bath', color: 'White', material: 'Cotton', fit: 'Relaxed', basePrice: 360, search: 'white luxury cotton bath robe product photography' },
        { file: 'lifestyle-11', name: 'Black Monogram Pet Collar', type: 'Pet Accessories', color: 'Black', material: 'Calf Leather', fit: 'Regular', basePrice: 240, search: 'black luxury leather pet collar product photography' },
        { file: 'lifestyle-12', name: 'Gold Porcelain Espresso Set', type: 'Tableware', color: 'Gold', material: 'Porcelain', fit: 'Regular', basePrice: 470, search: 'gold porcelain espresso cup set luxury product photography' }
      ]
    },

    gifts: {
      label: 'Gifts',
      sizes: ['ONE SIZE'],
      styles: [
        { file: 'gifts-01', name: 'Black Signature Gift Box', type: 'Signature Gifts', color: 'Black', material: 'Paper', fit: 'Regular', basePrice: 480, search: 'black luxury signature gift box ribbon product photography' },
        { file: 'gifts-02', name: 'Ivory Silk Gift Set for Her', type: 'For Her', color: 'Ivory', material: 'Silk', fit: 'Regular', basePrice: 640, search: 'ivory silk luxury gift set for women product photography' },
        { file: 'gifts-03', name: 'Gold Gentleman Accessories Set', type: 'For Him', color: 'Gold', material: 'Leather', fit: 'Regular', basePrice: 720, search: 'gold luxury mens accessories gift set product photography' },
        { file: 'gifts-04', name: 'Blue Leather Travel Gift Set', type: 'For Him', color: 'Blue', material: 'Calf Leather', fit: 'Regular', basePrice: 810, search: 'blue leather travel gift set luxury product photography' },
        { file: 'gifts-05', name: 'Red Celebration Keepsake Box', type: 'Celebrations', color: 'Red', material: 'Velvet', fit: 'Regular', basePrice: 520, search: 'red celebration keepsake gift box luxury product photography' },
        { file: 'gifts-06', name: 'Pink Fragrance and Candle Gift Set', type: 'For Her', color: 'Pink', material: 'Glass', fit: 'Regular', basePrice: 390, search: 'pink perfume candle luxury gift set product photography' },
        { file: 'gifts-07', name: 'Green Palazzo Home Gift Set', type: 'Home Gifts', color: 'Green', material: 'Porcelain', fit: 'Regular', basePrice: 580, search: 'green luxury home gift set porcelain product photography' },
        { file: 'gifts-08', name: 'Silver Collector Medallion Case', type: 'Collectors', color: 'Silver', material: 'Metal', fit: 'Regular', basePrice: 860, search: 'silver collector medallion presentation case luxury photography' },
        { file: 'gifts-09', name: 'Brown Personalized Leather Keepsake', type: 'Personalized', color: 'Brown', material: 'Calf Leather', fit: 'Regular', basePrice: 450, search: 'brown personalized leather keepsake luxury gift photography' },
        { file: 'gifts-10', name: 'White Porcelain Tea Gift Set', type: 'Home Gifts', color: 'White', material: 'Porcelain', fit: 'Regular', basePrice: 610, search: 'white porcelain tea gift set luxury product photography' },
        { file: 'gifts-11', name: 'Black Leather Desk Gift Set', type: 'For Him', color: 'Black', material: 'Calf Leather', fit: 'Regular', basePrice: 690, search: 'black leather desk accessories luxury gift set photography' },
        { file: 'gifts-12', name: 'Gold Limited-Edition Ornament', type: 'Collectors', color: 'Gold', material: 'Metal', fit: 'Regular', basePrice: 330, search: 'gold limited edition ornament luxury gift product photography' }
      ]
    }
  };

  // Keep the same category API expected by app.js and shop.js.
  Object.values(CATEGORY_CONFIG).forEach((config) => {
    config.types = [...new Set(config.styles.map((style) => style.type))];
  });

  const hash = (text) => [...text].reduce(
    (number, character) => ((number << 5) - number + character.charCodeAt(0)) | 0,
    0
  );

  const roundMoney = (value) => Math.round(value / 5) * 5;

  const productImagePath = (category, file, view) =>
    `${PRODUCT_IMAGE_ROOT}/${category}/${file}-${view}.${IMAGE_EXTENSION}`;

  const createImageSet = (category, file) => {
    const front = productImagePath(category, file, 'front');
    const hover = productImagePath(category, file, 'hover');
    const back = productImagePath(category, file, 'back');
    const detail = productImagePath(category, file, 'detail');

    return {
      front,
      hover,
      back,
      detail,
      gallery: USE_EXTENDED_GALLERY
        ? [front, hover, back, detail]
        : [front, hover, front, hover]
    };
  };

  const makeProduct = (category, styleIndex, editionIndex) => {
    const config = CATEGORY_CONFIG[category];
    const style = config.styles[styleIndex];
    const imageSet = createImageSet(category, style.file);
    const productNumber = editionIndex * config.styles.length + styleIndex + 1;
    const serial = String(productNumber).padStart(3, '0');
    const id = `${category}-${serial}`;
    const seed = Math.abs(hash(id));
    const editionLabel = editionIndex === 0 ? '' : ` — Atelier Edition ${ROMAN[editionIndex]}`;
    const price = roundMoney(style.basePrice + editionIndex * 35 + (styleIndex % 4) * 20);
    const badge = editionIndex === 0
      ? 'New In'
      : HIGHLIGHTS[(editionIndex + styleIndex) % HIGHLIGHTS.length];
    const color = COLOR_MAP[style.color] || COLORS[0];

    return {
      id,
      category,
      categoryLabel: config.label,
      type: style.type,
      name: `${style.name}${editionLabel}`,
      baseName: style.name,
      edition: editionIndex + 1,
      price,
      compareAt: productNumber % 19 === 0 ? roundMoney(price * 1.18) : null,
      color: color.name,
      colorHex: color.hex,
      fit: style.fit,
      badge,
      material: style.material,
      style: `AZ-${category.slice(0, 2).toUpperCase()}-${style.file.split('-').pop()}-${String(editionIndex + 1).padStart(2, '0')}`,
      sizes: config.sizes,

      // Product cards use front; hover uses hover.
      image: imageSet.front,
      image2: imageSet.hover,

      // Product-detail gallery uses the same product from four views.
      images: imageSet.gallery,

      imageFiles: {
        front: imageSet.front,
        hover: imageSet.hover,
        back: imageSet.back,
        detail: imageSet.detail
      },

      searchQuery: style.search,
      description: `The ${style.name.toLowerCase()} is crafted in ${style.material.toLowerCase()} with a ${style.fit.toLowerCase()} silhouette. This atelier edition preserves the same visual product identity across its front, alternate, back and detail photography.`,
      details: [
        `${style.material} construction`,
        `${style.fit} fit`,
        `Color: ${style.color}`,
        'Signature AURENZA finishing',
        'Designed in Accra, finished in Italy',
        'Specialist clean only'
      ],
      stock: 3 + (seed % 18),
      rating: Number(4.3 + (seed % 7) / 10).toFixed(1),
      editorial: styleIndex % 4 === 0 && editionIndex < 3,
      createdRank: 120 - productNumber
    };
  };

  const products = Object.entries(CATEGORY_CONFIG).flatMap(([category, config]) =>
    Array.from({ length: EDITIONS_PER_STYLE }, (_, editionIndex) =>
      config.styles.map((_, styleIndex) => makeProduct(category, styleIndex, editionIndex))
    ).flat()
  );

  const categoryCounts = Object.fromEntries(
    Object.keys(CATEGORY_CONFIG).map((category) => [
      category,
      products.filter((product) => product.category === category).length
    ])
  );

  const imageManifest = Object.entries(CATEGORY_CONFIG).flatMap(([category, config]) =>
    config.styles.map((style) => {
      const set = createImageSet(category, style.file);
      return {
        category,
        productName: style.name,
        searchQuery: style.search,
        front: set.front,
        hover: set.hover,
        back: set.back,
        detail: set.detail
      };
    })
  );

  window.AURENZA = Object.freeze({
    products,
    categories: CATEGORY_CONFIG,
    categoryCounts,
    colors: COLORS,
    fits: FITS,
    highlights: HIGHLIGHTS,
    image,
    imageManifest,

    findProduct(id) {
      return products.find((product) => product.id === id) || products[0];
    },

    formatPrice(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(value);
    },

    productsFor(category) {
      return products.filter((product) => product.category === category);
    }
  });
})();
