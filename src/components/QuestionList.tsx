
import { Clock, MessageCircle, ChevronUp, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuestions } from "@/hooks/useQuestions";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionListProps {
  onQuestionClick: (id: string) => void;
}

export const QuestionList = ({ onQuestionClick }: QuestionListProps) => {
  const { data: questions, isLoading, error } = useQuestions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Latest Questions</h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center space-y-2 min-w-[80px]">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Latest Questions</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">Failed to load questions. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Latest Questions</h2>
        <div className="text-sm text-gray-600">
          {questions?.length || 0} questions
        </div>
      </div>

      <div className="space-y-4">
        {questions?.map((question) => (
          <Card 
            key={question.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onQuestionClick(question.id)}
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center space-y-2 text-sm text-gray-600 min-w-[80px]">
                  <div className="flex items-center space-x-1">
                    <ChevronUp className="h-4 w-4" />
                    <span className="font-medium">{question.votes}</span>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${question.hasAcceptedAnswer ? 'text-green-600' : 'text-gray-600'}`}>
                      {question.answers}
                    </div>
                    <div className="text-xs">answers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{question.views}</div>
                    <div className="text-xs">views</div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {question.title}
                  </h3>
                  
                  <p className="text-gray-600 line-clamp-2">
                    {question.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{question.createdAt}</span>
                      </div>
                      <span>by <span className="font-medium text-blue-600">{question.author}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!questions || questions.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-600">No questions yet. Be the first to ask one!</p>
        </div>
      )}
    </div>
  );
};
