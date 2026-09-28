import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Settings,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Cpu,
  AlertCircle,
  HelpCircle,
  Minimize2,
  Maximize2,
  Heart,
  Brain,
  Wind,
  Activity,
  Dna,
  Terminal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import MarkdownView from './MarkdownView';
import {
  DEFAULT_OLLAMA_ENDPOINT,
  DIRECT_OLLAMA_ENDPOINT,
  DEFAULT_MODEL,
  ORGAN_PROMPT_MAP,
  fetchOllamaModels,
  buildSystemPrompt,
  streamOllamaChat,
  getOfflineOrganKnowledge
} from '../services/ollamaService';

const ORGAN_ICON_MAP = {
  HEART: Heart,
  BRAIN: Brain,
  LUNGS: Wind,
  VISCERAL: Activity,
  DNA: Dna
};

const QUICK_PROMPTS = {
  HEART: [
    {
      labelBn: '🫀 হৃৎপিণ্ডের ৪টি প্রকোষ্ঠ ও কপাটিকা',
      promptBn: 'হৃৎপিণ্ডের ৪টি প্রকোষ্ঠ এবং ৪টি কপাটিকার গঠন ও কাজ বিস্তারিত বুঝিয়ে বলো।',
      labelEn: '🫀 4 Chambers & Valves',
      promptEn: 'Explain the anatomy and functions of the 4 chambers and 4 valves of the human heart in detail.'
    },
    {
      labelBn: '⚡ SA নোড ও কার্ডিয়াক সাইকেল',
      promptBn: 'হৃৎপিণ্ডের SA Node এবং কার্ডিয়াক সাইকেল (Systole ও Diastole) কিভাবে কাজ করে?',
      labelEn: '⚡ SA Node & Cardiac Cycle',
      promptEn: 'How does the Sinoatrial (SA) node trigger electrical impulses, and how does the cardiac cycle work?'
    },
    {
      labelBn: '🩺 হার্ট অ্যাটাক কেন হয়?',
      promptBn: 'মায়োকার্ডিয়াল ইনফার্কশন (হার্ট অ্যাটাক) কেন হয় এবং এর লক্ষণ ও প্রতিকার কী?',
      labelEn: '🩺 What Causes a Heart Attack?',
      promptEn: 'What causes Myocardial Infarction (heart attack), what are its primary symptoms and emergency care?'
    },
    {
      labelBn: '🩸 রক্ত সংবহন প্রবাহ (Circulation)',
      promptBn: 'দেহে পালমোনারি এবং সিস্টেমিক রক্ত সংবহন কীভাবে সম্পন্ন হয়?',
      labelEn: '🩸 Pulmonary vs Systemic Flow',
      promptEn: 'How does pulmonary and systemic blood circulation work through the cardiovascular system?'
    }
  ],
  BRAIN: [
    {
      labelBn: '🧠 মস্তিষ্কের প্রধান অংশসমূহ ও কাজ',
      promptBn: 'সেরিব্রাম, সেরিবেলাম ও ব্রেনস্টেমের কাজ বিস্তারিত ব্যাখ্যা করো।',
      labelEn: '🧠 Brain Regions & Functions',
      promptEn: 'Explain the functions of the cerebrum, cerebellum, and brainstem in detail.'
    },
    {
      labelBn: '⚡ ব্রেন ওয়েভস (Beta, Alpha, Theta)',
      promptBn: 'মস্তিষ্কের আলফা, বিটা, থিটা এবং ডেল্টা তরঙ্গের পার্থক্য ও মানসিক অবস্থা কী?',
      labelEn: '⚡ Brainwave Frequencies',
      promptEn: 'Explain the differences between Alpha, Beta, Theta, and Gamma brainwave frequencies.'
    },
    {
      labelBn: '🔬 নিউরন ও সিন্যাপস সংযোগ',
      promptBn: 'একটি নিউরন কীভাবে অ্যাকশন পটেনশিয়াল ও নিউরোট্রান্সমিটারের মাধ্যমে সংকেত পাঠায়?',
      labelEn: '🔬 Neurons & Synapses',
      promptEn: 'How do neurons transmit action potentials and neurotransmitters across synaptic clefts?'
    },
    {
      labelBn: '🩺 স্ট্রোক কেন হয়?',
      promptBn: 'স্ট্রোকের কারণ, ইস্কেমিক বনাম হেমোরেজিক স্ট্রোকের পার্থক্য ও সতর্কবার্তা বলো।',
      labelEn: '🩺 What Causes a Stroke?',
      promptEn: 'Explain the causes of ischemic vs hemorrhagic stroke and critical warning signs.'
    }
  ],
  LUNGS: [
    {
      labelBn: '🫁 অ্যালভিওলাই ও গ্যাস বিনিময়',
      promptBn: 'অ্যালভিওলাইয়ে অক্সিজেন ও কার্বন ডাই-অক্সাইডের গ্যাসীয় বিনিময় কিভাবে সম্পন্ন হয়?',
      labelEn: '🫁 Alveoli & Gas Exchange',
      promptEn: 'How does gas exchange of oxygen and carbon dioxide occur across alveolar membranes?'
    },
    {
      labelBn: '💨 শ্বাসক্রিয়া ও ডায়াফ্রামের ভূমিকা',
      promptBn: 'শ্বাস গ্রহণ ও ত্যাগে মধ্যচ্ছদা বা ডায়াফ্রামের ভূমিকা এবং মেকানিক্স ব্যাখ্যা করো।',
      labelEn: '💨 Diaphragm Mechanics',
      promptEn: 'Explain the mechanics of inhalation and exhalation driven by the diaphragm and intercostal muscles.'
    },
    {
      labelBn: '🩺 অ্যাজমা ও নিউমোনিয়ার পার্থক্য',
      promptBn: 'শ্বসনতন্ত্রের প্রধান রোগ যেমন অ্যাজমা ও নিউমোনিয়া ফুসফুসকে কীভাবে আক্রান্ত করে?',
      labelEn: '🩺 Asthma vs Pneumonia',
      promptEn: 'What is the physiological difference between asthma and pneumonia in the lungs?'
    }
  ],
  VISCERAL: [
    {
      labelBn: '🫀 লিভারের প্রধান মেটাবলিক কাজ',
      promptBn: 'যকৃত বা লিভার কীভাবে ডিটক্সিফিকেশন, পিত্তরস তৈরি এবং গ্লুকোজ সংরক্ষণ করে?',
      labelEn: '🫀 Liver Metabolism',
      promptEn: 'Explain the primary metabolic, detoxification, and bile production roles of the liver.'
    },
    {
      labelBn: '🩸 নেফ্রন ও কিডনির ফিল্ট্রেশন',
      promptBn: 'কিডনির নেফ্রন কীভাবে রক্ত ফিল্টার করে এবং ইউরিন তৈরি করে? GFR কী?',
      labelEn: '🩸 Nephrons & Renal GFR',
      promptEn: 'How do nephrons in the kidneys filter blood and produce urine? What is GFR?'
    },
    {
      labelBn: '🧪 পরিপাক রস ও পাচনতন্ত্র',
      promptBn: 'পাকস্থলী ও অগ্ন্যাশয়ের পরিপাক রস ও এনজাইম কীভাবে খাদ্য পরিপাকে কাজ করে?',
      labelEn: '🧪 Gastric & Pancreatic Enzymes',
      promptEn: 'How do gastric acids and pancreatic digestive enzymes break down food nutrients?'
    }
  ],
  DNA: [
    {
      labelBn: '🧬 ডিএনএ ডাবল হেলিক্সের রাসায়নিক গঠন',
      promptBn: 'ডিএনএ-র দ্বি-সূত্রক হেলিক্স গঠন এবং Watson-Crick বেস পেয়ারিং বিস্তারিত ব্যাখ্যা করো।',
      labelEn: '🧬 DNA Double Helix',
      promptEn: 'Explain Watson-Crick base pairing and the antiparallel double-helix structure of DNA.'
    },
    {
      labelBn: '🔄 ট্রান্সক্রিপশন ও ট্রান্সলেশন',
      promptBn: 'সেন্ট্রাল ডগমা অনুসারে ডিএনএ থেকে কীভাবে mRNA ও প্রোটিন তৈরি হয়?',
      labelEn: '🔄 Transcription & Translation',
      promptEn: 'Explain the Central Dogma: how genetic code is transcribed into mRNA and translated into proteins.'
    },
    {
      labelBn: '🔬 জিন মিউটেশন ও রোগ',
      promptBn: 'ডিএনএ সিকোয়েন্সে মিউটেশন কীভাবে ঘটে এবং এর ফলে কি ধরনের জিনগত রোগ হতে পারে?',
      labelEn: '🔬 Genetic Mutations',
      promptEn: 'How do genetic mutations occur in DNA base sequences, and what are their clinical impacts?'
    }
  ]
};

