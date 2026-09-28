/**
 * Ollama Service for Human Bio-Simulator 3D
 * Handles communication with local Ollama API, streaming token decoding,
 * active organ context injection, and built-in offline anatomical knowledge fallback.
 */

export const DEFAULT_OLLAMA_ENDPOINT = '/api/ollama';
export const DIRECT_OLLAMA_ENDPOINT = 'http://localhost:11434';
export const DEFAULT_MODEL = 'llama3.2:3b';

// Organ Specific System Information
export const ORGAN_PROMPT_MAP = {
  HEART: {
    nameEn: 'Heart (Cardiovascular System)',
    nameBn: 'হৃৎপিণ্ড (কার্ডিওভাসকুলার সিস্টেম)',
    description: 'Muscular organ with 4 chambers (atria & ventricles) pumping oxygenated and deoxygenated blood through systemic and pulmonary circulation.',
    keyTopics: ['Chambers & Valves', 'Cardiac Cycle', 'ECG & Electrical Conduction', 'Coronary Circulation', 'Arrhythmia & Infarction']
  },
  BRAIN: {
    nameEn: 'Brain (Central Nervous System)',
    nameBn: 'মস্তিষ্ক (কেন্দ্রীয় স্নায়ুতন্ত্র)',
    description: 'Master organ with ~86 billion neurons, divided into Cerebrum, Cerebellum, and Brainstem, generating neural oscillations (Alpha, Beta, Theta, Gamma).',
    keyTopics: ['Cerebral Cortex', 'Neurons & Synapses', 'Brain Waves (EEG)', 'Neurotransmitters', 'Memory & Cognition']
  },
  LUNGS: {
    nameEn: 'Lungs (Respiratory System)',
    nameBn: 'ফুসফুস (শ্বসনতন্ত্র)',
    description: 'Paired spongy organs containing ~300-500 million alveoli responsible for oxygen uptake and carbon dioxide expulsion via alveolar capillary membranes.',
    keyTopics: ['Alveolar Gas Exchange', 'Diaphragm & Tidal Volume', 'Bronchial Tree', 'Surfactant', 'Asthma & Pneumonia']
  },
  VISCERAL: {
    nameEn: 'Visceral Organs (Liver, Kidneys, Digestive & Renal)',
    nameBn: 'অভ্যন্তরীণ অঙ্গসমূহ (যকৃত, বৃক্ক/কিডনি, পাকস্থলী)',
    description: 'Vital metabolic, detoxification, and filtration systems including the Liver (bile & metabolism) and Kidneys (nephrons, GFR & fluid balance).',
    keyTopics: ['Nephron Filtration (Kidney)', 'Liver Detoxification & Bile', 'Metabolic Regulation', 'Gastric Digestion', 'Renal Homeostasis']
  },
  DNA: {
    nameEn: 'DNA Helix (Genomic Architecture)',
    nameBn: 'ডিএনএ হেলিক্স (জিনোমিক স্থাপত্য)',
    description: 'Double helix macromolecule composed of nucleotide base pairs (Adenine-Thymine, Guanine-Cytosine) encoding the hereditary blueprint of life.',
    keyTopics: ['Base Pairing & Hydrogen Bonds', 'Transcription & Translation', 'DNA Replication & Helicase', 'Genetic Mutations', 'Epigenetics']
  }
};

/**
 * Check if Ollama is running and retrieve list of downloaded models
 */
export async function fetchOllamaModels(endpoint = DEFAULT_OLLAMA_ENDPOINT) {
  const tryFetch = async (url) => {
    const cleanUrl = url.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3500)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.models || []).map((m) => m.name);
  };

  try {
    const models = await tryFetch(endpoint);
    return { ok: true, models, activeEndpoint: endpoint };
  } catch (err) {
    // If proxied path failed, try direct localhost
    if (endpoint === DEFAULT_OLLAMA_ENDPOINT) {
      try {
        const directModels = await tryFetch(DIRECT_OLLAMA_ENDPOINT);
        return { ok: true, models: directModels, activeEndpoint: DIRECT_OLLAMA_ENDPOINT };
      } catch (directErr) {
        return { ok: false, models: [], error: err.message || 'Ollama offline' };
      }
    }
    return { ok: false, models: [], error: err.message || 'Ollama offline' };
  }
}

/**
 * Build System Prompt with active organ & live telemetry context
 */
