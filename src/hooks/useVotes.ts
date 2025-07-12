
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserVotes = (userId?: string) => {
  return useQuery({
    queryKey: ['userVotes', userId],
    queryFn: async () => {
      if (!userId) return {};

      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const votes: Record<string, 'up' | 'down'> = {};
      data.forEach(vote => {
        const key = vote.question_id || vote.answer_id;
        if (key) {
          votes[key] = vote.vote_type as 'up' | 'down';
        }
      });
      return votes;
    },
    enabled: !!userId
  });
};

export const useVote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      targetId, 
      voteType, 
      isQuestion = false 
    }: { 
      targetId: string; 
      voteType: 'up' | 'down'; 
      isQuestion?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has already voted on this item
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq(isQuestion ? 'question_id' : 'answer_id', targetId)
        .single();

      if (existingVote) {
        // Update existing vote or delete if same vote type
        if (existingVote.vote_type === voteType) {
          const { error } = await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
          if (error) throw error;
        }
      } else {
        // Create new vote
        const insertData = {
          user_id: user.id,
          vote_type: voteType,
          ...(isQuestion ? { question_id: targetId } : { answer_id: targetId })
        };

        const { error } = await supabase
          .from('votes')
          .insert(insertData);
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userVotes'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      if (!variables.isQuestion) {
        queryClient.invalidateQueries({ queryKey: ['answers'] });
      }
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
