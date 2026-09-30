/* =========================================
   ZYNEXCART — PRODUCTS
   Professional Product + Quantity Controls
   With Main Category + Subcategory Support
========================================= */


/* =========================================
   PRODUCT DATA

   21 Main Categories
   105 Products
   Every product has:
   - categoryId
   - subcategoryId

   subcategoryId will be used by the
   professional Products Page navigation.
========================================= */

const products = [

  /* =========================================
     1. PAAN CORNER
  ========================================= */

  {
    id: 1,
    name: "Fresh Paan",
    category: "paan",
    categoryId: "paan",
    subcategoryId: "paan",
    unit: "1 pc",
    price: 25,
    mrp: 30,
    discount: 17,
    image: "assets/products/fresh-paan.jpg"
  },
  {
    id: 2,
    name: "Meetha Paan",
    category: "paan",
    categoryId: "paan",
    subcategoryId: "paan",
    unit: "1 pc",
    price: 30,
    mrp: 35,
    discount: 14,
    image: "assets/products/meetha-paan.jpg"
  },
  {
    id: 3,
    name: "Mint Mouth Freshener",
    category: "paan",
    categoryId: "paan",
    subcategoryId: "mouth-fresheners",
    unit: "50 g",
    price: 45,
    mrp: 50,
    discount: 10,
    image: "assets/products/mint-mouth-freshener.jpg"
  },
  {
    id: 4,
    name: "Elaichi Mouth Freshener",
    category: "paan",
    categoryId: "paan",
    subcategoryId: "mouth-fresheners",
    unit: "50 g",
    price: 55,
    mrp: 60,
    discount: 8,
    image: "assets/products/elaichi-mouth-freshener.jpg"
  },
  {
    id: 5,
    name: "Paan Masala",
    category: "paan",
    categoryId: "paan",
    subcategoryId: "paan-masala",
    unit: "100 g",
    price: 85,
    mrp: 95,
    discount: 11,
    image: "assets/products/paan-masala.jpg"
  },


  /* =========================================
     2. DAIRY, BREAD & EGGS
  ========================================= */

  {
    id: 6,
    name: "Fresh Milk",
    category: "grocery",
    categoryId: "dairy-bread-eggs",
    subcategoryId: "milk",
    unit: "1 L",
    price: 68,
    mrp: 75,
    discount: 9,
    image: "assets/products/milk.jpg"
  },
  {
    id: 7,
    name: "Brown Bread",
    category: "grocery",
    categoryId: "dairy-bread-eggs",
    subcategoryId: "bread",
    unit: "400 g",
    price: 45,
    mrp: 50,
    discount: 10,
    image: "assets/products/bread.jpg"
  },
  {
    id: 8,
    name: "Toned Milk",
    category: "grocery",
    categoryId: "dairy-bread-eggs",
    subcategoryId: "milk",
    unit: "1 L",
    price: 64,
    mrp: 70,
    discount: 9,
    image: "assets/products/toned-milk.jpg"
  },
  {
    id: 9,
    name: "Fresh Curd",
    category: "grocery",
    categoryId: "dairy-bread-eggs",
    subcategoryId: "dairy",
    unit: "400 g",
    price: 48,
    mrp: 55,
    discount: 13,
    image: "assets/products/curd.jpg"
  },
  {
    id: 10,
    name: "Farm Fresh Eggs",
    category: "grocery",
    categoryId: "dairy-bread-eggs",
    subcategoryId: "eggs",
    unit: "6 pcs",
    price: 48,
    mrp: 54,
    discount: 11,
    image: "assets/products/eggs.jpg"
  },


  /* =========================================
     3. FRUITS & VEGETABLES
  ========================================= */

  {
    id: 11,
    name: "Fresh Bananas",
    category: "fruits-vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-fruits",
    unit: "1 kg",
    price: 55,
    mrp: 65,
    discount: 15,
    image: "assets/products/bananas.jpg"
  },
  {
    id: 12,
    name: "Fresh Apples",
    category: "fruits-vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-fruits",
    unit: "1 kg",
    price: 140,
    mrp: 160,
    discount: 13,
    image: "assets/products/apples.jpg"
  },
  {
    id: 13,
    name: "Fresh Potatoes",
    category: "fruits-vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "vegetables",
    unit: "1 kg",
    price: 35,
    mrp: 42,
    discount: 17,
    image: "assets/products/potatoes.jpg"
  },
  {
    id: 14,
    name: "Fresh Tomatoes",
    category: "fruits-vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "vegetables",
    unit: "1 kg",
    price: 45,
    mrp: 55,
    discount: 18,
    image: "assets/products/tomatoes.jpg"
  },
  {
    id: 15,
    name: "Fresh Onions",
    category: "fruits-vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "vegetables",
    unit: "1 kg",
    price: 42,
    mrp: 50,
    discount: 16,
    image: "assets/products/onions.jpg"
  },


  /* =========================================
     4. COLD DRINKS & JUICES
  ========================================= */

  {
    id: 16,
    name: "Orange Juice",
    category: "beverages",
    categoryId: "cold-drinks-juices",
    subcategoryId: "fruit-juices",
    unit: "1 L",
    price: 110,
    mrp: 125,
    discount: 12,
    image: "assets/products/juice.jpg"
  },
  {
    id: 17,
    name: "Mango Juice",
    category: "beverages",
    categoryId: "cold-drinks-juices",
    subcategoryId: "fruit-juices",
    unit: "1 L",
    price: 105,
    mrp: 120,
    discount: 13,
    image: "assets/products/mango-juice.jpg"
  },
  {
    id: 18,
    name: "Lemon Soft Drink",
    category: "beverages",
    categoryId: "cold-drinks-juices",
    subcategoryId: "soft-drinks",
    unit: "750 ml",
    price: 45,
    mrp: 50,
    discount: 10,
    image: "assets/products/lemon-soft-drink.jpg"
  },
  {
    id: 19,
    name: "Cola Soft Drink",
    category: "beverages",
    categoryId: "cold-drinks-juices",
    subcategoryId: "soft-drinks",
    unit: "750 ml",
    price: 45,
    mrp: 50,
    discount: 10,
    image: "assets/products/cola-soft-drink.jpg"
  },
  {
    id: 20,
    name: "Mixed Fruit Juice",
    category: "beverages",
    categoryId: "cold-drinks-juices",
    subcategoryId: "fruit-juices",
    unit: "1 L",
    price: 115,
    mrp: 130,
    discount: 12,
    image: "assets/products/mixed-fruit-juice.jpg"
  },


  /* =========================================
     5. SNACKS & MUNCHIES
  ========================================= */

  {
    id: 21,
    name: "Potato Chips",
    category: "snacks",
    categoryId: "snacks-munchies",
    subcategoryId: "chips",
    unit: "100 g",
    price: 35,
    mrp: 40,
    discount: 13,
    image: "assets/products/chips.jpg"
  },
  {
    id: 22,
    name: "Salted Peanuts",
    category: "snacks",
    categoryId: "snacks-munchies",
    subcategoryId: "nuts",
    unit: "200 g",
    price: 55,
    mrp: 65,
    discount: 15,
    image: "assets/products/salted-peanuts.jpg"
  },
  {
    id: 23,
    name: "Bhujia",
    category: "snacks",
    categoryId: "snacks-munchies",
    subcategoryId: "namkeen",
    unit: "200 g",
    price: 65,
    mrp: 75,
    discount: 13,
    image: "assets/products/bhujia.jpg"
  },
  {
    id: 24,
    name: "Aloo Bhujia",
    category: "snacks",
    categoryId: "snacks-munchies",
    subcategoryId: "namkeen",
    unit: "200 g",
    price: 60,
    mrp: 70,
    discount: 14,
    image: "assets/products/aloo-bhujia.jpg"
  },
  {
    id: 25,
    name: "Namkeen Mix",
    category: "snacks",
    categoryId: "snacks-munchies",
    subcategoryId: "namkeen",
    unit: "200 g",
    price: 70,
    mrp: 80,
    discount: 13,
    image: "assets/products/namkeen-mix.jpg"
  },


  /* =========================================
     6. BREAKFAST & INSTANT FOOD
  ========================================= */

  {
    id: 26,
    name: "Instant Noodles",
    category: "breakfast-instant-food",
    categoryId: "breakfast-instant-food",
    subcategoryId: "instant-food",
    unit: "70 g",
    price: 15,
    mrp: 18,
    discount: 17,
    image: "assets/products/instant-noodles.jpg"
  },
  {
    id: 27,
    name: "Oats",
    category: "breakfast-instant-food",
    categoryId: "breakfast-instant-food",
    subcategoryId: "healthy-breakfast",
    unit: "500 g",
    price: 95,
    mrp: 110,
    discount: 14,
    image: "assets/products/oats.jpg"
  },
  {
    id: 28,
    name: "Poha",
    category: "breakfast-instant-food",
    categoryId: "breakfast-instant-food",
    subcategoryId: "breakfast-staples",
    unit: "500 g",
    price: 55,
    mrp: 65,
    discount: 15,
    image: "assets/products/poha.jpg"
  },
  {
    id: 29,
    name: "Upma Mix",
    category: "breakfast-instant-food",
    categoryId: "breakfast-instant-food",
    subcategoryId: "instant-food",
    unit: "500 g",
    price: 65,
    mrp: 75,
    discount: 13,
    image: "assets/products/upma-mix.jpg"
  },
  {
    id: 30,
    name: "Corn Flakes",
    category: "breakfast-instant-food",
    categoryId: "breakfast-instant-food",
    subcategoryId: "breakfast-cereals",
    unit: "500 g",
    price: 165,
    mrp: 190,
    discount: 13,
    image: "assets/products/corn-flakes.jpg"
  },


  /* =========================================
     7. SWEET TOOTH
  ========================================= */

  {
    id: 31,
    name: "Milk Chocolate",
    category: "sweet-tooth",
    categoryId: "sweet-tooth",
    subcategoryId: "chocolates",
    unit: "40 g",
    price: 40,
    mrp: 45,
    discount: 11,
    image: "assets/products/milk-chocolate.jpg"
  },
  {
    id: 32,
    name: "Chocolate Bar",
    category: "sweet-tooth",
    categoryId: "sweet-tooth",
    subcategoryId: "chocolates",
    unit: "50 g",
    price: 50,
    mrp: 55,
    discount: 9,
    image: "assets/products/chocolate-bar.jpg"
  },
  {
    id: 33,
    name: "Gulab Jamun",
    category: "sweet-tooth",
    categoryId: "sweet-tooth",
    subcategoryId: "indian-sweets",
    unit: "500 g",
    price: 180,
    mrp: 210,
    discount: 14,
    image: "assets/products/gulab-jamun.jpg"
  },
  {
    id: 34,
    name: "Rasgulla",
    category: "sweet-tooth",
    categoryId: "sweet-tooth",
    subcategoryId: "indian-sweets",
    unit: "500 g",
    price: 170,
    mrp: 200,
    discount: 15,
    image: "assets/products/rasgulla.jpg"
  },
  {
    id: 35,
    name: "Cookies",
    category: "sweet-tooth",
    categoryId: "sweet-tooth",
    subcategoryId: "cookies",
    unit: "200 g",
    price: 65,
    mrp: 75,
    discount: 13,
    image: "assets/products/cookies.jpg"
  },


  /* =========================================
     8. BAKERY & BISCUITS
  ========================================= */

  {
    id: 36,
    name: "Glucose Biscuits",
    category: "bakery-biscuits",
    categoryId: "bakery-biscuits",
    subcategoryId: "biscuits",
    unit: "250 g",
    price: 30,
    mrp: 35,
    discount: 14,
    image: "assets/products/glucose-biscuits.jpg"
  },
  {
    id: 37,
    name: "Cream Biscuits",
    category: "bakery-biscuits",
    categoryId: "bakery-biscuits",
    subcategoryId: "biscuits",
    unit: "150 g",
    price: 35,
    mrp: 40,
    discount: 13,
    image: "assets/products/cream-biscuits.jpg"
  },
  {
    id: 38,
    name: "Rusk",
    category: "bakery-biscuits",
    categoryId: "bakery-biscuits",
    subcategoryId: "rusk",
    unit: "300 g",
    price: 65,
    mrp: 75,
    discount: 13,
    image: "assets/products/rusk.jpg"
  },
  {
    id: 39,
    name: "Fruit Cake",
    category: "bakery-biscuits",
    categoryId: "bakery-biscuits",
    subcategoryId: "cakes",
    unit: "250 g",
    price: 95,
    mrp: 110,
    discount: 14,
    image: "assets/products/fruit-cake.jpg"
  },
  {
    id: 40,
    name: "Chocolate Cake",
    category: "bakery-biscuits",
    categoryId: "bakery-biscuits",
    subcategoryId: "cakes",
    unit: "250 g",
    price: 120,
    mrp: 140,
    discount: 14,
    image: "assets/products/chocolate-cake.jpg"
  },


  /* =========================================
     9. TEA, COFFEE & MILK DRINKS
  ========================================= */

  {
    id: 41,
    name: "Tea",
    category: "tea-coffee-milk",
    categoryId: "tea-coffee-milk",
    subcategoryId: "tea",
    unit: "250 g",
    price: 120,
    mrp: 140,
    discount: 14,
    image: "assets/products/tea.jpg"
  },
  {
    id: 42,
    name: "Instant Coffee",
    category: "tea-coffee-milk",
    categoryId: "tea-coffee-milk",
    subcategoryId: "coffee",
    unit: "100 g",
    price: 180,
    mrp: 210,
    discount: 14,
    image: "assets/products/instant-coffee.jpg"
  },
  {
    id: 43,
    name: "Hot Chocolate",
    category: "tea-coffee-milk",
    categoryId: "tea-coffee-milk",
    subcategoryId: "milk-drinks",
    unit: "200 g",
    price: 160,
    mrp: 185,
    discount: 14,
    image: "assets/products/hot-chocolate.jpg"
  },
  {
    id: 44,
    name: "Malt Milk Drink",
    category: "tea-coffee-milk",
    categoryId: "tea-coffee-milk",
    subcategoryId: "milk-drinks",
    unit: "500 g",
    price: 240,
    mrp: 275,
    discount: 13,
    image: "assets/products/malt-milk-drink.jpg"
  },
  {
    id: 45,
    name: "Green Tea",
    category: "tea-coffee-milk",
    categoryId: "tea-coffee-milk",
    subcategoryId: "tea",
    unit: "25 tea bags",
    price: 135,
    mrp: 155,
    discount: 13,
    image: "assets/products/green-tea.jpg"
  },


  /* =========================================
     10. ATTA, RICE & DAL
  ========================================= */

  {
    id: 46,
    name: "Wheat Atta",
    category: "atta-rice-dal",
    categoryId: "atta-rice-dal",
    subcategoryId: "atta",
    unit: "5 kg",
    price: 260,
    mrp: 290,
    discount: 10,
    image: "assets/products/wheat-atta.jpg"
  },
  {
    id: 47,
    name: "Basmati Rice",
    category: "atta-rice-dal",
    categoryId: "atta-rice-dal",
    subcategoryId: "rice",
    unit: "5 kg",
    price: 420,
    mrp: 480,
    discount: 13,
    image: "assets/products/basmati-rice.jpg"
  },
  {
    id: 48,
    name: "Toor Dal",
    category: "atta-rice-dal",
    categoryId: "atta-rice-dal",
    subcategoryId: "dal",
    unit: "1 kg",
    price: 150,
    mrp: 175,
    discount: 14,
    image: "assets/products/toor-dal.jpg"
  },
  {
    id: 49,
    name: "Moong Dal",
    category: "atta-rice-dal",
    categoryId: "atta-rice-dal",
    subcategoryId: "dal",
    unit: "1 kg",
    price: 125,
    mrp: 145,
    discount: 14,
    image: "assets/products/moong-dal.jpg"
  },
  {
    id: 50,
    name: "Chana Dal",
    category: "atta-rice-dal",
    categoryId: "atta-rice-dal",
    subcategoryId: "dal",
    unit: "1 kg",
    price: 90,
    mrp: 105,
    discount: 14,
    image: "assets/products/chana-dal.jpg"
  },


  /* =========================================
     11. MASALA, OIL & MORE
  ========================================= */

  {
    id: 51,
    name: "Turmeric Powder",
    category: "masala-oil",
    categoryId: "masala-oil",
    subcategoryId: "spices",
    unit: "100 g",
    price: 35,
    mrp: 40,
    discount: 13,
    image: "assets/products/turmeric-powder.jpg"
  },
  {
    id: 52,
    name: "Red Chilli Powder",
    category: "masala-oil",
    categoryId: "masala-oil",
    subcategoryId: "spices",
    unit: "100 g",
    price: 40,
    mrp: 45,
    discount: 11,
    image: "assets/products/red-chilli-powder.jpg"
  },
  {
    id: 53,
    name: "Garam Masala",
    category: "masala-oil",
    categoryId: "masala-oil",
    subcategoryId: "spices",
    unit: "100 g",
    price: 55,
    mrp: 65,
    discount: 15,
    image: "assets/products/garam-masala.jpg"
  },
  {
    id: 54,
    name: "Cooking Oil",
    category: "masala-oil",
    categoryId: "masala-oil",
    subcategoryId: "cooking-oil",
    unit: "1 L",
    price: 145,
    mrp: 165,
    discount: 12,
    image: "assets/products/cooking-oil.jpg"
  },
  {
    id: 55,
    name: "Mustard Oil",
    category: "masala-oil",
    categoryId: "masala-oil",
    subcategoryId: "cooking-oil",
    unit: "1 L",
    price: 155,
    mrp: 175,
    discount: 11,
    image: "assets/products/mustard-oil.jpg"
  },


  /* =========================================
     12. SAUCES & SPREADS
  ========================================= */

  {
    id: 56,
    name: "Tomato Ketchup",
    category: "sauces-spreads",
    categoryId: "sauces-spreads",
    subcategoryId: "sauces",
    unit: "500 g",
    price: 95,
    mrp: 110,
    discount: 14,
    image: "assets/products/tomato-ketchup.jpg"
  },
  {
    id: 57,
    name: "Green Chilli Sauce",
    category: "sauces-spreads",
    categoryId: "sauces-spreads",
    subcategoryId: "sauces",
    unit: "200 g",
    price: 60,
    mrp: 70,
    discount: 14,
    image: "assets/products/green-chilli-sauce.jpg"
  },
  {
    id: 58,
    name: "Red Chilli Sauce",
    category: "sauces-spreads",
    categoryId: "sauces-spreads",
    subcategoryId: "sauces",
    unit: "200 g",
    price: 60,
    mrp: 70,
    discount: 14,
    image: "assets/products/red-chilli-sauce.jpg"
  },
  {
    id: 59,
    name: "Mayonnaise",
    category: "sauces-spreads",
    categoryId: "sauces-spreads",
    subcategoryId: "mayonnaise",
    unit: "250 g",
    price: 95,
    mrp: 110,
    discount: 14,
    image: "assets/products/mayonnaise.jpg"
  },
  {
    id: 60,
    name: "Chocolate Spread",
    category: "sauces-spreads",
    categoryId: "sauces-spreads",
    subcategoryId: "spreads",
    unit: "350 g",
    price: 220,
    mrp: 250,
    discount: 12,
    image: "assets/products/chocolate-spread.jpg"
  },


  /* =========================================
     13. CHICKEN, MEAT & FISH
  ========================================= */

  {
    id: 61,
    name: "Fresh Chicken Curry Cut",
    category: "chicken-meat-fish",
    categoryId: "chicken-meat-fish",
    subcategoryId: "chicken",
    unit: "500 g",
    price: 180,
    mrp: 210,
    discount: 14,
    image: "assets/products/chicken-curry-cut.jpg"
  },
  {
    id: 62,
    name: "Chicken Breast",
    category: "chicken-meat-fish",
    categoryId: "chicken-meat-fish",
    subcategoryId: "chicken",
    unit: "500 g",
    price: 220,
    mrp: 250,
    discount: 12,
    image: "assets/products/chicken-breast.jpg"
  },
  {
    id: 63,
    name: "Chicken Wings",
    category: "chicken-meat-fish",
    categoryId: "chicken-meat-fish",
    subcategoryId: "chicken",
    unit: "500 g",
    price: 190,
    mrp: 220,
    discount: 14,
    image: "assets/products/chicken-wings.jpg"
  },
  {
    id: 64,
    name: "Fresh Fish",
    category: "chicken-meat-fish",
    categoryId: "chicken-meat-fish",
    subcategoryId: "fish",
    unit: "500 g",
    price: 240,
    mrp: 275,
    discount: 13,
    image: "assets/products/fresh-fish.jpg"
  },
  {
    id: 65,
    name: "Fish Fillet",
    category: "chicken-meat-fish",
    categoryId: "chicken-meat-fish",
    subcategoryId: "fish",
    unit: "500 g",
    price: 280,
    mrp: 320,
    discount: 13,
    image: "assets/products/fish-fillet.jpg"
  },


  /* =========================================
     14. ORGANIC & HEALTHY LIVING
  ========================================= */

  {
    id: 66,
    name: "Organic Honey",
    category: "organic-healthy",
    categoryId: "organic-healthy",
    subcategoryId: "organic-foods",
    unit: "250 g",
    price: 180,
    mrp: 210,
    discount: 14,
    image: "assets/products/organic-honey.jpg"
  },
  {
    id: 67,
    name: "Organic Jaggery",
    category: "organic-healthy",
    categoryId: "organic-healthy",
    subcategoryId: "organic-foods",
    unit: "500 g",
    price: 95,
    mrp: 110,
    discount: 14,
    image: "assets/products/organic-jaggery.jpg"
  },
  {
    id: 68,
    name: "Chia Seeds",
    category: "organic-healthy",
    categoryId: "organic-healthy",
    subcategoryId: "seeds-nuts",
    unit: "200 g",
    price: 140,
    mrp: 165,
    discount: 15,
    image: "assets/products/chia-seeds.jpg"
  },
  {
    id: 69,
    name: "Almonds",
    category: "organic-healthy",
    categoryId: "organic-healthy",
    subcategoryId: "seeds-nuts",
    unit: "250 g",
    price: 260,
    mrp: 300,
    discount: 13,
    image: "assets/products/almonds.jpg"
  },
  {
    id: 70,
    name: "Green Tea Healthy Blend",
    category: "organic-healthy",
    categoryId: "organic-healthy",
    subcategoryId: "healthy-drinks",
    unit: "25 tea bags",
    price: 150,
    mrp: 175,
    discount: 14,
    image: "assets/products/healthy-green-tea.jpg"
  },


  /* =========================================
     15. BABY CARE
  ========================================= */

  {
    id: 71,
    name: "Baby Diapers",
    category: "baby-care",
    categoryId: "baby-care",
    subcategoryId: "diapers-wipes",
    unit: "Small Pack",
    price: 299,
    mrp: 340,
    discount: 12,
    image: "assets/products/baby-diapers.jpg"
  },
  {
    id: 72,
    name: "Baby Wipes",
    category: "baby-care",
    categoryId: "baby-care",
    subcategoryId: "diapers-wipes",
    unit: "72 pcs",
    price: 110,
    mrp: 130,
    discount: 15,
    image: "assets/products/baby-wipes.jpg"
  },
  {
    id: 73,
    name: "Baby Shampoo",
    category: "baby-care",
    categoryId: "baby-care",
    subcategoryId: "baby-bath",
    unit: "200 ml",
    price: 145,
    mrp: 165,
    discount: 12,
    image: "assets/products/baby-shampoo.jpg"
  },
  {
    id: 74,
    name: "Baby Soap",
    category: "baby-care",
    categoryId: "baby-care",
    subcategoryId: "baby-bath",
    unit: "75 g",
    price: 55,
    mrp: 65,
    discount: 15,
    image: "assets/products/baby-soap.jpg"
  },
  {
    id: 75,
    name: "Baby Lotion",
    category: "baby-care",
    categoryId: "baby-care",
    subcategoryId: "baby-skin-care",
    unit: "200 ml",
    price: 150,
    mrp: 175,
    discount: 14,
    image: "assets/products/baby-lotion.jpg"
  },


  /* =========================================
     16. PHARMA & WELLNESS
  ========================================= */

  {
    id: 76,
    name: "Digital Thermometer",
    category: "pharma-wellness",
    categoryId: "pharma-wellness",
    subcategoryId: "health-devices",
    unit: "1 pc",
    price: 150,
    mrp: 180,
    discount: 17,
    image: "assets/products/digital-thermometer.jpg"
  },
  {
    id: 77,
    name: "First Aid Kit",
    category: "pharma-wellness",
    categoryId: "pharma-wellness",
    subcategoryId: "first-aid",
    unit: "1 kit",
    price: 199,
    mrp: 230,
    discount: 13,
    image: "assets/products/first-aid-kit.jpg"
  },
  {
    id: 78,
    name: "Adhesive Bandages",
    category: "pharma-wellness",
    categoryId: "pharma-wellness",
    subcategoryId: "first-aid",
    unit: "20 pcs",
    price: 45,
    mrp: 55,
    discount: 18,
    image: "assets/products/adhesive-bandages.jpg"
  },
  {
    id: 79,
    name: "Hand Sanitizer",
    category: "pharma-wellness",
    categoryId: "pharma-wellness",
    subcategoryId: "hygiene-care",
    unit: "100 ml",
    price: 55,
    mrp: 65,
    discount: 15,
    image: "assets/products/hand-sanitizer.jpg"
  },
  {
    id: 80,
    name: "Cotton Roll",
    category: "pharma-wellness",
    categoryId: "pharma-wellness",
    subcategoryId: "first-aid",
    unit: "100 g",
    price: 45,
    mrp: 55,
    discount: 18,
    image: "assets/products/cotton-roll.jpg"
  },


  /* =========================================
     17. CLEANING ESSENTIALS
  ========================================= */

  {
    id: 81,
    name: "Dishwash Liquid",
    category: "household",
    categoryId: "cleaning-essentials",
    subcategoryId: "dishwashing",
    unit: "500 ml",
    price: 99,
    mrp: 115,
    discount: 14,
    image: "assets/products/dishwash.jpg"
  },
  {
    id: 82,
    name: "Laundry Detergent",
    category: "household",
    categoryId: "cleaning-essentials",
    subcategoryId: "laundry",
    unit: "1 kg",
    price: 110,
    mrp: 130,
    discount: 15,
    image: "assets/products/laundry-detergent.jpg"
  },
  {
    id: 83,
    name: "Floor Cleaner",
    category: "household",
    categoryId: "cleaning-essentials",
    subcategoryId: "floor-toilet-care",
    unit: "1 L",
    price: 120,
    mrp: 140,
    discount: 14,
    image: "assets/products/floor-cleaner.jpg"
  },
  {
    id: 84,
    name: "Toilet Cleaner",
    category: "household",
    categoryId: "cleaning-essentials",
    subcategoryId: "floor-toilet-care",
    unit: "500 ml",
    price: 95,
    mrp: 110,
    discount: 14,
    image: "assets/products/toilet-cleaner.jpg"
  },
  {
    id: 85,
    name: "Cleaning Sponge",
    category: "household",
    categoryId: "cleaning-essentials",
    subcategoryId: "cleaning-tools",
    unit: "3 pcs",
    price: 40,
    mrp: 50,
    discount: 20,
    image: "assets/products/cleaning-sponge.jpg"
  },


  /* =========================================
     18. HOME & OFFICE
  ========================================= */

  {
    id: 86,
    name: "Notebook",
    category: "home-office",
    categoryId: "home-office",
    subcategoryId: "stationery",
    unit: "1 pc",
    price: 45,
    mrp: 55,
    discount: 18,
    image: "assets/products/notebook.jpg"
  },
  {
    id: 87,
    name: "Ball Pen Pack",
    category: "home-office",
    categoryId: "home-office",
    subcategoryId: "stationery",
    unit: "5 pcs",
    price: 35,
    mrp: 45,
    discount: 22,
    image: "assets/products/ball-pens.jpg"
  },
  {
    id: 88,
    name: "Sticky Notes",
    category: "home-office",
    categoryId: "home-office",
    subcategoryId: "stationery",
    unit: "1 pack",
    price: 55,
    mrp: 65,
    discount: 15,
    image: "assets/products/sticky-notes.jpg"
  },
  {
    id: 89,
    name: "Kitchen Storage Box",
    category: "home-office",
    categoryId: "home-office",
    subcategoryId: "storage",
    unit: "1 pc",
    price: 120,
    mrp: 145,
    discount: 17,
    image: "assets/products/kitchen-storage-box.jpg"
  },
  {
    id: 90,
    name: "LED Bulb",
    category: "home-office",
    categoryId: "home-office",
    subcategoryId: "lighting",
    unit: "1 pc",
    price: 110,
    mrp: 130,
    discount: 15,
    image: "assets/products/led-bulb.jpg"
  },


  /* =========================================
     19. PERSONAL CARE
  ========================================= */

  {
    id: 91,
    name: "Bath Soap",
    category: "personal-care",
    categoryId: "personal-care",
    subcategoryId: "bath-body",
    unit: "100 g",
    price: 42,
    mrp: 50,
    discount: 16,
    image: "assets/products/soap.jpg"
  },
  {
    id: 92,
    name: "Shampoo",
    category: "personal-care",
    categoryId: "personal-care",
    subcategoryId: "hair-care",
    unit: "180 ml",
    price: 149,
    mrp: 175,
    discount: 15,
    image: "assets/products/shampoo.jpg"
  },
  {
    id: 93,
    name: "Face Wash",
    category: "personal-care",
    categoryId: "personal-care",
    subcategoryId: "face-care",
    unit: "100 ml",
    price: 129,
    mrp: 150,
    discount: 14,
    image: "assets/products/face-wash.jpg"
  },
  {
    id: 94,
    name: "Toothpaste",
    category: "personal-care",
    categoryId: "personal-care",
    subcategoryId: "oral-care",
    unit: "150 g",
    price: 95,
    mrp: 110,
    discount: 14,
    image: "assets/products/toothpaste.jpg"
  },
  {
    id: 95,
    name: "Toothbrush",
    category: "personal-care",
    categoryId: "personal-care",
    subcategoryId: "oral-care",
    unit: "1 pc",
    price: 45,
    mrp: 55,
    discount: 18,
    image: "assets/products/toothbrush.jpg"
  },


  /* =========================================
     20. PET CARE
  ========================================= */

  {
    id: 96,
    name: "Dog Food",
    category: "pet-care",
    categoryId: "pet-care",
    subcategoryId: "dog-food",
    unit: "1 kg",
    price: 260,
    mrp: 300,
    discount: 13,
    image: "assets/products/dog-food.jpg"
  },
  {
    id: 97,
    name: "Cat Food",
    category: "pet-care",
    categoryId: "pet-care",
    subcategoryId: "cat-food",
    unit: "1 kg",
    price: 280,
    mrp: 320,
    discount: 13,
    image: "assets/products/cat-food.jpg"
  },
  {
    id: 98,
    name: "Pet Treats",
    category: "pet-care",
    categoryId: "pet-care",
    subcategoryId: "pet-treats",
    unit: "100 g",
    price: 90,
    mrp: 110,
    discount: 18,
    image: "assets/products/pet-treats.jpg"
  },
  {
    id: 99,
    name: "Pet Shampoo",
    category: "pet-care",
    categoryId: "pet-care",
    subcategoryId: "pet-care",
    unit: "200 ml",
    price: 150,
    mrp: 180,
    discount: 17,
    image: "assets/products/pet-shampoo.jpg"
  },
  {
    id: 100,
    name: "Pet Bowl",
    category: "pet-care",
    categoryId: "pet-care",
    subcategoryId: "pet-care",
    unit: "1 pc",
    price: 120,
    mrp: 150,
    discount: 20,
    image: "assets/products/pet-bowl.jpg"
  },


  /* =========================================
     21. OFFERS & DEALS
  ========================================= */

  {
    id: 101,
    name: "Daily Essentials Combo",
    category: "offers",
    categoryId: "offers",
    subcategoryId: "essential-combos",
    unit: "1 combo",
    price: 299,
    mrp: 350,
    discount: 15,
    image: "assets/products/daily-essentials-combo.jpg"
  },
  {
    id: 102,
    name: "Breakfast Combo",
    category: "offers",
    categoryId: "offers",
    subcategoryId: "food-combos",
    unit: "1 combo",
    price: 249,
    mrp: 300,
    discount: 17,
    image: "assets/products/breakfast-combo.jpg"
  },
  {
    id: 103,
    name: "Snacks Combo",
    category: "offers",
    categoryId: "offers",
    subcategoryId: "food-combos",
    unit: "1 combo",
    price: 199,
    mrp: 240,
    discount: 17,
    image: "assets/products/snacks-combo.jpg"
  },
  {
    id: 104,
    name: "Personal Care Combo",
    category: "offers",
    categoryId: "offers",
    subcategoryId: "personal-care-combos",
    unit: "1 combo",
    price: 349,
    mrp: 410,
    discount: 15,
    image: "assets/products/personal-care-combo.jpg"
  },
  {
    id: 105,
    name: "Home Cleaning Combo",
    category: "offers",
    categoryId: "offers",
    subcategoryId: "home-cleaning-combos",
    unit: "1 combo",
    price: 299,
    mrp: 350,
    discount: 15,
    image: "assets/products/home-cleaning-combo.jpg"
  }

];


