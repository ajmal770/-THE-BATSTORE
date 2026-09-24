import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface LanguageItem {
  name: string;
  code: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageItem[] = [
  { name: 'English', code: 'en', flag: 'us', dir: 'ltr' },
  { name: 'Spanish', code: 'es', flag: 'es', dir: 'ltr' },
  { name: 'French', code: 'fr', flag: 'fr', dir: 'ltr' },
  { name: 'German', code: 'de', flag: 'de', dir: 'ltr' },
  { name: 'Chinese', code: 'zh', flag: 'cn', dir: 'ltr' },
  { name: 'Japanese', code: 'ja', flag: 'jp', dir: 'ltr' },
  { name: 'Korean', code: 'ko', flag: 'kr', dir: 'ltr' },
  { name: 'Arabic', code: 'ar', flag: 'sa', dir: 'rtl' },
  { name: 'Hindi', code: 'hi', flag: 'in', dir: 'ltr' },
  { name: 'Portuguese', code: 'pt', flag: 'pt', dir: 'ltr' }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Navigation & Header
  'nav.home': {
    English: 'Home',
    Spanish: 'Inicio',
    French: 'Accueil',
    German: 'Startseite',
    Chinese: '首页',
    Japanese: 'ホーム',
    Korean: '홈',
    Arabic: 'الرئيسية',
    Hindi: 'मुख्य पृष्ठ',
    Portuguese: 'Início'
  },
  'nav.shop': {
    English: 'Shop',
    Spanish: 'Tienda',
    French: 'Boutique',
    German: 'Shop',
    Chinese: '商店',
    Japanese: 'ショップ',
    Korean: '쇼핑몰',
    Arabic: 'المتجر',
    Hindi: 'दुकान',
    Portuguese: 'Loja'
  },
  'nav.products': {
    English: 'Products',
    Spanish: 'Productos',
    French: 'Produits',
    German: 'Produkte',
    Chinese: '所有商品',
    Japanese: '製品一覧',
    Korean: '상품 목록',
    Arabic: 'المنتجات',
    Hindi: 'उत्पाद',
    Portuguese: 'Produtos'
  },
  'nav.categories': {
    English: 'Categories',
    Spanish: 'Categorías',
    French: 'Catégories',
    German: 'Kategorien',
    Chinese: '商品分类',
    Japanese: 'カテゴリー',
    Korean: '카테고리',
    Arabic: 'الفئات',
    Hindi: 'श्रेणियां',
    Portuguese: 'Categorias'
  },
  'nav.sale': {
    English: 'Sale',
    Spanish: 'Ofertas',
    French: 'Promotions',
    German: 'Angebote',
    Chinese: '特惠促销',
    Japanese: 'セール',
    Korean: '세일',
    Arabic: 'التخفيضات',
    Hindi: 'बिक्री',
    Portuguese: 'Promoções'
  },
  'nav.about': {
    English: 'About Us',
    Spanish: 'Sobre Nosotros',
    French: 'À Propos',
    German: 'Über Uns',
    Chinese: '关于我们',
    Japanese: '会社概要',
    Korean: '회사 소개',
    Arabic: 'من نحن',
    Hindi: 'हमारे बारे में',
    Portuguese: 'Sobre Nós'
  },
  'nav.contact': {
    English: 'Contact Us',
    Spanish: 'Contacto',
    French: 'Contactez-nous',
    German: 'Kontakt',
    Chinese: '联系我们',
    Japanese: 'お問い合わせ',
    Korean: '문의하기',
    Arabic: 'اتصل بنا',
    Hindi: 'संपर्क करें',
    Portuguese: 'Contato'
  },
  'nav.cart': {
    English: 'Cart',
    Spanish: 'Carrito',
    French: 'Panier',
    German: 'Warenkorb',
    Chinese: '购物车',
    Japanese: 'カート',
    Korean: '장바구니',
    Arabic: 'سلة التسوق',
    Hindi: 'कार्ट',
    Portuguese: 'Carrinho'
  },
  'nav.wishlist': {
    English: 'Wishlist',
    Spanish: 'Favoritos',
    French: 'Favoris',
    German: 'Wunschliste',
    Chinese: '心愿单',
    Japanese: 'お気に入り',
    Korean: '위시리스트',
    Arabic: 'المفضلة',
    Hindi: 'इच्छासूची',
    Portuguese: 'Lista de Desejos'
  },
  'nav.search': {
    English: 'Search products, brands and categories...',
    Spanish: 'Buscar productos, marcas y categorías...',
    French: 'Rechercher des produits, marques et catégories...',
    German: 'Produkte, Marken und Kategorien suchen...',
    Chinese: '搜索商品、品牌和分类...',
    Japanese: '商品、ブランド、カテゴリーを検索...',
    Korean: '상품, 브랜드 및 카테고리 검색...',
    Arabic: 'ابحث عن المنتجات والعلامات التجارية والفئات...',
    Hindi: 'उत्पाद, ब्रांड और श्रेणियां खोजें...',
    Portuguese: 'Buscar produtos, marcas e categorias...'
  },
  'nav.login': {
    English: 'Sign In',
    Spanish: 'Iniciar Sesión',
    French: 'Se Connecter',
    German: 'Anmelden',
    Chinese: '登录',
    Japanese: 'ログイン',
    Korean: '로그인',
    Arabic: 'تسجيل الدخول',
    Hindi: 'साइन इन',
    Portuguese: 'Entrar'
  },

  // Features Section (Pre-Footer)
  'feature.shipping.title': {
    English: 'Free Shipping',
    Spanish: 'Envío Gratuito',
    French: 'Livraison Gratuite',
    German: 'Kostenloser Versand',
    Chinese: '免运费送货',
    Japanese: '送料無料',
    Korean: '무료 배송',
    Arabic: 'شحن مجاني',
    Hindi: 'मुफ्त शिपिंग',
    Portuguese: 'Frete Grátis'
  },
  'feature.shipping.desc': {
    English: 'On all orders over 15 Klm & $ 99.9',
    Spanish: 'En pedidos superiores a $150.',
    French: 'Sur toutes las commandes de plus de $150.',
    German: 'Für alle Bestellungen über $150.',
    Chinese: '订单满 $150 即享免运费。',
    Japanese: '$150以上のご注文で送料無料。',
    Korean: '$150 이상 주문 시 무료 배송.',
    Arabic: 'على جميع الطلبات التي تزيد عن 150 دولارًا.',
    Hindi: '$150 से अधिक के सभी ऑर्डर पर।',
    Portuguese: 'Em todos os pedidos acima de $150.'
  },
  'feature.security.title': {
    English: 'Secure Payments',
    Spanish: 'Pagos Seguros',
    French: 'Paiements Sécurisés',
    German: 'Sichere Zahlung',
    Chinese: '安全支付保障',
    Japanese: '安全な決済',
    Korean: '안전한 결제',
    Arabic: 'دفع آمن',
    Hindi: 'सुरक्षित भुगतान',
    Portuguese: 'Pagamentos Seguros'
  },
  'feature.security.desc': {
    English: '100% secure with 256-bit SSL.',
    Spanish: '100% seguro con SSL de 256 bits.',
    French: '100% sécurisé avec SSL 256 bits.',
    German: '100% sicher mit 256-Bit SSL.',
    Chinese: '100% 256位 SSL 加密安全保障。',
    Japanese: '256ビットSSL暗号化で100%安全。',
    Korean: '256비트 SSL로 100% 안전한 결제.',
    Arabic: 'آمن بنسبة 100٪ مع تشفير SSL سعة 256 بت.',
    Hindi: '256-बिट SSL के साथ 100% सुरक्षित।',
    Portuguese: '100% seguro com SSL de 256 bits.'
  },
  'feature.support.title': {
    English: '24/7 Support',
    Spanish: 'Soporte 24/7',
    French: 'Support 24/7',
    German: '24/7 Support',
    Chinese: '24/7 全天候客服',
    Japanese: '24時間年中無休サポート',
    Korean: '24/7 고객 지원',
    Arabic: 'دعم على مدار الساعة',
    Hindi: '24/7 सहायता',
    Portuguese: 'Suporte 24/7'
  },
  'feature.support.desc': {
    English: 'Dedicated support anytime.',
    Spanish: 'Soporte dedicado en cualquier momento.',
    French: 'Assistance dédiée a tout moment.',
    German: 'Jederzeit engagierter Support.',
    Chinese: '随时为您提供专属人工客服。',
    Japanese: 'いつでも専任のサポート。',
    Korean: '언제든 전담 고객 Support 지원.',
    Arabic: 'دعم مخصص في أي وقت.',
    Hindi: 'किसी भी समय समर्पित सहायता।',
    Portuguese: 'Suporte dedicado a qualquer hora.'
  },
  'feature.returns.title': {
    English: 'Easy Returns',
    Spanish: 'Devoluciones Fáciles',
    French: 'Retours Faciles',
    German: 'Einfache Rückgabe',
    Chinese: '轻松退换货',
    Japanese: '簡単な返品',
    Korean: '쉬운 반품',
    Arabic: 'إرجاع سهل',
    Hindi: 'आसान रिफंड',
    Portuguese: 'Devoluções Fáceis'
  },
  'feature.returns.desc': {
    English: '30-day hassle-free returns.',
    Spanish: 'Devoluciones sin complicaciones de 30 días.',
    French: 'Retours sans tracas sous 30 jours.',
    German: '30 Tage problemlos zurückgeben.',
    Chinese: '支持 30 天无忧无理由退换货。',
    Japanese: '30日間の安心返品保証。',
    Korean: '30일 무상 및 쉬운 반품.',
    Arabic: 'إرجاع بدون متاعب خلال 30 يومًا.',
    Hindi: '30 दिनों में बिना परेशानी के वापसी।',
    Portuguese: 'Devoluções sem complicações em 30 dias.'
  },

  // Footer Sections & Links
  'footer.about': {
    English: 'About',
    Spanish: 'Acerca de',
    French: 'À Propos',
    German: 'Über',
    Chinese: '关于我们',
    Japanese: '概要',
    Korean: '회사 정보',
    Arabic: 'حول',
    Hindi: 'के बारे में',
    Portuguese: 'Sobre'
  },
  'footer.help': {
    English: 'Help',
    Spanish: 'Ayuda',
    French: 'Aide',
    German: 'Hilfe',
    Chinese: '帮助中心',
    Japanese: 'ヘルプ',
    Korean: '고객센터',
    Arabic: 'المساعدة',
    Hindi: 'सहायता',
    Portuguese: 'Ajuda'
  },
  'footer.policy': {
    English: 'Consumer Policy',
    Spanish: 'Política del Consumidor',
    French: 'Politique du Consommateur',
    German: 'Verbraucherrichtlinie',
    Chinese: '消费者条款与政策',
    Japanese: '消費者ポリシー',
    Korean: '소비자 정책',
    Arabic: 'سياسة المستهلك',
    Hindi: 'उपभोक्ता नीति',
    Portuguese: 'Política do Consumidor'
  },
  'footer.mail': {
    English: 'Mail Us',
    Spanish: 'Envíanos un Correo',
    French: 'Écrivez-nous',
    German: 'Schreiben Sie uns',
    Chinese: '邮寄地址',
    Japanese: '郵送先',
    Korean: '우편 주소',
    Arabic: 'راسلنا',
    Hindi: 'हमें मेल करें',
    Portuguese: 'Envie um E-mail'
  },
  'footer.office': {
    English: 'Registered Office Address',
    Spanish: 'Dirección de la Oficina Registrada',
    French: 'Adresse del Siège Social',
    German: 'Registrierte Büroadresse',
    Chinese: '注册办公地址',
    Japanese: '登記済み事務所住所',
    Korean: '등록된 본사 주소',
    Arabic: 'عنوان المكتب المسجل',
    Hindi: 'पंजीकृत कार्यालय का पता',
    Portuguese: 'Endereço da Sede Registrada'
  },
  'footer.rights': {
    English: 'The BatStore Enterprise. All rights reserved.',
    Spanish: 'The BatStore Enterprise. Todos los derechos reservados.',
    French: 'The BatStore Enterprise. Tous droits réservés.',
    German: 'The BatStore Enterprise. Alle Rechte vorbehalten.',
    Chinese: 'The BatStore 企业集团 版权所有。',
    Japanese: 'The BatStore Enterprise. 无断転載を禁じます。',
    Korean: 'The BatStore Enterprise. 판권 소유.',
    Arabic: 'The BatStore Enterprise. جميع الحقوق محفوظة.',
    Hindi: 'The BatStore Enterprise. सर्वाधिकार सुरक्षित।',
    Portuguese: 'The BatStore Enterprise. Todos os direitos reservados.'
  },

  // Home Page Banner / Hero
  'hero.title': {
    English: 'Discover Next-Gen Products Today',
    Spanish: 'Descubra Productos de Última Generación Hoy',
    French: 'Découvrez les Produits de Nouvelle Génération',
    German: 'Entdecken Sie Produkte der nächsten Generation',
    Chinese: '探索下一代前沿科技与时尚臻品',
    Japanese: '次世代のプレミアム製品を発見しよう',
    Korean: '차세대 프리미엄 상품을 지금 만나보세요',
    Arabic: 'اكتشف منتجات الجيل القادم اليوم',
    Hindi: 'आज ही अगली पीढ़ी के उत्पादों की खोज करें',
    Portuguese: 'Descubra Produtos de Última Geração Hoje'
  },
  'hero.subtitle': {
    English: 'Shop the newest electronics, fashion, and lifestyle essentials with exclusive deals.',
    Spanish: 'Compre los últimos productos de electrónica, moda y estilo de vida con ofertas exclusivas.',
    French: 'Achetez la dernière électronique, la mode et les essentiels du quotidien avec des offres exclusives.',
    German: 'Kaufen Sie die neueste Elektronik, Mode und Lifestyle-Produkte mit exklusiven Angeboten.',
    Chinese: '精选全球热门电子产品、时尚服饰与居家精品，享受专属限时折扣。',
    Japanese: '限定セールで最新の家電、ファッション、ライフスタイル用品をショッピング。',
    Korean: '독점 혜택으로 최신 전자제품, 패션, 라이프스타일 필수품을 쇼핑하세요.',
    Arabic: 'تسوق أحدث الإلكترونيات والأزياء ومستلزمات الحياة مع عروض حصرية.',
    Hindi: 'विशेष सौदों के साथ नवीनतम इलेक्ट्रॉनिक्स, फैशन और जीवनशैली की आवश्यक वस्तुएं खरीदें।',
    Portuguese: 'Compre os mais recentes eletrônicos, moda e itens essenciais com ofertas exclusivas.'
  },
  'hero.btn': {
    English: 'Shop Now',
    Spanish: 'Comprar Ahora',
    French: 'Acheter Maintenant',
    German: 'Jetzt Einkaufen',
    Chinese: '立即选购',
    Japanese: '今すぐ購入',
    Korean: '지금 쇼핑하기',
    Arabic: 'تسوق الآن',
    Hindi: 'अभी खरीदें',
    Portuguese: 'Comprar Agora'
  },

  // Store Buttons & Labels
  'action.add_to_cart': {
    English: 'Add to Cart',
    Spanish: 'Añadir al Carrito',
    French: 'Ajouter au Panier',
    German: 'In den Warenkorb',
    Chinese: '加入购物车',
    Japanese: 'カートに追加',
    Korean: '장바구니 담기',
    Arabic: 'أضف إلى السلة',
    Hindi: 'कार्ट में जोड़ें',
    Portuguese: 'Adicionar ao Carrinho'
  },
  'action.buy_now': {
    English: 'Buy Now',
    Spanish: 'Comprar Ahora',
    French: 'Acheter Immédiatement',
    German: 'Sofort Kaufen',
    Chinese: '立即购买',
    Japanese: '今すぐ支払う',
    Korean: '바로 구매',
    Arabic: 'شراء الآن',
    Hindi: 'अभी खरीदें',
    Portuguese: 'Comprar Agora'
  },
  'action.view_details': {
    English: 'View Details',
    Spanish: 'Ver Detalles',
    French: 'Voir les Détails',
    German: 'Details Anzeigen',
    Chinese: '查看详情',
    Japanese: '詳細を見る',
    Korean: '상세보기',
    Arabic: 'عرض التفاصيل',
    Hindi: 'विवरण देखें',
    Portuguese: 'Ver Detalhes'
  }
};

interface LanguageContextType {
  activeLang: LanguageItem;
  setLanguage: (lang: LanguageItem) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'thebatstore_app_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeLang, setActiveLangState] = useState<LanguageItem>(() => {
    const savedCode = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedCode) {
      const found = LANGUAGES.find((l) => l.code === savedCode || l.name === savedCode);
      if (found) return found;
    }
    return LANGUAGES[0]; // English default
  });

  const setLanguage = (lang: LanguageItem) => {
    setActiveLangState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang.code);
  };

  useEffect(() => {
    // Update HTML dir & lang attributes dynamically on selection change!
    const isRtl = activeLang.dir === 'rtl';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = activeLang.code;
  }, [activeLang]);

  const t = (key: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][activeLang.name]) {
      return TRANSLATIONS[key][activeLang.name];
    }
    // Fallback to English if translation key missing
    if (TRANSLATIONS[key] && TRANSLATIONS[key]['English']) {
      return TRANSLATIONS[key]['English'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ activeLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
