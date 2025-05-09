import React from "react";
import { TerminalOutput } from "./TerminalOutput";

interface TerminalHistoryProps {
  output: string[];
}

const TerminalHistory: React.FC<TerminalHistoryProps> = ({ output }) => {
  return (
    <div className="flex flex-col gap-1">
      {output.map((out, i) => (
        <TerminalOutput key={i} output={out} index={i} />
      ))}
    </div>
  );
};

export default TerminalHistory;
