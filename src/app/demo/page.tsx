'use client';

import { useState } from 'react';
import SidePanel from '~/components/side_panel';
import ArticleViewer from '~/components/article_viewer';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

const Playground = () => {
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState('');
  const [metadata, setMetadata] = useState('');
  
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:flex w-full h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-full"
        >
          <ResizablePanel defaultSize={25} maxSize={30}>
            <SidePanel setArticle={setArticle} setLoading={setLoading} loading={loading} setMetadata={setMetadata} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <ArticleViewer article={article} loading={loading} metadata={metadata} />
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
            <SidePanel setArticle={setArticle} setLoading={setLoading} loading={loading} setMetadata={setMetadata} />
          </TabsContent>
          <TabsContent value="viewer" className="h-[calc(100%-4rem)] overflow-y-auto">
            <ArticleViewer article={article} loading={loading} metadata={metadata} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Playground;
