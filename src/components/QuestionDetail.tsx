
import { ArrowLeft, ChevronUp, ChevronDown, Check, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuestion } from "@/hooks/useQuestions";
import { useAnswers, useCreateAnswer } from "@/hooks/useAnswers";
import { useUserVotes, useVote } from "@/hooks/useVotes";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionDetailProps {
  questionId: string;
  onBack: () => void;
}

export const QuestionDetail = ({ questionId, onBack }: QuestionDetailProps) => {
  const [newAnswer, setNewAnswer] = useState("");
  const { user } = useAuth();
  
  const { data: question, isLoading: questionLoading } = useQuestion(questionId);
  const { data: answers, isLoading: answersLoading } = useAnswers(questionId);
  const { data: userVotes } = useUserVotes(user?.id);
  const vote = useVote();
  const createAnswer = useCreateAnswer();

  const handleVote = (targetId: string, voteType: 'up' | 'down', isQuestion = false) => {
    if (!user) return;
    vote.mutate({ targetId, voteType, isQuestion });
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim() && user) {
      createAnswer.mutate(
        { questionId, content: newAnswer },
        {
          onSuccess: () => setNewAnswer("")
        }
      );
    }
  };

  if (questionLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
        <div className="text-center py-8">
          <p className="text-gray-600">Question not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Questions
      </Button>

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center space-y-2 min-w-[60px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(question.id, 'up', true)}
                className={`p-1 ${userVotes?.[question.id] === 'up' ? 'text-green-600' : 'text-gray-600'}`}
                disabled={!user}
              >
                <ChevronUp className="h-6 w-6" />
              </Button>
              <span className="font-bold text-lg">{question.votes}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(question.id, 'down', true)}
                className={`p-1 ${userVotes?.[question.id] === 'down' ? 'text-red-600' : 'text-gray-600'}`}
                disabled={!user}
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{question.title}</h1>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{question.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
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

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {answers?.length || 0} Answer{(answers?.length || 0) !== 1 ? 's' : ''}
        </h2>

        {answersLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          answers?.map((answer) => (
            <Card key={answer.id} className={answer.isAccepted ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, 'up')}
                      className={`p-1 ${userVotes?.[answer.id] === 'up' ? 'text-green-600' : 'text-gray-600'}`}
                      disabled={!user}
                    >
                      <ChevronUp className="h-6 w-6" />
                    </Button>
                    <span className="font-bold text-lg">{answer.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, 'down')}
                      className={`p-1 ${userVotes?.[answer.id] === 'down' ? 'text-red-600' : 'text-gray-600'}`}
                      disabled={!user}
                    >
                      <ChevronDown className="h-6 w-6" />
                    </Button>
                    {answer.isAccepted && (
                      <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">{answer.content}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{answer.createdAt}</span>
                      </div>
                      <span>by <span className="font-medium text-blue-600">{answer.author}</span></span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Answer */}
      {user ? (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Write your answer here... You can use markdown for formatting."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <Button 
                onClick={handleSubmitAnswer}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newAnswer.trim() || createAnswer.isPending}
              >
                {createAnswer.isPending ? 'Posting...' : 'Post Your Answer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please log in to post an answer.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