export function buildSystemPrompt(activeOrgan = 'HEART', telemetry = {}) {
  const organInfo = ORGAN_PROMPT_MAP[activeOrgan] || ORGAN_PROMPT_MAP.HEART;

  let telemetrySnippet = '';
  if (activeOrgan === 'HEART' && telemetry.heartBpm) {
    telemetrySnippet = `Live Telemetry: Heart Rate is currently simulated at ${telemetry.heartBpm} BPM (beats per minute).`;
  } else if (activeOrgan === 'BRAIN' && telemetry.brainWaveMode) {
    telemetrySnippet = `Live Telemetry: Current simulated Brain Wave State is ${telemetry.brainWaveMode} wave mode.`;
  } else if (activeOrgan === 'LUNGS' && telemetry.lungBreathRate) {
    telemetrySnippet = `Live Telemetry: Respiration Rate is currently ${telemetry.lungBreathRate} breaths per minute.`;
  } else if (activeOrgan === 'DNA') {
    telemetrySnippet = `Live Telemetry: DNA Helix conformation is active in 3D simulator.`;
  }

  return `You are BioAI, an elite Medical & Anatomical Specialist inside the "3D Human Bio-Simulator".
Your mission is to provide deeply informative, accurate, engaging, and clear anatomical, physiological, and medical explanations about human organs and biology.

CURRENT 3D SIMULATOR CONTEXT:
- Active Organ in View: ${organInfo.nameEn} / ${organInfo.nameBn}
- Organ Overview: ${organInfo.description}
- ${telemetrySnippet}

LANGUAGE RULES:
- If the user asks in Bengali (বাংলা) or Banglish, answer comprehensively in natural, beautiful Bengali (বাংলা). Include standard medical terms in brackets when helpful (e.g. নিলয় [Ventricle], অলিন্দ [Atrium], স্নায়ুকোষ [Neuron]).
- If the user asks in English, answer in structured, articulate English.
- If asked about any human organ (Heart, Brain, Lungs, Liver, Kidneys, Stomach, Pancreas, Spleen, Eyes, Ears, Skin, Bones, DNA, etc.), deliver deep, high-value insights.

FORMATTING RULES:
- Use clean Markdown with headers (###), bold key terms, and bullet points.
- Structure your answer with:
  1. 📌 **সংক্ষিপ্ত পরিচিতি / Overview**
  2. 🔬 **শারীরস্থানিক গঠন / Anatomical Structure** (Chambers, tissues, cells, vessels)
  3. ⚡ **শারীরবৃত্তীয় কার্যপদ্ধতি / Physiological Function & Mechanism**
  4. 🩺 **সম্পর্কিত রোগ ও ক্লিনিকাল গুরুত্ব / Common Diseases & Clinical Relevance**
  5. 💡 **আকর্ষণীয় তথ্য / Biological Fast Fact**
- Maintain a warm, encouraging, scientific, and educational tone.`;
}

/**
 * Stream chat completion from Ollama
 */
export async function streamOllamaChat({
  endpoint = DEFAULT_OLLAMA_ENDPOINT,
  model = DEFAULT_MODEL,
  messages = [],
  systemPrompt = '',
  onToken,
  signal
}) {
  const cleanEndpoint = endpoint.replace(/\/+$/, '');

  // Prepend system prompt if not present
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content }))
  ];

  const payload = {
    model: model,
    messages: fullMessages,
    stream: true,
    options: {
      temperature: 0.7,
      top_p: 0.9
    }
  };

  const response = await fetch(`${cleanEndpoint}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    // If /api/chat is 404, attempt /api/generate fallback
    if (response.status === 404) {
      return streamOllamaGenerate({
        endpoint: cleanEndpoint,
        model,
        prompt: messages[messages.length - 1]?.content || '',
        systemPrompt,
        onToken,
        signal
      });
    }
    const errText = await response.text();
    throw new Error(`Ollama Error (${response.status}): ${errText || response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulated = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.trim() !== '');

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message && json.message.content) {
            accumulated += json.message.content;
            if (onToken) onToken(json.message.content, accumulated);
          }
          if (json.done) {
            return accumulated;
          }
        } catch (parseErr) {
          // Incomplete chunk buffer, continue
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return accumulated;
}

/**
 * Fallback to /api/generate if needed
 */
