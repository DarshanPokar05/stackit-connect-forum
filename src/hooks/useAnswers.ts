
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Answer {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
  user_id: string;
}

export const useAnswers = (questionId: string) => {
  return useQuery({
    queryKey: ['answers', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('answers')
        .select(`
          *,
          profiles!answers_user_id_fkey(username)
        `)
        .eq('question_id', questionId)
        .order('is_accepted', { ascending: false })
        .order('votes', { ascending: false });

      if (error) throw error;

      return data.map((a: any) => ({
        id: a.id,
        content: a.content,
        author: a.profiles?.username || 'Unknown',
        createdAt: new Date(a.created_at).toLocaleDateString(),
        votes: a.votes || 0,
        isAccepted: a.is_accepted || false,
        user_id: a.user_id
      }));
    },
    enabled: !!questionId
  });
};

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ questionId, content }: { questionId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('answers')
        .insert({
          question_id: questionId,
          content,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: "Success",
        description: "Answer posted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