/* =========================================
   FORMAT CATEGORY
========================================= */

function formatCategory(category) {

  return String(category || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, letter =>
      letter.toUpperCase()
    );

}


/* =========================================
   GET PRODUCT
========================================= */

function getProductById(productId) {

  return products.find(
    product =>
      Number(product.id) === Number(productId)
  );

}


/* =========================================
   GET PRODUCTS BY CATEGORY
========================================= */

function getProductsByCategory(categoryId) {

  if (!categoryId) {
    return [];
  }

  return products.filter(
    product =>
      String(product.categoryId) ===
      String(categoryId)
  );

}


/* =========================================
   GET PRODUCTS BY SUBCATEGORY
========================================= */

function getProductsBySubcategory(
  categoryId,
  subcategoryId
) {

  if (!categoryId || !subcategoryId) {
    return [];
  }

  return products.filter(
    product =>
      String(product.categoryId) ===
        String(categoryId) &&
      String(product.subcategoryId) ===
        String(subcategoryId)
  );

}


/* =========================================
   GET PRODUCT QUANTITY
========================================= */

function getProductQuantity(productId) {

  if (typeof getCart !== "function") {
    return 0;
  }

  const cart = getCart();

  if (!Array.isArray(cart)) {
    return 0;
  }

  const item = cart.find(
    item =>
      Number(item.id) === Number(productId)
  );

  return item
    ? Number(item.quantity || 0)
    : 0;

}