async function streamOllamaGenerate({ endpoint, model, prompt, systemPrompt, onToken, signal }) {
  const response = await fetch(`${endpoint}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      system: systemPrompt,
      stream: true
    }),
    signal
  });

  if (!response.ok) {
    throw new Error(`Ollama Generate failed: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter((l) => l.trim() !== '');

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.response) {
          accumulated += json.response;
          if (onToken) onToken(json.response, accumulated);
        }
      } catch (e) {}
    }
  }

  return accumulated;
}

/**
 * Comprehensive Built-in Anatomical Knowledge Base (Offline Fallback)
 * If Ollama is offline, this gives users immediate, high-detail answers for any organ!
 */
export const OFFLINE_ORGAN_KNOWLEDGE = {
  HEART: {
    bn: `### 🫀 মানব হৃৎপিণ্ড (Human Heart) - বিস্তারিত শারীরস্থান ও শারীরবৃত্তীয় বিবরণ

#### 📌 ১. সংক্ষিপ্ত পরিচিতি
হৃৎপিণ্ড হলো মানবদেহের রক্ত সংবহনতন্ত্রের (Cardiovascular System) প্রধান পেশিবহুল পাম্প অঙ্গ। এটি বক্ষগহ্বরে (Thoracic Cavity) দুই ফুসফুসের মধ্যবর্তী স্থানে মেডিয়াস্টিনামে (Mediastinum) সামান্য বাম দিকে হেলে অবস্থান করে। একজন পূর্ণবয়স্ক মানুষের হৃৎপিণ্ডের ওজন প্রায় ২৫০-৩৫০ গ্রাম (একটি বদ্ধ মুষ্টির সমান)।

---

#### 🔬 ২. শারীরস্থানিক গঠন (Anatomy & Chambers)
হৃৎপিণ্ড **পেরিকার্ডিয়াম (Pericardium)** নামক দ্বিস্তরীয় ঝিল্লি দ্বারা আবৃত। হৃৎপ্রাচীর ৩টি স্তরে গঠিত:
1. **এপিকার্ডিয়াম (Epicardium)**: বাইরের পাতলা স্তর।
2. **মায়োকার্ডিয়াম (Myocardium)**: মধ্যবর্তী পুরু ঐচ্ছিক কার্ডিয়াক পেশি স্তর যা সংকোচনশীল।
3. **এন্ডোকার্ডিয়াম (Endocardium)**: ভেতরের মসৃণ আবরণ।

**হৃৎপিণ্ডের ৪টি প্রকোষ্ঠ (4 Chambers):**
- **ডান অলিন্দ (Right Atrium)**: ঊর্ধ ও নিম্ন মহাশিরা (Vena Cava) দিয়ে শরীর থেকে কার্বন ডাই-অক্সাইডযুক্ত রক্ত গ্রহণ করে।
- **ডান নিলয় (Right Ventricle)**: ফুসফুসীয় ধমনীর মাধ্যমে রক্তকে ফুসফুসে পাঠায়।
- **বাম অলিন্দ (Left Atrium)**: ফুসফুস থেকে ৪টি পালমোনারি শিরার মাধ্যমে অক্সিজেনসমৃদ্ধ বিশুদ্ধ রক্ত গ্রহণ করে।
- **বাম নিলয় (Left Ventricle)**: হৃৎপিণ্ডের সবচেয়ে পুরু প্রাচীরযুক্ত প্রকোষ্ঠ; এটি মহাধমনী (Aorta) দিয়ে সারাদেহে অক্সিজেনযুক্ত রক্ত পাম্প করে।

**৪টি কপাটিকা (Valves):**
- **ট্রাইকাসপিড (Tricuspid)**: ডান অলিন্দ ও ডান নিলয়ের মাঝে (৩টি কপাট)।
- **বাইকাসপিড বা মাইট্রাল (Bicuspid/Mitral)**: বাম অলিন্দ ও বাম নিলয়ের মাঝে (২টি কপাট)।
- **পালমোনারি সেমিলুনার**: ডান নিলয় ও ফুসফুসীয় ধমনীর সংযোগস্থলে।
- **অ্যাওর্টিক সেমিলুনার**: বাম নিলয় ও মহাধমনীর মুখে।

---

#### ⚡ ৩. কার্ডিয়াক সাইকেল ও বৈদ্যুতিক স্পন্দন
হৃৎপিণ্ড স্বতঃস্ফূর্তভাবে স্পন্দিত হয় (**Myogenic Control**):
1. **SA নোড (Sinoatrial Node)**: একে "প্রাকৃতিক পেসমেকার" বলা হয়। প্রতি মিনিটে ৭০-৮০ বার অ্যাকশন পটেনশিয়াল তৈরি করে।
2. **AV নোড (Atrioventricular Node)**: স্পন্দনকে কিছুটা ধীর করে নিলয়ে পাঠায়।
3. **বান্ডল অব হিজ (Bundle of His) ও পারকিঞ্জে তন্তু (Purkinje Fibers)**: দ্রুত নিলয় প্রাচীরে ছড়িয়ে দেয়, যার ফলে নিলয়ের শক্তিশালী সিস্টোল ঘটে।

- **কার্ডিয়াক আউটপুট**: প্রতি স্পন্দনে প্রায় ৭০ মিলি রক্ত পাম্প হয় (Stroke Volume)। মিনিটে গড়ে প্রায় ৫ লিটার রক্ত সারাদেহে সঞ্চালিত হয়!

---

#### 🩺 ৪. প্রধান ক্লিনিক্যাল রোগসমূহ
- **করোনারি আর্টারি ডিজিজ (CAD)**: চর্বি বা প্লাক জমে হৃৎপিণ্ডের নিজস্ব রক্ত সরবরাহ বাধাগ্রস্ত হওয়া।
- **মায়োকার্ডিয়াল ইনফার্কশন (Heart Attack)**: হৃৎপেশির কোষে রক্ত ও অক্সিজেন না পৌঁছে কোষের মৃত্যু।
- **হার্ট ফেইলিউর**: হৃৎপিণ্ড শরীরের চাহিদামতো রক্ত পাম্প করতে ব্যর্থ হওয়া।
- **অ্যারিদমিয়া (Arrhythmia)**: অস্বাভাবিক স্পন্দন হার (ট্যাকিকার্ডিয়া > ১০০ BPM, ব্র্যাডিকার্ডিয়া < ৬০ BPM)।

💡 *টিপস: স্থানীয় Ollama সার্ভার চালু করতে টার্মিনালে \`ollama run llama3\` কমান্ডটি রান করুন। আরও বিশদ কথোপকথন তাৎক্ষণিক সক্রিয় হবে!*`,
    en: `### 🫀 The Human Heart - Comprehensive Anatomical & Physiological Guide

#### 📌 1. Overview
The human heart is the central muscular pump of the cardiovascular system, located within the thoracic cavity in the mediastinum, tilted slightly to the left. Weighing approximately 250–350g, it beats over 100,000 times daily, circulating ~7,500 liters of blood.

---

#### 🔬 2. Anatomical Structure
- **Heart Wall**: Composed of Epicardium (outer serous layer), Myocardium (thick cardiac contractile muscle), and Endocardium (inner endothelial lining).
- **Four Chambers**:
  - **Right Atrium (RA)**: Receives deoxygenated blood from the Superior & Inferior Vena Cava.
  - **Right Ventricle (RV)**: Pumps blood into the Pulmonary Trunk to the lungs.
  - **Left Atrium (LA)**: Receives oxygen-rich blood via four Pulmonary Veins.
  - **Left Ventricle (LV)**: Possesses the thickest muscular wall (3x RV) to pump blood into the high-pressure systemic circulation via the Aorta.
- **Valves**:
  - **Atrioventricular**: Tricuspid (right) and Bicuspid/Mitral (left).
  - **Semilunar**: Aortic and Pulmonary valves preventing retrograde regurgitation.

---

#### ⚡ 3. Cardiac Electrophysiology
Intrinsic conduction sequence:
1. **Sinoatrial (SA) Node**: The primary pacemaker in the RA generating rhythmic action potentials (~60–100 bpm).
2. **Atrioventricular (AV) Node**: Introduces a 0.1-second delay allowing ventricular filling.
3. **Bundle of His & Purkinje Fibers**: Rapidly propagates depolarization through the ventricular myocardium for synchronized ejection.

---

#### 🩺 4. Clinical Significance
- **Myocardial Infarction**: Coronary artery thrombosis leading to ischemia and tissue necrosis.
- **Hypertension**: Elevated afterload forcing left ventricular hypertrophy.
- **Arrhythmias**: Ventricular fibrillation, atrial flutter, or conduction blockades.

💡 *Ollama Notice: To unlock live streaming AI responses from local LLMs, start Ollama via \`ollama run llama3\` in your terminal.*`
  },
  BRAIN: {
    bn: `### 🧠 মানব মস্তিষ্ক (Human Brain) - নিউরোঅ্যানাটমি ও কার্যাবলী

#### 📌 ১. সংক্ষিপ্ত পরিচিতি
মানব মস্তিষ্ক হলো মানবদেহের সবচেয়ে জটিল জৈব তথ্য প্রক্রিয়াকরণ কেন্দ্র। দেড় কেজি (১.৪ কেজি) ওজনের এই অঙ্গে প্রায় ৮৬ বিলিয়ন নিউরন এবং ট্রিলিয়ন সিন্যাপটিক সংযোগ বিদ্যমান। এটি শরীরের মোট অক্সিজেনের ২০% এবং গ্লুকোজের ২৫% একাই ব্যবহার করে।

---

#### 🔬 ২. প্রধান ৩টি অংশ ও তাদের কাজ
1. **গুরুমস্তিষ্ক বা সেরিব্রাম (Cerebrum)**:
   - মস্তিষ্কের ৮৫% অংশ জুড়ে অবস্থিত।
   - ২টি সেরিব্রাল হেমিস্ফিয়ার (বাম ও ডান) **কর্পাস ক্যালোসাম** দ্বারা যুক্ত।
   - **৪টি লোব**:
     - *ফ্রন্টাল লোব (Frontal)*: সিদ্ধান্ত গ্রহণ, যুক্তি, ব্যক্তিত্ব, ঐচ্ছিক পেশি নিয়ন্ত্রণ।
     - *প্যারাইটাল লোব (Parietal)*: স্পর্শ, তাপমাত্রা, ব্যথা ও স্থানিক অনুভূতি।
     - *অক্সিপিটাল লোব (Occipital)*: দৃষ্টিশক্তি ও চাক্ষুষ বিশ্লেষণ।
     - *টেম্পোরাল লোব (Temporal)*: শ্রবণ, ভাষা অনুধাবন (Wernicke's Area) ও দীর্ঘস্থায়ী স্মৃতি।
2. **লঘুমস্তিষ্ক বা সেরিবেলাম (Cerebellum)**:
   - দেহের ভারসাম্য, ভঙ্গি (Posture) এবং সূক্ষ্ম পেশি সঞ্চালন (যেমন টাইপিং বা সাইকেল চালানো) সমন্বয় করে।
3. **মস্তিষ্ককাণ্ড (Brainstem)**:
   - **মেডুলা অবলংগাটা, পনস ও মিডব্রেন** দ্বারা গঠিত।
   - শ্বাস-প্রশ্বাস, হৃদস্পন্দন, রক্তচাপ ও খাদ্য গিলে ফেলার মতো অনৈচ্ছিক জীবনরক্ষাকারী কাজ নিয়ন্ত্রণ করে।

---

#### ⚡ ৩. ব্রেন ওয়েভ ও নিউরোট্রান্সমিটার
- **ব্রেন ওয়েভস (EEG Waves)**:
  - *Delta (০.৫-৪ Hz)*: গভীর ঘুম।
  - *Theta (৪-৮ Hz)*: ধ্যান, তন্দ্রাভাব ও সৃজনশীলতা।
  - *Alpha (৮-১২ Hz)*: শান্ত, রিল্যাক্সড জাগ্রত অবস্থা।
  - *Beta (১২-৩০ Hz)*: সক্রিয় চিন্তা, সমস্যা সমাধান ও সতর্কতা।
  - *Gamma (>৩০ Hz)*: উচ্চতর প্রজ্ঞান ও গভীর মনোযোগ।
- **প্রধান নিউরোট্রান্সমিটার**: ডোপামিন (পুরস্কার ও মোটিভেশন), সেরোটোনিন (মুড ও ঘুম), অ্যাসিটাইলকোলিন (স্মৃতি ও পেশি), GABA (প্রধান প্রতিরোধক)।

---

#### 🩺 ৪. স্নায়বিক রোগসমূহ
- **স্ট্রোক (Stroke)**: মস্তিষ্কে রক্তক্ষরণ বা রক্তনালীতে ব্লকেজ।
- **আলঝেইমার রোগ (Alzheimer's)**: বিটা-অ্যামাইলয়েড প্লাক জমে স্মৃতিশক্তি হারানো।
- **পারকিনসন রোগ (Parkinson's)**: সাবস্ট্যানশিয়া নাইগ্রায় ডোপামিন উৎপাদনকারী নিউরনের ক্ষয়।`,
    en: `### 🧠 The Human Brain - Neuroanatomy & Cognitive Physiology

#### 📌 1. Overview
The brain weighs approximately 1.4 kg and contains ~86 billion neurons interconnected by over 100 trillion synapses. Despite accounting for only 2% of total body mass, it consumes 20% of resting oxygen and glucose metabolism.

---

#### 🔬 2. Functional Architecture
- **Cerebrum**:
  - Divided into bilateral hemispheres connected via the **Corpus Callosum**.
  - Four Lobes: Frontal (executive function, motor cortex), Parietal (somatosensory processing), Temporal (audition, language comprehension, memory via Hippocampus), and Occipital (visual cortex).
- **Limbic System**: Amygdala (emotion/fear response), Hippocampus (consolidation of short-term to long-term memory).
- **Cerebellum ("Little Brain")**: Fine-tunes motor coordination, equilibrium, motor learning, and spatial orientation.
- **Brainstem (Midbrain, Pons, Medulla Oblongata)**: Controls autonomic homeostatic mechanisms including cardiovascular output, respiration, and vasomotor tone.

---

#### ⚡ 3. Electrophysiology (Neural Oscillations)
- **Beta Bands (13–30 Hz)**: Active cognition, focus, and analytical task performance.
- **Alpha Bands (8–12 Hz)**: Relaxed alertness, eyes-closed resting state.
- **Theta & Delta (<8 Hz)**: Memory retrieval, REM dreaming, and slow-wave restorative sleep.`
  },
  LUNGS: {
    bn: `### 🫁 মানব ফুসফুস (Human Lungs) - শ্বসনতন্ত্র ও গ্যাস বিনিময়

#### 📌 ১. সংক্ষিপ্ত পরিচিতি
ফুসফুস হলো মানবদেহের প্রধান শ্বসন অঙ্গ। ডান ফুসফুসটি ৩টি লোব (Superior, Middle, Inferior) এবং বাম ফুসফুসটি হৃৎপিণ্ডের অবস্থানের কারণে কিছুটা ছোট ও ২টি লোব নিয়ে গঠিত। ফুসফুস **প্লুরা (Pleura)** নামক দ্বিস্তরীয় ঝিল্লি দ্বারা সুরক্ষিত।

---

#### 🔬 ২. অ্যালভিওলাই ও শ্বসন বৃক্ষ
- বাতাস নাসারন্ধ্র ➔ গলবিল ➔ স্বরযন্ত্র (Larynx) ➔ শ্বাসনালী (Trachea) ➔ ব্রঙ্কাস ➔ ব্রঙ্কিওল হয়ে অ্যালভিওলাইয়ে পৌঁছায়।
- ফুসফুসে প্রায় **৩০০ থেকে ৫০০ মিলিয়ন অ্যালভিওলাই (Alveoli)** রয়েছে।
- এদের সম্মিলিত ক্ষেত্রফল প্রায় ৭০-১০০ বর্গমিটার (একটি টেনিস কোর্টের সমান!)।
- অ্যালভিওলাই প্রাচীর অত্যন্ত পাতলা (মাত্র ০.২-০.৫ মাইক্রোমিটার) এবং এদের চারপাশে কৈশিক জালিকার (Capillaries) ঘন বিস্তার থাকে।
- **সারফ্যাক্ট্যান্ট (Surfactant)**: টাইপ-২ অ্যালভিওলার কোষ থেকে নিঃসৃত তরল যা পৃষ্ঠটান কমিয়ে অ্যালভিওলাইকে চুপসে যাওয়া থেকে রক্ষা করে।

---

#### ⚡ ৩. গ্যাসীয় বিনিময় ও শ্বাসক্রিয়া
- **ডিফিউশন বা ব্যাপন প্রক্রিয়া**: অ্যালভিওলাইয়ের উচ্চ ঘনত্বের অক্সিজেন (PO2 ~ 104 mmHg) রক্তের হিমোগ্লোবিনের সাথে যুক্ত হয়ে অক্সিহিমোগ্লোবিন গঠন করে। অপরদিকে রক্ত থেকে কার্বন ডাই-অক্সাইড অ্যালভিওলাইয়ে ব্যাপিত হয়ে নিঃশ্বাসের সাথে বের হয়ে যায়।
- **মধ্যচ্ছদা বা ডায়াফ্রাম (Diaphragm)**: শ্বাস গ্রহণের সময় সংকুচিত হয়ে নিচে নামে, বক্ষগহ্বরের আয়তন বাড়ে এবং ফুসফুসে বাতাস প্রবেশ করে।
- স্বাভাবিক শ্বাস হার: প্রতি মিনিটে ১২-২০ বার।`,
    en: `### 🫁 The Human Lungs - Respiratory Mechanics & Gas Exchange

#### 📌 1. Overview
The respiratory system facilitates continuous gas exchange, taking in atmospheric O₂ and removing metabolic CO₂. The right lung has three lobes (superior, middle, inferior), while the left lung has two lobes with a cardiac notch accommodating the heart apex.

---

#### 🔬 2. Alveolar-Capillary Interface
- Over **300-500 million alveoli** provide an enormous surface area of 70–100 m² for gas diffusion.
- **Respiratory Membrane Thickness**: ~0.5 micrometers, permitting rapid Fickian diffusion.
- **Pulmonary Surfactant**: Secreted by Type II pneumocytes, it diminishes alveolar surface tension, preventing atelectasis at end-expiration.`
  },
  VISCERAL: {
    bn: `### 🫀 অভ্যন্তরীণ অঙ্গসমূহ (যকৃত ও বৃক্ক/কিডনি) - মেটাবলিজম ও রেচন

#### 📌 ১. যকৃত বা লিভার (Liver) - মানবদেহের সর্ববৃহৎ রাসায়নিক কারখানা
- ওজন প্রায় ১.৫ কেজি।
- **প্রধান কাজসমূহ**:
  - **পিত্তরস (Bile) উৎপাদন**: চর্বি পরিপাক ও শোষণে সহায়তা করে (পিত্তথলিতে জমা থাকে)।
  - **ডিটক্সিফিকেশন**: রক্ত থেকে অ্যালকোহল, বিষাক্ত রাসায়নিক ও ওষুধের অবশেষ নিষ্ক্রিয় করে।
  - **গ্লাইকোজেনেসিস ও গ্লুকোজ নিয়ন্ত্রণ**: অতিরিক্ত গ্লুকোজ গ্লাইকোজেন হিসেবে জমা রাখে।
  - **প্লাজমা প্রোটিন তৈরি**: অ্যালবুমিন এবং রক্ত জমাট বাঁধার ফ্যাক্টর (যেমন ফাইব্রিনোজেন, প্রোথ্রম্বিন) তৈরি করে।

---

#### 📌 ২. বৃক্ক বা কিডনি (Kidneys) - তরল ভারসাম্য ও রেচন
- মেরুদণ্ডের দুপাশে অবস্থিত শিমের দানার মতো দুটি অঙ্গ।
- প্রতিটি কিডনিতে প্রায় **১০ থেকে ১২ লক্ষ নেফ্রন (Nephron)** থাকে যা কিডনির গঠনগত ও কার্যগত একক।
- **রক্ত পরিশোধন ও প্রস্রাব তৈরি**:
  - *আল্ট্রাফিল্ট্রেশন*: বোম্যান্স ক্যাপসুল ও গ্লোমেরুলাসে উচ্চ চাপে রক্ত ফিল্টার হয়। দৈনিক প্রায় ১৮০ লিটার রক্ত রস ফিল্টার হয় (GFR ~ 125 ml/min)।
  - *পুনঃশোষণ*: ৯৯% পানি, গ্লুকোজ ও প্রয়োজনীয় আয়ন রেনাল টিউবিউলে পুনঃশোষিত হয়। দৈনিক মাত্র ১.৫ লিটার প্রস্রাব হিসেবে নির্গত হয়।
  - *হরমোন নিঃসরণ*: এরিথ্রোপোয়েটিন (রক্তকণিকা উৎপাদন উদ্দীপক) ও রেনিন (রক্তচাপ নিয়ন্ত্রক)।`,
    en: `### 🫀 Visceral Organs (Liver & Kidneys) - Metabolism & Excretion

#### 📌 1. Liver (Hepatic System)
- Largest internal organ (~1.5 kg).
- **Metabolic hub**: Converts excess glucose into glycogen; breaks down glycogen during hypoglycemia.
- **Bile Synthesis**: Emulsifies dietary lipids for intestinal absorption.
- **Detoxification**: Cytochrome P450 enzyme family metabolizes xenobiotics, alcohol, and ammonia into urea.
- **Protein Synthesis**: Produces circulating albumin and clotting factors (I, II, V, VII, IX, X).

---

#### 📌 2. Kidneys (Renal System)
- Each kidney contains ~1-1.2 million **nephrons**.
- **Glomerular Filtration Rate (GFR)**: Normal is ~120-125 mL/min (~180 liters/day).
- Over 99% of filtered water and solutes are selectively reabsorbed by the proximal convoluted tubule, loop of Henle, and collecting ducts.`
  },
  DNA: {
    bn: `### 🧬 ডিএনএ হেলিক্স (DNA - Deoxyribonucleic Acid) - জীবনের জিনোমিক কোড

#### 📌 ১. গঠন ও আবিষ্কার
- ১৯৫৩ সালে জেমস ওয়াটসন ও ফ্রান্সিস ক্রিক ডিএনএ-র দ্বি-সূত্রক (Double Helix) গঠন আবিষ্কার করেন।
- এটি ডিঅক্সিরাইবোজ শর্করা, ফসফেট গ্রুপ এবং ৪ প্রকার নাইট্রোজেনাস ক্ষার দ্বারা গঠিত:
  - **অ্যাডিনিন (A)** ও **থাইমিন (T)** (২টি হাইড্রোজেন বন্ধন দিয়ে যুক্ত)।
  - **গুয়ানিন (G)** ও **সাইটোসিন (C)** (৩টি শক্তিশালী হাইড্রোজেন বন্ধন দিয়ে যুক্ত)।

---

#### 🔬 ২. সেন্ট্রাল ডগমা (Central Dogma of Biology)
1. **Replication**: ডিএনএ পলিমারেজ এনজাইমের সাহায্যে ডিএনএ থেকে হুবহু নতুন ডিএনএ তৈরি।
2. **Transcription**: ডিএনএ থেকে মেসেঞ্জার আরএনএ (mRNA) তৈরি।
3. **Translation**: রাইবোসোমে mRNA-এর কোড পড়ে প্রয়োজনীয় প্রোটিন ও এনজাইম সংশ্লেষণ।`,
    en: `### 🧬 DNA Double Helix - Molecular Genetics & Architecture

#### 📌 1. Structural Blueprint
- Discovered by Watson & Crick (1953), DNA consists of antiparallel polynucleotide chains coiled into a right-handed double helix.
- **Watson-Crick Base Pairing**:
  - Adenine pairs with Thymine via 2 hydrogen bonds (A = T).
  - Guanine pairs with Cytosine via 3 hydrogen bonds (G = C).

---

#### 🔬 2. The Central Dogma
- **Replication**: DNA helicase unwinds the double helix, and DNA polymerase synthesizes complementary strands.
- **Transcription**: RNA polymerase generates precursor mRNA within the nucleus.
- **Translation**: Ribosomes decode triplet codons into polypeptide amino acid sequences.`
  }
};

