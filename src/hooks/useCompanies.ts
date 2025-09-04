import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Company {
  id: number;
  company_name: string;
  created_at: string;
}

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      const { data, error } = await supabase
        .from('c_mobile')
        .select('*')
        .order('company_name', { ascending: true });

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - companies don't change often
  });
};

export const useAddCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyName: string): Promise<Company> => {
      // Check if company already exists (case-insensitive)
      const { data: existingCompany, error: checkError } = await supabase
        .from('c_mobile')
        .select('*')
        .ilike('company_name', companyName)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected
        throw checkError;
      }

      if (existingCompany) {
        throw new Error(`Company "${companyName}" already exists!`);
      }

      // Add new company
      const { data, error } = await supabase
        .from('c_mobile')
        .insert({
          company_name: companyName.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding company:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (newCompany) => {
      // Invalidate and refetch companies list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success(`Successfully added "${newCompany.company_name}" as a new brand!`);
    },
    onError: (error: any) => {
      console.error('Failed to add company:', error);
      toast.error(error.message || 'Failed to add new brand. Please try again.');
    },
  });
};