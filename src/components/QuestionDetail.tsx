
import { ArrowLeft, ChevronUp, ChevronDown, Check, Clock, MessageCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface QuestionDetailProps {
  questionId: string;
  onBack: () => void;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
}

// Mock data
const mockQuestion = {
  id: "1",
  title: "How to implement JWT authentication in React?",
  description: `I'm trying to implement JWT authentication in my React application but I'm having trouble with token storage and refresh.

Here's what I've tried so far:

1. Storing tokens in localStorage
2. Using httpOnly cookies
3. Implementing refresh token logic

The main issues I'm facing are:
- Token expiration handling
- Secure storage best practices
- Automatic token refresh

Any guidance would be greatly appreciated!`,
  author: "john_doe",
  createdAt: "2 hours ago",
  tags: ["React", "JWT", "Authentication"],
  votes: 15,
  views: 142
};

const mockAnswers: Answer[] = [
  {
    id: "1",
    content: `For JWT authentication in React, I recommend using httpOnly cookies for token storage as they're more secure than localStorage.

Here's a comprehensive approach:

**1. Token Storage:**
- Use httpOnly cookies for refresh tokens
- Store access tokens in memory (React state/context)

**2. Implementation:**
\`\`\`javascript
// Create an auth context
const AuthContext = createContext();

// Token refresh logic
const refreshToken = async () => {
  try {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      credentials: 'include' // Include httpOnly cookies
    });
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    // Redirect to login
  }
};
\`\`\`

**3. Axios Interceptors:**
Set up request and response interceptors to handle token attachment and refresh automatically.

This approach provides good security while maintaining a smooth user experience.`,
    author: "security_expert",
    createdAt: "1 hour ago",
    votes: 12,
    isAccepted: true
  },
  {
    id: "2",
    content: `Another approach is to use a dedicated library like \`@auth0/auth0-react\` or \`react-query\` with custom hooks.

Here's a simple custom hook approach:

\`\`\`javascript
const useAuth = () => {
  const [token, setToken] = useState(null);
  
  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const { accessToken } = await response.json();
    setToken(accessToken);
  };

  return { token, login };
};
\`\`\`

The key is to keep it simple and secure!`,
    author: "react_dev",
    createdAt: "45 minutes ago",
    votes: 8,
    isAccepted: false
  }
];

export const QuestionDetail = ({ questionId, onBack }: QuestionDetailProps) => {
  const [newAnswer, setNewAnswer] = useState("");
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});

  const handleVote = (id: string, type: 'up' | 'down') => {
    setUserVotes(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim()) {
      console.log("Submitting answer:", newAnswer);
      setNewAnswer("");
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
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
                onClick={() => handleVote('question', 'up')}
                className={`p-1 ${userVotes['question'] === 'up' ? 'text-green-600' : 'text-gray-600'}`}
              >
                <ChevronUp className="h-6 w-6" />
              </Button>
              <span className="font-bold text-lg">{mockQuestion.votes}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('question', 'down')}
                className={`p-1 ${userVotes['question'] === 'down' ? 'text-red-600' : 'text-gray-600'}`}
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{mockQuestion.title}</h1>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{mockQuestion.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {mockQuestion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{mockQuestion.createdAt}</span>
                  </div>
                  <span>by <span className="font-medium text-blue-600">{mockQuestion.author}</span></span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {mockAnswers.length} Answer{mockAnswers.length !== 1 ? 's' : ''}
        </h2>

        {mockAnswers.map((answer) => (
          <Card key={answer.id} className={answer.isAccepted ? 'border-green-200 bg-green-50' : ''}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(answer.id, 'up')}
                    className={`p-1 ${userVotes[answer.id] === 'up' ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    <ChevronUp className="h-6 w-6" />
                  </Button>
                  <span className="font-bold text-lg">{answer.votes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(answer.id, 'down')}
                    className={`p-1 ${userVotes[answer.id] === 'down' ? 'text-red-600' : 'text-gray-600'}`}
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
        ))}
      </div>

      {/* Add Answer */}
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
              disabled={!newAnswer.trim()}
            >
              Post Your Answer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
