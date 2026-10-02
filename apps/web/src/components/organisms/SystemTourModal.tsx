import React, { useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import { usePatient } from "../../context/PatientContext";
import { NavigationTab } from "../templates/MainLayout";
import {
  Compass,
  X,
  ArrowRight,
  ArrowLeft,
  Activity,
  Sparkles,
  Receipt,
  Network,
  ShieldCheck,
  Binary,
  CheckCircle2,
  ExternalLink,
  Users,
} from "lucide-react";

export interface SystemTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const SystemTourModal: React.FC<SystemTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { isRTL } = useLocale();
  const { patientId, setPatientId } = usePatient();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      badge: "Step 1 of 5 • Data Spine",
      title: "Unified Patient 360 Spine",
      titleAr: "ملف المريض الشامل والعمود الفقري للبيانات",
      icon: <Activity className="w-6 h-6 text-[#4F7C82]" />,
      description:
        "Hospyar unifies fragmented health records into a single clinical canvas. Demographics, National IDs (Emirates ID & Saudi ID), blood types, and hospital admissions are linked to regional Health Information Exchanges (Malaffi in UAE, NPHIES in Saudi Arabia).",
      descriptionAr:
        "يقوم هوسبيار بتوحيد السجلات الطبية المجزأة في واجهة سريرية موحدة. يتم ربط الهويات الوطنية وفصائل الدم وبيانات الدخول بأنظمة الربط الصحي الخليجية (ملفي في الإمارات، ونفيس في السعودية).",
      highlights: [
        {
          label: "LOINC Vitals & Labs",
          detail:
            "Heart rate, blood pressure, fasting glucose, and HbA1c with directional trend alerts (UP, DOWN, STABLE).",
        },
        {
          label: "SNOMED CT Diagnoses",
          detail:
            "Ontological diagnosis mapping (e.g. Type 2 Diabetes #44054006) preventing terminology drift.",
        },
        {
          label: "Predictive Risk Gauges",
          detail:
            "Real-time AI scores for 30-day readmission risk, mortality index, and claim denial probability.",
        },
      ],
      interactiveAction: (
        <div className="bg-[#F8FCFD] border border-[#93B1B5] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0B2E33]">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#4F7C82]" />
              Try Switching Patient:
            </span>
            <span className="font-mono text-[#6B8B99] text-[11px]">
              Active: {patientId}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPatientId("PAT-78921")}
              className={`p-2 rounded-lg text-left text-xs transition-all border ${
                patientId === "PAT-78921"
                  ? "border-[#4F7C82] bg-white text-[#0B2E33] shadow-sm font-bold"
                  : "border-transparent bg-white/60 hover:bg-white text-[#6B8B99]"
              }`}
            >
              <div className="font-semibold text-[#0B2E33]">
                🇦🇪 Tariq Al-Hashemi
              </div>
              <div className="text-[10px] text-[#6B8B99]">
                UAE Malaffi • O+ • Medium Risk
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPatientId("PAT-10492")}
              className={`p-2 rounded-lg text-left text-xs transition-all border ${
                patientId === "PAT-10492"
                  ? "border-[#4F7C82] bg-white text-[#0B2E33] shadow-sm font-bold"
                  : "border-transparent bg-white/60 hover:bg-white text-[#6B8B99]"
              }`}
            >
              <div className="font-semibold text-[#0B2E33]">
                🇸🇦 Fatima Al-Otaibi
              </div>
              <div className="text-[10px] text-[#6B8B99]">
                KSA NPHIES • A+ • High Risk
              </div>
            </button>
          </div>
        </div>
      ),
      jumpTab: "patient360" as NavigationTab,
      jumpText: "Explore Patient 360 Canvas",
    },
    {
      stepNumber: 2,
      badge: "Step 2 of 5 • Retrieval Engine",
      title: "Tri-Fold Deterministic Retrieval (HybridRAG)",
      titleAr: "محرك الاسترجاع الثلاثي المحدد (HybridRAG)",
      icon: <Sparkles className="w-6 h-6 text-[#4F7C82]" />,
      description:
        "Traditional healthcare AI hallucinates clinical numbers and medications. Hospyar solves this with deterministic tri-fold routing: natural language prompts are routed through three specialized pipelines before reaching the LLM.",
      descriptionAr:
        "تعاني أنظمة الذكاء الاصطناعي التقليدية من الهلوسة في الأرقام والأدوية. يحل هوسبيار ذلك عبر التوجيه الثلاثي المحدد عبر مسارات متخصصة تضمن دقة مطلقة قبل توليد الإجابة.",
      highlights: [
        {
          label: "1. VectorRAG (Semantic Chunks)",
          detail:
            "Dense embeddings (bge-large-en) over MIMIC-IV clinical discharge summaries and consult notes.",
        },
        {
          label: "2. GraphRAG (Ontology Hierarchies)",
          detail:
            "NetworkX graph traversal across SNOMED CT and LOINC concept trees to prevent semantic drift.",
        },
        {
          label: "3. Text2SQL (Relational Math)",
          detail:
            "Executes direct SQL queries against Snowflake tables for exact numeric labs and billing values with 0% math error.",
        },
      ],
      interactiveAction: (
        <div className="bg-[#0B2E33] text-white rounded-xl p-3.5 space-y-2 text-xs font-mono">
          <div className="text-[#B8E3E9] text-[11px] font-bold">
            Routing Pipeline Example:
          </div>
          <div className="bg-[#061D20] p-2.5 rounded border border-[#4F7C82]/40 text-[11px] space-y-1">
            <span className="text-[#93B1B5]">Prompt:</span> &quot;What was the
            patient fasting glucose and discharge plan?&quot;
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#4F7C82]/60 text-white">
                → Text2SQL: 142 mg/dL
              </span>
              <span className="px-2 py-0.5 rounded bg-[#6B8B99]/60 text-white">
                → VectorRAG: Metformin BID
              </span>
              <span className="px-2 py-0.5 rounded bg-[#B8E3E9]/20 text-[#B8E3E9]">
                → Cortex AI LLM
              </span>
            </div>
          </div>
        </div>
      ),
      jumpTab: "copilot" as NavigationTab,
      jumpText: "Try AI Copilot Q&A",
    },
    {
      stepNumber: 3,
      badge: "Step 3 of 5 • Hallucination Defense",
      title: "100% Verbatim Citation Anchors",
      titleAr: "مراسي الاقتباس الحرفي والموثق بنسبة 100٪",
      icon: <ShieldCheck className="w-6 h-6 text-[#4F7C82]" />,
      description:
        "In clinical governance, an AI statement without a citation is unsafe. Every factual assertion generated by Hospyar is cryptographically bound to an immutable citation badge [CIT-xxx] pointing to an exact FHIR resource or clinical note span.",
      descriptionAr:
        "في الحوكمة السريرية، يعتبر أي تصريح دون مصدر غير آمن. كل معلومة ينتجها هوسبيار ترتبط بمصدر غير قابل للتغيير يشير بدقة إلى السجل الطبي أو الفقرة المحددة.",
      highlights: [
        {
          label: "Interactive Evidence Drawer",
          detail:
            "Click any [CIT-001] or [CIT-002] badge in the Copilot chat to slide open the verbatim source text and metadata.",
        },
        {
          label: "Direct FHIR Resource Resolvers",
          detail:
            "Points directly to Observation/obs-89104#valueQuantity or Discharge_Summary/note-22104#span_120-145.",
        },
        {
          label: "Audit Log Integrity",
          detail:
            "Signed with SHA-256 HMAC signatures to guarantee non-repudiation for UAE & KSA healthcare audits.",
        },
      ],
      interactiveAction: (
        <div className="bg-[#F8FCFD] border border-[#93B1B5] rounded-xl p-3.5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#0B2E33] block">
              Sample Citation Badge:
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#B8E3E9] text-[#0B2E33] text-xs font-mono font-bold border border-[#4F7C82]/30 cursor-pointer hover:bg-[#93B1B5]/40 transition-colors">
              <Binary className="w-3 h-3 text-[#4F7C82]" />
              <span>[CIT-001] Glucose 142 mg/dL</span>
            </div>
          </div>
          <span className="text-[11px] text-[#6B8B99] max-w-[200px]">
            Clicking this anywhere in the app displays the verbatim lab draw
            timestamp and FHIR pointer.
          </span>
        </div>
      ),
      jumpTab: "copilot" as NavigationTab,
      jumpText: "Inspect Live Citations in Chat",
    },
    {
      stepNumber: 4,
      badge: "Step 4 of 5 • Revenue Cycle",
      title: "Claims Scrubber & Pre-Bill Audit",
      titleAr: "مدقق المطالبات التأمينية والوقاية من الرفض",
      icon: <Receipt className="w-6 h-6 text-[#4F7C82]" />,
      description:
        "Healthcare providers in the GCC lose millions annually due to technical claim rejections by payers (Daman, Tawuniya, Bupa). Hospyar pre-audits claims against clinical documentation before transmission.",
      descriptionAr:
        "تخسر المنشآت الصحية مبالغ طائلة سنوياً بسبب رفض المطالبات التأمينية. يقوم هوسبيار بالتدقيق المسبق للمطالبات ومقارنتها بالتوثيق السريري قبل إرسالها لشركات التأمين.",
      highlights: [
        {
          label: "CPT-4 vs ICD-10 Discrepancy Checks",
          detail:
            "Detects procedures billed without matching chronic or acute diagnoses in the patient chart.",
        },
        {
          label: "Predictive Denial Probability",
          detail:
            "Calculates rejection likelihood (e.g. 12% vs 35%) so billing teams can resolve deficiencies proactively.",
        },
        {
          label: "NPHIES & Malaffi Rules Engine",
          detail:
            "Tailored compliance checks adhering to Saudi CHI rules and Abu Dhabi DoH billing mandates.",
        },
      ],
      interactiveAction: (
        <div className="bg-[#F8FCFD] border border-[#93B1B5] rounded-xl p-3.5 space-y-1.5 text-xs">
          <div className="flex justify-between items-center font-bold text-[#0B2E33]">
            <span>Claim Validation Status</span>
            <span className="text-[#4F7C82] font-mono">
              2 Clean • 1 Action Required
            </span>
          </div>
          <p className="text-[11px] text-[#6B8B99]">
            Flags ungrounded procedures before electronic submission to avoid
            costly 90-day appeal cycles.
          </p>
        </div>
      ),
      jumpTab: "claims" as NavigationTab,
      jumpText: "Open Claims Scrubber Table",
    },
    {
      stepNumber: 5,
      badge: "Step 5 of 5 • Data Sovereignty",
      title: "Zero-Egress Sovereign Cloud (GCC PDPL)",
      titleAr: "سحابة سيادية منعدمة التسريب (حسب قوانين حماية البيانات)",
      icon: <Network className="w-6 h-6 text-[#4F7C82]" />,
      description:
        "UAE Federal Decree-Law No. 45 and Saudi Arabia PDPL require health data to remain within sovereign territory. Hospyar ensures zero data egress by deploying all embeddings, databases, and Snowflake Cortex AI models inside in-country cloud regions.",
      descriptionAr:
        "يفرض قانون حماية البيانات الإماراتي والسعودي بقاء البيانات الصحية داخل الحدود الوطنية. يضمن هوسبيار عدم خروج أي بيانات عبر استضافة جميع النماذج وقواعد البيانات داخل مراكز البيانات الوطنية.",
      highlights: [
        {
          label: "In-Country AI Inference",
          detail:
            "Snowflake Cortex AI (llama3.3-70b) runs directly inside UAE-CENTRAL-1 / KSA data perimeters.",
        },
        {
          label: "Cryptographic SHA-256 Checksums",
          detail:
            "Tracks integrity of 15 key configuration manifests and payloads to prevent supply chain tampering.",
        },
        {
          label: "Federated HIE Gateways",
          detail:
            "Bi-directional interoperability with Malaffi (Abu Dhabi), NABIDH (Dubai), Riayati (Federal UAE), and NPHIES (Saudi Arabia).",
        },
      ],
      interactiveAction: (
        <div className="bg-[#0B2E33] text-white rounded-xl p-3.5 flex items-center justify-between text-xs font-mono">
          <div className="space-y-0.5">
            <div className="text-[#B8E3E9] font-bold">
              SOVEREIGNTY STATUS: ENFORCED
            </div>
            <div className="text-[11px] text-[#93B1B5]">
              Egress Block: 100% • Zone: UAE-CENTRAL-1
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#4F7C82] text-white text-[11px] font-bold">
            COMPLIANT
          </span>
        </div>
      ),
      jumpTab: "hie" as NavigationTab,
      jumpText: "Inspect Sovereign HIE Sync",
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJump = (tab: NavigationTab) => {
    onNavigateTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2E33]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`bg-white border border-[#93B1B5] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {/* Modal Header */}
        <div className="bg-[#0B2E33] text-white p-5 flex items-center justify-between border-b border-[#061D20]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F7C82]/40 border border-[#6B8B99]/40 flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#B8E3E9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {isRTL
                    ? "جولة هوسبيار التفاعلية"
                    : "Hospyar System Interactive Tour"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7C82] text-white font-semibold">
                  {current.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#B8E3E9]/80 font-medium">
                {isRTL
                  ? "دليلك لفهم المنصة والذكاء الاصطناعي السريري"
                  : "Quick walkthrough of platform architecture & clinical workflows"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="bg-[#F8FCFD] px-6 py-2.5 border-b border-[#93B1B5]/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((s, idx) => (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? "w-8 bg-[#4F7C82]"
                    : idx < currentStep
                      ? "w-2.5 bg-[#4F7C82]/50"
                      : "w-2 bg-[#93B1B5]/40"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono font-semibold text-[#6B8B99]">
            {isRTL
              ? `المرحلة ${currentStep + 1} من ${steps.length}`
              : `Step ${currentStep + 1} of ${steps.length}`}
          </span>
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title & Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF6F8] border border-[#93B1B5] flex items-center justify-center shrink-0">
              {current.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B2E33]">
                {isRTL ? current.titleAr : current.title}
              </h2>
              <p className="text-xs text-[#6B8B99] font-medium">
                {isRTL ? current.descriptionAr : current.description}
              </p>
            </div>
          </div>

          {/* Key Feature Highlights */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0B2E33] tracking-wide uppercase font-mono block">
              {isRTL ? "الركائز الأساسية" : "Core Architectural Pillars"}
            </span>
            <div className="space-y-2">
              {current.highlights.map((h, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#93B1B5]/60 hover:border-[#4F7C82] p-3 rounded-xl flex items-start gap-3 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#4F7C82] shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <span className="font-bold text-[#0B2E33]">
                      {h.label}:{" "}
                    </span>
                    <span className="text-[#6B8B99]">{h.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Feature Demo */}
          {current.interactiveAction}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#F8FCFD] border-t border-[#93B1B5]/30 p-4 px-6 flex items-center justify-between gap-3">
          {/* Jump directly to feature */}
          <button
            type="button"
            onClick={() => handleJump(current.jumpTab)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F7C82] hover:text-[#0B2E33] transition-colors cursor-pointer"
          >
            <span>{current.jumpText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Next / Prev Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-[#93B1B5] bg-white text-[#0B2E33] text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isRTL ? "السابق" : "Previous"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-[#4F7C82] hover:bg-[#0B2E33] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>
                {currentStep === steps.length - 1
                  ? isRTL
                    ? "إتمام الجولة"
                    : "Finish Tour"
                  : isRTL
                    ? "التالي"
                    : "Next Step"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
