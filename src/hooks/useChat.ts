
import { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useConversation } from './chat/useConversation';
import { useProfileGeneration } from './chat/useProfileGeneration';
import { useOnboardingNavigation } from './chat/useOnboardingNavigation';
import { Message } from './chat/types';
import { SUPPORTED_LANGUAGES } from '@/components/care-seeker/onboarding/chat/LanguageSelector';

export const useChat = () => {
  const {
    messages,
    chatState,
    setChatState,
    input,
    setInput,
    addMessage,
    clearConversation,
    language,
    setLanguage,
    userId
  } = useConversation();
  
  const { generateProfile, isExiting } = useProfileGeneration(messages);
  const { handleBack, proceedToDocuments } = useOnboardingNavigation();

  // Only initialize chat when we have a userId and no messages
  useEffect(() => {
    const initializeIfNeeded = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Only initialize if we have a user session, userId is set, and no messages exist
      if (session?.user && userId && messages.length === 0) {
        startChat();
      }
    };

    initializeIfNeeded();
  }, [messages.length, userId]);

  const startChat = async () => {
    setChatState('initializing');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message: 'START_CHAT',
          userContext: {
            name: user?.user_metadata?.full_name,
            email: user?.email,
            userId: user?.id, // Pass user ID to the function
            onboardingStep: 'profile_creation'
          },
          language
        }
      });

      if (error) throw error;

      if (data.type === 'message') {
        addMessage({ role: 'assistant', content: data.text });
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setChatState('idle');
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    setChatState('sending');
    
    const languageName = SUPPORTED_LANGUAGES[newLanguage as keyof typeof SUPPORTED_LANGUAGES];
    const message = `Please continue our conversation in ${languageName}.`;
    
    addMessage({ role: 'user', content: message });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message,
          history: messages.map(m => ({ role: m.role, text: m.content })),
          userContext: {
            name: user?.user_metadata?.full_name,
            email: user?.email,
            onboardingStep: 'profile_creation'
          },
          language: newLanguage
        }
      });

      if (error) throw error;

      if (data.type === 'message') {
        addMessage({ role: 'assistant', content: data.text });
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setChatState('idle');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSubmit = async () => {
    if (!input.trim() || chatState !== 'idle') return;

    const userMessage = input.trim();
    setInput('');
    setChatState('sending');
    
    addMessage({ role: 'user', content: userMessage });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message: userMessage,
          history: messages.map(m => ({ role: m.role, text: m.content })),
          userContext: {
            name: user?.user_metadata?.full_name,
            email: user?.email,
            onboardingStep: 'profile_creation'
          },
          language
        }
      });

      if (error) throw error;

      if (data.type === 'message') {
        addMessage({ 
          role: 'assistant', 
          content: data.text 
        });
      }

    } catch (error) {
      console.error('Error in conversation:', error);
    } finally {
      setChatState('idle');
    }
  };

  const generateAndProceedToDocuments = async () => {
    setChatState('generating-profile');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      setChatState('idle');
      return false;
    }
    
    const success = await generateProfile({
      name: user?.user_metadata?.full_name,
      email: user?.email,
      userId: user.id, // Pass user ID to ensure proper data association
      onboardingStep: 'profile_creation'
    });

    if (success) {
      clearConversation();
      proceedToDocuments();
    }
    
    setChatState('idle');
    return success;
  };

  const handleFinish = async () => {
    await generateAndProceedToDocuments();
  };

  return {
    messages,
    input,
    language,
    isAnalyzing: chatState !== 'idle',
    isExiting,
    handleInputChange,
    handleSubmit,
    handleBack,
    handleFinish,
    handleLanguageChange,
    generateAndProceedToDocuments
  };
};
