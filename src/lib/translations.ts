export type Language = "en" | "es" | "fr" | "pt" | "de" | "it" | "ja" | "ko" | "no" | "de-ch";

export const languages: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "no", name: "Norsk" },
  { code: "de-ch", name: "Schweizerdeutsch" },
];

export const translations = {
  en: {
    hero: {
      welcome: "Welcome to Aether Industries",
      slogan: "A cleaner future starts with every drop",
      motto: "Excellence | Efficiency | Power",
    },
    nav: {
      home: "Home",
      about: "About",
      products: "Products",
      contact: "Contact Us",
    },
    home: {
      title: "Welcome",
      description:
        "At Aether Industries, we are pioneering the future of automation technology with cutting-edge solutions that transform industries and elevate human potential.",
    },
    about: {
      title: "About Section",
      subtitle: "Innovation Meets Precision",
      description:
        "Aether Industries was founded on December 27, 2005, as a company that manufactured water packaging machines. During the development process of the most advanced models, the addition of our first partners gave us the possibility to plan the first models of customized packaging machines for clients who might need a capacity superior to that of our mass-produced models. From a certain point, we began to automate our assembly line with machinery developed by us until we were able to commercialize said machinery at more affordable prices than the competition.",
      partners: "Our Partners",
    },
    products: {
      title: "Product Lines",
      subtitle: "Comprehensive Automation Solutions",
      lines: {
        x: { name: "Line X", type: "Packaging Systems" },
        r: { name: "Line R", type: "Welding Solutions" },
        a: { name: "Line A", type: "Robotic Arms" },
        s: { name: "Line S", type: "Control Systems" },
        p: { name: "Line P", type: "Peripherals" },
        c: { name: "Line C", type: "CNC – Cutting" },
        t: { name: "Line T", type: "CNC – Turning" },
        f: { name: "Line F", type: "CNC – Milling" },
        m: { name: "Line M", type: "CNC – Machining" },
      },
    },
    contact: {
      title: "Contact Us",
      subtitle: "Get in Touch",
      social: "Follow Us",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send Message",
        sending: "Sending...",
        success: "Message sent successfully!",
        error: "Please fill in all fields",
      },
    },
  },
  es: {
    hero: {
      welcome: "Bienvenido a Aether Industries",
      slogan: "Un futuro más limpio empieza con cada gota",
      motto: "Excelencia | Eficiencia | Potencia",
    },
    nav: {
      home: "Inicio",
      about: "Acerca de",
      products: "Productos",
      contact: "Contacto",
    },
    home: {
      title: "Bienvenido",
      description:
        "En Aether Industries estamos siendo pioneros en el futuro de la tecnología de automatización con soluciones de vanguardia que transforman industrias y elevan el potencial humano.",
    },
    about: {
      title: "Acerca de Nosotros",
      subtitle: "La Innovación Encuentra la Precisión",
      description:
        "Aether Industries se fundó el 27 de diciembre de 2005 como una empresa que manufacturaba envasadoras de agua, durante el proceso de desarrollo de los modelos más avanzados, la adhesión de nuestros primeros socios nos dio la posibilidad de planificar los primeros modelos de envasadoras personalizadas para los clientes que pudieran necesitar una capacidad superior que la de nuestros modelos producidos en masa, a partir de cierto punto, empezamos a automatizar nuestra línea de ensamblaje con maquinaria desarrollada por nosotros hasta llegar a poder comercializar dicha maquinaria a precios más asequibles que los de la competencia.",
      partners: "Nuestros Socios",
    },
    products: {
      title: "Líneas de Productos",
      subtitle: "Soluciones Integrales de Automatización",
      lines: {
        x: { name: "Línea X", type: "Envasadoras" },
        r: { name: "Línea R", type: "Soldadura" },
        a: { name: "Línea A", type: "Brazos Robóticos" },
        s: { name: "Línea S", type: "Sistemas de Control" },
        p: { name: "Línea P", type: "Periféricos" },
        c: { name: "Línea C", type: "CNC – Corte" },
        t: { name: "Línea T", type: "CNC – Torneado" },
        f: { name: "Línea F", type: "CNC – Fresado" },
        m: { name: "Línea M", type: "CNC – Mecanizado" },
      },
    },
    contact: {
      title: "Contáctenos",
      subtitle: "Póngase en Contacto",
      social: "Síguenos",
      form: {
        name: "Nombre",
        email: "Correo electrónico",
        message: "Mensaje",
        send: "Enviar Mensaje",
        sending: "Enviando...",
        success: "¡Mensaje enviado con éxito!",
        error: "Por favor, complete todos los campos",
      },
    },
  },
  fr: {
    hero: {
      welcome: "Bienvenue chez Aether Industries",
      slogan: "Un avenir plus propre commence par chaque goutte",
      motto: "Excellence | Efficacité | Puissance",
    },
    nav: {
      home: "Accueil",
      about: "À propos",
      products: "Produits",
      contact: "Contact",
    },
    home: {
      title: "Bienvenue",
      description:
        "Chez Aether Industries, nous sommes pionniers de l'avenir de la technologie d'automatisation avec des solutions de pointe qui transforment les industries et élèvent le potentiel humain.",
    },
    about: {
      title: "À Propos de Nous",
      subtitle: "L'Innovation Rencontre la Précision",
      description:
        "Aether Industries a été fondée le 27 décembre 2005 en tant qu'entreprise qui fabriquait des machines d'emballage d'eau. Au cours du processus de développement des modèles les plus avancés, l'adhésion de nos premiers partenaires nous a donné la possibilité de planifier les premiers modèles de machines d'emballage personnalisées pour les clients qui pourraient avoir besoin d'une capacité supérieure à celle de nos modèles produits en masse. À partir d'un certain point, nous avons commencé à automatiser notre ligne d'assemblage avec des machines développées par nous-mêmes jusqu'à ce que nous soyons en mesure de commercialiser ces machines à des prix plus abordables que ceux de la concurrence.",
      partners: "Nos Partenaires",
    },
    products: {
      title: "Gammes de Produits",
      subtitle: "Solutions d'Automatisation Complètes",
      lines: {
        x: { name: "Ligne X", type: "Systèmes d'Emballage" },
        r: { name: "Ligne R", type: "Solutions de Soudage" },
        a: { name: "Ligne A", type: "Bras Robotiques" },
        s: { name: "Ligne S", type: "Systèmes de Contrôle" },
        p: { name: "Ligne P", type: "Périphériques" },
        c: { name: "Ligne C", type: "CNC – Découpe" },
        t: { name: "Ligne T", type: "CNC – Tournage" },
        f: { name: "Ligne F", type: "CNC – Fraisage" },
        m: { name: "Ligne M", type: "CNC – Usinage" },
      },
    },
    contact: {
      title: "Contactez-Nous",
      subtitle: "Entrer en Contact",
      social: "Suivez-Nous",
      form: {
        name: "Nom",
        email: "Email",
        message: "Message",
        send: "Envoyer le Message",
        sending: "Envoi en cours...",
        success: "Message envoyé avec succès!",
        error: "Veuillez remplir tous les champs",
      },
    },
  },
  pt: {
    hero: {
      welcome: "Bem-vindo à Aether Industries",
      slogan: "Um futuro mais limpo começa com cada gota",
      motto: "Excelência | Eficiência | Potência",
    },
    nav: {
      home: "Início",
      about: "Sobre",
      products: "Produtos",
      contact: "Contato",
    },
    home: {
      title: "Bem-vindo",
      description:
        "Na Aether Industries, estamos sendo pioneiros no futuro da tecnologia de automação com soluções de ponta que transformam indústrias e elevam o potencial humano.",
    },
    about: {
      title: "Sobre Nós",
      subtitle: "A Inovação Encontra a Precisão",
      description:
        "A Aether Industries foi fundada em 27 de dezembro de 2005 como uma empresa que fabricava máquinas de embalagem de água. Durante o processo de desenvolvimento dos modelos mais avançados, a adesão de nossos primeiros parceiros nos deu a possibilidade de planejar os primeiros modelos de máquinas de embalagem personalizadas para clientes que pudessem precisar de uma capacidade superior à de nossos modelos produzidos em massa. A partir de certo ponto, começamos a automatizar nossa linha de montagem com maquinário desenvolvido por nós até conseguirmos comercializar esse maquinário a preços mais acessíveis do que os da concorrência.",
      partners: "Nossos Parceiros",
    },
    products: {
      title: "Linhas de Produtos",
      subtitle: "Soluções Abrangentes de Automação",
      lines: {
        x: { name: "Linha X", type: "Sistemas de Embalagem" },
        r: { name: "Linha R", type: "Soluções de Soldagem" },
        a: { name: "Linha A", type: "Braços Robóticos" },
        s: { name: "Linha S", type: "Sistemas de Controle" },
        p: { name: "Linha P", type: "Periféricos" },
        c: { name: "Linha C", type: "CNC – Corte" },
        t: { name: "Linha T", type: "CNC – Torneamento" },
        f: { name: "Linha F", type: "CNC – Fresagem" },
        m: { name: "Linha M", type: "CNC – Usinagem" },
      },
    },
    contact: {
      title: "Contate-Nos",
      subtitle: "Entre em Contato",
      social: "Siga-Nos",
      form: {
        name: "Nome",
        email: "Email",
        message: "Mensagem",
        send: "Enviar Mensagem",
        sending: "Enviando...",
        success: "Mensagem enviada com sucesso!",
        error: "Por favor, preencha todos os campos",
      },
    },
  },
  de: {
    hero: {
      welcome: "Willkommen bei Aether Industries",
      slogan: "Eine sauberere Zukunft beginnt mit jedem Tropfen",
      motto: "Exzellenz | Effizienz | Kraft",
    },
    nav: {
      home: "Startseite",
      about: "Über uns",
      products: "Produkte",
      contact: "Kontakt",
    },
    home: {
      title: "Willkommen",
      description:
        "Bei Aether Industries sind wir Pioniere der Zukunft der Automatisierungstechnologie mit modernsten Lösungen, die Industrien transformieren und menschliches Potenzial erhöhen.",
    },
    about: {
      title: "Über Uns",
      subtitle: "Innovation Trifft Präzision",
      description:
        "Aether Industries wurde am 27. Dezember 2005 als Unternehmen gegründet, das Wasserverpackungsmaschinen herstellte. Während des Entwicklungsprozesses der fortschrittlichsten Modelle gab uns der Beitritt unserer ersten Partner die Möglichkeit, die ersten Modelle kundenspezifischer Verpackungsmaschinen für Kunden zu planen, die möglicherweise eine höhere Kapazität als unsere in Massenproduktion hergestellten Modelle benötigen. Ab einem bestimmten Punkt begannen wir, unsere Montagelinie mit von uns entwickelten Maschinen zu automatisieren, bis wir in der Lage waren, diese Maschinen zu günstigeren Preisen als die Konkurrenz zu vermarkten.",
      partners: "Unsere Partner",
    },
    products: {
      title: "Produktlinien",
      subtitle: "Umfassende Automatisierungslösungen",
      lines: {
        x: { name: "Linie X", type: "Verpackungssysteme" },
        r: { name: "Linie R", type: "Schweißlösungen" },
        a: { name: "Linie A", type: "Roboterarme" },
        s: { name: "Linie S", type: "Steuerungssysteme" },
        p: { name: "Linie P", type: "Peripheriegeräte" },
        c: { name: "Linie C", type: "CNC – Schneiden" },
        t: { name: "Linie T", type: "CNC – Drehen" },
        f: { name: "Linie F", type: "CNC – Fräsen" },
        m: { name: "Linie M", type: "CNC – Bearbeitung" },
      },
    },
    contact: {
      title: "Kontaktieren Sie Uns",
      subtitle: "In Kontakt Treten",
      social: "Folgen Sie Uns",
      form: {
        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
        send: "Nachricht Senden",
        sending: "Wird gesendet...",
        success: "Nachricht erfolgreich gesendet!",
        error: "Bitte füllen Sie alle Felder aus",
      },
    },
  },
  it: {
    hero: {
      welcome: "Benvenuto in Aether Industries",
      slogan: "Un futuro più pulito inizia con ogni goccia",
      motto: "Eccellenza | Efficienza | Potenza",
    },
    nav: {
      home: "Home",
      about: "Chi Siamo",
      products: "Prodotti",
      contact: "Contatti",
    },
    home: {
      title: "Benvenuto",
      description:
        "In Aether Industries, stiamo aprendo la strada al futuro della tecnologia di automazione con soluzioni all'avanguardia che trasformano le industrie ed elevano il potenziale umano.",
    },
    about: {
      title: "Chi Siamo",
      subtitle: "L'Innovazione Incontra la Precisione",
      description:
        "Aether Industries è stata fondata il 27 dicembre 2005 come azienda che produceva macchine per l'imballaggio dell'acqua. Durante il processo di sviluppo dei modelli più avanzati, l'adesione dei nostri primi partner ci ha dato la possibilità di pianificare i primi modelli di macchine per l'imballaggio personalizzate per i clienti che potrebbero aver bisogno di una capacità superiore a quella dei nostri modelli prodotti in serie. Da un certo punto, abbiamo iniziato ad automatizzare la nostra linea di assemblaggio con macchinari sviluppati da noi fino a poter commercializzare tali macchinari a prezzi più accessibili rispetto alla concorrenza.",
      partners: "I Nostri Partner",
    },
    products: {
      title: "Linee di Prodotti",
      subtitle: "Soluzioni di Automazione Complete",
      lines: {
        x: { name: "Linea X", type: "Sistemi di Confezionamento" },
        r: { name: "Linea R", type: "Soluzioni di Saldatura" },
        a: { name: "Linea A", type: "Bracci Robotici" },
        s: { name: "Linea S", type: "Sistemi di Controllo" },
        p: { name: "Linea P", type: "Periferiche" },
        c: { name: "Linea C", type: "CNC – Taglio" },
        t: { name: "Linea T", type: "CNC – Tornitura" },
        f: { name: "Linea F", type: "CNC – Fresatura" },
        m: { name: "Linea M", type: "CNC – Lavorazione" },
      },
    },
    contact: {
      title: "Contattaci",
      subtitle: "Mettiti in Contatto",
      social: "Seguici",
      form: {
        name: "Nome",
        email: "Email",
        message: "Messaggio",
        send: "Invia Messaggio",
        sending: "Invio in corso...",
        success: "Messaggio inviato con successo!",
        error: "Si prega di compilare tutti i campi",
      },
    },
  },
  ja: {
    hero: {
      welcome: "Aether Industriesへようこそ",
      slogan: "より清潔な未来は一滴から始まる",
      motto: "卓越性 | 効率性 | パワー",
    },
    nav: {
      home: "ホーム",
      about: "会社概要",
      products: "製品",
      contact: "お問い合わせ",
    },
    home: {
      title: "ようこそ",
      description:
        "Aether Industriesでは、産業を変革し人間の可能性を高める最先端のソリューションで、自動化技術の未来を切り開いています。",
    },
    about: {
      title: "会社概要",
      subtitle: "革新と精密の融合",
      description:
        "Aether Industriesは2005年12月27日に水包装機を製造する会社として設立されました。最も高度なモデルの開発過程で、最初のパートナーの追加により、当社の大量生産モデルよりも優れた容量を必要とする可能性のあるクライアント向けにカスタマイズされた包装機の最初のモデルを計画する可能性が得られました。ある時点から、私たちは自社で開発した機械で組立ラインを自動化し始め、競合他社よりも手頃な価格でその機械を商品化できるようになりました。",
      partners: "パートナー企業",
    },
    products: {
      title: "製品ライン",
      subtitle: "包括的な自動化ソリューション",
      lines: {
        x: { name: "ラインX", type: "包装システム" },
        r: { name: "ラインR", type: "溶接ソリューション" },
        a: { name: "ラインA", type: "ロボットアーム" },
        s: { name: "ラインS", type: "制御システム" },
        p: { name: "ラインP", type: "周辺機器" },
        c: { name: "ラインC", type: "CNC – 切断" },
        t: { name: "ラインT", type: "CNC – 旋盤" },
        f: { name: "ラインF", type: "CNC – フライス盤" },
        m: { name: "ラインM", type: "CNC – 機械加工" },
      },
    },
    contact: {
      title: "お問い合わせ",
      subtitle: "ご連絡ください",
      social: "フォローする",
      form: {
        name: "お名前",
        email: "メールアドレス",
        message: "メッセージ",
        send: "メッセージを送信",
        sending: "送信中...",
        success: "メッセージが正常に送信されました！",
        error: "すべてのフィールドに入力してください",
      },
    },
  },
  ko: {
    hero: {
      welcome: "Aether Industries에 오신 것을 환영합니다",
      slogan: "더 깨끗한 미래는 한 방울에서 시작됩니다",
      motto: "우수성 | 효율성 | 파워",
    },
    nav: {
      home: "홈",
      about: "회사 소개",
      products: "제품",
      contact: "문의하기",
    },
    home: {
      title: "환영합니다",
      description:
        "Aether Industries에서 우리는 산업을 변화시키고 인간의 잠재력을 높이는 최첨단 솔루션으로 자동화 기술의 미래를 개척하고 있습니다.",
    },
    about: {
      title: "회사 소개",
      subtitle: "혁신과 정밀의 만남",
      description:
        "Aether Industries는 2005년 12월 27일에 물 포장 기계를 제조하는 회사로 설립되었습니다. 가장 진보된 모델의 개발 과정에서 첫 번째 파트너의 추가로 대량 생산 모델보다 더 큰 용량이 필요할 수 있는 고객을 위한 맞춤형 포장 기계의 첫 번째 모델을 계획할 수 있는 가능성을 얻었습니다. 어느 시점부터 우리는 자체 개발한 기계로 조립 라인을 자동화하기 시작했고, 경쟁사보다 저렴한 가격으로 해당 기계를 상용화할 수 있게 되었습니다.",
      partners: "파트너사",
    },
    products: {
      title: "제품 라인",
      subtitle: "포괄적인 자동화 솔루션",
      lines: {
        x: { name: "라인 X", type: "포장 시스템" },
        r: { name: "라인 R", type: "용접 솔루션" },
        a: { name: "라인 A", type: "로봇 팔" },
        s: { name: "라인 S", type: "제어 시스템" },
        p: { name: "라인 P", type: "주변기기" },
        c: { name: "라인 C", type: "CNC – 절단" },
        t: { name: "라인 T", type: "CNC – 선반" },
        f: { name: "라인 F", type: "CNC – 밀링" },
        m: { name: "라인 M", type: "CNC – 가공" },
      },
    },
    contact: {
      title: "문의하기",
      subtitle: "연락 주세요",
      social: "팔로우하기",
      form: {
        name: "이름",
        email: "이메일",
        message: "메시지",
        send: "메시지 보내기",
        sending: "전송 중...",
        success: "메시지가 성공적으로 전송되었습니다!",
        error: "모든 필드를 입력해주세요",
      },
    },
  },
  no: {
    hero: {
      welcome: "Velkommen til Aether Industries",
      slogan: "En renere fremtid starter med hver dråpe",
      motto: "Fortreffelighet | Effektivitet | Kraft",
    },
    nav: {
      home: "Hjem",
      about: "Om oss",
      products: "Produkter",
      contact: "Kontakt oss",
    },
    home: {
      title: "Velkommen",
      description:
        "Hos Aether Industries er vi banebrytende for fremtiden innen automatiseringsteknologi med banebrytende løsninger som transformerer industrier og hever menneskelig potensial.",
    },
    about: {
      title: "Om Oss",
      subtitle: "Innovasjon Møter Presisjon",
      description:
        "Aether Industries ble grunnlagt 27. desember 2005 som et selskap som produserte vannpakkeringsmaskiner. Under utviklingsprosessen av de mest avanserte modellene ga tilslutningen av våre første partnere oss muligheten til å planlegge de første modellene av tilpassede pakkeringsmaskiner for kunder som kunne trenge en større kapasitet enn våre masseproduserte modeller. Fra et visst punkt begynte vi å automatisere vår monteringslinje med maskiner utviklet av oss selv til vi var i stand til å kommersialisere disse maskinene til mer rimelige priser enn konkurrentene.",
      partners: "Våre Partnere",
    },
    products: {
      title: "Produktlinjer",
      subtitle: "Omfattende Automatiseringsløsninger",
      lines: {
        x: { name: "Linje X", type: "Emballasjesystemer" },
        r: { name: "Linje R", type: "Sveiseløsninger" },
        a: { name: "Linje A", type: "Robotarmer" },
        s: { name: "Linje S", type: "Kontrollsystemer" },
        p: { name: "Linje P", type: "Periferiutstyr" },
        c: { name: "Linje C", type: "CNC – Kutting" },
        t: { name: "Linje T", type: "CNC – Dreining" },
        f: { name: "Linje F", type: "CNC – Fresing" },
        m: { name: "Linje M", type: "CNC – Maskinering" },
      },
    },
    contact: {
      title: "Kontakt Oss",
      subtitle: "Ta Kontakt",
      social: "Følg Oss",
      form: {
        name: "Navn",
        email: "E-post",
        message: "Melding",
        send: "Send Melding",
        sending: "Sender...",
        success: "Melding sendt vellykket!",
        error: "Vennligst fyll ut alle feltene",
      },
    },
  },
  "de-ch": {
    hero: {
      welcome: "Willkomme bi Aether Industries",
      slogan: "E saubereri Zuekunft fangt mit jedem Tröpfli aa",
      motto: "Uszeichnig | Effiziänz | Chraft",
    },
    nav: {
      home: "Heimet",
      about: "Über üs",
      products: "Produkt",
      contact: "Kontakt",
    },
    home: {
      title: "Willkomme",
      description:
        "Bi Aether Industries sind mir Pionier vo de Zuekunft vo de Automatisierigstechnologii mit modernste Lösige, wo Industrie transformiere und s menschliche Potenzial erhöhe.",
    },
    about: {
      title: "Über Üs",
      subtitle: "Innovation Trifft Präzision",
      description:
        "Aether Industries isch am 27. Dezämber 2005 als Firma gründet worde, wo Wasserverpackigsmaschine hergestellt het. Während em Entwickligsprozäss vo de fortschrittlichste Modell het üs de Biitritt vo üsne erste Partner d'Möglichkeit gäh, die erschte Modell vo kundespaziifische Verpackigsmaschine z'plane für Kunde, wo möglicherwiis e höheri Kapazität bruche als üsi Masseproduktionsmodell. Ab eme gwüsse Punkt hei mir aagfange, üsi Montagelinie mit vo üs entwicklete Maschine z'automatisiere, bis mir i de Lag gsi sind, die Maschine z'günstigere Priise als d'Konkurrenz z'vermarkte.",
      partners: "Üsi Partner",
    },
    products: {
      title: "Produktlinie",
      subtitle: "Umfassendi Automatisierigslösige",
      lines: {
        x: { name: "Linie X", type: "Verpackigssystem" },
        r: { name: "Linie R", type: "Schweisslösige" },
        a: { name: "Linie A", type: "Roboterarme" },
        s: { name: "Linie S", type: "Stüürigssystem" },
        p: { name: "Linie P", type: "Peripheriegerät" },
        c: { name: "Linie C", type: "CNC – Schnide" },
        t: { name: "Linie T", type: "CNC – Dräie" },
        f: { name: "Linie F", type: "CNC – Fräse" },
        m: { name: "Linie M", type: "CNC – Bearbeitig" },
      },
    },
    contact: {
      title: "Kontaktiere Üs",
      subtitle: "In Kontakt Träte",
      social: "Folge Üs",
      form: {
        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
        send: "Nachricht Schicke",
        sending: "Wird gschickt...",
        success: "Nachricht erfolgrich gschickt!",
        error: "Bitte fülle alli Felder uus",
      },
    },
  },
};
