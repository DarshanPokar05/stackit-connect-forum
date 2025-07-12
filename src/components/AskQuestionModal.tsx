
import { useState } from "react";
import { X, Bold, Italic, List, Link2, Image, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCreateQuestion } from "@/hooks/useQuestions";

interface AskQuestionModalProps {
  open: boolean;
  onClose: () => void;
}

const availableTags = [
  "React", "JavaScript", "TypeScript", "Node.js", "Python", "Java", "C++", "HTML", "CSS",
  "Vue.js", "Angular", "Express", "MongoDB", "PostgreSQL", "MySQL", "Authentication",
  "API", "Database", "Frontend", "Backend", "Full Stack", "Mobile", "iOS", "Android"
];

export const AskQuestionModal = ({ open, onClose }: AskQuestionModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const createQuestion = useCreateQuestion();

  const handleTagAdd = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (title.trim() && description.trim() && selectedTags.length > 0) {
      createQuestion.mutate(
        { title, description, tags: selectedTags },
        {
          onSuccess: () => {
            // Reset form
            setTitle("");
            setDescription("");
            setSelectedTags([]);
            setTagInput("");
            onClose();
          }
        }
      );
    }
  };

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) && 
    !selectedTags.includes(tag)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Ask a Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Be specific and imagine you're asking a question to another person"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
            />
            <p className="text-sm text-gray-600">
              The title should be a concise summary of your problem or question.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            
            {/* Rich Text Editor Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border border-gray-200 rounded-t-md bg-gray-50">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Link2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Image className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <Textarea
              id="description"
              placeholder="Provide all the relevant details about your problem. Include what you've tried and what specific help you need."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              className="resize-none rounded-t-none border-t-0"
            />
            <p className="text-sm text-gray-600">
              Include all the information someone would need to answer your question.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-base font-medium">
              Tags <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tags"
              placeholder="Search for tags..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="text-base"
            />
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => handleTagRemove(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Tag Suggestions */}
            {tagInput && filteredTags.length > 0 && (
              <div className="border border-gray-200 rounded-md p-2 bg-white shadow-sm max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-1">
                  {filteredTags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleTagAdd(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-600">
              Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!title.trim() || !description.trim() || selectedTags.length === 0 || createQuestion.isPending}
            >
              {createQuestion.isPending ? 'Posting...' : 'Post Your Question'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
