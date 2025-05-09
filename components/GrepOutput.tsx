import React from 'react';

interface GrepMatch {
  path: string;
  content: string;
  line: string;
  keyword: string;
}

interface GrepOutputProps {
  matches: GrepMatch[];
}

export const GrepOutput: React.FC<GrepOutputProps> = ({ matches }) => {
  const renderHighlightedContent = (content: string, keyword: string) => {
    const parts = content.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === keyword.toLowerCase() ? (
            <span 
              key={i} 
              className="font-bold underline text-yellow-400"
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match, index) => (
        <div key={index} className="flex flex-col">
          <div className="text-zinc-400">
            {match.path} <span className="text-zinc-600">[{match.line}]</span>
          </div>
          <div className="pl-4 text-zinc-200">
            {renderHighlightedContent(match.content, match.keyword)}
          </div>
        </div>
      ))}
    </div>
  );
};