/* =========================================
   CREATE PRODUCT BUTTON
========================================= */

function createProductButton(product) {

  const quantity =
    getProductQuantity(product.id);


  if (quantity <= 0) {

    return `
      <button
        type="button"
        class="add-btn"
        data-product-id="${product.id}"
      >
        ADD
      </button>
    `;

  }


  return `
    <div
      class="add-btn added"
      data-product-id="${product.id}"
    >

      <button
        type="button"
        class="qty-minus"
        data-action="minus"
        aria-label="Decrease ${product.name} quantity"
      >
        −
      </button>

      <span
        class="qty-number"
        aria-live="polite"
      >
        ${quantity}
      </span>

      <button
        type="button"
        class="qty-plus"
        data-action="plus"
        aria-label="Increase ${product.name} quantity"
      >
        +
      </button>

    </div>
  `;

}


/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createProductCard(product) {

  return `
    <article class="product-card">

      <a
        href="product.html?id=${product.id}"
        class="product-image"
        aria-label="View ${product.name}"
      >

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        >

      </a>


      <div class="product-info">

        <div class="product-category">
          ${formatCategory(product.category)}
        </div>

        <h3 class="product-name">
          ${product.name}
        </h3>

        <p class="product-unit">
          ${product.unit}
        </p>


        <div class="product-price-row">

          <span class="product-price">
            ${formatPrice(product.price)}
          </span>

          <span class="product-mrp">
            ${formatPrice(product.mrp)}
          </span>

          <span class="product-discount">
            ${product.discount}% OFF
          </span>

        </div>


        ${createProductButton(product)}

      </div>

    </article>
  `;

}


