import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Simulated campus deals
const campusDeals = [
  {
    id: 1,
    title: "Spartan Dining Discount",
    description: "15% off on Tuesdays with student ID",
    expires: "Oct 31",
    icon: "local_dining",
    iconColor: "bg-secondary/20 text-secondary",
  },
  {
    id: 2,
    title: "Student Movie Night",
    description: "$8 tickets at Cinema 12 near campus",
    expires: "Every Thursday",
    icon: "local_movies",
    iconColor: "bg-primary/20 text-primary",
  },
  {
    id: 3,
    title: "SJSU Gym Membership",
    description: "20% off semester passes this week",
    expires: "5 days left",
    icon: "sports",
    iconColor: "bg-green-500/20 text-green-500",
  },
];

export default function CampusDeals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-neutral-800">Campus Deals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campusDeals.map((deal) => (
            <div key={deal.id} className="rounded-lg border border-neutral-200 p-3 bg-neutral-50">
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 rounded-md ${deal.iconColor.split(' ')[0]} flex items-center justify-center`}>
                  <span className={`material-icons ${deal.iconColor.split(' ')[1]}`}>{deal.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-800">{deal.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{deal.description}</p>
                  <div className="mt-2">
                    <span className={`inline-block text-xs ${deal.iconColor.replace('/', '/')} px-2 py-0.5 rounded`}>
                      {deal.expires}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            See more deals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
