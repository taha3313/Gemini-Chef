export default function ClaudeRecipe({ recipe }) {
  return (
    <section
      className="bg-amber-50 border border-amber-200 rounded-xl shadow-md p-4 md:p-6 text-amber-900 space-y-4 text-base"
      aria-live="polite"
    >
      <h2 className="text-xl font-semibold text-amber-800 mb-4">
        🍽️ Chef Gemini Recommends:
      </h2>
      <div
        className="prose prose-amber prose-sm sm:prose lg:prose-lg dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: recipe }}
      />
    </section>
  );
}
