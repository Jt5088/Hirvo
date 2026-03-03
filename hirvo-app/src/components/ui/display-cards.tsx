"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  restX?: number;
  restY?: number;
  hoverY?: number;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
  restX = 0,
  restY = 0,
  hoverY,
  isVisible,
  isActive,
  onClick,
}: DisplayCardProps & {
  isVisible: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  const resolvedHoverY = hoverY ?? restY - 48;
  const skew = isActive ? 0 : -8;

  return (
    <div
      onClick={onClick}
      className={cn(
        "display-card",
        "relative flex h-36 w-[22rem] select-none flex-col justify-between rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-4 py-3 cursor-pointer",
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] after:pointer-events-none",
        "[&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
      style={{
        "--card-x": `${restX}px`,
        "--card-y": `${isVisible ? restY : restY - 64}px`,
        "--card-hover-y": `${resolvedHoverY}px`,
        "--card-skew": `${skew}deg`,
        opacity: isVisible ? 1 : 0,
      } as React.CSSProperties}
    >
      <div>
        <span className="relative inline-block rounded-full bg-blue-800 p-1">
          {icon}
        </span>
        <p className={cn("text-lg font-medium", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg">{description}</p>
      <p className="text-muted-foreground">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards: DisplayCardProps[] = [
    {
      restX: 0,
      restY: 0,
      hoverY: -48,
      className:
        "[grid-area:stack] before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 before:pointer-events-none grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      restX: 48,
      restY: 40,
      hoverY: -8,
      className:
        "[grid-area:stack] before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 before:pointer-events-none grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      restX: 96,
      restY: 80,
      hoverY: 32,
      className: "[grid-area:stack]",
    },
  ];

  const displayCards = cards || defaultCards;

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(displayCards.length).fill(false)
  );
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          displayCards.forEach((_, i) => {
            setTimeout(() => {
              setVisibleCards((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [displayCards.length]);

  const handleCardClick = (index: number) => {
    setActiveCard((prev) => (prev === index ? null : index));
  };

  return (
    <div
      ref={containerRef}
      className="grid [grid-template-areas:'stack'] place-items-center"
    >
      {displayCards.map((cardProps, index) => (
        <DisplayCard
          key={index}
          {...cardProps}
          isVisible={visibleCards[index]}
          isActive={activeCard === index}
          onClick={() => handleCardClick(index)}
        />
      ))}
    </div>
  );
}
