
import React from 'react';
import { Check } from 'lucide-react';

interface ComparisonItem {
  feature: string;
  eythor: boolean | string;
  manual: boolean | string;
}

interface ComparisonTableProps {
  items: ComparisonItem[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ items }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="text-left py-4 px-6 bg-eythor-dark/70 rounded-tl-lg font-heading">Feature</th>
            <th className="text-center py-4 px-6 bg-eythor-purple/20 font-heading">Eythor</th>
            <th className="text-center py-4 px-6 bg-eythor-dark/70 rounded-tr-lg font-heading">Manual Cleaning</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className={`text-left py-4 px-6 bg-eythor-dark/30 ${index === items.length - 1 ? 'rounded-bl-lg' : ''}`}>
                {item.feature}
              </td>
              <td className={`text-center py-4 px-6 bg-eythor-purple/10 ${typeof item.eythor === 'boolean' ? '' : 'text-eythor-purple font-semibold'}`}>
                {typeof item.eythor === 'boolean' ? (
                  item.eythor ? <Check className="mx-auto text-eythor-purple" size={20} /> : '-'
                ) : (
                  item.eythor
                )}
              </td>
              <td className={`text-center py-4 px-6 bg-eythor-dark/30 ${index === items.length - 1 ? 'rounded-br-lg' : ''}`}>
                {typeof item.manual === 'boolean' ? (
                  item.manual ? <Check className="mx-auto text-white" size={20} /> : '-'
                ) : (
                  item.manual
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
