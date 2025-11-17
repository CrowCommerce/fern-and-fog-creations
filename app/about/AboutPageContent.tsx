import Link from 'next/link';
import type { AboutPage, AboutProcessStep, AboutValue } from '@/types/about';

interface AboutPageContentProps {
  content: AboutPage;
  processSteps: AboutProcessStep[];
  values: AboutValue[];
}

// Icon mapping for process steps
function getProcessStepIcon(iconType: string) {
  const icons = {
    gathered: (
      <svg className="w-8 h-8 text-fern" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
    crafted: (
      <svg className="w-8 h-8 text-fern" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M12 21c-1.74 0-3.33-.6-4.5-1.5L12 4.5l4.5 15c-1.17.9-2.76 1.5-4.5 1.5Z"/>
        <path d="M7.5 19.5c-1.5-1.26-2.5-3.1-2.5-5.19V3"/>
        <path d="M19 3v11.31c0 2.09-1 3.93-2.5 5.19"/>
      </svg>
    ),
    treasured: (
      <svg className="w-8 h-8 text-fern" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>
    ),
  };

  return icons[iconType as keyof typeof icons] || icons.gathered;
}

export default function AboutPageContent({ content, processSteps, values }: AboutPageContentProps) {
  return (
    <div className="bg-parchment">
      {/* Hero Section */}
      <div className="relative bg-moss py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-parchment sm:text-5xl lg:text-6xl">
              {content.heroHeading}
            </h1>
            <p className="mt-6 text-xl text-mist max-w-3xl mx-auto">
              {content.heroIntro}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Story */}
          <div>
            <h2 className="text-3xl font-display font-bold text-bark mb-6">
              {content.storyHeading}
            </h2>
            <div className="space-y-4 text-bark/70 leading-relaxed">
              {content.storyContent.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Quote Image Section */}
          <div className="relative">
            {content.quoteImageUrl && (
              <div className="aspect-square rounded-lg overflow-hidden ring-2 ring-bark/20">
                <img
                  src={content.quoteImageUrl}
                  alt="Crafting workspace with natural materials"
                  className="size-full object-cover"
                />
              </div>
            )}
            {(content.quoteText || content.quoteAttribution) && (
              <div className="mt-6 p-6 bg-mist rounded-lg">
                {content.quoteText && (
                  <p className="text-sm italic text-bark/70">
                    &quot;{content.quoteText}&quot;
                  </p>
                )}
                {content.quoteAttribution && (
                  <p className="mt-2 text-sm font-medium text-bark">
                    — {content.quoteAttribution}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Process Section */}
        {processSteps.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-display font-bold text-bark text-center mb-12">
              {content.processHeading}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {processSteps.map((step) => (
                <div key={step.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-fern/10 rounded-full mb-4">
                    {getProcessStepIcon(step.iconType)}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-bark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-bark/70">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Values Section */}
        {values.length > 0 && (
          <div className="mt-24 p-8 bg-mist rounded-lg">
            <h2 className="text-2xl font-display font-bold text-bark text-center mb-8">
              {content.valuesHeading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-bark/70">
              {values.map((value) => (
                <div key={value.title}>
                  <h3 className="font-semibold text-bark mb-2">{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-display font-bold text-bark mb-4">
            {content.ctaHeading}
          </h2>
          <p className="text-lg text-bark/70 mb-8">
            {content.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={content.ctaPrimaryUrl}
              className="inline-flex items-center px-8 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors"
            >
              {content.ctaPrimaryText}
            </Link>
            {content.ctaSecondaryText && content.ctaSecondaryUrl && (
              <Link
                href={content.ctaSecondaryUrl}
                className="inline-flex items-center px-8 py-3 bg-transparent text-fern font-medium rounded-md ring-2 ring-fern hover:bg-fern/10 transition-colors"
              >
                {content.ctaSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
