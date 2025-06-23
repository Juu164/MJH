# Neon Pulse Theme Review

## Palette
- `background`: `#0F1115`
- `neonFrom`: `#9146FF`
- `neonTo`: `#00E5FF`
- `textBase`: `#F0F2F5`

```css
:root {
  --color-neon-from: #9146FF;
  --color-neon-to: #00E5FF;
  --color-background: #0F1115;
  --color-text-base: #F0F2F5;
}
```

## Components
### NeonCard
```tsx
export const NeonCard: React.FC<Props> = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg transition-all relative overflow-hidden ${className}`} {...props}>
    {children}
    <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity animate-gradient bg-gradient-to-r from-neonFrom to-neonTo" />
  </div>
);
```

### NeonButton
```tsx
export const NeonButton: React.FC<Props> = ({ variant = 'primary', className = '', children, ...props }) => {
  const base = 'px-4 py-2 rounded-lg font-bold transition-transform duration-200 neon-gradient text-white neon-glow';
  return (
    <button className={`${base} hover:scale-105 ${className}`} {...props}>
      {children}
    </button>
  );
};
```

## Hero Image
[Unsplash Concert Silhouette](https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2)

## Test Scenarios
1. Navigate through the side menu and ensure glow on hover.
2. Hover a NeonButton – it scales slightly and emits a neon glow.
3. Toggle dark mode from the header; background switches to dark anthracite.
4. Switch list/grid view on the Concerts page; the active icon lights up cyan.
