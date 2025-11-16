/**
 * Type definitions for react-jotform-embed
 * Community package for embedding Jotform forms in React
 */

declare module 'react-jotform-embed' {
  import { FC } from 'react';

  interface JotformEmbedProps {
    src: string;
    scrolling?: 'yes' | 'no';
    frameBorder?: string | number;
  }

  const JotformEmbed: FC<JotformEmbedProps>;
  export default JotformEmbed;
}
