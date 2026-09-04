export type Language = 'en' | 'nl';

export interface TranslationDictionary {
  // Navigation & Header
  nav: {
    home: string;
    whyUs: string;
    howItWorks: string;
    suppliers: string;
    aboutUs: string;
    startEvent: string;
    signIn: string;
    dashboard: string;
    language: string;
    english: string;
    dutch: string;
  };

  // Hero Section
  hero: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    subtext: string;
    subtextHighlight: string;
    subtextEnd: string;
    verifiedSuppliers: string;
    realtimeAvailability: string;
    combinedContract: string;
    ratingText: string;
    wabiSabiBadge: string;
    curatedEvents: string;
  };

  // Search Widget
  search: {
    eventTypeLabel: string;
    selectEventType: string;
    dateLabel: string;
    datePlaceholder: string;
    locationLabel: string;
    locationPlaceholder: string;
    guestsLabel: string;
    selectGuests: string;
    startBtn: string;
    eventTypes: {
      wedding: { label: string; subtitle: string };
      birthday: { label: string; subtitle: string };
      corporate: { label: string; subtitle: string };
      anniversary: { label: string; subtitle: string };
      babyShower: { label: string; subtitle: string };
      privateDinner: { label: string; subtitle: string };
    };
    guestOptions: {
      tier1: { label: string; subtitle: string };
      tier2: { label: string; subtitle: string };
      tier3: { label: string; subtitle: string };
      tier4: { label: string; subtitle: string };
      tier5: { label: string; subtitle: string };
    };
  };

  // Value Propositions
  valueProps: {
    tag: string;
    titlePart1: string;
    titlePart2: string;
    subtext: string;
    exploreBenefits: string;
    items: {
      singleRequest: { tag: string; title: string; description: string };
      verifiedPartners: { tag: string; title: string; description: string };
      concierge: { tag: string; title: string; description: string };
      instantQuotes: { tag: string; title: string; description: string };
      liveCalendar: { tag: string; title: string; description: string };
    };
    // Comparison Table (Why Us Page)
    comparison: {
      tag: string;
      title: string;
      traditionalTitle: string;
      traditionalPoints: string[];
      leemeventsTitle: string;
      leemeventsPoints: string[];
      ctaBtn: string;
    };
  };

  // How It Works
  howItWorks: {
    tag: string;
    titlePart1: string;
    titlePart2: string;
    subtext: string;
    readyPrompt: string;
    startMyEvent: string;
    steps: {
      step1: { title: string; description: string };
      step2: { title: string; description: string };
      step3: { title: string; description: string };
      step4: { title: string; description: string };
      step5: { title: string; description: string };
      step6: { title: string; description: string };
      step7: { title: string; description: string };
    };
    faq: {
      tag: string;
      title: string;
      items: { q: string; a: string }[];
      ctaBtn: string;
    };
  };

  // Categories & Supplier Directory
  categories: {
    tag: string;
    titlePart1: string;
    titlePart2: string;
    subtext: string;
    countBadge: string;
    list: {
      venue: { label: string; count: string; tag: string };
      catering: { label: string; count: string; tag: string };
      photography: { label: string; count: string; tag: string };
      videography: { label: string; count: string; tag: string };
      decor: { label: string; count: string; tag: string };
      dress: { label: string; count: string; tag: string };
      hair_makeup: { label: string; count: string; tag: string };
      planner: { label: string; count: string; tag: string };
      nanny: { label: string; count: string; tag: string };
      rentals: { label: string; count: string; tag: string };
      cake: { label: string; count: string; tag: string };
      favors: { label: string; count: string; tag: string };
      photoshoot: { label: string; count: string; tag: string };
    };
    vetting: {
      tag: string;
      title: string;
      description: string;
      point1Title: string;
      point1Desc: string;
      point2Title: string;
      point2Desc: string;
      point3Title: string;
      point3Desc: string;
      ctaBtn: string;
    };
  };

  // About Section & Page
  about: {
    tag: string;
    titlePart1: string;
    titlePart2: string;
    p1: string;
    p2: string;
    highlight: string;
    bullet1Title: string;
    bullet1Desc: string;
    bullet2Title: string;
    bullet2Desc: string;
    bullet3Title: string;
    bullet3Desc: string;
    ctaBtn: string;
    wabiSabiTitle: string;
    wabiSabiDesc: string;
    // About Page Extras
    principlesTag: string;
    principlesTitle: string;
    principles: {
      warmthTitle: string;
      warmthDesc: string;
      excellenceTitle: string;
      excellenceDesc: string;
      agreementTitle: string;
      agreementDesc: string;
      conciergeTitle: string;
      conciergeDesc: string;
    };
    pageHeroTag: string;
    pageHeroTitlePart1: string;
    pageHeroTitlePart2: string;
    pageHeroSubtext: string;
    planWithUs: string;
  };

  // Testimonials
  testimonials: {
    tag: string;
    title: string;
    subtext: string;
    items: {
      name: string;
      event: string;
      location: string;
      quote: string;
      suppliersBooked: string;
    }[];
  };

  // Supplier Banner
  supplierBanner: {
    tag: string;
    titlePart1: string;
    titlePart2: string;
    subtext: string;
    perk1: string;
    perk2: string;
    perk3: string;
    ctaBtn: string;
  };

  // Final CTA
  finalCTA: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    subtext: string;
    button: string;
    guarantee: string;
  };

  // Footer
  footer: {
    brandDesc: string;
    newsletterTitle: string;
    emailPlaceholder: string;
    subscribeBtn: string;
    subscribedMsg: string;
    popularCategoriesTitle: string;
    popularCategories: string[];
    companyTitle: string;
    companyLinks: {
      whyUs: string;
      howItWorks: string;
      about: string;
      directory: string;
      becomePartner: string;
    };
    contactTitle: string;
    address: string;
    allRightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
    cookiePreferences: string;
  };

  // Auth & Roles (Login / Signup)
  auth: {
    backToHome: string;
    brandTagline: string;
    brandSubtext: string;
    wabiSabiMarketplace: string;
    signInTab: string;
    createAccountTab: string;
    welcomeBack: string;
    startYourEvent: string;
    signInSubtext: string;
    signUpSubtext: string;
    roleQuestion: string;
    hostRoleTitle: string;
    hostRoleDesc: string;
    supplierRoleTitle: string;
    supplierRoleDesc: string;
    googleContinue: string;
    orContinueEmail: string;
    orSignUpEmail: string;
    fullNameLabel: string;
    fullNamePlaceholderHost: string;
    fullNamePlaceholderSupplier: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    rememberMe: string;
    forgotPassword: string;
    continueToHostOnboarding: string;
    continueToSupplierOnboarding: string;
    signInAsHost: string;
    signInAsSupplier: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    termsNoticePart1: string;
    termsLink: string;
    termsNoticePart2: string;
    privacyLink: string;
  };

  // Combined Request Modal
  modal: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    stepIndicator: string;
    selectCategoriesHeader: string;
    selectedCount: string;
    eventDetailsHeader: string;
    eventType: string;
    eventDate: string;
    guestCount: string;
    location: string;
    estimatedBudget: string;
    contactDetailsHeader: string;
    fullName: string;
    email: string;
    phone: string;
    specialNotes: string;
    specialNotesPlaceholder: string;
    nextStep: string;
    backStep: string;
    submitCombinedRequest: string;
    successTitle: string;
    successMessage: string;
    successSummary: string;
    closeBtn: string;
  };

  // Dashboard Layouts & Pages
  dashboard: {
    hostSuite: string;
    supplierHub: string;
    hostPortal: string;
    browseSuppliers: string;
    selectionCart: string;
    signOut: string;
    verifiedSupplier: string;
    pendingApproval: string;
    activeInDirectory: string;
    reviewInProgress: string;
    liveInDirectory: string;
    verifiedVendor: string;
    eventHost: string;
    hostNav: {
      overview: string;
      myEvents: string;
      browse: string;
      cart: string;
      requests: string;
      messages: string;
      team: string;
      documents: string;
      settings: string;
    };
    supplierNav: {
      overview: string;
      profile: string;
      portfolio: string;
      services: string;
      calendar: string;
      requests: string;
      customers: string;
      messages: string;
      reviews: string;
      earnings: string;
      subscription: string;
    };
    hostHome: {
      suiteBadge: string;
      welcome: string;
      headerDesc: string;
      browseBtn: string;
      viewCart: string;
      eventTitle: string;
      eventType: string;
      daysLeft: string;
      date: string;
      location: string;
      guests: string;
      supplierConfirmed: string;
      budgetCommitted: string;
      activeRequests: string;
      viewAll: string;
      actionRequired: string;
      contractSummary: string;
      downloadContract: string;
      accepted: string;
      contractSent: string;
      pending: string;
    };
    supplierHome: {
      dashboardBadge: string;
      verifiedPartner: string;
      updateAvailability: string;
      manageServices: string;
      newRequests: string;
      requiresResponse: string;
      confirmedBookings: string;
      synced: string;
      estRevenue: string;
      revenueSub: string;
      overallRating: string;
      reviewsCount: string;
      pendingQueue: string;
      acceptBtn: string;
      declineBtn: string;
      acceptedStatus: string;
      declinedStatus: string;
      guestCountLabel: string;
      serviceLabel: string;
    };
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      whyUs: 'Why LEEMEVENTS',
      howItWorks: 'How It Works',
      suppliers: 'Suppliers',
      aboutUs: 'About Us',
      startEvent: 'Start my event',
      signIn: 'Sign In',
      dashboard: 'Dashboard',
      language: 'Language',
      english: 'English',
      dutch: 'Nederlands',
    },
    hero: {
      badge: 'The Two-Sided Event Marketplace Platform',
      titlePart1: 'Every event,',
      titlePart2: 'planned in one place.',
      subtext: 'Discover, compare, and book all your event suppliers — venue, catering, photography, videography, decor, hair & makeup, DJ, and cake — on one platform. Submit',
      subtextHighlight: '1 combined request',
      subtextEnd: 'and manage everything together.',
      verifiedSuppliers: 'Verified suppliers',
      realtimeAvailability: 'Real-time availability',
      combinedContract: 'Combined planning & contract',
      ratingText: '(480+ events)',
      wabiSabiBadge: '• WABI SABI • EST 2026 •',
      curatedEvents: 'Curated Earth & Stone Events',
    },
    search: {
      eventTypeLabel: 'Event Type',
      selectEventType: 'Select Event Type',
      dateLabel: 'Event Date',
      datePlaceholder: 'mm/dd/yyyy',
      locationLabel: 'Location / City',
      locationPlaceholder: 'e.g. Amsterdam, London...',
      guestsLabel: 'Guest Count',
      selectGuests: 'Select Guests',
      startBtn: 'Start',
      eventTypes: {
        wedding: { label: 'Wedding', subtitle: 'Ceremony & Reception' },
        birthday: { label: 'Birthday Party', subtitle: 'Milestone & Parties' },
        corporate: { label: 'Corporate Event', subtitle: 'Conferences & Galas' },
        anniversary: { label: 'Anniversary Gala', subtitle: 'Milestone Celebrations' },
        babyShower: { label: 'Baby Shower & Reveal', subtitle: 'Showers & Family' },
        privateDinner: { label: 'Private Dinner', subtitle: 'Fine Dining & Soirées' },
      },
      guestOptions: {
        tier1: { label: '10 - 30 guests', subtitle: 'Intimate Gathering' },
        tier2: { label: '30 - 50 guests', subtitle: 'Medium Party' },
        tier3: { label: '50 - 100 guests', subtitle: 'Classic Celebration' },
        tier4: { label: '100 - 200 guests', subtitle: 'Large Event' },
        tier5: { label: '200+ guests', subtitle: 'Grand Gala' },
      },
    },
    valueProps: {
      tag: 'Why choose LEEMEVENTS',
      titlePart1: 'Event planning,',
      titlePart2: 'without the chaos',
      subtext: 'Planning a wedding or celebration should be magical, not stressful. We curate the best suppliers into one harmonious stone & earth ecosystem.',
      exploreBenefits: 'Explore benefits →',
      items: {
        singleRequest: {
          tag: 'Save Time',
          title: 'Single Combined Request',
          description: 'No more emailing 15 individual vendors separately. Pick your date and preferences, and submit 1 grouped inquiry.',
        },
        verifiedPartners: {
          tag: 'Quality Stamp',
          title: 'Verified & Reviewed Partners',
          description: 'Every venue, photographer, caterer, and DJ is rigorously vetted for quality, reliability, and authentic client reviews.',
        },
        concierge: {
          tag: 'Dedicated Support',
          title: 'Personal Event Concierge',
          description: 'Our dedicated event matchmakers supervise your schedule and ensure all your selected suppliers work together seamlessly.',
        },
        instantQuotes: {
          tag: 'Clarity',
          title: 'Instant Coordinated Quotes',
          description: 'All your selected vendors receive your event brief simultaneously, giving you 1 clear consolidated proposal.',
        },
        liveCalendar: {
          tag: 'Live Sync',
          title: 'Up-To-Date Live Calendars',
          description: 'Prevent booking conflicts. Our system synchronizes supplier calendars live so you see available dates instantly.',
        },
      },
      comparison: {
        tag: 'The Difference',
        title: 'Traditional Planning vs. The LEEMEVENTS Way',
        traditionalTitle: 'Traditional Event Planning',
        traditionalPoints: [
          'Emailing 15+ individual vendor websites separately',
          'Juggling disconnected contracts, invoices & payment schedules',
          'Uncertain supplier quality and unverified online reviews',
          'No central coordinator to align timelines between caterers, venue & DJ',
          'Constant back-and-forth calendar checking for date availability',
        ],
        leemeventsTitle: 'The LEEMEVENTS Solution',
        leemeventsPoints: [
          '1 single combined request for venue, catering, photo, DJ & decor',
          '1 consolidated proposal, 1 agreement, and 1 clear deposit payment',
          '100% vetted & verified luxury suppliers with real client ratings',
          'Dedicated event matchmaker supervising logistics and day-of execution',
          'Real-time live calendar synchronization across all selected partners',
        ],
        ctaBtn: 'Start Your Combined Request',
      },
    },
    howItWorks: {
      tag: 'In 7 Simple Steps',
      titlePart1: 'From initial idea',
      titlePart2: 'to a flawless event',
      subtext: 'LEEMEVENTS makes booking multiple suppliers as effortless as booking a luxury boutique stay.',
      readyPrompt: 'Ready to design your event?',
      startMyEvent: 'Start my event →',
      steps: {
        step1: {
          title: 'Select your event type',
          description: 'Choose your celebration — from a dream wedding to an intimate birthday dinner or corporate gala.',
        },
        step2: {
          title: 'Select suppliers & date',
          description: 'Pick desired categories (venue, catering, photography, DJ) and enter your preferred event date.',
        },
        step3: {
          title: 'Check availability',
          description: 'Our platform verifies real-time date availability across all your selected premium suppliers.',
        },
        step4: {
          title: 'Submit 1 combined request',
          description: 'Send one single combined inquiry with a click. No more juggling 10 separate email threads.',
        },
        step5: {
          title: 'Team & matchmaker takes over',
          description: 'Our event specialists coordinate timing, requirements, and logistics with every partner.',
        },
        step6: {
          title: '1 Contract & deposit',
          description: 'Receive 1 clear overall proposal, 1 straightforward agreement, and 1 secure deposit payment.',
        },
        step7: {
          title: 'Party time!',
          description: 'Relax and enjoy. All your suppliers arrive perfectly synchronized on your special day.',
        },
      },
      faq: {
        tag: 'Got Questions?',
        title: 'Frequently Asked Questions',
        items: [
          {
            q: 'How does a combined event request work?',
            a: 'Instead of contacting vendors individually, you select the supplier categories you need (e.g. Venue, Catering, Photography, DJ), pick your event date, and submit 1 form. Our platform broadcasts your request to matched available partners simultaneously.',
          },
          {
            q: 'Are the prices standard or customized?',
            a: 'You receive customized proposals tailored to your guest count, location, and date. Because vendors receive coordinated briefs, we often secure bundle packages and streamlined rates.',
          },
          {
            q: 'Can I add or remove suppliers after submitting?',
            a: 'Yes! Your dedicated LEEMEVENTS matchmaker works with you to refine your selections until your final proposal matches your vision 100%.',
          },
          {
            q: 'Is using LEEMEVENTS free for event organizers?',
            a: 'Submitting requests and receiving combined proposals is 100% free with no obligation to book. We handle all coordination at zero added markup.',
          },
        ],
        ctaBtn: 'Start My Event Now',
      },
    },
    categories: {
      tag: 'Explore Our Supplier Network',
      titlePart1: 'All event specialists',
      titlePart2: 'in one directory',
      subtext: 'From enchanting estate grounds to artisan patissiers and award-winning photographers. Add to your combined request with one click.',
      countBadge: '13 Categories • 800+ Verified Partners',
      list: {
        venue: { label: 'Venues & Locations', count: '140+ Unique Venues', tag: 'Popular' },
        catering: { label: 'Catering & Food Trucks', count: '95+ Culinary Partners', tag: 'Gourmet' },
        photography: { label: 'Photography', count: '110+ Photographers', tag: 'Featured' },
        videography: { label: 'Videography', count: '65+ Filmmakers', tag: 'Cinematic' },
        decor: { label: 'Decor & Floral Design', count: '85+ Stylists', tag: 'Trending' },
        dress: { label: 'Bridal & Suits', count: '45+ Boutiques', tag: 'Couture' },
        hair_makeup: { label: 'Hair & Makeup', count: '75+ Beauty Artists', tag: 'Beauty' },
        planner: { label: 'Event & Wedding Planners', count: '40+ Directors', tag: 'Full Service' },
        nanny: { label: 'Nanny & Kids Corner', count: '25+ Childcare Providers', tag: 'Carefree' },
        rentals: { label: 'Tables, Chairs & Rentals', count: '55+ Rental Companies', tag: 'Furniture' },
        cake: { label: 'Wedding Cake & Sweets', count: '60+ Patissiers', tag: 'Artisan' },
        favors: { label: 'Favors & Gifting', count: '50+ Artisans', tag: 'Keepsakes' },
        photoshoot: { label: 'Photoshoot Locations', count: '35+ Exclusive Spots', tag: 'Spotlight' },
      },
      vetting: {
        tag: 'Our Quality Promise',
        title: 'Rigorous Partner Verification Standard',
        description: 'Every vendor in our directory passes strict evaluation for licensing, liability insurance, portfolio quality, and verified client testimonials.',
        point1Title: '1. Vetted Portfolios',
        point1Desc: 'We review past event galleries, food hygiene ratings, and sound equipment standards.',
        point2Title: '2. Authentic Reviews',
        point2Desc: 'Reviews on LEEMEVENTS come exclusively from verified clients who completed bookings.',
        point3Title: '3. Calendar Sync',
        point3Desc: 'Suppliers maintain active live calendars so you never inquire about booked dates.',
        ctaBtn: 'Combine My Suppliers Now',
      },
    },
    about: {
      tag: 'About LEEMEVENTS',
      titlePart1: 'Rediscover the joy',
      titlePart2: 'of celebrating.',
      p1: 'LEEMEVENTS was born out of a simple realization: planning a milestone celebration was far too often overshadowed by managing dozens of separate email threads, fragmented price quotes, and misaligned vendor schedules.',
      p2: "We believe every event — from an intimate backyard anniversary to a breathtaking estate wedding — deserves calm, elegance, and inspiration. That is why we built the world's first",
      highlight: 'two-sided combined event marketplace platform.',
      bullet1Title: 'Single Point of Contact:',
      bullet1Desc: 'Seamless coordination across all your chosen partners without noise.',
      bullet2Title: 'Quality Guarantee:',
      bullet2Desc: 'Only verified suppliers with a proven track record of excellence.',
      bullet3Title: 'Transparent Terms:',
      bullet3Desc: '1 joint agreement and clear, predictable payments.',
      ctaBtn: 'Discover Our Story',
      wabiSabiTitle: 'Wabi Sabi Aesthetic',
      wabiSabiDesc: 'Timeless stone & earth tranquility',
      principlesTag: 'Our Core Principles',
      principlesTitle: 'Built on trust, transparency, & design',
      principles: {
        warmthTitle: 'Wabi-Sabi Warmth',
        warmthDesc: 'We believe in natural elegance, uncluttered communication, and mindful celebration styling.',
        excellenceTitle: 'Curated Excellence',
        excellenceDesc: "We don't accept every listing. Only verified artisans and proven event partners join our platform.",
        agreementTitle: '1 Consolidated Agreement',
        agreementDesc: 'No managing 10 contracts. We organize all your booked services under 1 transparent proposal.',
        conciergeTitle: 'Dedicated Concierge',
        conciergeDesc: 'Human event matchmakers supervise your schedule so every vendor arrives on time on your special day.',
      },
      pageHeroTag: 'Our Story & Philosophy',
      pageHeroTitlePart1: 'Calm, elegance, and',
      pageHeroTitlePart2: 'tranquility.',
      pageHeroSubtext: 'LEEMEVENTS was founded with a single mission: to return beauty and simplicity to milestone event planning.',
      planWithUs: 'Plan Your Event With Us',
    },
    testimonials: {
      tag: 'Real Host Experiences',
      title: 'Loved by couples & event planners',
      subtext: 'Read how host couples and event directors created unforgettable celebrations with our combined marketplace platform.',
      items: [
        {
          name: 'Sophie & Lucas van Dijk',
          event: 'Estate Wedding at Country Manor',
          location: 'Cotswolds / Oxford',
          quote: 'LEEMEVENTS’s combined request system was a lifesaver for our wedding. Within 24 hours, our dream venue, photographer, and caterer were perfectly synchronized. Zero stress, just 1 clear dashboard!',
          suppliersBooked: 'Venue, Photographer, Live Band & Catering',
        },
        {
          name: 'Charlotte Sterling',
          event: '30th Birthday Rooftop Celebration',
          location: 'Downtown Manhattan',
          quote: 'I wanted a chic dinner party with a mixologist and live DJ for 60 guests. With 1 request on LEEMEVENTS, everything was lined up seamlessly. My guests are still talking about it!',
          suppliersBooked: 'Rooftop Venue, Mixologist, DJ & Styling',
        },
        {
          name: 'Marcus Chen & TechVision Team',
          event: 'Annual Corporate Gala & Award Show',
          location: 'San Francisco',
          quote: 'Professional, transparent, and remarkably fast. As an event director, LEEMEVENTS saved me weeks of back-and-forth email tag. Centralized billing made our accounting completely painless.',
          suppliersBooked: 'Industrial Space, AV/Lighting, Catering & Staff',
        },
      ],
    },
    supplierBanner: {
      tag: 'For Event Suppliers & Venues',
      titlePart1: 'Are you an event supplier?',
      titlePart2: 'Get discovered & receive bundled bookings.',
      subtext: 'Join the fastest-growing two-sided event network. Receive high-intent leads from host planners actively matching your exact location and date.',
      perk1: 'Bundled quote inquiries',
      perk2: 'Smart calendar integration',
      perk3: '100% Verified hosts',
      ctaBtn: 'Become a Partner',
    },
    finalCTA: {
      badge: 'Ready for a Effortless Planning Experience?',
      titlePart1: 'Design your dream celebration',
      titlePart2: 'in one combined request.',
      subtext: 'Stop juggling individual quotes. Build your custom supplier stack in under 2 minutes and receive aligned proposals.',
      button: 'Start Planning Your Event',
      guarantee: '✓ 100% Free & No Obligation • No hidden fees',
    },
    footer: {
      brandDesc: 'The leading two-sided event marketplace platform. Discover, compare, and book all your event suppliers in one place with a single combined request.',
      newsletterTitle: 'Receive curated event inspiration',
      emailPlaceholder: 'Enter your email address',
      subscribeBtn: 'Subscribe',
      subscribedMsg: 'Thank you! You are now subscribed to our newsletter.',
      popularCategoriesTitle: 'Popular Categories',
      popularCategories: [
        'Wedding Venues & Mansions',
        'Gourmet Catering & Chefs',
        'Wedding Photographers',
        'Cinematic Videography',
        'Floral Design & Styling',
        'DJs & Live Music Bands',
      ],
      companyTitle: 'Platform & Company',
      companyLinks: {
        whyUs: 'Why LEEMEVENTS',
        howItWorks: 'How It Works',
        about: 'About Our Mission',
        directory: 'Supplier Directory',
        becomePartner: 'Become a Supplier Partner',
      },
      contactTitle: 'Contact & HQ',
      address: '5th Avenue, New York, NY 10001',
      allRightsReserved: 'All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePreferences: 'Cookie Preferences',
    },
    auth: {
      backToHome: 'Back to Home',
      brandTagline: 'Plan your celebration with calm.',
      brandSubtext: 'Join thousands of event hosts and curated luxury suppliers using LEEMEVENTS for combined request planning and unified contracts.',
      wabiSabiMarketplace: 'Wabi Sabi Marketplace',
      signInTab: 'Sign In',
      createAccountTab: 'Create Account',
      welcomeBack: 'Welcome Back',
      startYourEvent: 'Start Your Event',
      signInSubtext: 'Sign in to access your saved suppliers, events, or booking proposals.',
      signUpSubtext: 'What brings you to LEEMEVENTS? Choose your account role below.',
      roleQuestion: 'What brings you to LEEMEVENTS?',
      hostRoleTitle: 'Event Host',
      hostRoleDesc: 'Planning a celebration (wedding, birthday, corporate)',
      supplierRoleTitle: 'Supplier Partner',
      supplierRoleDesc: 'Venue, Chef, DJ, Photo, Stylist...',
      googleContinue: 'Continue with Google',
      orContinueEmail: 'Or continue with email',
      orSignUpEmail: 'Or sign up with email',
      fullNameLabel: 'Full Name / Business Name *',
      fullNamePlaceholderHost: 'Eleanor Vance',
      fullNamePlaceholderSupplier: 'Aura Floral & Styling',
      emailLabel: 'Email Address *',
      emailPlaceholder: 'eleanor@example.com',
      passwordLabel: 'Password *',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      continueToHostOnboarding: 'Continue to Host Onboarding',
      continueToSupplierOnboarding: 'Continue to Supplier Onboarding',
      signInAsHost: 'Sign In as Event Host',
      signInAsSupplier: 'Sign In as Supplier Partner',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      termsNoticePart1: 'By continuing, you agree to LEEMEVENTS’s',
      termsLink: 'Terms of Service',
      termsNoticePart2: 'and',
      privacyLink: 'Privacy Policy',
    },
    modal: {
      title: 'Combined Event Request',
      subtitle: 'Select multiple suppliers and receive one unified proposal',
      step1Title: 'Step 1: Select Suppliers',
      step1Desc: 'Choose the services you need for your celebration',
      step2Title: 'Step 2: Event Details',
      step2Desc: 'Tell us about your date, location, and guest count',
      step3Title: 'Step 3: Contact & Summary',
      step3Desc: 'Where should we send your combined proposal?',
      stepIndicator: 'Step',
      selectCategoriesHeader: 'Select Needed Supplier Categories',
      selectedCount: 'selected',
      eventDetailsHeader: 'Your Event Preferences',
      eventType: 'Event Type',
      eventDate: 'Event Date',
      guestCount: 'Expected Guests',
      location: 'Event Location / City',
      estimatedBudget: 'Estimated Total Budget',
      contactDetailsHeader: 'Your Contact Details',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      specialNotes: 'Special Requests or Vision Notes',
      specialNotesPlaceholder: 'Tell us about your theme, preferred music genres, dietary requirements...',
      nextStep: 'Continue to Next Step',
      backStep: 'Back',
      submitCombinedRequest: 'Submit Combined Event Request',
      successTitle: 'Request Sent Successfully!',
      successMessage: 'Your combined event brief has been dispatched to matched luxury suppliers.',
      successSummary: 'Our concierge team will coordinate with your selected partners and deliver 1 consolidated proposal within 24-48 hours.',
      closeBtn: 'Close & Return to Dashboard',
    },
    dashboard: {
      hostSuite: 'Host Suite',
      supplierHub: 'Supplier Hub',
      hostPortal: 'Host Portal',
      browseSuppliers: 'Browse Suppliers',
      selectionCart: 'Selection Cart',
      signOut: 'Sign Out',
      verifiedSupplier: 'Verified Supplier',
      pendingApproval: 'Pending Approval',
      activeInDirectory: 'Active in Directory',
      reviewInProgress: 'Review in Progress',
      liveInDirectory: 'Live in Directory',
      verifiedVendor: 'Verified Vendor',
      eventHost: 'Event Host',
      hostNav: {
        overview: 'Overview',
        myEvents: 'My Events',
        browse: 'Browse Suppliers',
        cart: 'My Selection / Cart',
        requests: 'Requests & Bookings',
        messages: 'Messages',
        team: 'Planning & Team',
        documents: 'Documents & Contracts',
        settings: 'Profile & Settings',
      },
      supplierNav: {
        overview: 'Overview',
        profile: 'Account & Profile',
        portfolio: 'Portfolio',
        services: 'Services & Pricing',
        calendar: 'Calendar & Availability',
        requests: 'Requests Queue',
        customers: 'My Customers',
        messages: 'Messages',
        reviews: 'Reviews',
        earnings: 'Earnings & Bookings',
        subscription: 'Subscription Plan',
      },
      hostHome: {
        suiteBadge: 'Autumn 2026 Celebration Suite',
        welcome: 'Welcome back, Eleanor',
        headerDesc: 'Track vendor contracts, monitor milestone schedules, and manage your unified celebration deposit.',
        browseBtn: 'Browse Suppliers',
        viewCart: 'View Cart (3 items)',
        eventTitle: "Eleanor & Liam's Country Estate Wedding",
        eventType: 'Country Estate Wedding',
        daysLeft: 'days remaining',
        date: 'Friday, September 18, 2026',
        location: 'Cotswolds, Oxfordshire, UK',
        guests: '120 Expected Guests',
        supplierConfirmed: 'Suppliers Booked',
        budgetCommitted: 'Committed Budget',
        activeRequests: 'Active Requests & Bookings',
        viewAll: 'View All',
        actionRequired: 'Milestones & Next Steps',
        contractSummary: 'Unified Agreement & Escrow Deposit',
        downloadContract: 'Download Contract PDF',
        accepted: 'Accepted',
        contractSent: 'Contract Sent',
        pending: 'Pending',
      },
      supplierHome: {
        dashboardBadge: 'Supplier Dashboard',
        verifiedPartner: 'Verified Partner',
        updateAvailability: 'Update Availability',
        manageServices: 'Manage Services',
        newRequests: 'New Requests',
        requiresResponse: 'Requires response within 24h',
        confirmedBookings: 'Confirmed Bookings',
        synced: '100% calendar synced',
        estRevenue: 'Est. Monthly Revenue',
        revenueSub: 'Sept 2026 pipeline',
        overallRating: 'Average Rating',
        reviewsCount: 'Based on 28 verified reviews',
        pendingQueue: 'Live Inquiries & Booking Requests',
        acceptBtn: 'Accept & Send Quote',
        declineBtn: 'Decline',
        acceptedStatus: 'Accepted & In Coordination',
        declinedStatus: 'Declined',
        guestCountLabel: 'guests',
        serviceLabel: 'Service',
      },
    },
  },

  nl: {
    nav: {
      home: 'Home',
      whyUs: 'Waarom LEEMEVENTS',
      howItWorks: 'Hoe het werkt',
      suppliers: 'Leveranciers',
      aboutUs: 'Over ons',
      startEvent: 'Start mijn evenement',
      signIn: 'Inloggen',
      dashboard: 'Dashboard',
      language: 'Taal',
      english: 'English',
      dutch: 'Nederlands',
    },
    hero: {
      badge: 'Het tweezijdige evenementenplatform',
      titlePart1: 'Elk evenement,',
      titlePart2: 'gepland op één plek.',
      subtext: 'Ontdek, vergelijk en boek al uw evenementleveranciers — locatie, catering, fotografie, videografie, decoratie, haar & make-up, DJ en taart — op één platform. Dien',
      subtextHighlight: '1 gecombineerde aanvraag',
      subtextEnd: 'in en beheer alles samen.',
      verifiedSuppliers: 'Geverifieerde leveranciers',
      realtimeAvailability: 'Real-time beschikbaarheid',
      combinedContract: 'Gecombineerde planning & contract',
      ratingText: '(480+ evenementen)',
      wabiSabiBadge: '• WABI SABI • EST 2026 •',
      curatedEvents: 'Exclusieve Earth & Stone Evenementen',
    },
    search: {
      eventTypeLabel: 'Type Evenement',
      selectEventType: 'Kies Type Evenement',
      dateLabel: 'Evenement Datum',
      datePlaceholder: 'dd/mm/jjjj',
      locationLabel: 'Locatie / Stad',
      locationPlaceholder: 'bijv. Amsterdam, Utrecht, Rotterdam...',
      guestsLabel: 'Aantal Gasten',
      selectGuests: 'Kies Aantal Gasten',
      startBtn: 'Starten',
      eventTypes: {
        wedding: { label: 'Bruiloft', subtitle: 'Ceremonie & Receptie' },
        birthday: { label: 'Verjaardagsfeest', subtitle: 'Mijlpalen & Feesten' },
        corporate: { label: 'Bedrijfsevenement', subtitle: 'Conferenties & Gala’s' },
        anniversary: { label: 'Jubileum Gala', subtitle: 'Mijlpaal Vieringen' },
        babyShower: { label: 'Babyshower & Gender Reveal', subtitle: 'Showers & Familie' },
        privateDinner: { label: 'Privé Diner', subtitle: 'Fine Dining & Soirées' },
      },
      guestOptions: {
        tier1: { label: '10 - 30 gasten', subtitle: 'Intiem Gezelschap' },
        tier2: { label: '30 - 50 gasten', subtitle: 'Middelgroot Feest' },
        tier3: { label: '50 - 100 gasten', subtitle: 'Klassieke Viering' },
        tier4: { label: '100 - 200 gasten', subtitle: 'Groot Evenement' },
        tier5: { label: '200+ gasten', subtitle: 'Groots Gala' },
      },
    },
    valueProps: {
      tag: 'Waarom kiezen voor LEEMEVENTS',
      titlePart1: 'Evenementen plannen,',
      titlePart2: 'zonder de chaos',
      subtext: 'Het organiseren van een bruiloft of viering hoort magisch te zijn, niet stressvol. Wij brengen de beste leveranciers samen in één harmonieus ecosysteem.',
      exploreBenefits: 'Ontdek de voordelen →',
      items: {
        singleRequest: {
          tag: 'Tijdsbesparing',
          title: 'Eén Gecombineerde Aanvraag',
          description: 'Niet meer naar 15 verschillende leveranciers mailen. Kies uw datum en wensen, en dien 1 gebundelde aanvraag in.',
        },
        verifiedPartners: {
          tag: 'Kwaliteitsgarantie',
          title: 'Geverifieerde & Beoordeelde Partners',
          description: 'Elke locatie, fotograaf, cateraar en DJ wordt grondig gecontroleerd op kwaliteit, betrouwbaarheid en echte klantbeoordelingen.',
        },
        concierge: {
          tag: 'Persoonlijke Begeleiding',
          title: 'Persoonlijke Evenementenconciërge',
          description: 'Onze toegewijde event matchmakers bewaken uw draaiboek en zorgen dat alle geselecteerde leveranciers vlekkeloos samenwerken.',
        },
        instantQuotes: {
          tag: 'Volledige Duidelijkheid',
          title: 'Directe Gecoördineerde Offertes',
          description: 'Al uw gekozen leveranciers ontvangen uw briefing tegelijkertijd, wat resulteert in 1 duidelijk, gebundeld voorstel.',
        },
        liveCalendar: {
          tag: 'Live Synchronisatie',
          title: 'Altijd Actuele Beschikbaarheid',
          description: 'Voorkom dubbele boekingen. Ons systeem synchroniseert leveranciersagenda’s live zodat u direct beschikbare data ziet.',
        },
      },
      comparison: {
        tag: 'Het Verschil',
        title: 'Traditioneel Plannen vs. De LEEMEVENTS Manier',
        traditionalTitle: 'Traditionele Evenementenplanning',
        traditionalPoints: [
          'Mailen naar 15+ individuele websites van leveranciers',
          'Goochelen met losse contracten, facturen en betalingstermijnen',
          'Onzekere kwaliteit van leveranciers en onbetrouwbare reviews',
          'Geen centrale coördinator om planning tussen cateraar, zaal en DJ af te stemmen',
          'Voortdurend heen-en-weer communiceren over datumbeschikbaarheid',
        ],
        leemeventsTitle: 'De LEEMEVENTS Oplossing',
        leemeventsPoints: [
          '1 enkele gecombineerde aanvraag voor locatie, catering, foto, DJ & styling',
          '1 overzichtelijk voorstel, 1 overeenkomst en 1 duidelijke aanbetaling',
          '100% gescreende luxe leveranciers met authentieke klantbeoordelingen',
          'Toegewijde event matchmaker die logistiek en uitvoering begeleidt',
          'Real-time live kalendersynchronisatie tussen alle geselecteerde partners',
        ],
        ctaBtn: 'Start Uw Gecombineerde Aanvraag',
      },
    },
    howItWorks: {
      tag: 'In 7 Eenvoudige Stappen',
      titlePart1: 'Van eerste idee',
      titlePart2: 'tot een vlekkeloos evenement',
      subtext: 'LEEMEVENTS maakt het boeken van meerdere leveranciers net zo moeiteloos als het reserveren van een luxe boetiekhotel.',
      readyPrompt: 'Klaar om uw evenement te ontwerpen?',
      startMyEvent: 'Start mijn evenement →',
      steps: {
        step1: {
          title: 'Kies uw type evenement',
          description: 'Kies uw viering — van een droomhuwelijk tot een intiem verjaardagsdiner of zakelijk gala.',
        },
        step2: {
          title: 'Selecteer leveranciers & datum',
          description: 'Kies de gewenste categorieën (locatie, catering, fotografie, DJ) en vul uw voorkeursdatum in.',
        },
        step3: {
          title: 'Controleer beschikbaarheid',
          description: 'Ons platform controleert real-time de beschikbaarheid bij al uw gekozen premium leveranciers.',
        },
        step4: {
          title: 'Dien 1 gecombineerde aanvraag in',
          description: 'Verstuur één enkele aanvraag met één klik. Geen tientallen losse e-mailthreads meer.',
        },
        step5: {
          title: 'Team & matchmaker nemen over',
          description: 'Onze evenementspecialisten stemmen timing, wensen en logistiek af met elke partner.',
        },
        step6: {
          title: '1 Contract & aanbetaling',
          description: 'Ontvang 1 helder overkoepelend voorstel, 1 duidelijke overeenkomst en 1 veilige betaling.',
        },
        step7: {
          title: 'Tijd om te vieren!',
          description: 'Ontspan en geniet. Al uw leveranciers arriveren perfect gesynchroniseerd op uw grote dag.',
        },
      },
      faq: {
        tag: 'Vragen?',
        title: 'Veelgestelde Vragen',
        items: [
          {
            q: 'Hoe werkt een gecombineerde evenementenaanvraag?',
            a: 'In plaats van leveranciers afzonderlijk te benaderen, selecteert u de gewenste categorieën (bijv. Locatie, Catering, Fotografie, DJ), kiest u uw datum en verstuurt u 1 formulier. Ons platform stuurt uw aanvraag direct door naar passende, beschikbare partners.',
          },
          {
            q: 'Zijn de prijzen standaard of op maat gemaakt?',
            a: 'U ontvangt offertes op maat, afgestemd op uw gastenaantal, locatie en datum. Omdat leveranciers gecoördineerde briefings ontvangen, kunnen we vaak voordelige pakkettarieven realiseren.',
          },
          {
            q: 'Kan ik na het indienen leveranciers toevoegen of verwijderen?',
            a: 'Zeker! Uw persoonlijke LEEMEVENTS matchmaker helpt u bij het verfijnen van uw keuzes totdat het uiteindelijke voorstel 100% aansluit bij uw visie.',
          },
          {
            q: 'Is het gebruik van LEEMEVENTS gratis voor organisatoren?',
            a: 'Het indienen van aanvragen en ontvangen van gecombineerde voorstellen is 100% gratis en geheel vrijblijvend. Wij verzorgen alle coördinatie zonder verborgen toeslagen.',
          },
        ],
        ctaBtn: 'Start Mijn Evenement Nu',
      },
    },
    categories: {
      tag: 'Verken Ons Leveranciersnetwerk',
      titlePart1: 'Alle evenementspecialisten',
      titlePart2: 'in één overzicht',
      subtext: 'Van betoverende landgoederen tot ambachtelijke patissiers en bekroonde fotografen. Voeg met één klik toe aan uw gecombineerde aanvraag.',
      countBadge: '13 Categorieën • 800+ Geverifieerde Partners',
      list: {
        venue: { label: 'Locaties & Landgoederen', count: '140+ Unieke Locaties', tag: 'Populair' },
        catering: { label: 'Catering & Foodtrucks', count: '95+ Culinaire Partners', tag: 'Gourmet' },
        photography: { label: 'Fotografie', count: '110+ Fotografen', tag: 'Uitgelicht' },
        videography: { label: 'Videografie', count: '65+ Filmmakers', tag: 'Cinematisch' },
        decor: { label: 'Decoratie & Bloemenstyling', count: '85+ Stylisten', tag: 'Trending' },
        dress: { label: 'Bruidsmode & Maatpakken', count: '45+ Boetieks', tag: 'Couture' },
        hair_makeup: { label: 'Haar & Make-up', count: '75+ Beauty Artists', tag: 'Beauty' },
        planner: { label: 'Event & Weddingplanners', count: '40+ Regisseurs', tag: 'Full Service' },
        nanny: { label: 'Nanny & Kids Corner', count: '25+ Kinderopvang', tag: 'Zorgeloos' },
        rentals: { label: 'Tafels, Stoelen & Verhuur', count: '55+ Verhuurbedrijven', tag: 'Meubilair' },
        cake: { label: 'Bruidstaarten & Sweets', count: '60+ Patissiers', tag: 'Ambacht' },
        favors: { label: 'Bedankjes & Geschenken', count: '50+ Ambachtslieden', tag: 'Herinneringen' },
        photoshoot: { label: 'Fotoshoot Locaties', count: '35+ Exclusieve Plekken', tag: 'Spotlight' },
      },
      vetting: {
        tag: 'Onze Kwaliteitsbelofte',
        title: 'Strenge Partner Verificatiestandaard',
        description: 'Elke leverancier in ons bestand ondergaat een strenge controle op vergunningen, aansprakelijkheidsverzekering, portfoliokwaliteit en geverifieerde klantervaringen.',
        point1Title: '1. Gescreende Portfolio’s',
        point1Desc: 'We beoordelen eerdere evenementengalerijen, voedselveiligheid en geluidsapparatuur normen.',
        point2Title: '2. Echte Reviews',
        point2Desc: 'Beoordelingen op LEEMEVENTS zijn uitsluitend afkomstig van geverifieerde klanten met voltooide boekingen.',
        point3Title: '3. Kalendersynchronisatie',
        point3Desc: 'Leveranciers houden actieve live agenda’s bij, zodat u nooit informeert naar bezette data.',
        ctaBtn: 'Combineer Mijn Leveranciers Nu',
      },
    },
    about: {
      tag: 'Over LEEMEVENTS',
      titlePart1: 'Herontdek het plezier',
      titlePart2: 'van vieren.',
      p1: 'LEEMEVENTS is ontstaan uit een eenvoudig inzicht: het plannen van een bijzondere mijlpaal werd te vaak overschaduwd door het beheren van tientallen losse e-mails, gefragmenteerde offertes en slecht op elkaar afgestemde schema’s.',
      p2: 'Wij geloven dat elk evenement — van een intiem jubileum tot een adembenemende bruiloft op een landgoed — rust, elegantie en inspiratie verdient. Daarom hebben we het eerste',
      highlight: 'tweezijdige gecombineerde evenementenplatform ter wereld gebouwd.',
      bullet1Title: 'Eén Centraal Aanspreekpunt:',
      bullet1Desc: 'Vlekkeloze coördinatie tussen al uw gekozen partners zonder ruis.',
      bullet2Title: 'Kwaliteitsgarantie:',
      bullet2Desc: 'Uitsluitend gecontroleerde leveranciers met bewezen uitmuntendheid.',
      bullet3Title: 'Transparante Voorwaarden:',
      bullet3Desc: '1 gezamenlijke overeenkomst en duidelijke, voorspelbare betalingen.',
      ctaBtn: 'Ontdek Ons Verhaal',
      wabiSabiTitle: 'Wabi Sabi Esthetiek',
      wabiSabiDesc: 'Tijdloze rust in steen- en aardetinten',
      principlesTag: 'Onze Kernprincipes',
      principlesTitle: 'Gebouwd op vertrouwen, transparantie & design',
      principles: {
        warmthTitle: 'Wabi-Sabi Warmte',
        warmthDesc: 'Wij geloven in natuurlijke elegantie, heldere communicatie en bewuste styling van vieringen.',
        excellenceTitle: 'Gecureerde Uitmuntendheid',
        excellenceDesc: 'We laten niet zomaar iedereen toe. Alleen geverifieerde vakmensen en bewezen partners treden toe.',
        agreementTitle: '1 Gebundelde Overeenkomst',
        agreementDesc: 'Geen 10 contracten beheren. Wij organiseren al uw geboekte diensten onder 1 transparant voorstel.',
        conciergeTitle: 'Toegewijde Conciërge',
        conciergeDesc: 'Persoonlijke event matchmakers bewaken uw draaiboek zodat elke leverancier op tijd arriveert.',
      },
      pageHeroTag: 'Ons Verhaal & Filosofie',
      pageHeroTitlePart1: 'Rust, elegantie en',
      pageHeroTitlePart2: 'harmonie.',
      pageHeroSubtext: 'LEEMEVENTS is opgericht met één missie: schoonheid en eenvoud terugbrengen naar evenementenplanning.',
      planWithUs: 'Plan Uw Evenement Met Ons',
    },
    testimonials: {
      tag: 'Echte Klantervaringen',
      title: 'Geliefd bij koppels & eventplanners',
      subtext: 'Lees hoe gastheren en eventdirecteuren onvergetelijke vieringen creëerden met ons gecombineerde platform.',
      items: [
        {
          name: 'Sophie & Lucas van Dijk',
          event: 'Landgoed Bruiloft',
          location: 'Cotswolds / Oxford',
          quote: 'Het gecombineerde aanvraagsysteem van LEEMEVENTS was een uitkomst voor onze bruiloft. Binnen 24 uur waren onze droomlocatie, fotograaf en cateraar perfect op elkaar afgestemd. Geen stress, gewoon 1 helder dashboard!',
          suppliersBooked: 'Locatie, Fotograaf, Live Band & Catering',
        },
        {
          name: 'Charlotte Sterling',
          event: '30e Verjaardag Rooftop Party',
          location: 'Downtown Manhattan',
          quote: 'Ik wilde een chique dinerparty met een mixoloog en live DJ voor 60 gasten. Met 1 aanvraag via LEEMEVENTS was alles naadloos geregeld. Mijn gasten praten er nog steeds over!',
          suppliersBooked: 'Rooftop Locatie, Mixoloog, DJ & Styling',
        },
        {
          name: 'Marcus Chen & TechVision Team',
          event: 'Jaarlijks Bedrijfsgala & Awardshow',
          location: 'San Francisco',
          quote: 'Professioneel, transparant en opmerkelijk snel. Als eventdirecteur heeft LEEMEVENTS me weken aan e-mailverkeer bespaard. De centrale facturatie maakte onze boekhouding volkomen pijnloos.',
          suppliersBooked: 'Industriële Ruimte, AV/Licht, Catering & Personeel',
        },
      ],
    },
    supplierBanner: {
      tag: 'Voor Evenementleveranciers & Locaties',
      titlePart1: 'Bent u een evenementleverancier?',
      titlePart2: 'Word ontdekt & ontvang gebundelde boekingen.',
      subtext: 'Sluit u aan bij het snelst groeiende tweezijdige evenementennetwerk. Ontvang serieuze aanvragen van organisatoren die exact matchen met uw regio en datum.',
      perk1: 'Gebundelde offerte-aanvragen',
      perk2: 'Slimme kalenderintegratie',
      perk3: '100% Geverifieerde organisatoren',
      ctaBtn: 'Word Partner',
    },
    finalCTA: {
      badge: 'Klaar voor een Zorgeloze Planningservaring?',
      titlePart1: 'Ontwerp uw droomviering',
      titlePart2: 'in één gecombineerde aanvraag.',
      subtext: 'Stop met het najagen van losse offertes. Stel uw leveranciersteam samen in minder dan 2 minuten en ontvang afgestemde voorstellen.',
      button: 'Start Met Het Plannen Van Uw Evenement',
      guarantee: '✓ 100% Gratis & Vrijblijvend • Geen verborgen kosten',
    },
    footer: {
      brandDesc: 'Het toonaangevende tweezijdige evenementenplatform. Ontdek, vergelijk en boek al uw evenementleveranciers op één plek met één gecombineerde aanvraag.',
      newsletterTitle: 'Ontvang gecureerde evenementeninspiratie',
      emailPlaceholder: 'Vul uw e-mailadres in',
      subscribeBtn: 'Aanmelden',
      subscribedMsg: 'Bedankt! U bent nu ingeschreven voor onze nieuwsbrief.',
      popularCategoriesTitle: 'Populaire Categorieën',
      popularCategories: [
        'Trouwlocaties & Landgoederen',
        'Gourmet Catering & Chefs',
        'Trouwfotografen',
        'Cinematische Videografie',
        'Bloemenstyling & Decoratie',
        'DJ’s & Live Muziekbands',
      ],
      companyTitle: 'Platform & Bedrijf',
      companyLinks: {
        whyUs: 'Waarom LEEMEVENTS',
        howItWorks: 'Hoe het werkt',
        about: 'Over Onze Missie',
        directory: 'Leveranciersoverzicht',
        becomePartner: 'Word Leverancier Partner',
      },
      contactTitle: 'Contact & Hoofdkantoor',
      address: '5th Avenue, New York, NY 10001',
      allRightsReserved: 'Alle rechten voorbehouden.',
      privacyPolicy: 'Privacybeleid',
      termsOfService: 'Algemene Voorwaarden',
      cookiePreferences: 'Cookie Voorkeuren',
    },
    auth: {
      backToHome: 'Terug naar Home',
      brandTagline: 'Plan uw viering in alle rust.',
      brandSubtext: 'Sluit u aan bij duizenden evenementorganisatoren en exclusieve leveranciers die LEEMEVENTS gebruiken voor gecombineerde aanvragen en uniforme contracten.',
      wabiSabiMarketplace: 'Wabi Sabi Marktplaats',
      signInTab: 'Inloggen',
      createAccountTab: 'Account Aanmaken',
      welcomeBack: 'Welkom Terug',
      startYourEvent: 'Start Uw Evenement',
      signInSubtext: 'Log in om toegang te krijgen tot uw bewaarde leveranciers, evenementen of boekingsvoorstellen.',
      signUpSubtext: 'Wat brengt u naar LEEMEVENTS? Kies hieronder uw accountrol.',
      roleQuestion: 'Wat brengt u naar LEEMEVENTS?',
      hostRoleTitle: 'Evenement Organisator',
      hostRoleDesc: 'Een viering plannen (bruiloft, verjaardag, bedrijfsevenement)',
      supplierRoleTitle: 'Leverancier Partner',
      supplierRoleDesc: 'Locatie, Chef, DJ, Fotograaf, Stylist...',
      googleContinue: 'Doorgaan met Google',
      orContinueEmail: 'Of ga door met e-mail',
      orSignUpEmail: 'Of registreer met e-mail',
      fullNameLabel: 'Volledige Naam / Bedrijfsnaam *',
      fullNamePlaceholderHost: 'Eleanor Vance',
      fullNamePlaceholderSupplier: 'Aura Floral & Styling',
      emailLabel: 'E-mailadres *',
      emailPlaceholder: 'eleanor@voorbeeld.nl',
      passwordLabel: 'Wachtwoord *',
      rememberMe: 'Onthoud mij',
      forgotPassword: 'Wachtwoord vergeten?',
      continueToHostOnboarding: 'Doorgaan naar Organisator Onboarding',
      continueToSupplierOnboarding: 'Doorgaan naar Leverancier Onboarding',
      signInAsHost: 'Inloggen als Organisator',
      signInAsSupplier: 'Inloggen als Leverancier Partner',
      alreadyHaveAccount: 'Heeft u al een account?',
      dontHaveAccount: 'Nog geen account?',
      termsNoticePart1: 'Door door te gaan, gaat u akkoord met LEEMEVENTS’s',
      termsLink: 'Algemene Voorwaarden',
      termsNoticePart2: 'en',
      privacyLink: 'Privacybeleid',
    },
    modal: {
      title: 'Gecombineerde Evenementenaanvraag',
      subtitle: 'Selecteer meerdere leveranciers en ontvang één uniform voorstel',
      step1Title: 'Stap 1: Leveranciers Kiezen',
      step1Desc: 'Kies de gewenste diensten voor uw viering',
      step2Title: 'Stap 2: Evenement Details',
      step2Desc: 'Vertel ons over uw datum, locatie en aantal gasten',
      step3Title: 'Stap 3: Contact & Overzicht',
      step3Desc: 'Waar mogen we uw gecombineerde voorstel naartoe sturen?',
      stepIndicator: 'Stap',
      selectCategoriesHeader: 'Selecteer Gewenste Leverancierscategorieën',
      selectedCount: 'geselecteerd',
      eventDetailsHeader: 'Uw Evenement Voorkeuren',
      eventType: 'Type Evenement',
      eventDate: 'Evenement Datum',
      guestCount: 'Verwacht Aantal Gasten',
      location: 'Locatie / Stad',
      estimatedBudget: 'Geschat Totaalbudget',
      contactDetailsHeader: 'Uw Contactgegevens',
      fullName: 'Volledige Naam',
      email: 'E-mailadres',
      phone: 'Telefoonnummer',
      specialNotes: 'Speciale Wensen of Visie',
      specialNotesPlaceholder: 'Vertel ons over uw thema, gewenste muziekstijlen, dieetwensen...',
      nextStep: 'Doorgaan naar Volgende Stap',
      backStep: 'Terug',
      submitCombinedRequest: 'Dien Gecombineerde Aanvraag In',
      successTitle: 'Aanvraag Succesvol Verzonden!',
      successMessage: 'Uw gecombineerde evenementbriefing is verstuurd naar passende luxe leveranciers.',
      successSummary: 'Ons conciërgeteam stemt alles af met uw gekozen partners en levert binnen 24-48 uur 1 gebundeld voorstel.',
      closeBtn: 'Sluiten & Terug naar Dashboard',
    },
    dashboard: {
      hostSuite: 'Host Suite',
      supplierHub: 'Supplier Hub',
      hostPortal: 'Host Portaal',
      browseSuppliers: 'Leveranciers Bladeren',
      selectionCart: 'Mijn Selectie',
      signOut: 'Uitloggen',
      verifiedSupplier: 'Geverifieerde Leverancier',
      pendingApproval: 'In Beoordeling',
      activeInDirectory: 'Actief in Gids',
      reviewInProgress: 'Controle Loopt',
      liveInDirectory: 'Zichtbaar in Gids',
      verifiedVendor: 'Geverifieerde Partner',
      eventHost: 'Evenement Host',
      hostNav: {
        overview: 'Overzicht',
        myEvents: 'Mijn Evenementen',
        browse: 'Leveranciers Bladeren',
        cart: 'Mijn Selectie / Winkelmand',
        requests: 'Aanvragen & Boekingen',
        messages: 'Berichten',
        team: 'Planning & Team',
        documents: 'Documenten & Contracten',
        settings: 'Profiel & Instellingen',
      },
      supplierNav: {
        overview: 'Overzicht',
        profile: 'Account & Profiel',
        portfolio: 'Portfolio',
        services: 'Diensten & Prijzen',
        calendar: 'Kalender & Beschikbaarheid',
        requests: 'Aanvragen Wachtrij',
        customers: 'Mijn Klanten',
        messages: 'Berichten',
        reviews: 'Beoordelingen',
        earnings: 'Inkomsten & Boekingen',
        subscription: 'Abonnement',
      },
      hostHome: {
        suiteBadge: 'Najaar 2026 Feestsuite',
        welcome: 'Welkom terug, Eleanor',
        headerDesc: 'Volg leverancierscontracten, bewaak mijlpaalschema’s en beheer uw centrale aanbetaling.',
        browseBtn: 'Leveranciers Bladeren',
        viewCart: 'Winkelmand Bekijken (3 items)',
        eventTitle: 'Eleanor & Liam’s Landgoed Bruiloft',
        eventType: 'Landgoed Bruiloft',
        daysLeft: 'dagen resterend',
        date: 'Vrijdag 18 September 2026',
        location: 'Cotswolds, Oxfordshire, VK',
        guests: '120 Verwachte Gasten',
        supplierConfirmed: 'Leveranciers Geboekt',
        budgetCommitted: 'Vastgelegd Budget',
        activeRequests: 'Actieve Aanvragen & Boekingen',
        viewAll: 'Alles Bekijken',
        actionRequired: 'Mijlpalen & Volgende Stappen',
        contractSummary: 'Gebundelde Overeenkomst & Borgbetaling',
        downloadContract: 'Download Contract PDF',
        accepted: 'Geaccepteerd',
        contractSent: 'Contract Verzonden',
        pending: 'In Behandeling',
      },
      supplierHome: {
        dashboardBadge: 'Leveranciersdashboard',
        verifiedPartner: 'Geverifieerde Partner',
        updateAvailability: 'Beschikbaarheid Aanpassen',
        manageServices: 'Diensten Beheren',
        newRequests: 'Nieuwe Aanvragen',
        requiresResponse: 'Reactie vereist binnen 24u',
        confirmedBookings: 'Bevestigde Boekingen',
        synced: '100% kalender gesynchroniseerd',
        estRevenue: 'Geschatte Maandomzet',
        revenueSub: 'Pijplijn sept 2026',
        overallRating: 'Gemiddelde Score',
        reviewsCount: 'Op basis van 28 reviews',
        pendingQueue: 'Binnengekomen Aanvragen & Boekingen',
        acceptBtn: 'Accepteren & Offerte Sturen',
        declineBtn: 'Afwijzen',
        acceptedStatus: 'Geaccepteerd & In Afstemming',
        declinedStatus: 'Afgewezen',
        guestCountLabel: 'gasten',
        serviceLabel: 'Dienst',
      },
    },
  },
};
