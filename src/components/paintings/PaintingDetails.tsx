import React from 'react';

export interface PaintingDetailsProps {
  artist: string;
  medium: string;
  size?: string;
  dimensions?: string;
  style?: string;
  category?: string;
  year: string | number;
  frame?: string;
  type?: string;
}

export const PaintingDetails: React.FC<PaintingDetailsProps> = ({
  artist,
  medium,
  size,
  dimensions,
  style,
  category,
  year,
  frame = 'Unframed',
  type = '100% Original Artwork',
}) => {
  const displaySize = size || dimensions || '36 × 48 inches';
  const displayStyle = style || category || 'Contemporary Fine Art';

  const detailsList = [
    { label: 'ARTIST', value: artist },
    { label: 'MEDIUM', value: medium },
    { label: 'SIZE', value: displaySize },
    { label: 'STYLE', value: displayStyle },
    { label: 'YEAR', value: String(year) },
    { label: 'FRAME', value: frame },
    { label: 'ORIGINAL', value: type },
  ];

  return (
    <div id="painting-specifications" className="w-full py-4 border-y border-[#E5E5E5]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-3.5 gap-x-6 sm:gap-x-8 text-xs sm:text-sm">
        {detailsList.map((item) => (
          <div key={item.label} className="flex flex-col space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] text-[#888888] uppercase">
              {item.label}
            </span>
            <span className="font-medium text-[#111111] tracking-tight leading-snug">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
