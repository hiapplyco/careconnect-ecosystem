
import { Card } from "@/components/ui/card";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatInput } from "./chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { LanguageSelector } from "@/components/care-seeker/onboarding/chat/LanguageSelector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const QuestionnaireChat = () => {
  const {
    messages,
    input,
    isAnalyzing,
    language,
    handleInputChange,
    handleSubmit,
    handleBack,
    handleFinish,
    handleLanguageChange,
    generateAndProceedToDocuments
  } = useChat();
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="container flex items-center justify-between h-16 max-w-3xl px-4 mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <LanguageSelector 
              language={language}
              onLanguageChange={handleLanguageChange}
            />
            <Button 
              onClick={() => setShowEndConfirmation(true)}
              disabled={isAnalyzing}
              variant="default"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Continue to Documents
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={messages.length * 10} className="h-1" />

      {/* Chat Container */}
      <div className="container flex-1 p-4 mx-auto max-w-3xl">
        <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-white rounded-lg shadow-sm border">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <ChatMessageList messages={messages} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <ChatInput
              input={input}
              isLoading={isAnalyzing}
              onInputChange={handleInputChange}
              onSendMessage={handleSubmit}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={showEndConfirmation} onOpenChange={setShowEndConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue to Document Upload</AlertDialogTitle>
            <AlertDialogDescription>
              We'll analyze your responses and prepare your profile before proceeding to document upload. Would you like to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay Here</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              setShowEndConfirmation(false);
              await generateAndProceedToDocuments();
            }}>
              Continue to Documents
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
