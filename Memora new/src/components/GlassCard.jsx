export default function GlassCard({ children, className = '', style = {}, ...props }) {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '2rem', ...style }} {...props}>
      {children}
    </div>
  );
}
