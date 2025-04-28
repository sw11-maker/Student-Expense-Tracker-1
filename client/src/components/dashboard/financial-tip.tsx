import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Financial tips that can be rotated/randomized
const financialTips = [
  {
    title: "Building an Emergency Fund as a Student",
    content: "Even with a tight budget, try to set aside a small amount each month for unexpected expenses. Aim to build up at least $500 for emergencies like car repairs or unexpected medical costs. This prevents you from relying on high-interest credit cards in a pinch.",
  },
  {
    title: "Take Advantage of Student Discounts",
    content: "Your SJSU student ID can save you money on everything from software to movie tickets. Always ask if a student discount is available when making purchases. Many local restaurants near campus also offer discounts with a valid student ID.",
  },
  {
    title: "Textbook Money-Saving Strategies",
    content: "Before buying new textbooks, explore rental options, e-books, or used copies. Check the SJSU library, as many required texts may be available for free. Additionally, consider forming a study group where members share resources.",
  },
  {
    title: "Plan Meals to Save Money",
    content: "Eating out regularly can quickly drain your budget. Try meal prepping on weekends, bringing lunch from home, and limiting takeout to once a week. The SJSU dining plan can be cost-effective if used strategically.",
  },
];

export default function FinancialTip() {
  // Get a random tip (in a real app, this could be rotated weekly or fetched from an API)
  const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="material-icons text-white text-sm">lightbulb</span>
          </div>
          <h2 className="text-lg font-bold text-neutral-800">Financial Tip of the Week</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-secondary/10 rounded-lg">
          <h3 className="font-medium text-neutral-800">{randomTip.title}</h3>
          <p className="mt-2 text-sm text-neutral-700">
            {randomTip.content}
          </p>
          <div className="mt-4 flex justify-end">
            <Button variant="link" className="text-secondary text-sm font-medium flex items-center p-0">
              More tips
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
