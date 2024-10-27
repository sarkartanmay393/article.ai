import type { ArticleMetadata } from "~/types/article";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { addSpacesBetweenWords } from "~/lib/utils";
import type { KeyPair } from "~/lib/schema";
import { useToast } from "~/hooks/use-toast";

export default function Metadata({ metadata }: { metadata: ArticleMetadata | null }) {
  if (!metadata) {
    return <div>No metadata available</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <KeyValueView metadata={metadata} />
    </div>
  );
}

const KeyValueView = ({ metadata }: { metadata: KeyPair }) => {
  const metadataKeys = Object.keys(metadata);
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      {metadataKeys.map((key, index) => {
        const value = metadata[key as keyof ArticleMetadata];
        if (value === null || value === undefined) {
          return null;
        }

        let valueParsed: string | JSX.Element = '';

        if (Array.isArray(value)) {
          valueParsed = value.join(', ');
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
          valueParsed = <KeyValueView metadata={value} />;
        }

        if (typeof value === 'string') {
          valueParsed = value;
        }

        if (typeof value === 'number') {
          valueParsed = value.toString();
        }

        const handleCopy = () => {
          'use client';
          if (typeof valueParsed === 'string') {
            void navigator.clipboard.writeText(valueParsed);
            toast({ title: 'Copied to Clipboard', description: 'Markdown content has been copied.' });
          }
        };

        return (
          <div key={index} className="overflow-auto items-center flex gap-1 border-[1px] border-gray-200 p-2 rounded-md">
            <div className="font-medium text-gray-900 w-max min-w-[144px] max-w-[168px] capitalize text-md">{addSpacesBetweenWords(key)}:</div>
            <div className="text-gray-600 flex-grow text-md font-[300] text-left">{valueParsed}</div>
            {typeof valueParsed === 'string' &&
              <Button variant='ghost' onClick={handleCopy}>
                <Copy />
              </Button>}
          </div>
        );
      })}
    </div>
  );
};