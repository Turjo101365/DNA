export const TRANSLATIONS = {
  en: {
    // Header & Meta
    appTitle: 'HUMAN BIO-SIMULATOR 3D',
    appSubtitle: 'VITAL ORGANS & REAL-TIME WEBCAM GESTURE TELEMETRY',
    versionBadge: 'VISION v3.0',
    fps: 'FPS',
    spin: 'SPIN',
    paused: 'PAUSED',
    reset: 'RESET',
    aiChat: 'BIO-AI',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    langEn: 'EN',
    langBn: 'বাং',

    // Organs
    organs: {
      HEART: {
        label: 'HEART',
        sub: 'Cardiovascular'
      },
      BRAIN: {
        label: 'BRAIN',
        sub: 'Neural Synapses'
      },
      LUNGS: {
        label: 'LUNGS',
        sub: 'Respiratory'
      },
      VISCERAL: {
        label: 'VISCERA',
        sub: 'Digestive & Renal'
      },
      DNA: {
        label: 'DNA HELIX',
        sub: 'Genomic Code'
      }
    },

    // Bottom Navigation Hints
    hints: {
      drag: '🖱️ Drag to rotate',
      zoom: '⚙️ Scroll to zoom',
      gestures: '🖐️ Webcam hand gestures',
      keys: '⌨️ Keys 1-5 to switch organs',
      peace: '✌️ Peace gesture for signature reaction',
      aiChat: '🤖 C to toggle BioAI'
    },

    // Gesture Status & Matrix
    gestures: {
      headerActive: 'HAND DETECTED',
      headerStandby: 'CAMERA STANDBY',
      fidelity: 'TRACKING FIDELITY',
      cheatsheetTitle: 'Gesture Matrix Cheatsheet',
      actions: {
        HEART: 'Cardiac Surge / Tachycardia Pulse Boost',
        BRAIN: 'Cycle Brainwave Rhythm (Alpha/Beta/Gamma)',
        LUNGS: 'Deep Inspiratory Tidal Expansion',
        VISCERAL: 'Trigger Gastric Motility Peristalsis',
        DNA: 'Uncoil Double Helix into Flat Ladder',
        DEFAULT: 'Trigger Signature Organ Mode'
      },
      items: {
        NONE: {
          label: 'NO GESTURE DETECTED',
          action: 'Show hand to webcam to interact'
        },
        OPEN_PALM: {
          label: 'OPEN PALM',
          action: 'Rotate & Pan 3D Model in Space',
          tip: 'Drag to Rotate 3D'
        },
        PINCH: {
          label: 'PINCH / SPREAD',
          action: 'Dynamic Optical Zoom & Deep Tissue Inspect',
          tip: 'Zoom Model in/out'
        },
        FIST: {
          label: 'CLOSED FIST',
          action: 'Orientation Locked (Frozen)',
          tip: 'Lock & Hold View'
        },
        PEACE: {
          label: 'PEACE SIGN',
          tip: 'Trigger Reaction'
        },
        POINT: {
          label: 'POINTING',
          action: 'Precision Alignment & Raycast Inspection',
          tip: 'Precision Align'
        },
        THUMBS_UP: {
          label: 'THUMBS UP',
          action: 'Recalibrating / Resetting View',
          tip: 'Reset View & Center'
        },
        TWO_HAND_ZOOM: {
          label: 'TWO HANDS ACTIVE',
          action: 'Dual Hand Stretch & Scale',
          tip: 'Dual Hand Stretch'
        }
      }
    },

    // Organ Telemetry Bar
    telemetry: {
      titleSuffix: 'BIO-TELEMETRY',
      heart: {
        pulseRate: 'PULSE RATE',
        bloodPress: 'BLOOD PRESS.',
        output: 'OUTPUT',
        bpmSlider: 'BPM SLIDER:'
      },
      brain: {
        frequency: 'FREQUENCY',
        neurons: 'NEURONS',
        neuronsValue: '~86 Billion',
        synapseLoad: 'SYNAPSE LOAD',
        rhythm: 'RHYTHM:'
      },
      lungs: {
        breathRate: 'BREATH RATE',
        breathRateUnit: '/min',
        spo2: 'SpO₂ SAT',
        tidalVol: 'TIDAL VOL.',
        breathSpeed: 'BREATH SPEED:'
      },
      dna: {
        basePairs: 'BASE PAIRS',
        basePairsValue: '36 Pairs',
        helixPitch: 'HELIX PITCH',
        stabilityTm: 'STABILITY Tm',
        uncoilBtn: 'UNCOIL / MUTATE HELIX LADDER'
      },
      visceral: {
        renalGfr: 'RENAL GFR',
        gastricPh: 'GASTRIC pH',
        liverFlow: 'LIVER FLOW',
        activeNote: 'Metabolic filtration & gastrointestinal peristalsis active'
      }
    },

    // Camera Feed
    camera: {
      opticSensor: 'OPTIC SENSOR',
      startWebcam: 'START WEBCAM CONTROL',
      initializing: 'INITIALIZING VISION AI...',
      offlineTitle: 'Vision Input Offline',
      deniedDesc: 'Camera permission denied. Use mouse/touch to interact with the 3D model.',
      retry: 'Retry Camera',
      trackingActive: 'TRACKING ACTIVE',
      tooltips: {
        mirror: 'Toggle Mirror View',
        minimize: 'Minimize Camera',
        expand: 'Expand Camera',
        disable: 'Disable Camera'
      }
    },

    // 3D Tooltip Overlays
    viewer: {
      latin: 'Latin:',
      pressure: 'Hydrodynamic Pressure:',
      volume: 'Capacity / Volume:',
      neurons: 'Neural Network:',
      capacity: 'Functional Capacity:',
      gfr: 'Filtration GFR:',
      clinicalFact: 'Clinical Fact:'
    }
  },

  bn: {
    // Header & Meta
    appTitle: 'হিউম্যান বায়ো-সিমুলেটর ৩ডি',
    appSubtitle: 'জীবন্ত অঙ্গপ্রত্যঙ্গ ও রিয়েল-টাইম ওয়েবক্যাম অঙ্গভঙ্গি টেলিমেট্রি',
    versionBadge: 'ভিশন ৩.০',
    fps: 'এফপিএস',
    spin: 'ঘূর্ণন',
    paused: 'স্থগিত',
    reset: 'রিসেট',
    aiChat: 'এআই চ্যাট',
    themeDark: 'ডার্ক মোড',
    themeLight: 'লাইট মোড',
    langEn: 'EN',
    langBn: 'বাং',

    // Organs
    organs: {
      HEART: {
        label: 'হৃদপিণ্ড',
        sub: 'কার্ডিওভাসকুলার'
      },
      BRAIN: {
        label: 'মস্তিষ্ক',
        sub: 'স্নায়ুতন্ত্র ও সিন্যাপস'
      },
      LUNGS: {
        label: 'ফুসফুস',
        sub: 'শ্বসনতন্ত্র'
      },
      VISCERAL: {
        label: 'অভ্যন্তরীণ অঙ্গ',
        sub: 'পরিপাক ও রেচন'
      },
      DNA: {
        label: 'ডিএনএ হেলিক্স',
        sub: 'জিনগত সংকেত'
      }
    },

    // Bottom Navigation Hints
    hints: {
      drag: '🖱️ ঘোরাতে ড্র্যাগ করুন',
      zoom: '⚙️ জুম করতে স্ক্রোল করুন',
      gestures: '🖐️ ওয়েবক্যাম হাতের ইশারা',
      keys: '⌨️ অঙ্গ পরিবর্তন করতে ১-৫ কী চাপুন',
      peace: '✌️ বিশেষ প্রতিক্রিয়ার জন্য পিস ইশারা',
      aiChat: '🤖 C চাপলে BioAI চ্যাট'
    },

    // Gesture Status & Matrix
    gestures: {
      headerActive: 'হাত শনাক্ত হয়েছে',
      headerStandby: 'ক্যামেরা স্ট্যান্ডবাই',
      fidelity: 'ট্র্যাকিং নির্ভুলতা',
      cheatsheetTitle: 'অঙ্গভঙ্গি নির্দেশিকা (Gesture Matrix)',
      actions: {
        HEART: 'হৃদস্পন্দনের গতি বৃদ্ধি (টাকিকার্ডিয়া পালস)',
        BRAIN: 'মস্তিষ্কের তরঙ্গ পরিবর্তন (আলফা/বিটা/গামা)',
        LUNGS: 'গভীর শ্বসন বায়ুধারণ সম্প্রসারণ',
        VISCERAL: 'পরিপাক নালীর পেরিস্টালসিস সক্রিয়',
        DNA: 'ডিএনএ ডাবল হেলিক্স মই আকারে উন্মোচন',
        DEFAULT: 'অঙ্গটির বিশেষ বৈশিষ্ট্য প্রদর্শন'
      },
      items: {
        NONE: {
          label: 'কোনো ইশারা শনাক্ত হয়নি',
          action: 'নিয়ন্ত্রণ করতে ওয়েবক্যামের সামনে হাত দেখান'
        },
        OPEN_PALM: {
          label: 'খোলা হাতের তালু',
          action: 'ত্রিমাত্রিক মডেলকে শূন্যে ঘোরান ও স্থানান্তর করুন',
          tip: 'ঘোরাতে ড্র্যাগ করুন'
        },
        PINCH: {
          label: 'পিঞ্চ / ছড়ানো',
          action: 'ডায়নামিক অপটিক্যাল জুম ও কোষ পর্যবেক্ষণ',
          tip: 'মডেল ছোট/বড় জুম'
        },
        FIST: {
          label: 'মুষ্টিবদ্ধ হাত',
          action: 'বর্তমান অবস্থান লক করা (স্থির)',
          tip: 'ভিউ লক করে রাখুন'
        },
        PEACE: {
          label: 'পিস সাইন (দুই আঙুল)',
          tip: 'বিশেষ প্রতিক্রিয়া'
        },
        POINT: {
          label: 'তর্জনী নির্দেশ',
          action: 'নির্ভুল পর্যবেক্ষণ ও অ্যালাইনমেন্ট',
          tip: 'নির্ভুল পর্যবেক্ষণ'
        },
        THUMBS_UP: {
          label: 'থাম্বস আপ',
          action: 'ভিউ রিক্যালিব্রেট ও কেন্দ্রে রিসেট',
          tip: 'রিসেট ও সেন্টার'
        },
        TWO_HAND_ZOOM: {
          label: 'উভয় হাত সক্রিয়',
          action: 'দ্বৈত হাত দিয়ে বড়/ছোট করা',
          tip: 'দুই হাতে স্কেল'
        }
      }
    },

    // Organ Telemetry Bar
    telemetry: {
      titleSuffix: 'বায়ো-টেলিমেট্রি',
      heart: {
        pulseRate: 'পালস রেট',
        bloodPress: 'রক্তচাপ',
        output: 'রক্ত নির্গমন',
        bpmSlider: 'বিপিএম স্লাইডার:'
      },
      brain: {
        frequency: 'কম্পাঙ্ক / ফ্রিকোয়েন্সি',
        neurons: 'নিউরন সংখ্যা',
        neuronsValue: '~৮৬ বিলিয়ন',
        synapseLoad: 'সিন্যাপস লোড',
        rhythm: 'রhythm / ছন্দ:'
      },
      lungs: {
        breathRate: 'শ্বাসের গতি',
        breathRateUnit: '/মিনিট',
        spo2: 'SpO₂ স্যাচুরেশন',
        tidalVol: 'টাইডাল ভলিউম',
        breathSpeed: 'শ্বসনের গতি:'
      },
      dna: {
        basePairs: 'বেস পেয়ার',
        basePairsValue: '৩৬ জোড়া',
        helixPitch: 'হেলিক্স পিচ',
        stabilityTm: 'তাপীয় স্থায়িত্ব',
        uncoilBtn: 'হেলিক্স লেডার উন্মোচন / রূপান্তর'
      },
      visceral: {
        renalGfr: 'রেনাল জিএফআর',
        gastricPh: 'গ্যাস্ট্রিক পিএইচ',
        liverFlow: 'হেপাটিক প্রবাহ',
        activeNote: 'বিপাকীয় পরিস্রাবণ ও পরিপাক পেরিস্টালসিস সক্রিয়'
      }
    },

    // Camera Feed
    camera: {
      opticSensor: 'অপটিক সেন্সর',
      startWebcam: 'ওয়েবক্যাম কন্ট্রোল চালু করুন',
      initializing: 'ভিশন এআই চালু হচ্ছে...',
      offlineTitle: 'ক্যামেরা ইনপুট অফলাইন',
      deniedDesc: 'ক্যামেরার অনুমতি পাওয়া যায়নি। মাউস/টাচ দিয়ে ত্রিমাত্রিক মডেলটি দেখুন।',
      retry: 'পুনরায় চেষ্টা করুন',
      trackingActive: 'ট্র্যাকিং সক্রিয়',
      tooltips: {
        mirror: 'মিরর ভিউ টগল করুন',
        minimize: 'ক্যামেরা ছোট করুন',
        expand: 'ক্যামেরা বড় করুন',
        disable: 'ক্যামেরা বন্ধ করুন'
      }
    },

    // 3D Tooltip Overlays
    viewer: {
      latin: 'ল্যাটিন নাম:',
      pressure: 'হাইড্রোডাইনামিক চাপ:',
      volume: 'ধারণক্ষমতা / আয়তন:',
      neurons: 'স্নায়ু সংযোগ:',
      capacity: 'কার্যক্ষমতা:',
      gfr: 'ফিল্ট্রেশন জিএফআর:',
      clinicalFact: 'ক্লিনিক্যাল তথ্য:'
    }
  }
};
