const photos = [
  'photo-1600607687939-ce8a6c25118c', 'photo-1600585154340-be6161a56a0c',
  'photo-1600607687920-4e2a09cf159d', 'photo-1600566753086-00f18fb6b3ea',
  'photo-1600047509807-ba8f99d2cdde', 'photo-1600607687644-c7171b42498f',
  'photo-1600566753190-17f0baa2a6c3', 'photo-1600210492486-724fe5c67fb0',
  'photo-1600566752355-35792bedcfea', 'photo-1600607687939-ce8a6c25118c',
  'photo-1600607687920-4e2a09cf159d', 'photo-1600585154340-be6161a56a0c',
]

const image = (photo, width = 1000) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=82`
const agent = { name: { en: 'EstateHub Demo Team', ar: 'فريق إيستيت هَب التجريبي' }, phone: '+20 100 000 0000', email: 'hello@example.test' }

function property(id, type, purpose, price, beds, baths, area, city, cityAr, neighborhood, neighborhoodAr, title, titleAr, description, descriptionAr, photoIndex, extras = {}) {
  const gallery = [photoIndex, (photoIndex + 3) % photos.length, (photoIndex + 6) % photos.length].map((i) => image(photos[i]))
  return {
    id, type, purpose, price, beds, baths, area,
    city: { en: city, ar: cityAr }, neighborhood: { en: neighborhood, ar: neighborhoodAr },
    title: { en: title, ar: titleAr }, description: { en: description, ar: descriptionAr },
    images: gallery, image: gallery[0], featured: false,
    amenities: {
      en: ['Natural light', 'Built-in wardrobes', 'Secure entry'],
      ar: ['إضاءة طبيعية', 'خزائن مدمجة', 'مدخل آمن'],
    },
    listedAt: '2026-09-18', built: 2021, agent, ...extras,
  }
}

export const properties = [
  property('eh-001', 'apartment', 'sale', 4850000, 3, 2, 178, 'New Cairo', 'القاهرة الجديدة', 'Fifth Settlement', 'التجمع الخامس', 'Light-filled home near the park', 'شقة مشرقة بالقرب من الحديقة', 'A calm, contemporary apartment with a generous balcony, smart storage and an easy walk to everyday essentials.', 'شقة عصرية هادئة بشرفة واسعة ومساحات تخزين عملية، وعلى مسافة قريبة من الخدمات اليومية.', 0, { featured: true, listedAt: '2026-10-15', amenities: { en: ['Private balcony', 'Fitted kitchen', 'Underground parking', '24-hour security'], ar: ['شرفة خاصة', 'مطبخ مجهز', 'موقف سيارات تحت الأرض', 'أمن على مدار الساعة'] } }),
  property('eh-002', 'villa', 'sale', 12750000, 5, 4, 420, 'Sheikh Zayed', 'الشيخ زايد', 'Beverly Hills', 'بيفرلي هيلز', 'A garden villa made for gathering', 'فيلا بحديقة مثالية للعائلة', 'A welcoming family villa with a private garden, bright living spaces and room to grow.', 'فيلا عائلية ترحيبية بحديقة خاصة ومساحات معيشة مضيئة ومساحة تناسب احتياجات الأسرة.', 1, { featured: true, built: 2022, listedAt: '2026-10-12', amenities: { en: ['Private garden', 'Maid room', 'Walk-in closet', 'Covered parking'], ar: ['حديقة خاصة', 'غرفة مساعدة', 'غرفة ملابس', 'موقف سيارات مغطى'] } }),
  property('eh-003', 'apartment', 'rent', 32000, 2, 2, 132, 'Maadi', 'المعادي', 'Degla', 'دجلة', 'Quiet apartment on a leafy street', 'شقة هادئة في شارع تحيط به الأشجار', 'An airy, furnished apartment in a walkable neighbourhood close to cafés and green spaces.', 'شقة مفروشة جيدة التهوية في حي مناسب للمشي، بالقرب من المقاهي والمساحات الخضراء.', 2, { featured: true, listedAt: '2026-10-10', amenities: { en: ['Fully furnished', 'Balcony', 'Pet friendly', 'Elevator'], ar: ['مفروشة بالكامل', 'شرفة', 'تسمح بالحيوانات الأليفة', 'مصعد'] } }),
  property('eh-004', 'townhouse', 'sale', 6850000, 4, 3, 255, '6th of October', 'السادس من أكتوبر', 'Palm Hills', 'بالم هيلز', 'Modern townhouse with a private patio', 'تاون هاوس عصري بفناء خاص', 'A well-planned townhouse with an open kitchen, a sunny patio and flexible family space.', 'تاون هاوس بتصميم عملي ومطبخ مفتوح وفناء مشمس ومساحات مرنة تناسب الأسرة.', 3, { featured: true, listedAt: '2026-10-08', built: 2023 }),
  property('eh-005', 'house', 'rent', 48000, 4, 3, 300, 'New Cairo', 'القاهرة الجديدة', 'Mivida', 'ميفيدا', 'Family home with room to breathe', 'منزل عائلي بمساحات رحبة', 'A spacious home with a private garden and a practical layout for everyday family life.', 'منزل واسع بحديقة خاصة وتوزيع عملي يناسب تفاصيل الحياة العائلية اليومية.', 4, { listedAt: '2026-10-06', amenities: { en: ['Private garden', 'Storage room', 'Club access', 'Central air conditioning'], ar: ['حديقة خاصة', 'غرفة تخزين', 'دخول النادي', 'تكييف مركزي'] } }),
  property('eh-006', 'commercial', 'rent', 85000, 0, 2, 210, 'New Cairo', 'القاهرة الجديدة', 'Golden Square', 'الجولدن سكوير', 'Street-facing retail with great visibility', 'محل تجاري بواجهة واضحة على الشارع', 'A flexible retail unit in a busy destination, with generous frontage and convenient access.', 'وحدة تجارية مرنة في وجهة حيوية، بواجهة واسعة وسهولة في الوصول.', 5, { listedAt: '2026-10-02', built: 2020, amenities: { en: ['Street frontage', 'Customer parking', 'Flexible floor plan', 'Accessible entrance'], ar: ['واجهة على الشارع', 'موقف للعملاء', 'مساحة قابلة للتقسيم', 'مدخل مهيأ'] } }),
  property('eh-007', 'apartment', 'sale', 2950000, 2, 1, 108, 'Nasr City', 'مدينة نصر', 'Makram Ebeid', 'مكرم عبيد', 'Easy city living near everything', 'حياة مريحة بالقرب من كل شيء', 'A smartly arranged apartment close to transport, shopping and the neighbourhood’s daily conveniences.', 'شقة بتقسيم ذكي بالقرب من المواصلات والتسوق والخدمات اليومية في الحي.', 6, { listedAt: '2026-09-29', built: 2018 }),
  property('eh-008', 'villa', 'rent', 95000, 5, 4, 380, 'Sheikh Zayed', 'الشيخ زايد', 'Allegria', 'أليجريا', 'Private pool villa in a peaceful setting', 'فيلا بمسبح خاص في أجواء هادئة', 'Unwind in a bright villa with a private pool, outdoor dining and plenty of space for guests.', 'استمتع بفيلا مضيئة مع مسبح خاص ومساحة لتناول الطعام في الهواء الطلق واستقبال الضيوف.', 7, { listedAt: '2026-09-26', built: 2024, amenities: { en: ['Private pool', 'Garden', 'Furnished terrace', 'Gated community'], ar: ['مسبح خاص', 'حديقة', 'تراس مفروش', 'كمبوند مغلق'] } }),
  property('eh-009', 'apartment', 'rent', 18500, 1, 1, 82, 'Maadi', 'المعادي', 'Sarayat', 'السرايات', 'A bright one-bedroom in the heart of Maadi', 'شقة مشرقة بغرفة نوم في قلب المعادي', 'A tidy, sunlit apartment with a separate kitchen in one of Maadi’s most charming pockets.', 'شقة مرتبة ومشمسة بمطبخ مستقل في أحد أحياء المعادي الأكثر تميزاً.', 8, { listedAt: '2026-09-24', amenities: { en: ['Furnished', 'Elevator', 'Balcony', 'Near metro'], ar: ['مفروشة', 'مصعد', 'شرفة', 'بالقرب من المترو'] } }),
  property('eh-010', 'townhouse', 'sale', 5700000, 3, 3, 220, '6th of October', 'السادس من أكتوبر', 'O West', 'أو ويست', 'A thoughtful home with a rooftop terrace', 'منزل بتصميم مدروس وتراس على السطح', 'An end-unit townhouse with a private rooftop terrace, generous windows and a family-friendly community.', 'تاون هاوس بوحدة طرفية وتراس خاص على السطح ونوافذ واسعة وكمبوند مناسب للعائلات.', 9, { listedAt: '2026-09-20', built: 2022 }),
  property('eh-011', 'commercial', 'sale', 9200000, 0, 2, 165, 'Nasr City', 'مدينة نصر', 'Abbas El Akkad', 'عباس العقاد', 'Versatile office in a central business hub', 'مكتب مرن في مركز أعمال حيوي', 'A well-positioned office space with a flexible layout, reception area and reliable building services.', 'مساحة مكتبية بموقع مميز وتخطيط مرن ومنطقة استقبال وخدمات مبنى موثوقة.', 10, { listedAt: '2026-09-18', built: 2019, amenities: { en: ['Reception area', 'Meeting room', 'High-speed internet ready', 'Secure building'], ar: ['منطقة استقبال', 'غرفة اجتماعات', 'جاهز للإنترنت فائق السرعة', 'مبنى مؤمن'] } }),
  property('eh-012', 'house', 'sale', 6100000, 4, 3, 275, 'New Cairo', 'القاهرة الجديدة', 'South Academy', 'جنوب الأكاديمية', 'Move-in ready family house', 'منزل عائلي جاهز للسكن', 'An inviting detached home with a bright dining area, useful storage and a private outdoor corner.', 'منزل مستقل ومرحّب بمنطقة طعام مضيئة ومساحات تخزين عملية وركن خارجي خاص.', 11, { listedAt: '2026-09-15', built: 2017 }),
  property('eh-013', 'apartment', 'sale', 3550000, 3, 2, 145, 'Sheikh Zayed', 'الشيخ زايد', 'Zayed 2000', 'زايد ٢٠٠٠', 'A relaxed apartment with open views', 'شقة مريحة بإطلالة مفتوحة', 'Enjoy open views and a spacious reception room in this thoughtfully maintained home.', 'استمتع بإطلالة مفتوحة وغرفة استقبال واسعة في هذه الشقة التي تتمتع بصيانة جيدة.', 0, { listedAt: '2026-09-11', built: 2020 }),
  property('eh-014', 'villa', 'sale', 15800000, 6, 5, 510, '6th of October', 'السادس من أكتوبر', 'Dreamland', 'دريم لاند', 'Generous villa with a mature garden', 'فيلا واسعة بحديقة ناضجة', 'A substantial villa with generous entertaining areas, a mature garden and a private family suite.', 'فيلا رحبة بمساحات مميزة لاستقبال الضيوف وحديقة ناضجة وجناح عائلي خاص.', 1, { listedAt: '2026-09-08', built: 2016, amenities: { en: ['Mature garden', 'Family suite', 'Maid room', 'Garage'], ar: ['حديقة ناضجة', 'جناح عائلي', 'غرفة مساعدة', 'مرآب'] } }),
  property('eh-015', 'apartment', 'rent', 26000, 2, 2, 120, 'New Cairo', 'القاهرة الجديدة', 'Rehab City', 'مدينة الرحاب', 'Furnished apartment close to the mall', 'شقة مفروشة بالقرب من المول', 'A comfortable furnished home a short walk from the mall, cafés and landscaped community spaces.', 'منزل مفروش ومريح على مسافة قصيرة من المول والمقاهي والمساحات الخضراء في الكمبوند.', 2, { listedAt: '2026-09-05', amenities: { en: ['Fully furnished', 'Community pools', 'Balcony', 'Covered parking'], ar: ['مفروشة بالكامل', 'حمامات سباحة بالكمبوند', 'شرفة', 'موقف سيارات مغطى'] } }),
  property('eh-016', 'commercial', 'rent', 52000, 0, 1, 125, 'Maadi', 'المعادي', 'New Maadi', 'المعادي الجديدة', 'Boutique workspace in a lively district', 'مساحة عمل مميزة في حي نابض بالحياة', 'A light-filled ground-floor workspace suited to a studio, clinic or creative office.', 'مساحة عمل مضيئة بالدور الأرضي تناسب استوديو أو عيادة أو مكتباً إبداعياً.', 3, { listedAt: '2026-09-02', amenities: { en: ['Ground floor', 'Natural light', 'Private washroom', 'Street access'], ar: ['الدور الأرضي', 'إضاءة طبيعية', 'دورة مياه خاصة', 'مدخل مباشر من الشارع'] } }),
  property('eh-017', 'townhouse', 'rent', 42000, 3, 3, 205, 'Sheikh Zayed', 'الشيخ زايد', 'Beverly Hills', 'بيفرلي هيلز', 'A welcoming townhouse for the next chapter', 'تاون هاوس ترحيبي لبداية جديدة', 'Settle into an easy-flowing home with a sunny terrace and green space just outside.', 'استقر في منزل بتصميم انسيابي وتراس مشمس ومساحة خضراء على بُعد خطوات.', 4, { listedAt: '2026-08-28', built: 2021 }),
  property('eh-018', 'apartment', 'sale', 2200000, 2, 1, 96, 'Nasr City', 'مدينة نصر', 'Raba’a El Adaweya', 'رابعة العدوية', 'A well-kept home with a generous balcony', 'شقة بحالة جيدة وشرفة رحبة', 'A practical city apartment with a generous balcony and easy access to daily essentials.', 'شقة عملية بشرفة رحبة وسهولة في الوصول إلى الاحتياجات اليومية.', 5, { listedAt: '2026-08-25', built: 2015 }),
  property('eh-019', 'house', 'rent', 36000, 3, 2, 240, '6th of October', 'السادس من أكتوبر', 'West Somid', 'غرب سوميد', 'A calm home with a shaded garden', 'منزل هادئ بحديقة مظللة', 'A peaceful home with a shaded garden, airy bedrooms and a generous family room.', 'منزل هادئ بحديقة مظللة وغرف نوم جيدة التهوية وغرفة معيشة عائلية واسعة.', 6, { listedAt: '2026-08-20', built: 2019 }),
  property('eh-020', 'villa', 'sale', 11300000, 5, 4, 390, 'New Cairo', 'القاهرة الجديدة', 'Katameya Heights', 'قطامية هايتس', 'Contemporary villa with a quiet courtyard', 'فيلا عصرية بفناء هادئ', 'A contemporary home centred around a private courtyard, with refined finishes and open family spaces.', 'منزل عصري يتمحور حول فناء خاص، بتشطيبات راقية ومساحات عائلية مفتوحة.', 7, { listedAt: '2026-08-17', built: 2023 }),
  property('eh-021', 'apartment', 'rent', 22000, 2, 1, 110, 'Sheikh Zayed', 'الشيخ زايد', 'Zayed 1', 'الشيخ زايد ١', 'An airy apartment near daily conveniences', 'شقة جيدة التهوية بالقرب من الخدمات', 'A well-lit apartment with a practical layout, close to supermarkets and local transport.', 'شقة مضيئة بتوزيع عملي، بالقرب من السوبرماركت والمواصلات المحلية.', 8, { listedAt: '2026-08-12', built: 2018 }),
  property('eh-022', 'commercial', 'sale', 4700000, 0, 1, 92, '6th of October', 'السادس من أكتوبر', 'Hadayek October', 'حدائق أكتوبر', 'Compact commercial unit in a growing area', 'وحدة تجارية بمساحة مناسبة في منطقة واعدة', 'A well-proportioned commercial unit with street access and a flexible open interior.', 'وحدة تجارية بتقسيم مناسب ومدخل على الشارع ومساحة داخلية مفتوحة ومرنة.', 9, { listedAt: '2026-08-08', built: 2024 }),
  property('eh-023', 'apartment', 'sale', 3900000, 3, 2, 155, 'Maadi', 'المعادي', 'Zahraa El Maadi', 'زهراء المعادي', 'A generous home with a separate dining room', 'شقة واسعة بغرفة طعام مستقلة', 'A spacious apartment with a separate dining room, practical storage and pleasant natural light.', 'شقة واسعة بغرفة طعام مستقلة ومساحات تخزين عملية وإضاءة طبيعية مريحة.', 10, { listedAt: '2026-08-03', built: 2020 }),
  property('eh-024', 'house', 'sale', 7800000, 4, 3, 330, 'New Cairo', 'القاهرة الجديدة', 'El Banafseg', 'البنفسج', 'Detached home with a bright garden room', 'منزل مستقل بغرفة مشرقة تطل على الحديقة', 'A detached home with a bright garden room, spacious bedrooms and a private garage.', 'منزل مستقل بغرفة مضيئة تطل على الحديقة وغرف نوم واسعة ومرآب خاص.', 11, { listedAt: '2026-07-28', built: 2021 }),
]

export const propertyTypes = ['apartment', 'house', 'villa', 'townhouse', 'commercial']
export const listingPurposes = ['sale', 'rent']

function localizedPair(value) {
  return Boolean(value && typeof value.en === 'string' && value.en.trim() && typeof value.ar === 'string' && value.ar.trim())
}

function isWebUrl(value) {
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export function isValidProperty(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  if (typeof value.id !== 'string' || !value.id.trim()) return false
  if (!propertyTypes.includes(value.type) || !listingPurposes.includes(value.purpose)) return false
  if (!Number.isFinite(value.price) || value.price <= 0) return false
  if (!Number.isInteger(value.beds) || value.beds < 0 || !Number.isInteger(value.baths) || value.baths < 0) return false
  if (!Number.isFinite(value.area) || value.area <= 0) return false
  if (!localizedPair(value.title) || !localizedPair(value.description) || !localizedPair(value.city) || !localizedPair(value.neighborhood)) return false
  if (!isValidDate(value.listedAt)) return false
  if (value.built !== undefined && (!Number.isInteger(value.built) || value.built < 1600 || value.built > new Date().getFullYear() + 5)) return false
  if (value.featured !== undefined && typeof value.featured !== 'boolean') return false
  if (!Array.isArray(value.images) || value.images.some((url) => typeof url !== 'string' || !isWebUrl(url))) return false
  if (value.image !== undefined && (typeof value.image !== 'string' || (value.image && !isWebUrl(value.image)))) return false
  if (value.amenities && (!Array.isArray(value.amenities.en) || !value.amenities.en.every((item) => typeof item === 'string') || !Array.isArray(value.amenities.ar) || !value.amenities.ar.every((item) => typeof item === 'string'))) return false
  if (value.address !== undefined && typeof value.address !== 'string') return false
  if (value.agent !== undefined && (!value.agent || typeof value.agent !== 'object' || Array.isArray(value.agent) || !localizedPair(value.agent.name))) return false
  return true
}

