/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Code, Copy, Download, Eye, Info, Type } from 'lucide-react'; // Import icon
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { useToast } from '~/hooks/use-toast';
import { Button } from './ui/button';
import type { ArticleMetadata } from '~/lib/types/article';
import MarkdownPreviewer from './markdown_previewer';
import Metadata from './metadata';

interface ArticleViewerPanelProps {
  article: string;
  loading: boolean;
  metadata: string;
}

export default function ArticleViewerPanel({ article, loading, metadata: metadataString }: ArticleViewerPanelProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'markdown' | 'metadata'>('rendered');
  const { toast } = useToast();

  if (loading) {
    return (
      <Card className="w-full h-full flex flex-col justify-center items-center text-center animate-fade-in px-8 border-none">
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
      <Card className="w-full h-full flex flex-col justify-center items-center text-center border-none">
        <Type className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-600 mb-2">Enter a topic to get started</h2>
        <p className="text-gray-500">Your generated article will appear here</p>
      </Card>
    );
  }

  let metadata: ArticleMetadata | null = null;

  try {
    metadata = JSON.parse(metadataString) as ArticleMetadata;
  } catch (error) {
    console.error(error);
  }

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(article.slice(1, article.length-1));
    toast({ title: 'Copied to Clipboard', description: 'Markdown content has been copied.' });
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([article.slice(1, article.length-1).replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(metadata?.title ?? 'untitled').toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full h-full overflow-auto border-none">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
        <CardHeader className='flex flex-row justify-between border-b-[1px] h-20'>
          <div className='flex flex-col'>
            <CardTitle className=''>{metadata?.title ?? 'untitled'}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{metadata?.readingTime ?? -1} min read</span>
              <span>•</span>
              <span>{metadata?.wordCount ?? -1} words</span>
            </div>
          </div>
          <TabsList className="mb-0">
            <TabsTrigger value="rendered"><Eye className='w-4 h-4 sm:mr-2' /> <span className='hidden md:inline'>Rendered</span></TabsTrigger>
            <TabsTrigger value="markdown"><Code className='w-4 h-4 sm:mr-2' /> <span className='hidden md:inline'>Markdown</span></TabsTrigger>
            <TabsTrigger value="metadata"><Info className='w-4 h-4 sm:mr-2' /> <span className='hidden md:inline'>Metadata</span></TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="rendered">
            <div className="prose max-w-none justify-center flex">
              <MarkdownPreviewer markdownString={article.slice(1, article.length-1).replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')} />
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
                <code>{article.slice(1, article.length-1).replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')}</code>
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="metadata">
            <Metadata metadata={metadata} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
