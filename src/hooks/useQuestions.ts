
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Question {
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
  user_id: string;
}

export const useQuestions = () => {
  return useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles!questions_user_id_fkey(username),
          answers(count),
          answers!inner(is_accepted)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((q: any) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        author: q.profiles?.username || 'Unknown',
        createdAt: new Date(q.created_at).toLocaleDateString(),
        tags: q.tags || [],
        votes: q.votes || 0,
        answers: q.answers?.length || 0,
        views: q.views || 0,
        hasAcceptedAnswer: q.answers?.some((a: any) => a.is_accepted) || false,
        user_id: q.user_id
      }));
    }
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles!questions_user_id_fkey(username)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from('questions')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        author: data.profiles?.username || 'Unknown',
        createdAt: new Date(data.created_at).toLocaleDateString(),
        tags: data.tags || [],
        votes: data.votes || 0,
        views: (data.views || 0) + 1,
        user_id: data.user_id
      };
    },
    enabled: !!id
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ title, description, tags }: { title: string; description: string; tags: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('questions')
        .insert({
          title,
          description,
          tags,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: "Success",
        description: "Question posted successfully!",
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