/* =========================================
   DISPLAY FEATURED PRODUCTS
========================================= */

function displayFeaturedProducts() {

  const container =
    document.querySelector(
      "#featuredProducts"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    products
      .slice(0, 8)
      .map(createProductCard)
      .join("");

  setupProductControls();

}


/* =========================================
   GET PRODUCTS PAGE FILTER
========================================= */

function getProductsPageFilter() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return {
    category:
      (
        params.get("category") ||
        ""
      ).trim(),

    subcategory:
      (
        params.get("subcategory") ||
        ""
      ).trim(),

    search:
      (
        params.get("search") ||
        ""
      ).trim()
      .toLowerCase()
  };

}


/* =========================================
   GET FILTERED PRODUCTS
========================================= */

function getFilteredProducts() {

  const {
    category,
    subcategory,
    search
  } = getProductsPageFilter();


  let filtered =
    products.slice();


  /* -----------------------------------------
     MAIN CATEGORY
  ----------------------------------------- */

  if (category) {

    filtered =
      filtered.filter(
        product =>
          String(
            product.categoryId || ""
          ) ===
          String(category)
      );

  }


  /* -----------------------------------------
     SUBCATEGORY
  ----------------------------------------- */

  if (subcategory) {

    filtered =
      filtered.filter(
        product =>
          String(
            product.subcategoryId || ""
          ) ===
          String(subcategory)
      );

  }


  /* -----------------------------------------
     SEARCH
  ----------------------------------------- */

  if (search) {

    filtered =
      filtered.filter(
        product => {

          const name =
            String(
              product.name || ""
            ).toLowerCase();

          const categoryName =
            String(
              product.category || ""
            ).toLowerCase();

          const unit =
            String(
              product.unit || ""
            ).toLowerCase();


          return (
            name.includes(search) ||
            categoryName.includes(search) ||
            unit.includes(search)
          );

        }
      );

  }


  return filtered;

}


