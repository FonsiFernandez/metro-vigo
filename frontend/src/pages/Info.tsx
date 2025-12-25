import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Github, Linkedin } from "lucide-react";
import profilePhoto from "../assets/foto.jpg";

export default function InfoPage() {
  const values = [
    { title: "Safety first", text: "Designed around safe platforms, clear signage, and predictable service." },
    { title: "Accessibility", text: "Step-free access where possible, readable UI, and inclusive wayfinding." },
    { title: "Sustainability", text: "Better mobility with less traffic, noise, and emissions in the city center." },
    { title: "Reliability", text: "Simple lines, intuitive transfers, and service alerts when it matters." },
  ];

  const rules = [
    { title: "Validate before travel", text: "Keep a valid ticket or pass ready for inspection." },
    { title: "Keep moving on escalators", text: "Stand to the right, let others pass on the left." },
    { title: "Respect quiet zones", text: "Lower volume and keep calls short, especially during peak hours." },
    { title: "No smoking / vaping", text: "Not allowed in stations, trains, or entrances." },
    { title: "Priority seating", text: "Reserved for people with reduced mobility, pregnant passengers, and the elderly." },
    { title: "Bikes & scooters", text: "Allowed off-peak when space permits. Foldables anytime." },
  ];

  const fines = [
    { label: "No valid ticket", amount: "€60–€120", note: "Depends on repeated offenses and situation." },
    { label: "Misuse of emergency equipment", amount: "€150+", note: "Includes false alarms and obstruction." },
    { label: "Vandalism / damage", amount: "€300+", note: "Plus repair costs and legal action if needed." },
    { label: "Disruptive behavior", amount: "€80–€200", note: "Safety-related incidents are treated seriously." },
  ];

  const vigo = [
    { title: "Waterfront city", text: "A strong maritime identity with port life, promenades, and viewpoints." },
    { title: "Beaches & nature", text: "Quick access to Samil and coastal areas, plus nearby hikes and miradores." },
    { title: "Culture & food", text: "Galician cuisine, seafood, and local neighborhoods with character." },
    { title: "Easy connections", text: "Rail hub + airport links make Vigo a great base for exploring the region." },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Information</h1>
        <p className="text-sm text-muted-foreground">
          Practical guidelines, values, and city highlights. (Fictional project)
        </p>
      </div>

      {/* Values */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Our values</CardTitle>
            <Badge variant="secondary">Vision</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border/50 bg-background/60 p-3">
              <div className="font-medium">{v.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{v.text}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rules + Fines */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Metro rules</CardTitle>
              <Badge variant="outline">Good to know</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.map((r) => (
              <div key={r.title} className="rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.text}</div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground">
              These are illustrative guidelines for the fictional Vigo Metro project.
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Fines & enforcement</CardTitle>
              <Badge variant="outline">Indicative</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {fines.map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.note}</div>
                </div>
                <div className="whitespace-nowrap font-semibold">{f.amount}</div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground">
              Final policies would be defined by the relevant authorities.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Vigo — city highlights</CardTitle>
            <Badge variant="secondary">Tourism</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {vigo.map((x) => (
              <div key={x.title} className="rounded-xl border border-border/50 bg-background/60 p-3">
                <div className="font-medium">{x.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{x.text}</div>
              </div>
            ))}
          </div>

<div className="h-px bg-border" />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Next: we can add curated suggestions, walking routes, and station-based tips.
            </div>
            <Button variant="outline">Coming soon</Button>
          </div>
        </CardContent>
      </Card>

 {/* About the developer */}
 <Card className="border border-border/60">
   <CardHeader className="pb-3">
     <div className="flex items-center justify-between gap-3">
       <CardTitle className="text-base">About the developer</CardTitle>
       <Badge variant="outline">Personal</Badge>
     </div>
   </CardHeader>

   <CardContent className="space-y-5">
     <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
       {/* Photo */}
       <div className="flex-shrink-0">
         <img
           src={profilePhoto}
           alt="Alfonso"
           className="
             h-28 w-28 rounded-2xl object-cover
             border border-border/60
             shadow-sm
           "
           draggable={false}
         />
       </div>

       {/* Text */}
       <div className="space-y-2">
         <p className="text-sm text-muted-foreground leading-relaxed">
           Hi, I’m <span className="font-medium text-foreground">Alfonso</span>, the developer behind this project.
           <span className="font-medium text-foreground"> Vigo Metro</span> is a{" "}
           <span className="font-medium text-foreground">fictional</span> application created for fun and exploration:
           a way to experiment with UI/UX, transport systems, and present a more modern, digital vision of the city of Vigo.
         </p>

         <p className="text-sm text-muted-foreground leading-relaxed">
           The project combines frontend design, data modeling, and interaction patterns inspired by real metro networks,
           but it has <span className="font-medium text-foreground">no official or institutional affiliation</span>.
         </p>
       </div>
     </div>

     {/* Actions */}
     <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
       <Button variant="outline" asChild className="gap-2">
         <a
           href="https://github.com/FonsiFernandez"
           target="_blank"
           rel="noreferrer"
         >
           <Github className="h-4 w-4" />
           GitHub
         </a>
       </Button>

       <Button variant="outline" asChild className="gap-2">
         <a
           href="https://www.linkedin.com/in/fonsifernandez/"
           target="_blank"
           rel="noreferrer"
         >
           <Linkedin className="h-4 w-4" />
           LinkedIn
         </a>
       </Button>
     </div>

     <div className="text-xs text-muted-foreground">
       Built as a personal UI/UX and engineering showcase · Data and services simulated.
     </div>
   </CardContent>
 </Card>
    </div>

  );
}
