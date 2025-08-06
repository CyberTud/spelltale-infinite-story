import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Wand2, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BookPreview } from "@/components/BookPreview";

const Landing = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pt-28 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Infinite AI stories, generated as you read
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Spelltale
            <span className="block text-muted-foreground text-xl font-normal mt-2">An infinite AI story that writes itself</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Dive into a living book where each chapter unfolds uniquely for you. Start reading instantly—no sign up required.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/read" aria-label="Start reading now">Start Reading</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#preview" aria-label="See a quick preview">Preview</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-mystical" aria-hidden="true" />
                Dynamic storytelling
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              The narrative adapts as you read, conjuring new scenes, twists, and discoveries.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-mystical" aria-hidden="true" />
                Endless chapters
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Turn the page forever—there’s always another chapter awaiting your curiosity.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-mystical" aria-hidden="true" />
                Shareable moments
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Capture and share magical passages with friends across your favorite apps.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="mx-auto max-w-4xl px-6 pb-20">
        <Card>
          <CardHeader>
            <CardTitle>See the vibe</CardTitle>
          </CardHeader>
          <CardContent>
            <BookPreview />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              This is a live excerpt. Want more? Click Start Reading to step into your story.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Spelltale • Crafted with imagination
      </footer>
    </main>
  );
};

export default Landing;
