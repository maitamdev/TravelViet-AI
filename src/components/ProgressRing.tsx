interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({ value, size = 60, strokeWidth = 4, color = 'var(--primary)' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className='transform -rotate-90'>
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
        fill='none' stroke='currentColor' className='text-muted' />
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
        fill='none' stroke={color} strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap='round' className='transition-all duration-500' />
      <text x='50%' y='50%' textAnchor='middle' dominantBaseline='central'
        className='fill-foreground text-sm font-semibold' transform={'rotate(90 ' + size/2 + ' ' + size/2 + ')'}>
        {Math.round(value)}%
      </text>
    </svg>
  );
}
