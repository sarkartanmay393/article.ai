/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use server';

import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { articleSchema } from './schema';
import { signIn, signOut } from './server/auth';
import { redirect } from 'next/navigation';

export async function generate({ topic, tone, style, maxLength }: { topic: string, tone: string, style: string, maxLength: number }) {
  'use server';

  const stream = createStreamableValue();

  void (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-4o-mini'),
      system: generateArticlePrompt(),
      prompt: `
        topic: ${topic},
        tone: ${tone},
        style: ${style},
        length: ${maxLength} words,
      `,
      schema: articleSchema,
      schemaName: 'article',
      schemaDescription: 'An article in markdown format with a title, summary, keywords, target audience, reading time, word count of actual content, language, tone, style, and SEO metadata.',
      onFinish({ usage }) {
        console.log('Token usage:', usage);
      },
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}

export const handleGithubLogin = async () => {
  'use server';
  try {
    const { error } = await signIn("github", { redirectTo: '/demo' });
    if (error) throw error as Error;
  } catch (error) {
    console.error(error);
  }
};

export const handleGithubLogout = async () => {
  'use server';
  try {
    const { error } = await signOut({
      redirect: true,
      redirectTo: '/',
    });
    if (error) throw error as Error;
    return redirect('/');
  } catch (error) {
    console.error(error);
  }
};

const generateArticlePrompt = () => `
Generate a well-structured article metadata based on user inputs provided in a as a JSON object with metadata and content fields. These inputs include the topic, style, tone, and length, which will guide the writing of the article. The content should be a Markdown-formatted string suitable for rendering in the UI.

**User Inputs:**
- **Topic**: The subject or theme of the article.
- **Style Selection**: The writing style, such as narrative, expository, persuasive, or descriptive.
- **Tone Selection**: The emotional tone of the article, like formal, informal, optimistic, or critical.
- **Length**: The desired length of the article, typically in terms of word count.

# Steps
1. **Understand the Topic**: Conduct preliminary research to gather essential information about the topic.
2. **Choose the Style**: 
   - Narrative: Storytelling with a sequence of events.
   - Expository: Explanation and factual information with a thesis and supporting points.
   - Persuasive: Use arguments and evidence to convince the reader.
   - Descriptive: Use vivid language to engage the reader’s senses.
   - anyother: Use a combination of styles to create a unique writing style.
3. **Set the Tone**: Apply the chosen tone throughout the article consistently. Adapt language and phrasing to match the tone.
4. **Determine the Structure**: Organize the article into logical sections or paragraphs, aligning with the specified length.
5. **Draft the Article**: Include an introduction, body, and conclusion according to the selected style, tone, and length.
6. **Review and Edit**: Ensure coherence, clarity, and conciseness. Revise for grammar and professional standards.
7. **Main Content**: Provide insights or detailed information using headings where necessary.
8. **Lists and Quotes**: Include at least one list (bullet points or numbered) and a quote from an expert with proper citation.
9. **Metadata**: Ensure the following metadata is included:
   - Title
   - Summary
   - Keywords (up to 5)
   - Target audience
   - Approximate reading time
   - Word count
   - Language ("en" for English)
   - Tone and Style details
   - SEO metadata
10. **Content**: The content should be a Markdown-formatted string suitable for rendering in the UI.

  **Instructions**
    # Content Generation
        Write an article based on the provided topic, style, tone, and length.
        Structure the article with an introduction, body, and conclusion.
        Use Markdown syntax for formatting:
            Headings (#, ##, ###)
            Lists (- for bullet points, 1. for numbered lists)
            Emphasis (**bold**, *italic*)
        Include at least one list and one properly cited quote.

# Output Format

The output should be a structured JSON object containing the article with metadata and content divided into a title, summary, body, and required metadata fields.

# Example

**Input**: 
\`\`\`json
  {
  "topic": "The Impact of Artificial Intelligence on Healthcare",
  "style": "Expository",
  "tone": "Optimistic",
  "length": "500 words"
} 
  \`\`\`

**Output**:
\`\`\` json
{
  "metadata": {
    "title": "Revolutionizing Healthcare: The Impact of Artificial Intelligence",
    "summary": "An optimistic exploration of how artificial intelligence is transforming healthcare, improving patient outcomes, and streamlining medical processes.",
    "keywords": ["artificial intelligence", "healthcare", "technology", "innovation"],
    "approximate_reading_time": "3 minutes",
    "word_count": 105,
    "language": "en",
    "tone": "Optimistic",
    "style": "Expository"
  },
  "content": \`
  # Introduction
  ## Background
  ## Objectives
  ## Methodology
  ## Results
  ## Conclusion
  \`
}
\`\`\`

# Notes

- Ensure the article matches the style, tone, and length specified.
- Use varied sentence structure and vocabulary to maintain engagement.
- Consider the expertise level of the target audience when writing.
- Ensure factual accuracy, provide citations or references if necessary.`;