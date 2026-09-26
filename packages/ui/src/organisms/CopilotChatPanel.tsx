import React, { useState } from 'react';
import { QueryResponseDTO, CitationAnchor, RetrievalRoute } from '@hospyar/shared-types';
import { Button } from '../atoms/Button';
import { Spinner } from '../atoms/Spinner';
import { ChatMessageBubble } from '../molecules/ChatMessageBubble';
import { RouteBadgeGroup } from '../molecules/RouteBadgeGroup';
import { Sparkles, Send, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

export interface CopilotChatPanelProps {
  onQuery: (query: string) => Promise<QueryResponseDTO>;
  onSelectCitation: (citation: CitationAnchor) => void;
  activeCitationId?: string;
  locale?: string;
  className?: string;
}

export const CopilotChatPanel: React.FC<CopilotChatPanelProps> = ({
  onQuery,
  onSelectCitation,
  activeCitationId,
  locale = 'en-US',
  className
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'ai' | 'user';
    text: string;
    textArabic?: string;
    citations?: CitationAnchor[];
    routes?: RetrievalRoute[];
    executionTimeMs?: number;
  }>>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hospyar Sovereign AI Copilot initialized. Grounded across Snowflake Relational Tables (FHIR R4), MIMIC-IV Clinical Notes, and SNOMED CT ontologies. Ask any question regarding patient lab trends, clinical progress, or prior authorization.',
      textArabic: 'تم تهيئة المساعد الذكي السيادي هوسبيار. مدعوم بقواعد بيانات سنوفليك العلائقية (FHIR R4) وملاحظات ميميك السريرية وشبكة سنوميد المعرفية. اطرح أي سؤال يتعلق باتجاهات التحاليل أو المسار السريري للمريض.'
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');

    // Append user message
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: userQuery }]);

    setIsLoading(true);
    try {
      const response = await onQuery(userQuery);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response.generated_answer,
          textArabic: response.generated_answer_ar,
          citations: response.citations,
          routes: response.retrieval_routes_used,
          executionTimeMs: response.execution_time_ms
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Error contacting Sovereign Snowflake Cortex API. Please verify network boundaries.',
          textArabic: 'خطأ في الاتصال بواجهة سنوفليك كورتكس السيادية. يرجى التحقق من أمن الشبكة.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'What is the latest fasting blood glucose level and trend?',
    'Summarize cardiology consult and hypertension management plan.',
    'Are there any prior-auth discrepancies for the echocardiogram?'
  ];

  return (
    <div
      className={cn(
        'flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden',
        className
      )}
    >
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Tri-Fold Sovereign HybridRAG Copilot
            </h3>
            <p className="text-[11px] text-slate-400">
              Zero-Egress Snowflake Cortex AI • Verbatim Citation Anchors
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40">
          <Cpu className="w-3 h-3" />
          <span>LLaMA-3-70B Governed</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1.5">
            <ChatMessageBubble
              sender={msg.sender}
              text={msg.text}
              textArabic={msg.textArabic}
              locale={locale}
              citations={msg.citations}
              onCitationClick={onSelectCitation}
              activeCitationId={activeCitationId}
            />

            {msg.routes && msg.routes.length > 0 && (
              <div className="flex items-center gap-3 text-[11px] text-slate-500 pl-11">
                <RouteBadgeGroup routes={msg.routes} />
                {msg.executionTimeMs && (
                  <span className="font-mono text-[10px] text-slate-400">
                    ⏱️ {msg.executionTimeMs} ms
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 pl-11 py-2 text-xs text-slate-400 font-mono">
            <Spinner size="sm" />
            <span>Traversing VectorRAG, GraphRAG & Text2SQL routes...</span>
          </div>
        )}
      </div>

      {/* Suggested quick queries */}
      <div className="px-5 py-2 bg-slate-950/40 border-t border-slate-800/40 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider shrink-0">
          Suggested:
        </span>
        {sampleQueries.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInput(q)}
            className="text-[11px] text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            locale.startsWith('ar')
              ? 'اطرح سؤالاً سريرياً مع التحقق السيادي من المصادر...'
              : 'Ask a clinical question with zero-hallucination source verification...'
          }
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
        <Button
          type="submit"
          variant="clinical"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
