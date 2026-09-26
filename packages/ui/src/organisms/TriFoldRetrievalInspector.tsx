import React from 'react';
import { RetrievalEvidenceItem, CitationAnchor } from '@hospyar/shared-types';
import { Binary, Network, Database, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export interface TriFoldRetrievalInspectorProps {
  evidenceItems: RetrievalEvidenceItem[];
  onSelectCitation?: (citation: CitationAnchor) => void;
  className?: string;
}

export const TriFoldRetrievalInspector: React.FC<TriFoldRetrievalInspectorProps> = ({
  evidenceItems = [],
  onSelectCitation,
  className
}) => {
  const routes = [
    {
      id: 'VectorRAG',
      title: 'VectorRAG: Note Semantic Chunks',
      icon: <Binary className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/20'
    },
    {
      id: 'GraphRAG',
      title: 'GraphRAG: SNOMED/LOINC Ontologies',
      icon: <Network className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-950/20'
    },
    {
      id: 'Text2SQL',
      title: 'Text2SQL: Exact Relational Math',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/20'
    }
  ];

  return (
    <div
      className={cn(
        'bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            Tri-Fold Deterministic Retrieval Inspector
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Total Evidence Items: {evidenceItems.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((rt) => {
          const matched = evidenceItems.filter((e) => e.route === rt.id);
          return (
            <div
              key={rt.id}
              className={cn(
                'rounded-xl border p-3.5 flex flex-col justify-between transition-all',
                rt.color
              )}
            >
              <div>
                <div className="flex items-center gap-2 mb-2 font-medium text-xs text-slate-200">
                  {rt.icon}
                  <span>{rt.title}</span>
                </div>

                {matched.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic py-2">
                    No active tokens routed to this pipeline for the current prompt.
                  </p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {matched.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (onSelectCitation) {
                            onSelectCitation({
                              citation_id: item.id,
                              pointer_type: item.route === 'Text2SQL' ? 'SQL_KEY' : item.route === 'GraphRAG' ? 'ONTOLOGY_NODE' : 'TEXT_SPAN',
                              source_reference: item.reference,
                              verbatim_text: item.excerpt,
                              confidence_score: item.relevance_score
                            });
                          }
                        }}
                        className="bg-slate-950/80 hover:bg-slate-950 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 space-y-1 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                          <span>[{item.id}]</span>
                          <span className="text-slate-400">
                            Score: {(item.relevance_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="line-clamp-2 text-slate-300 font-sans">
                          {item.excerpt}
                        </p>
                        <div className="text-[9px] font-mono text-slate-500 truncate">
                          Pointer: {item.reference}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Pass-through</span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  Grounded <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
