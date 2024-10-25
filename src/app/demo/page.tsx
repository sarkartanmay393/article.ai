'use client';

import { useState } from 'react';
import SidePanel from '~/components/side_panel';
import ArticleViewer from '~/components/article_viewer';
import type { Article } from '~/types/article';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

const Playground = () => {
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<Article | null>({
    id: "art_123xyz",
    metadata: {
      title: "The Future of Artificial Intelligence",
      summary: "An exploration of AI's impact on society and technology",
      keywords: ["AI", "technology", "future", "machine learning"],
      targetAudience: "tech-savvy professionals",
      readingTime: 5,
      wordCount: 1200,
      language: "en",
      tone: "informative",
      style: "professional",
      seoMetadata: {
        metaTitle: "The Future of AI: A Comprehensive Overview",
        metaDescription: "Explore the future implications of AI technology...",
      },
      generationParams: {
        prompt: "Write a professional article about AI's future...",
        temperature: 0.7,
        model: "gpt-4",
        timestamp: "2024-10-25T10:30:00Z"
      },
      version: 1
    },
    content: [
      {
        id: "sec_1",
        type: "heading",
        content: "The Future of Artificial Intelligence",
        metadata: { level: 1 }
      },
      {
        id: "sec_2",
        type: "paragraph",
        content: "Artificial Intelligence has become an integral part of our daily lives..."
      },
      {
        id: "sec_3",
        type: "heading",
        content: "Current State of AI",
        metadata: { level: 2 }
      },
      {
        id: "sec_4",
        type: "list",
        content: "Key developments in AI",
        metadata: { listType: "bullet" },
        children: [
          { id: "item_1", type: "list", content: "Machine Learning advancements" },
          { id: "item_2", type: "list", content: "Natural Language Processing" }
        ]
      },
      {
        id: "sec_5",
        type: "quote",
        content: "AI is not just transforming technology; it's reshaping society itself.",
        metadata: {
          citations: [{
            id: "cite_1",
            text: "AI Impact Report 2024",
            type: "article",
            author: "Dr. Jane Smith",
            date: "2024"
          }]
        }
      }
    ],
    created_at: "2024-10-25T10:30:00Z",
    updated_at: "2024-10-25T10:30:00Z"
  });
  
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:flex w-full h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-full"
        >
          <ResizablePanel defaultSize={25} maxSize={30}>
            <SidePanel setArticle={setArticle} setLoading={setLoading} loading={loading} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <ArticleViewer articleData={article} loading={loading} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="md:hidden w-full h-full">
        <Tabs defaultValue="viewer" className="h-full">
          <TabsList className="flex justify-around p-4 bg-gray-100">
            <TabsTrigger value="panel" className="w-full">Settings</TabsTrigger>
            <TabsTrigger value="viewer" className="w-full">Viewer</TabsTrigger>
          </TabsList>
          <TabsContent value="panel" className="h-[calc(100%-4rem)] overflow-y-auto">
            <SidePanel setArticle={setArticle} setLoading={setLoading} loading={loading} />
          </TabsContent>
          <TabsContent value="viewer" className="h-[calc(100%-4rem)] overflow-y-auto">
            <ArticleViewer articleData={article} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Playground;
