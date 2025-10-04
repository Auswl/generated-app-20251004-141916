import React from 'react';
import { PROCEDURE_COLORS } from '@/types/denta-plan';
export const ProcedureLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 p-4 bg-background border rounded-lg">
      {Object.entries(PROCEDURE_COLORS).map(([procedure, classes]) => {
        // Extract the background color class
        const bgColorClass = classes.split(' ').find(c => c.startsWith('bg-'));
        return (
          <div key={procedure} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-sm ${bgColorClass}`}></div>
            <span className="text-sm text-muted-foreground">{procedure}</span>
          </div>
        );
      })}
    </div>
  );
};