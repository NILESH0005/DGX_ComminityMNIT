// Shared heading style + section header used by the DGX sections
export const headingFont = { fontFamily: "'Space Grotesk', sans-serif" };

export default function SectionHeader({ tag, title, text }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
      <span className="inline-block bg-[#76B900]/15 text-[#2f5200] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full">
        {tag}
      </span>
      <h2
        className="text-3xl sm:text-4xl md:text-5xl font-black text-[#013D54] leading-tight mt-4 mb-4"
        style={headingFont}
      >
        {title}
      </h2>
      <p className="text-base sm:text-lg text-[#4a6b7a]">{text}</p>
    </div>
  );
}