/* =========================================
   DISPLAY PRODUCTS PAGE
========================================= */

function displayProductsPage() {

  const container =
    document.getElementById(
      "productsGrid"
    );


  if (!container) {
    return false;
  }


  const filteredProducts =
    getFilteredProducts();


  container.innerHTML =
    filteredProducts
      .map(createProductCard)
      .join("");


  updateProductsPageEmptyState(
    filteredProducts
  );


  setupProductControls();


  updateProductsPageCount(
    filteredProducts.length
  );


  return true;

}


/* =========================================
   PRODUCTS PAGE EMPTY STATE
========================================= */

function updateProductsPageEmptyState(
  filteredProducts
) {

  const emptyState =
    document.getElementById(
      "noProducts"
    );


  const message =
    document.getElementById(
      "noProductsMessage"
    );


  if (!emptyState) {
    return;
  }


  if (
    filteredProducts.length === 0
  ) {

    emptyState.style.display =
      "flex";


    if (message) {

      const {
        search,
        subcategory
      } =
        getProductsPageFilter();


      if (search) {

        message.textContent =
          `No products found for "${search}".`;

      } else if (subcategory) {

        message.textContent =
          "No products are currently available in this subcategory.";

      } else {

        message.textContent =
          "No products are currently available in this category.";

      }

    }

    return;

  }


  emptyState.style.display =
    "none";

}


