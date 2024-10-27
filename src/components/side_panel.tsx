/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useState } from 'react';
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Checkbox } from "~/components/ui/checkbox";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import type { CheckedState } from '@radix-ui/react-checkbox';
import { useToast } from '~/hooks/use-toast';
import { Loader2Icon, Wand2 } from 'lucide-react';
import { readStreamableValue } from 'ai/rsc';
import { generate } from '~/lib/actions';

type SidePanelProps = {
  setArticle: any;
  // setArticle: (article: Article | null) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setMetadata: any;
}

export default function SidePanel({ setArticle, setLoading, loading, setMetadata }: SidePanelProps) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Professional');
  const [tone, setTone] = useState('Neutral');
  const [maxLength, setMaxLength] = useState(500);
  const [includeCitations, setIncludeCitations] = useState<CheckedState>(false);
  const [seoOptimization, setSeoOptimization] = useState<CheckedState>(false);
  const [factChecking, setFactChecking] = useState<CheckedState>(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { toast } = useToast();

  const clearAllInput = () => {
    setTone('');
    setStyle('Professional');
    setTone('Neutral');
    setMaxLength(500);
    setIncludeCitations(false);
    setSeoOptimization(false);
    setFactChecking(false);
  }

  const handleGenerateArticle = async () => {
    try {
      if (!topic) {
        toast({
          title: "Missing Topic",
          description: "Please enter a topic before generating the article.",
        });
        return;
      }

        setLoading(true);

      const { object } = await generate({
        tone,
        style,
        maxLength,
        topic,
      })

      let alreadyLoading = true;

      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject?.metadata) {
          setMetadata(
            JSON.stringify((partialObject as any).metadata, null, 2),
          );
        }
        if (partialObject?.content) {
          if (alreadyLoading) {
            setLoading(false);
            alreadyLoading = false;
          }
          setArticle(
            JSON.stringify((partialObject as any).content, null, 2),
          );
        }
      }

      clearAllInput();

      toast({
        title: "Article Generated",
        description: `Your article with style "${style}" and tone "${tone}" has been generated!`,
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to Generate Article",
        description: "An error occurred while generating the article. Please try again.",
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Playground</h1>
        <p className="text-sm text-gray-500">Configure your article settings</p>
      </div>

      {/* Settings Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Topic Input */}
        <div className="space-y-2">
          <Label>Article Topic</Label>
          <Textarea
            disabled={loading}
            className="min-h-20 max-h-80 w-full h-24"
            placeholder="Enter your article topic or brief..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <Label>Writing Style</Label>
          <Select onValueChange={(value) => setStyle(value)} value={style}>
            <SelectTrigger disabled={loading} className="w-full">
              <SelectValue placeholder="Select writing style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select onValueChange={(value) => setTone(value)} value={tone}>
            <SelectTrigger disabled={loading} className="w-full">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Neutral">Neutral</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Authoritative">Authoritative</SelectItem>
              <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Length Slider */}
        <div className="space-y-2">
          <Label>Maximum Length</Label>
          <div className="relative">
            <Slider
              disabled={loading}
              defaultValue={[500]}
              min={100}
              max={2000}
              step={10}
              value={[maxLength]}
              onValueChange={(value) => setMaxLength(value.at(0)!)}
              onMouseEnter={() => setShowTooltip(true)} 
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute top-[-40px] left-2/4 transform bg-gray-600 text-white text-sm rounded px-2 py-1">
                {maxLength} words
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>100</span>
            <span>2000 words</span>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-2 hidden">
          <Label>Advanced Settings</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox disabled={loading} checked={includeCitations} onCheckedChange={setIncludeCitations} />
              <span className="text-sm text-gray-700">Include citations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox disabled={loading} checked={seoOptimization} onCheckedChange={setSeoOptimization} />
              <span className="text-sm text-gray-700">SEO optimization</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox disabled={loading} checked={factChecking} onCheckedChange={setFactChecking} />
              <span className="text-sm text-gray-700">Fact checking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 animate-fade-in">
        <Button disabled={loading} onClick={handleGenerateArticle} className={`w-full flex items-center justify-center ${loading ? "animate-pulse" : ""}`}>
          {loading ? <Loader2Icon className='animate-spin' /> :
            <Wand2 className="w-4 h-4 mr-2" />}
          {loading ? "Generating..." : "Generate Article"}
        </Button>
      </div>
    </div>
  );
}
