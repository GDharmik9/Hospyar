import React from 'react';
import { CitationAnchor } from '@hospyar/shared-types';
import { CitationAnchorBadge } from '../atoms/CitationAnchorBadge';
import { User, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ChatMessageBubbleProps {
  sender: 'ai' | 'user';
  text: string;
  textArabic?: string;
  locale?: string;
  citations?: CitationAnchor[];
  onCitationClick?: (citation: CitationAnchor) => void;
  activeCitationId?: string;
  className?: string;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  sender,
  text,
  textArabic,
  locale = 'en-US',
  citations = [],
  onCitationClick,
  activeCitationId,
  className
}) => {
  const isRTL = locale.startsWith('ar');
  const displayText = isRTL && textArabic ? textArabic : text;

  // Build map of citation anchors
  const citationMap = new Map<string, CitationAnchor>();
  citations.forEach((c) => citationMap.set(c.citation_id, c));

  // Render text and replace [CIT-xxx] with CitationAnchorBadge
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[CIT-\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(CIT-\d+)\]/);
      if (match) {
        const citId = match[1];
        const citObj = citationMap.get(citId) || {
          citation_id: citId,
          pointer_type: 'TEXT_SPAN',
          source_reference: `Source/${citId}`,
          verbatim_text: 'Verified evidence anchor'
        };
        return (
          <span key={index} className="inline-block mx-1 align-baseline">
            <CitationAnchorBadge
              citation={citObj}
              isActive={activeCitationId === citId}
              onClick={onCitationClick}
            />
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 max-w-3xl my-2',
        sender === 'user' ? (isRTL ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row-reverse') : '',
        className
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
          sender === 'ai'
            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/40'
            : 'bg-slate-800 text-slate-300 border border-slate-700'
        )}
      >
        {sender === 'ai' ? <Sparkles className="w-4 h-4 text-emerald-200" /> : <User className="w-4 h-4" />}
      </div>

      <div
        className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-relaxed border transition-all',
          sender === 'ai'
            ? 'bg-slate-900/95 text-slate-100 border-slate-800 shadow-sm'
            : 'bg-emerald-900/40 text-emerald-100 border-emerald-700/50'
        )}
      >
        <div className="font-sans whitespace-pre-wrap">
          {renderMessageContent(displayText)}
        </div>
      </div>
    </div>
  );
};