/* =========================================
   PRODUCTS PAGE COUNT
========================================= */

function updateProductsPageCount(
  count
) {

  const text =
    `${count} ${
      count === 1
        ? "product"
        : "products"
    }`;


  const topCount =
    document.getElementById(
      "productsCount"
    );


  const toolbarCount =
    document.getElementById(
      "productsToolbarCount"
    );


  if (topCount) {

    topCount.textContent =
      text;

  }


  if (toolbarCount) {

    toolbarCount.textContent =
      text;

  }

}


/* =========================================
   CREATE QUANTITY CONTROL
========================================= */

function createQuantityControl(
  product,
  quantity
) {

  const quantityControl =
    document.createElement(
      "div"
    );


  quantityControl.className =
    "add-btn added";


  quantityControl.dataset.productId =
    product.id;


  quantityControl.innerHTML = `

    <button
      type="button"
      class="qty-minus"
      data-action="minus"
      aria-label="Decrease ${product.name} quantity"
    >
      −
    </button>

    <span
      class="qty-number"
      aria-live="polite"
    >
      ${quantity}
    </span>

    <button
      type="button"
      class="qty-plus"
      data-action="plus"
      aria-label="Increase ${product.name} quantity"
    >
      +
    </button>

  `;


  return quantityControl;

}


