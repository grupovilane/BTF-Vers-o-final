import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { 
  Languages, 
  ChevronDown, 
  Menu, 
  X 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logo: sempre volta para a hero. Em outra página, navega para "/"; na home, rola suavemente para o topo.
  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate({ to: "/" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloqueia o scroll do body enquanto o menu mobile está aberto
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  // Fecha o menu automaticamente ao chegar no breakpoint tablet
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => mql.matches && setMobileMenuOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);


  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    window.localStorage.setItem("btf_lang", lng);
  };

  const links = [
    { href: "#quem-somos", label: t("nav.whoWeAre") },
    { href: "#liga", label: t("nav.liga") },
    { href: "#servicos", label: t("nav.services") },
    { href: "#eventos", label: t("nav.events") },
    { href: "#trabalhe-conosco", label: t("nav.careers") },
    { href: "#contato", label: t("nav.contact") },
  ];


  const languages = [
    { code: "pt", label: "Português" },
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ];


  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-smooth ${
        scrolled ? "glass border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-15 md:h-20 lg:h-24 flex items-center justify-between max-h-[60px] md:max-h-none">
        <a href="/" onClick={goHome} aria-label={`BTF. ${t("nav.whoWeAre")}`} className="flex-shrink-0 scale-90 sm:scale-100 origin-left">
          <Logo />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0 lg:gap-1" aria-label={t("nav.primary")}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-1.5 lg:px-3 py-2 text-[11px] lg:text-sm font-medium whitespace-nowrap text-muted-foreground/80 transition-all duration-300 hover:text-primary-glow relative group flex items-center"
            >
              {l.label}
              <span className="absolute bottom-1 left-4 right-4 h-[1px] bg-primary-glow scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </a>

          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary-glow">
                <Languages className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">{i18n.language.split('-')[0]}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-border/60">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="cursor-pointer focus:bg-primary/10"
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 -mr-2 min-w-[44px] min-h-[44px] grid place-items-center text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.menu")}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-border/60 animate-fade-in max-h-[calc(100dvh-60px)] overflow-y-auto overscroll-contain">
          <nav className="flex flex-col p-6 gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}

                className="text-lg font-medium text-muted-foreground py-2 min-h-[44px] flex items-center xl:hover:text-primary-glow"
              >
                {l.label}
              </a>
            ))}
            <div className="h-px bg-border/60 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("nav.language")}</span>
              <div className="flex gap-4">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-xs font-bold uppercase px-3 py-2 min-h-[44px] ${i18n.language.startsWith(lang.code) ? 'text-primary-glow' : 'text-muted-foreground outline-none'}`}
                  >
                    {lang.code}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
