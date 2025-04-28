import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function ResourcesPage() {
  // Financial tips
  const financialTips = [
    {
      id: "1",
      title: "Building an Emergency Fund",
      content: "Start with a goal of $500, then work toward 3-6 months of expenses. Keep this money in a separate savings account that's easy to access when needed, but not connected to your everyday checking account.",
      icon: "savings",
    },
    {
      id: "2",
      title: "Student Loan Repayment Strategies",
      content: "Understand your grace period and repayment options before graduation. Consider income-driven repayment plans if you're struggling with standard payments. Making payments during school (even small ones) can reduce your overall interest.",
      icon: "school",
    },
    {
      id: "3",
      title: "Smart Textbook Shopping",
      content: "Always check the library first. Look for used books, rentals, or digital versions. Websites like Chegg, Amazon, and BookFinder can help you find the best deals. Sell your books back at the end of the semester.",
      icon: "book",
    },
    {
      id: "4",
      title: "Meal Planning on a Budget",
      content: "Batch cook meals on weekends and freeze portions. Buy staples in bulk. Use apps like Flipp to find grocery deals. Consider splitting grocery costs with roommates for items you all use.",
      icon: "restaurant",
    },
    {
      id: "5",
      title: "Finding Student Discounts",
      content: "Your SJSU ID can get you discounts on software, entertainment, transportation, and more. Always ask if a student discount is available. Websites like UNiDAYS and Student Beans aggregate student deals.",
      icon: "discount",
    },
  ];
  
  // Campus resources
  const campusResources = [
    {
      id: "1",
      title: "SJSU Financial Aid Office",
      description: "Information about scholarships, grants, loans, and work-study programs.",
      link: "https://www.sjsu.edu/faso/",
      icon: "account_balance",
    },
    {
      id: "2",
      title: "Spartan Food Pantry",
      description: "Free food resources for students experiencing food insecurity.",
      link: "https://www.sjsu.edu/spartanfoodpantry/",
      icon: "kitchen",
    },
    {
      id: "3",
      title: "SJSU Career Center",
      description: "Resources for finding part-time jobs, internships, and career opportunities.",
      link: "https://www.sjsu.edu/careercenter/",
      icon: "work",
    },
    {
      id: "4",
      title: "Student Health and Counseling Services",
      description: "Affordable healthcare and mental health services for students.",
      link: "https://www.sjsu.edu/medical/",
      icon: "health_and_safety",
    },
    {
      id: "5",
      title: "Financial Wellness Workshops",
      description: "Free workshops on budgeting, credit, and financial planning.",
      link: "https://www.sjsu.edu/studentaffairs/",
      icon: "event",
    },
  ];
  
  // FAQs
  const faqs = [
    {
      id: "1",
      question: "How can I reduce my housing costs as a student?",
      answer: "Consider living with roommates to split rent and utilities. Look into becoming a Resident Advisor (RA) for reduced or free housing. Explore housing options further from campus where rent might be cheaper, and weigh that against transportation costs. Some homeowners near campus offer reduced rent in exchange for help with chores or childcare.",
    },
    {
      id: "2",
      question: "What should I include in my student budget?",
      answer: "Your budget should include: tuition and fees, books and supplies, housing and utilities, food (grocery and dining out), transportation (car payments, insurance, gas, maintenance, or public transit), personal expenses (clothing, haircuts, toiletries), healthcare (insurance, medications, co-pays), phone and internet, entertainment, savings for emergencies, and any debt payments.",
    },
    {
      id: "3",
      question: "How can I build credit as a student?",
      answer: "Consider a student credit card with a low limit or a secured credit card. Always pay the full balance each month to avoid interest. Become an authorized user on a parent's credit card with good history. Pay all bills on time, including utilities and phone. Use credit monitoring services to track your score improvement.",
    },
    {
      id: "4",
      question: "What are the best ways to save money on textbooks?",
      answer: "Rent instead of buying when possible. Purchase used books from the campus bookstore or online marketplaces. Check if digital versions are available (often cheaper). Look for older editions if your professor allows it. Share textbooks with classmates for courses you take together. Sell your books when you're done with them.",
    },
    {
      id: "5",
      question: "Are there campus jobs that work well with class schedules?",
      answer: "Yes! Look into becoming a teaching assistant, research assistant, library assistant, campus tour guide, IT help desk staff, or administrative assistant in various departments. These positions often offer flexible hours and understand academic priorities. The career center maintains listings of on-campus employment opportunities designed for students.",
    },
  ];
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 pb-16 md:pb-0">
        <div className="p-4 md:p-6 space-y-6">
          <h1 className="text-2xl font-bold text-neutral-800">Financial Resources</h1>
          
          <Tabs defaultValue="tips" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="tips">Financial Tips</TabsTrigger>
              <TabsTrigger value="campus">Campus Resources</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            {/* Financial Tips Tab */}
            <TabsContent value="tips">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {financialTips.map((tip) => (
                  <Card key={tip.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <span className="material-icons text-primary">{tip.icon}</span>
                        </div>
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-600">{tip.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="mt-6 bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="material-icons mr-2">lightbulb</span>
                    Pro Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700">
                    Use the 50/30/20 rule for budgeting: allocate 50% of your income to needs (housing, food, utilities), 
                    30% to wants (entertainment, eating out), and 20% to savings and debt repayment. As a student, 
                    you might need to adjust these percentages based on your specific situation.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Campus Resources Tab */}
            <TabsContent value="campus">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campusResources.map((resource) => (
                  <Card key={resource.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <span className="material-icons text-primary">{resource.icon}</span>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button variant="outline" className="w-full" asChild>
                        <a href={resource.link} target="_blank" rel="noopener noreferrer">
                          Visit Resource
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="mt-6 bg-secondary/5 border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="material-icons mr-2">school</span>
                    Student Services Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 mb-4">
                    The Student Services Center at SJSU brings together the Registrar's Office, 
                    Financial Aid and Scholarship Office, and the Bursar's Office to provide 
                    comprehensive support for all your enrollment and financial needs.
                  </p>
                  <div className="flex space-x-4">
                    <div>
                      <h3 className="font-medium text-neutral-800">Location</h3>
                      <p className="text-sm text-neutral-600">Student Services Center (SSC)</p>
                      <p className="text-sm text-neutral-600">One Washington Square</p>
                      <p className="text-sm text-neutral-600">San José, CA 95192-0008</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800">Hours</h3>
                      <p className="text-sm text-neutral-600">Monday–Thursday: 8:15am–4:45pm</p>
                      <p className="text-sm text-neutral-600">Friday: 9:00am–4:30pm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* FAQ Tab */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Common questions about student finances and budgeting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-neutral-600">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Have More Questions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-neutral-600">
                    If you have specific financial questions not covered here, SJSU offers personalized 
                    financial counseling services to help you navigate your unique situation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="default" className="flex-1" asChild>
                      <a href="https://www.sjsu.edu/faso/contact-us.php" target="_blank" rel="noopener noreferrer">
                        <span className="material-icons mr-2 text-sm">email</span>
                        Contact Financial Aid
                      </a>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <a href="https://www.sjsu.edu/careercenter/students/scheduled-appointments.php" target="_blank" rel="noopener noreferrer">
                        <span className="material-icons mr-2 text-sm">event</span>
                        Schedule Appointment
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