/* =========================================
   REFRESH PRODUCT BUTTON
========================================= */

function refreshProductButton(
  productId
) {

  const product =
    getProductById(
      productId
    );


  if (!product) {
    return;
  }


  const quantity =
    getProductQuantity(
      productId
    );


  const controls =
    document.querySelectorAll(
      `.add-btn[data-product-id="${productId}"]`
    );


  controls.forEach(
    control => {

      if (quantity <= 0) {

        if (
          control.tagName === "BUTTON" &&
          !control.classList.contains("added")
        ) {
          return;
        }


        const addButton =
          document.createElement(
            "button"
          );


        addButton.type =
          "button";


        addButton.className =
          "add-btn";


        addButton.dataset.productId =
          productId;


        addButton.textContent =
          "ADD";


        control.replaceWith(
          addButton
        );


        setupSingleProductControl(
          addButton
        );


        return;

      }


      if (
        control.classList.contains(
          "added"
        )
      ) {

        const number =
          control.querySelector(
            ".qty-number"
          );


        if (number) {

          number.textContent =
            quantity;

        }


        return;

      }


      const quantityControl =
        createQuantityControl(
          product,
          quantity
        );


      control.replaceWith(
        quantityControl
      );


      setupSingleProductControl(
        quantityControl
      );

    }
  );

}


