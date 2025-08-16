import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InsightsForm } from "@/components/dashboard/insights-form";
import { analyzeUserReviews } from "@/ai/flows/analyze-user-reviews";

export default function InsightsPage() {
  async function handleAnalysis(reviews: string[], serviceProviderName: string) {
    "use server";
    if (!reviews || reviews.length === 0 || !serviceProviderName) {
      return { feedback: "Por favor, insira o nome do profissional e pelo menos uma avaliação." };
    }
    const result = await analyzeUserReviews({ reviews, serviceProviderName });
    return result;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Análise de Desempenho com IA
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Feedback de Melhoria</CardTitle>
          <CardDescription>
            Cole as avaliações dos seus clientes para receber um feedback
            personalizado e identificar pontos de melhoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InsightsForm handleAnalysis={handleAnalysis} />
        </CardContent>
      </Card>
    </div>
  );
}
