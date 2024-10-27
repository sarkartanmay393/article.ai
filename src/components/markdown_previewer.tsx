/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { type Components } from 'react-markdown';

type MarkdownPreviewerProps = {
  markdownString: string;
}

export default function MarkdownPreviewer({ markdownString }: MarkdownPreviewerProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
      {markdownString}
    </ReactMarkdown>
  );
}

const components: Components = {
  h1: ({ node, ...props }) => (
    <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '0.5em' }} {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 style={{ fontSize: '1.75em', fontWeight: 'bold', marginBottom: '0.5em' }} {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '0.5em' }} {...props} />
  ),
  p: ({ node, ...props }) => (
    <p style={{ fontSize: '1em', lineHeight: '1.5em', marginBottom: '1em' }} {...props} />
  ),
  strong: ({ node, ...props }) => <strong style={{ fontWeight: 'bold' }} {...props} />,
  em: ({ node, ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote
      style={{
        borderLeft: '4px solid #ccc',
        paddingLeft: '1em',
        color: '#666',
        margin: '1em 0',
      }}
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul style={{ paddingLeft: '1.5em', marginBottom: '1em' }} {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol style={{ paddingLeft: '1.5em', marginBottom: '1em' }} {...props} />
  ),
  li: ({ node, ...props }) => <li style={{ marginBottom: '0.5em' }} {...props} />,
  code: ({ node, className, children, ...props }) => {
    return (
      // <pre
      // {...props}
      //   style={{
      //     backgroundColor: '#f5f5f5',
      //     padding: '1em',
      //     borderRadius: '3px',
      //     overflowX: 'auto',
      //     margin: '1em 0',
      //   }}
      // >
      <code style={{ fontFamily: 'monospace' }}>{children}</code>
      //  </pre>
    );
  },
};