/* =========================================
   SETUP SINGLE PRODUCT CONTROL
========================================= */

function setupSingleProductControl(control) {

  if (!control) {
    return;
  }

  control.dataset.bound = "true";

}


  control.dataset.bound =
    "true";


  /* -----------------------------------------
     ADD BUTTON
  ----------------------------------------- */

  if (
    control.tagName === "BUTTON" &&
    !control.classList.contains("added")
  ) {

    control.addEventListener(
      "click",
      function () {

        const productId =
          Number(
            control.dataset.productId
          );


        const product =
          getProductById(
            productId
          );


        if (!product) {
          return;
        }


        addToCart(
          product
        );


        refreshProductButton(
          productId
        );


        updateCartCount();

      }
    );


    return;

  }


  /* -----------------------------------------
     QUANTITY CONTROL
  ----------------------------------------- */

  if (
    !control.classList.contains(
      "added"
    )
  ) {
    return;
  }


  control.addEventListener(
    "click",
    function (event) {

      const actionButton =
        event.target.closest(
          "button.qty-minus, button.qty-plus"
        );


      if (!actionButton) {
        return;
      }


      const productId =
        Number(
          control.dataset.productId
        );


      const product =
        getProductById(
          productId
        );


      if (!product) {
        return;
      }


      /* PLUS */

      if (
        actionButton.classList.contains(
          "qty-plus"
        )
      ) {

        addToCart(
          product
        );


        refreshProductButton(
          productId
        );


        updateCartCount();


        return;

      }


      /* MINUS */

      if (
        actionButton.classList.contains(
          "qty-minus"
        )
      ) {

        changeCartQuantity(
          productId,
          -1
        );


        refreshProductButton(
          productId
        );


        updateCartCount();

      }

    }
  );

}


/* =========================================
   SETUP ALL PRODUCT CONTROLS
========================================= */

function setupProductControls() {

  if (
    document.body.dataset.zynexcartProductControlsReady === "true"
  ) {
    return;
  }

  document.body.dataset.zynexcartProductControlsReady = "true";

  document.body.addEventListener(
    "click",
    function (event) {

      const actionButton =
        event.target.closest(
          ".qty-minus, .qty-plus"
        );

      const addButton =
        event.target.closest(
          ".add-btn[data-product-id]"
        );

      if (!addButton) {
        return;
      }

      const productId =
        Number(
          addButton.dataset.productId
        );

      if (!productId) {
        return;
      }

      const product =
        getProductById(productId);

      if (!product) {
        return;
      }


      /* ==============================
         PLUS
      ============================== */

      if (
        actionButton &&
        actionButton.classList.contains("qty-plus")
      ) {

        event.preventDefault();
        event.stopPropagation();

        addToCart(product);

        refreshProductButton(productId);

        updateCartCount();

        return;
      }


      /* ==============================
         MINUS
      ============================== */

      if (
        actionButton &&
        actionButton.classList.contains("qty-minus")
      ) {

        event.preventDefault();
        event.stopPropagation();

        changeCartQuantity(
          productId,
          -1
        );

        refreshProductButton(productId);

        updateCartCount();

        return;
      }


      /* ==============================
         ADD
      ============================== */

      if (
        addButton.tagName === "BUTTON" &&
        !addButton.classList.contains("added")
      ) {

        event.preventDefault();
        event.stopPropagation();

        addToCart(product);

        refreshProductButton(productId);

        updateCartCount();

      }

    }
  );

}

/* =========================================
   SYNC PRODUCT BUTTONS
========================================= */

function syncProductButtons() {

  const controls =
    document.querySelectorAll(
      ".add-btn[data-product-id]"
    );


  const productIds =
    new Set();


  controls.forEach(
    control => {

      const productId =
        Number(
          control.dataset.productId
        );


      if (productId) {

        productIds.add(
          productId
        );

      }

    }
  );


  productIds.forEach(
    productId => {

      refreshProductButton(
        productId
      );

    }
  );

}


/* =========================================
   UPDATE PRODUCTS PAGE
========================================= */

function refreshProductsPage() {

  const grid =
    document.getElementById(
      "productsGrid"
    );


  if (!grid) {
    return;
  }


  displayProductsPage();

}


/* =========================================
   CART UPDATE LISTENER
========================================= */

document.addEventListener(
  "zynexcart:cartUpdated",
  function () {

    syncProductButtons();

    updateCartCount();

  }
);


/* =========================================
   START PRODUCTS
========================================= */

function initProducts() {

  /*
   * Home page
   */
  displayFeaturedProducts();


  /*
   * Products page
   */
  displayProductsPage();


  /*
   * Header cart
   */
  updateCartCount();

}


/* =========================================
   PUBLIC PRODUCT API
========================================= */

window.ZynexCartProducts = {

  products,

  getProductById,

  getProductsByCategory,

  getProductsBySubcategory,

  formatCategory,

  createProductCard,

  getFilteredProducts,

  displayProductsPage,

  refreshProductsPage,

  refreshProductButton,

  syncProductButtons

};


/* =========================================
   GLOBAL PRODUCTS ACCESS
========================================= */

window.products =
  products;


/* =========================================
   SUPPORT:

   1. NORMAL PAGE
   2. DYNAMIC COMPONENTS
========================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initProducts,
    {
      once: true
    }
  );

} else {

  initProducts();

}
