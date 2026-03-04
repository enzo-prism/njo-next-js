import { AlertTriangle, Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[55vh] items-center">
      <Card className="mx-auto w-full max-w-xl border border-border/80">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Page not found</CardTitle>
          <CardDescription>
            The page you were looking for does not exist, may have moved, or is temporarily unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Try returning to the homepage, searching our services pages, or contacting us if you think this is a broken link.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resources" className="inline-flex items-center gap-2">
                <Search className="h-4 w-4" />
                Explore resources
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
