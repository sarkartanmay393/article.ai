'use client';

import React, { useState } from 'react';
import { Type } from 'lucide-react'; // Import icon
import type { Article } from '~/types/article';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { Copy, Download } from 'lucide-react';
import ArticleFormatter from '~/lib/article-formatter';
import { useToast } from '~/hooks/use-toast';

interface ArticleViewerPanelProps {
  article: Article | null;
  loading: boolean;
}

export default function ArticleViewerPanel({ article, loading }: ArticleViewerPanelProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'markdown' | 'metadata'>('rendered');
  const { toast } = useToast();

  if (loading) {
    return (
      <Card className="w-full h-full flex flex-col justify-center items-center text-center animate-fade-in px-8">
        <Type className="w-12 h-12 text-gray-400 mb-4 animate-pulse" />
        <h2 className="text-xl font-medium text-gray-600 mb-2 animate-fade-in">
          Generating your article...
        </h2>
        <p className="text-gray-500">
          Please wait while your article is being generated
        </p>
        <p className="text-gray-500">
          This may take a few minutes depending on the length of your article
        </p>
      </Card>
    );
  }

  if (!article) {
    return (
      <Card className="w-full h-full flex flex-col justify-center items-center text-center">
        <Type className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-600 mb-2">Enter a topic to get started</h2>
        <p className="text-gray-500">Your generated article will appear here</p>
      </Card>
    );
  }

  const formatter = new ArticleFormatter(article);

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(formatter.toMarkdown());
    toast({ title: 'Copied to Clipboard', description: 'Markdown content has been copied.' });
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([formatter.toMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article?.metadata.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    return article?.content.map((section) => {
      switch (section.type) {
        case 'heading':
          const HeadingTag = `h${section.metadata?.level ?? 1}` as keyof JSX.IntrinsicElements;
          return <HeadingTag key={section.id} className="font-bold my-4">{section.content}</HeadingTag>;

        case 'paragraph':
          return <p key={section.id} className="my-4 leading-relaxed">{section.content}</p>;

        case 'list':
          const ListTag = section.metadata?.listType === 'numbered' ? 'ol' : 'ul';
          return (
            <ListTag key={section.id} className="my-4 ml-6">
              {section.children?.map(item => (
                <li key={item.id} className="my-1">{item.content}</li>
              ))}
            </ListTag>
          );

        case 'quote':
          return (
            <blockquote key={section.id} className="border-l-4 border-gray-300 pl-4 my-4 italic">
              {section.content}
              {section.metadata?.citations?.map(citation => (
                <cite key={citation.id} className="block text-sm text-gray-600 mt-2">
                  — {citation.author}, {citation.date}
                </cite>
              ))}
            </blockquote>
          );

        default:
          return <div key={section.id}>{section.content}</div>;
      }
    });
  };

  return (
    <Card className="w-full h-full overflow-auto">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
        <CardHeader className='flex flex-row justify-between border-b-[1px]'>
          <div className='flex flex-col'>
            <CardTitle>{article.metadata.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{article.metadata.readingTime} min read</span>
              <span>•</span>
              <span>{article.metadata.wordCount} words</span>
            </div>
          </div>
          <TabsList className="mb-4">
            <TabsTrigger value="rendered">Rendered</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="rendered">
            <div className="prose max-w-none">
              {renderContent()}
            </div>
          </TabsContent>

          <TabsContent value="markdown">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute right-0 top-0 m-2"
                onClick={handleCopyMarkdown}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-20 top-0 m-2"
                onClick={handleDownloadMarkdown}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <pre className="bg-gray-50 p-4 rounded-lg mt-10 overflow-auto">
                <code>{formatter.toMarkdown()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="metadata">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
              <code>{JSON.stringify(article?.metadata, null, 2)}</code>
            </pre>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