export default function OrganAIChatbot({
  isOpen,
  onClose,
  activeOrgan = 'HEART',
  onSelectOrgan,
  telemetry = {},
  theme = 'dark',
  language = 'en'
}) {
  const isLight = theme === 'light';

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'bn'
          ? `### 🤖 স্বাগতম! আমি BioAI - অর্গান স্পেশালিস্ট এআই

আমি **3D Human Bio-Simulator**-এর অ্যানাটমি ও ফিজিওলজি সহকারী। আপনি যেকোনো মানব অঙ্গ (হৃৎপিণ্ড, মস্তিষ্ক, ফুসফুস, লিভার, কিডনি, ডিএনএ ইত্যাদি) সম্পর্কে প্রশ্ন করতে পারেন।

- 🩺 **বর্তমানে ভিউয়ারে সক্রিয়**: **${ORGAN_PROMPT_MAP[activeOrgan]?.nameBn || activeOrgan}**
- ⚡ **ভাষা সমর্থন**: বাংলা, বাংলিশ বা ইংরেজিতে যে কোনো প্রশ্ন করতে পারেন।
- 💡 নিচে দেওয়া কুইক টপিক বাটনে ক্লিক করে বা সরাসরি টাইপ করে শুরু করুন!`
          : `### 🤖 Welcome! I am BioAI - Human Organ Specialist

I am the interactive Anatomy & Physiology clinical assistant for **3D Human Bio-Simulator**. You can explore any vital organ (Heart, Brain, Lungs, Viscera, DNA Helix) and its physiological mechanics.

- 🩺 **Active 3D Organ**: **${ORGAN_PROMPT_MAP[activeOrgan]?.nameEn || activeOrgan}**
- ⚡ **Language**: Ask questions in English or বাংলা.
- 💡 Click any suggested topic chip below or type your inquiry to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      organ: activeOrgan
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [ollamaStatus, setOllamaStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [endpoint, setEndpoint] = useState(DEFAULT_OLLAMA_ENDPOINT);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const CurrentOrganIcon = ORGAN_ICON_MAP[activeOrgan] || Heart;

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Check Ollama connection on mount and when endpoint changes
  const checkConnection = async (targetEndpoint = endpoint) => {
    setOllamaStatus('checking');
    try {
      const result = await fetchOllamaModels(targetEndpoint);
      if (result.success && result.models.length > 0) {
        setOllamaStatus('connected');
        setModels(result.models);
        // If current selectedModel is not in list, pick the first available
        if (!result.models.includes(selectedModel)) {
          setSelectedModel(result.models[0]);
        }
      } else if (result.success && result.models.length === 0) {
        // Connected to Ollama but no models installed
        setOllamaStatus('connected');
        setModels([]);
      } else {
        setOllamaStatus('offline');
      }
    } catch {
      setOllamaStatus('offline');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // Update welcome notice when activeOrgan changes
  useEffect(() => {
    const organInfo = ORGAN_PROMPT_MAP[activeOrgan];
    const organName = language === 'bn' ? (organInfo?.nameBn || activeOrgan) : (organInfo?.nameEn || activeOrgan);

    setMessages((prev) => [
      ...prev,
      {
        id: `organ-switch-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'bn'
            ? `🔄 **সক্রিয় অঙ্গ পরিবর্তন**: এখন **${organName}** নির্বাচন করা হয়েছে। আপনি এই অঙ্গের কাজ, রোগব্যাধি ও ফিজিওলজি সম্পর্কে জানতে পারেন।`
            : `🔄 **Active Organ Switched**: Now viewing **${organName}**. You can inspect its physiology, cellular mechanisms, and clinical pathology.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        organ: activeOrgan
      }
    ]);
  }, [activeOrgan]);

  // Handle Send Message
  const handleSendMessage = async (customPrompt) => {
    const promptToSend = (customPrompt || input).trim();
    if (!promptToSend || isLoading) return;

    if (!customPrompt) setInput('');

    // Cancel any ongoing speech
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Create user message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      organ: activeOrgan
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setStreamingContent('');

    const systemPrompt = buildSystemPrompt(activeOrgan, telemetry);

    // Build chat history for Ollama
    const conversationHistory = [
      { role: 'system', content: systemPrompt },
      ...messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: promptToSend }
    ];

    abortControllerRef.current = new AbortController();

    try {
      let accumulatedResponse = '';

      await streamOllamaChat(
        conversationHistory,
        (chunk) => {
          accumulatedResponse += chunk;
          setStreamingContent(accumulatedResponse);
        },
        {
          endpoint,
          model: selectedModel,
          signal: abortControllerRef.current.signal
        }
      );

      // Successfully streamed
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: accumulatedResponse || (language === 'bn' ? 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।' : 'No response received.'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          organ: activeOrgan,
          modelUsed: selectedModel
        }
      ]);
      setOllamaStatus('connected');
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      console.warn('Ollama streaming failed, falling back to bio encyclopedia:', err);
      setOllamaStatus('offline');

      // Offline intelligent knowledge fallback
      const fallbackAnswer = getOfflineOrganKnowledge(activeOrgan, promptToSend);

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `${fallbackAnswer}\n\n> ⚠️ *${
            language === 'bn'
              ? `নোট: লোকাল Ollama-র সংযোগ ব্যাহত হয়েছে (${err.message})। উপরোক্ত তথ্য বিল্ট-ইন অ্যানাটমিক্যাল এনসাইক্লোপিডিয়া থেকে সরবরাহ করা হয়েছে।`
              : `Note: Local Ollama connection failed (${err.message}). The above details were provided by the built-in clinical bio-encyclopedia.`
          }*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          organ: activeOrgan,
          isOfflineFallback: true
        }
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  // Copy message to clipboard
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text to Speech
  const handleToggleSpeech = (text) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/[#*`_~>-]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 750); // limit spoken snippet length

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isBengali = /[\u0980-\u09FF]/.test(text);
    if (isBengali) {
      utterance.lang = 'bn-BD';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Clear Chat
  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    const organInfo = ORGAN_PROMPT_MAP[activeOrgan];
    const organName = language === 'bn' ? (organInfo?.nameBn || activeOrgan) : (organInfo?.nameEn || activeOrgan);

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'bn'
            ? `চ্যাট হিস্ট্রি রিসেট করা হয়েছে। আপনি **${organName}** বা অন্য যেকোনো অঙ্গ সম্পর্কে প্রশ্ন করতে পারেন।`
            : `Chat history reset. You can ask any question regarding **${organName}** or any other anatomical structure.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        organ: activeOrgan
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`fixed top-16 right-0 bottom-0 z-40 flex flex-col backdrop-blur-2xl border-l transition-all duration-300 font-sans shadow-2xl ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-800 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]'
          : 'bg-slate-950/95 border-cyan-500/30 text-slate-100 shadow-[-10px_0_30px_rgba(0,0,0,0.7)]'
      } ${
        isExpanded ? 'w-full md:w-[680px]' : 'w-full sm:w-[440px] md:w-[480px]'
      } ${language === 'bn' ? 'font-bangla' : ''}`}
    >
      {/* Top Header Bar */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
          isLight ? 'border-slate-200 bg-slate-50/90' : 'border-slate-800 bg-slate-900/60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`relative flex items-center justify-center w-8 h-8 rounded-xl border transition-all ${
              isLight
                ? 'bg-cyan-50 border-cyan-300 text-cyan-700 shadow-sm'
                : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
            }`}
          >
            <Bot className="w-4 h-4 animate-pulse" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${
                isLight ? 'border-white' : 'border-slate-950'
              } ${
                ollamaStatus === 'connected'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : ollamaStatus === 'checking'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`text-xs sm:text-sm font-extrabold tracking-wider ${
                  language === 'bn' ? 'font-bangla' : "font-['Orbitron']"
                } bg-gradient-to-r ${
                  isLight
                    ? 'from-cyan-700 via-sky-600 to-emerald-600'
                    : 'from-cyan-300 via-sky-200 to-emerald-300'
                } bg-clip-text text-transparent`}
              >
                {language === 'bn' ? 'বায়ো-এআই সহকারী' : 'BIO-AI ASSISTANT'}
              </h2>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                  isLight
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-700 font-semibold'
                    : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                }`}
              >
                OLLAMA
              </span>
            </div>
            <div className={`flex items-center gap-2 text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  ollamaStatus === 'connected' ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span>
                {ollamaStatus === 'connected'
                  ? `Model: ${selectedModel}`
                  : ollamaStatus === 'checking'
                  ? (language === 'bn' ? 'Ollama সংযোগ পরীক্ষা হচ্ছে...' : 'Connecting to Ollama...')
                  : (language === 'bn' ? 'অফলাইন এনসাইক্লোপিডিয়া মোড' : 'Ollama Offline (Bio-Data)')}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Ollama Settings"
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showSettings
                ? isLight
                  ? 'bg-cyan-100 border-cyan-400 text-cyan-800'
                  : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : isLight
                  ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Expand / Minimize Width */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Standard Width' : 'Expand Width'}
            className={`hidden md:flex p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Panel */}
          <button
            onClick={onClose}
            title="Close Assistant"
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/50'
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Organ Context Pill */}
      <div
        className={`px-4 py-2 border-b flex items-center justify-between text-xs font-mono transition-colors ${
          isLight ? 'border-slate-200 bg-slate-100/80 text-slate-700' : 'border-slate-800/80 bg-slate-950/70 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <CurrentOrganIcon className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'} animate-pulse`} />
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
            {language === 'bn' ? 'সক্রিয় অঙ্গ:' : 'Context:'}
          </span>
          <span className={`${isLight ? 'text-cyan-800 font-bold' : 'text-cyan-300 font-semibold'} tracking-wide`}>
            {language === 'bn'
              ? (ORGAN_PROMPT_MAP[activeOrgan]?.nameBn || activeOrgan)
              : (ORGAN_PROMPT_MAP[activeOrgan]?.nameEn || activeOrgan)}
          </span>
        </div>
        {telemetry.heartBpm && activeOrgan === 'HEART' && (
          <span className="text-[11px] text-rose-500 font-mono font-bold">
            {telemetry.heartBpm} BPM
          </span>
        )}
        {telemetry.brainWaveMode && activeOrgan === 'BRAIN' && (
          <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
            {telemetry.brainWaveMode} Wave
          </span>
        )}
        {telemetry.lungBreathRate && activeOrgan === 'LUNGS' && (
          <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
            {telemetry.lungBreathRate} Breaths/m
          </span>
        )}
      </div>

      {/* Settings Modal / Collapsible Section */}
      {showSettings && (
        <div
          className={`p-3 border-b text-xs font-mono space-y-2.5 transition-colors ${
            isLight ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-cyan-500/20 bg-slate-900/90 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span className={isLight ? 'text-cyan-800' : 'text-cyan-300'}>
              ⚙️ {language === 'bn' ? 'ওলামা কনফিগারেশন' : 'OLLAMA CONFIGURATION'}
            </span>
            <button
              onClick={() => checkConnection(endpoint)}
              className={`flex items-center gap-1 text-[11px] cursor-pointer ${
                isLight ? 'text-slate-600 hover:text-cyan-700' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <RefreshCw className="w-3 h-3" /> {language === 'bn' ? 'সংযোগ পরীক্ষা' : 'Test Connection'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className={`block text-[10px] mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                API Endpoint
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api/ollama"
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-800 focus:border-cyan-500'
                    : 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[10px] mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Model Name
              </label>
              {models.length > 0 ? (
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-800 focus:border-cyan-500'
                      : 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500'
                  }`}
                >
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  placeholder="llama3"
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-800 focus:border-cyan-500'
                      : 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500'
                  }`}
                />
              )}
            </div>
          </div>

          {ollamaStatus === 'offline' && (
            <div
              className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${
                isLight
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-200/90'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span>
                  {language === 'bn'
                    ? 'ওলামা লোকাল সার্ভার অফলাইনে আছে। লোকাল এলএলএম চালাতে কমান্ড দিন:'
                    : 'Ollama server is offline. To chat with local models, run:'}
                </span>
                <code className={`block mt-1 px-1.5 py-0.5 rounded font-mono text-[10px] ${
                  isLight ? 'bg-amber-100 text-amber-900' : 'bg-black/40 text-amber-300'
                }`}>
                  ollama run llama3
                </code>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offline Notification Banner if Ollama is not connected */}
      {ollamaStatus === 'offline' && !showSettings && (
        <div
          className={`px-3 py-1.5 border-b flex items-center justify-between text-[11px] font-mono ${
            isLight
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-amber-950/30 border-amber-500/20 text-amber-300/90'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>
              {language === 'bn'
                ? 'অফলাইন মোড (বায়ো-এনসাইক্লোপিডিয়া সক্রিয়)'
                : 'Ollama Offline (Using Bio-Encyclopedia)'}
            </span>
          </div>
          <button
            onClick={() => checkConnection(endpoint)}
            className={`hover:underline text-[10px] cursor-pointer font-semibold ${
              isLight ? 'text-cyan-800' : 'text-cyan-300'
            }`}
          >
            {language === 'bn' ? 'পুনরায় চেষ্টা' : 'Retry Connect'}
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`flex items-center gap-2 mb-1 px-1 text-[10px] font-mono ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <span>{isUser ? (language === 'bn' ? 'আপনি' : 'USER') : (language === 'bn' ? 'বায়ো-এআই' : 'BIO-AI ASSISTANT')}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.isOfflineFallback && (
                  <span
                    className={`px-1 rounded border ${
                      isLight
                        ? 'bg-amber-100 border-amber-300 text-amber-800 font-semibold'
                        : 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {language === 'bn' ? 'এনসাইক্লোপিডিয়া' : 'ENCYCLOPEDIA'}
                  </span>
                )}
                {msg.modelUsed && (
                  <span
                    className={`px-1 rounded border ${
                      isLight
                        ? 'bg-cyan-100 border-cyan-300 text-cyan-800 font-semibold'
                        : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
                    }`}
                  >
                    {msg.modelUsed}
                  </span>
                )}
              </div>

              <div
                className={`relative max-w-[92%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-md leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none font-medium'
                    : isLight
                      ? 'bg-slate-100/90 border border-slate-200 text-slate-800 rounded-tl-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <MarkdownView content={msg.content} />
                )}

                {/* Message Utility Controls */}
                {!isUser && (
                  <div
                    className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                      isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${
                          isLight ? 'hover:text-cyan-700' : 'hover:text-cyan-300'
                        }`}
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleSpeech(msg.content)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${
                          isLight ? 'hover:text-cyan-700' : 'hover:text-cyan-300'
                        }`}
                        title="Read aloud"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-500" />
                            <span className="text-rose-500 font-semibold">{language === 'bn' ? 'অডিও থামান' : 'Stop Audio'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>{language === 'bn' ? 'শুনুন' : 'Listen'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Streaming Indicator & In-Progress Chunk */}
        {isLoading && streamingContent && (
          <div className="flex flex-col items-start">
            <div className={`flex items-center gap-2 mb-1 px-1 text-[10px] font-mono animate-pulse ${
              isLight ? 'text-cyan-700' : 'text-cyan-400'
            }`}>
              <span>{language === 'bn' ? 'বায়ো-এআই লিখছে...' : 'BIO-AI GENERATING...'}</span>
            </div>
            <div
              className={`max-w-[92%] rounded-2xl rounded-tl-none p-3.5 border text-xs sm:text-sm shadow-md leading-relaxed ${
                isLight
                  ? 'bg-slate-100 border-cyan-400 text-slate-800'
                  : 'bg-slate-900/90 border-cyan-500/40 text-slate-100'
              }`}
            >
              <MarkdownView content={streamingContent} />
              <span className={`inline-block w-2 h-4 ml-1 animate-pulse align-middle ${
                isLight ? 'bg-cyan-600' : 'bg-cyan-400'
              }`} />
            </div>
          </div>
        )}

        {/* Loading Spinner when awaiting first token */}
        {isLoading && !streamingContent && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono max-w-fit ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-cyan-800'
                : 'bg-slate-900/70 border-slate-800 text-cyan-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-500" />
            <span>{language === 'bn' ? 'অ্যানাটমিক্যাল মডেল বিশ্লেষণ হচ্ছে...' : 'Consulting anatomical model...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips for Active Organ */}
      <div
        className={`px-3 py-2 border-t overflow-x-auto transition-colors ${
          isLight ? 'border-slate-200 bg-slate-50/90' : 'border-slate-800/80 bg-slate-950/60'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-max pb-1">
          <span className={`text-[10px] font-mono flex items-center gap-1 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <Sparkles className="w-3 h-3 text-cyan-500" /> {language === 'bn' ? 'দ্রুত জিজ্ঞাসা:' : 'Quick Ask:'}
          </span>
          {(QUICK_PROMPTS[activeOrgan] || QUICK_PROMPTS.HEART).map((qp, idx) => (
            <button
              key={idx}
              onClick={() =>
                handleSendMessage(language === 'bn' ? qp.promptBn : (qp.promptEn || qp.promptBn))
              }
              disabled={isLoading}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400 hover:text-cyan-700 hover:bg-cyan-50/50 shadow-xs'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-cyan-500/60 hover:text-cyan-300'
              }`}
            >
              {language === 'bn' ? qp.labelBn : (qp.labelEn || qp.labelBn)}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Chat Input Form */}
      <div
        className={`p-3 border-t transition-colors ${
          isLight ? 'border-slate-200 bg-slate-50/95' : 'border-slate-800 bg-slate-900/90'
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'bn'
                  ? `অর্গান সম্পর্কে যে কোনো প্রশ্ন লিখুন (${ORGAN_PROMPT_MAP[activeOrgan]?.nameBn || 'হৃৎপিণ্ড'})...`
                  : `Ask any question about ${ORGAN_PROMPT_MAP[activeOrgan]?.nameEn || 'vital organs'}...`
              }
              disabled={isLoading}
              className={`w-full pl-3 pr-8 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30'
                  : 'bg-slate-950 border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div
          className={`flex items-center justify-between mt-2 px-1 text-[10px] font-mono ${
            isLight ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          <span>Supported: বাংলা, English, Banglish</span>
          <button
            onClick={handleClearChat}
            className={`transition-colors cursor-pointer ${
              isLight ? 'hover:text-slate-800' : 'hover:text-slate-300'
            }`}
          >
            {language === 'bn' ? 'হিস্ট্রি মুছুন' : 'Clear History'}
          </button>
        </div>
      </div>
    </aside>
  );
}
