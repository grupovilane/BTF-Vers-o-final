import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  headingAs?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  titleId?: string;
};

const SectionHeader = ({
  label,
  title,
  description,
  headingAs = "h2",
  align = "left",
  className,
  titleClassName,
  descriptionClassName,
  titleId,
}: SectionHeaderProps) => {
  const Heading: ElementType = headingAs;
  const centered = align === "center";

  return (
    <div className={cn(centered && "text-center", className)}>
      {label ? (
        <span className="mb-2.5 block text-[13px] font-semibold uppercase tracking-[0.18em] text-primary-glow sm:text-sm">
          {label}
        </span>
      ) : null}
      <Heading
        id={titleId}
        className={cn(
          "font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.1] text-foreground",
          description && "mb-3.5",
          centered && "mx-auto",
          titleClassName,
        )}
      >
        {title}
      </Heading>
      {description ? (
        <div
          className={cn(
            "max-w-[35rem] text-[clamp(0.9375rem,1.5vw,1.0625rem)] font-normal leading-[1.6] text-muted-foreground",
            centered && "mx-auto",
            descriptionClassName,
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeader;