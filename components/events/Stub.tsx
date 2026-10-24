/**
 * The tear-off end of an event ticket. It says *when*: the one thing a
 * visitor scans for. Two notches bite into the perforation; they use the
 * page background color, so the page behind must be Cloud.
 */
export function Stub({
  lead,
  big,
  small,
  tone,
}: {
  lead: string;
  big: string;
  small: string;
  tone: "teal" | "coral" | "deepsea";
}) {
  const bg = { teal: "bg-teal", coral: "bg-coral", deepsea: "bg-deepsea" }[tone];
  return (
    <div
      className={`${bg} relative flex flex-row items-baseline justify-center gap-3 rounded-t-2xl px-6 py-5 text-white sm:w-44 sm:flex-col sm:items-center sm:justify-center sm:gap-0 sm:rounded-l-2xl sm:rounded-tr-none sm:py-8`}
    >
      <span className="eyebrow text-white/85">{lead}</span>
      <span className="font-display text-[2.75rem] leading-none font-extrabold tracking-[-0.03em] uppercase sm:mt-1 sm:text-[3.5rem]">
        {big}
      </span>
      <span className="text-[0.95rem] font-bold tracking-wide uppercase sm:mt-2">{small}</span>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 size-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-cloud sm:top-0 sm:right-0 sm:bottom-auto sm:left-auto sm:translate-x-1/2 sm:-translate-y-1/2"
      />
      <span
        aria-hidden
        className="absolute right-0 bottom-0 size-5 translate-x-1/2 translate-y-1/2 rounded-full bg-cloud"
      />
    </div>
  );
}
