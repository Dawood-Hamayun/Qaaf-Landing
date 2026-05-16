import Image from "next/image";
import clsx from "clsx";

type Props = {
  srcLight: string;
  srcDark: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Phone bezel with an app screenshot inside. Aspect is tuned slightly
 * shorter than the source mockup (1344x2992) so the silhouette doesn't
 * read as stretched. object-top crops the bottom indicator area.
 */
export function PhoneFrame({ srcLight, srcDark, alt, className, priority }: Props) {
  return (
    <div
      className={clsx(
        "relative aspect-[9/19] w-full select-none",
        "rounded-[2.6rem] border border-ink/10 bg-bg-card",
        "shadow-phone",
        "dark:border-amber/15 dark:shadow-[0_30px_120px_-20px_rgba(232,184,106,0.18),0_30px_80px_-20px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="absolute inset-[5px] overflow-hidden rounded-[2.3rem] bg-bg-card">
        <div className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-[16px] w-[34%] -translate-x-1/2 rounded-full bg-ink-deep/90 dark:bg-black" />
        <Image
          src={srcLight}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 360px, 70vw"
          priority={priority}
          loading={priority ? undefined : "eager"}
          unoptimized
          className="object-cover object-top dark:hidden"
        />
        <Image
          src={srcDark}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 360px, 70vw"
          priority={priority}
          loading={priority ? undefined : "eager"}
          unoptimized
          className="hidden object-cover object-top dark:block"
        />
      </div>
      <span className="pointer-events-none absolute left-[-2px] top-[18%] h-9 w-[3px] rounded-l bg-ink/10 dark:bg-amber/20" />
      <span className="pointer-events-none absolute left-[-2px] top-[28%] h-14 w-[3px] rounded-l bg-ink/10 dark:bg-amber/20" />
      <span className="pointer-events-none absolute right-[-2px] top-[22%] h-16 w-[3px] rounded-r bg-ink/10 dark:bg-amber/20" />
    </div>
  );
}
