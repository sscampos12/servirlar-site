"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2 } from "lucide-react";

type InsightsFormProps = {
  handleAnalysis: (reviews: string[], serviceProviderName: string) => Promise<{ feedback: string }>;
};

export function InsightsForm({ handleAnalysis }: InsightsFormProps) {
  const [reviews, setReviews] = useState("");
  const [providerName, setProviderName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback("");
    const reviewArray = reviews.split('\n').filter(r => r.trim() !== '');
    const result = await handleAnalysis(reviewArray, providerName);
    setFeedback(result.feedback);
    setIsLoading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="providerName" className="font-semibold">Nome do Profissional</Label>
          <Input
            id="providerName"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            placeholder="Ex: Maria da Silva"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="reviews" className="font-semibold">Avaliações dos Clientes</Label>
          <p className="text-sm text-muted-foreground">Insira uma avaliação por linha.</p>
          <Textarea
            id="reviews"
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
            placeholder="Ex: Ótimo serviço, muito pontual e cuidadosa."
            rows={10}
            className="mt-1"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" />
              Analisar Avaliações
            </>
          )}
        </Button>
      </form>
      
      <div className="space-y-4">
        <h3 className="font-semibold font-headline text-lg">Feedback Gerado por IA</h3>
        <Card className={`min-h-[300px] ${isLoading || feedback ? 'block' : 'hidden'}`}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Análise Construtiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {feedback && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{feedback}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
