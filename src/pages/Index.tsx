// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, CheckSquare, Clock, Sparkles, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-landing.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: "15-Minute Planning",
      description: "Create complete itineraries in minutes, not hours",
    },
    {
      icon: Sparkles,
      title: "Smart Activities",
      description: "60+ curated activities with auto-generated checklists",
    },
    {
      icon: Users,
      title: "Role Assignment",
      description: "Assign tasks and keep everyone accountable",
    },
    {
      icon: CheckSquare,
      title: "Day-of Run Sheet",
      description: "Offline-ready mobile guide for smooth execution",
    },
    {
      icon: Calendar,
      title: "Timeline Management",
      description: "One-tap adjustments when plans change",
    },
    {
      icon: TrendingUp,
      title: "Expense Tracking",
      description: "Simple splits and budget management",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "var(--gradient-hero)",
          }}
        />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Turn <span className="text-primary">ideas</span> into unforgettable{" "}
                <span className="text-accent">experiences</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Plan student trips, team offsites, and friend getaways in under 15 minutes. Get instant itineraries,
                smart checklists, and day-of run sheets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg h-14 px-8" onClick={() => navigate("/destinations")}>
                  Start Planning
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">70%</div>
                  <div className="text-sm text-muted-foreground">Plans completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">15min</div>
                  <div className="text-sm text-muted-foreground">Avg. plan time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">60+</div>
                  <div className="text-sm text-muted-foreground">Activities</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl"
                style={{ background: "var(--gradient-hero)" }}
              />
              <img
                src={heroImage}
                alt="Group of friends planning and enjoying activities together"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section - Remove this as we have a dedicated page */}

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need to succeed</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From initial brief to post-trip wrap-up, we've got every step covered
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 border-2"
              style={{
                background: "var(--gradient-card)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The magic moment</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See your trip come to life in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Fill Trip Brief</h3>
              <p className="text-muted-foreground">Answer a few quick questions about your group, dates, and goals</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Get Instant Itinerary</h3>
              <p className="text-muted-foreground">Receive a time-boxed plan with activities and checklist</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Run Your Day</h3>
              <p className="text-muted-foreground">Use the mobile run sheet to manage everything on the go</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="text-lg h-14 px-8" onClick={() => navigate("/trip/new")}>
              Create Your First Trip
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold">Trusted by organizers everywhere</h2>
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="space-y-2">
              <div className="text-2xl font-bold">Student Clubs</div>
              <p className="text-muted-foreground">20-50 participants, need turnkey solutions</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">Team Leaders</div>
              <p className="text-muted-foreground">10-40 people, require timelines and safety</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">Friend Groups</div>
              <p className="text-muted-foreground">2-10 friends, want quick budgeted plans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative container mx-auto px-4 text-center space-y-8">
          <h2 className="text-5xl font-bold">Ready to create something amazing?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join organizers who are turning plans into memories
          </p>
          <Button size="lg" className="text-lg h-14 px-12" onClick={() => navigate("/trip/new")}>
            Get Started - It's Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
