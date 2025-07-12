
import { Clock, MessageCircle, ChevronUp, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  hasAcceptedAnswer: boolean;
}

interface QuestionListProps {
  onQuestionClick: (id: string) => void;
}

// Mock data for demonstration
const mockQuestions: Question[] = [
  {
    id: "1",
    title: "How to implement JWT authentication in React?",
    description: "I'm trying to implement JWT authentication in my React application but I'm having trouble with token storage and refresh...",
    author: "john_doe",
    createdAt: "2 hours ago",
    tags: ["React", "JWT", "Authentication"],
    votes: 15,
    answers: 3,
    views: 142,
    hasAcceptedAnswer: true
  },
  {
    id: "2",
    title: "Best practices for React component state management",
    description: "What are the current best practices for managing state in React components? Should I use useState, useReducer, or context?",
    author: "jane_smith",
    createdAt: "4 hours ago",
    tags: ["React", "State Management", "Hooks"],
    votes: 8,
    answers: 5,
    views: 89,
    hasAcceptedAnswer: false
  },
  {
    id: "3",
    title: "How to optimize database queries in PostgreSQL?",
    description: "My PostgreSQL queries are running slow. What are some techniques to optimize them?",
    author: "dev_master",
    createdAt: "1 day ago",
    tags: ["PostgreSQL", "Database", "Performance"],
    votes: 23,
    answers: 7,
    views: 234,
    hasAcceptedAnswer: true
  }
];

export const QuestionList = ({ onQuestionClick }: QuestionListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Latest Questions</h2>
        <div className="text-sm text-gray-600">
          {mockQuestions.length} questions
        </div>
      </div>

      <div className="space-y-4">
        {mockQuestions.map((question) => (
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
    </div>
  );
};