/**
 * Get instant fallback knowledge if Ollama is unreachable
 */
export function getOfflineOrganKnowledge(query = '', activeOrgan = 'HEART') {
  const q = query.toLowerCase();
  let targetOrgan = activeOrgan;

  if (q.includes('heart') || q.includes('হৃদ') || q.includes('হার্ট') || q.includes('রক্ত') || q.includes('cardio')) {
    targetOrgan = 'HEART';
  } else if (q.includes('brain') || q.includes('মস্তিষ্ক') || q.includes('ব্রেন') || q.includes('স্নায়ু') || q.includes('neuron')) {
    targetOrgan = 'BRAIN';
  } else if (q.includes('lung') || q.includes('ফুসফুস') || q.includes('শ্বাস') || q.includes('alveoli')) {
    targetOrgan = 'LUNGS';
  } else if (q.includes('liver') || q.includes('kidney') || q.includes('কিডনি') || q.includes('যকৃত') || q.includes('viscera')) {
    targetOrgan = 'VISCERAL';
  } else if (q.includes('dna') || q.includes('জিন') || q.includes('helix') || q.includes('ক্রোমোজোম')) {
    targetOrgan = 'DNA';
  }

  const isBengali = /[\u0980-\u09FF]/.test(query) || q.includes('koro') || q.includes('bolo') || q.includes('ki') || q.includes('kemne');
  const knowledge = OFFLINE_ORGAN_KNOWLEDGE[targetOrgan] || OFFLINE_ORGAN_KNOWLEDGE.HEART;

  return isBengali ? knowledge.bn : knowledge.en;
}
