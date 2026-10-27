import btfLogo from "@/assets/btf-logo.webp";

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <img src={btfLogo} alt="Logo da BTF, Blue Trust Force" decoding="async" className="h-10 w-auto object-contain" />
    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground text-center leading-none md:hidden lg:block">
      Blue Trust Force
    </div>
  </div>
);

export default Logo;