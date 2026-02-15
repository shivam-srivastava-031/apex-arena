import { Gamepad2, Crosshair, Swords, Target, Shield, Zap } from 'lucide-react';

const floatingIcons = [
  { Icon: Gamepad2, x: '10%', y: '20%', delay: '0s', size: 28 },
  { Icon: Crosshair, x: '85%', y: '15%', delay: '0.5s', size: 22 },
  { Icon: Swords, x: '75%', y: '70%', delay: '1s', size: 26 },
  { Icon: Target, x: '15%', y: '75%', delay: '1.5s', size: 20 },
  { Icon: Shield, x: '50%', y: '10%', delay: '2s', size: 24 },
  { Icon: Zap, x: '90%', y: '50%', delay: '0.8s', size: 18 },
  { Icon: Gamepad2, x: '30%', y: '85%', delay: '1.2s', size: 22 },
  { Icon: Crosshair, x: '65%', y: '30%', delay: '0.3s', size: 20 },
];

export function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className="absolute animate-float text-primary-foreground/10"
          style={{
            left: item.x,
            top: item.y,
            animationDelay: item.delay,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        >
          <item.Icon size={item.size} />
        </div>
      ))}
    </div>
  );
}
