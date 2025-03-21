
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileUpload } from "@/components/onboarding/FileUpload";
import { AudioRecorder } from "@/components/onboarding/AudioRecorder";
import { EmmaV2 } from "@/components/onboarding/EmmaV2";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { QuestionnaireChat } from "@/components/onboarding/QuestionnaireChat";
import { AudioExperienceRecorder } from "@/components/onboarding/AudioExperienceRecorder";
import { SkipForward } from "lucide-react";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";
import { ChatInterface } from "@/components/chat/ChatInterface";

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [inputMethod, setInputMethod] = useState<"resume" | "audio" | "video" | "text" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
    };
    checkSession();
  }, [navigate]);

  const handleMethodSelection = async (method: "resume" | "audio" | "video" | "text") => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to continue"
      });
      return;
    }

    setInputMethod(method);
    try {
      const { error } = await supabase.from('caregiver_profiles').upsert({
        id: userId,
        input_method: method
      });
      
      if (error) {
        console.error("Error updating profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error?.message || "Failed to update profile"
        });
        return;
      }
      
      setStep(2);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to update profile"
      });
    }
  };

  const handleSkip = () => {
    navigate('/onboarding/documents');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col space-y-6">
          <OnboardingNavigation showSkip={true} />
          <OnboardingProgress currentStep={1} />
        </div>

        {step === 1 && (
          <Card className="shadow-lg border-gray-100">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Welcome to em.path!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label className="text-base">Choose how you'd like to start</Label>
                <RadioGroup 
                  value={inputMethod || undefined} 
                  onValueChange={(value: "resume" | "audio" | "video" | "text") => handleMethodSelection(value)} 
                  className="grid gap-4"
                >
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="resume" id="resume" />
                    <Label htmlFor="resume" className="flex-1">Upload Resume</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="audio" id="audio" />
                    <Label htmlFor="audio" className="flex-1">Record Audio Introduction</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="video" id="video" />
                    <Label htmlFor="video" className="flex-1">Record Video Introduction</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text" className="flex-1">Chat with our Agent, Emma</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg border-gray-100">
            <CardContent className={`${inputMethod === "text" ? "p-0 h-[60vh]" : "pt-6"}`}>
              {inputMethod === "resume" && <FileUpload onComplete={() => setStep(3)} />}
              {inputMethod === "audio" && <AudioExperienceRecorder />}
              {inputMethod === "video" && <EmmaV2 onComplete={() => setStep(3)} />}
              {inputMethod === "text" && <ChatInterface />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
