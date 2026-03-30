import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Rymlab</h1>
      <p className="text-muted-foreground">Portfolio &amp; Blog — Coming Soon</p>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Complete</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Tailwind CSS v4 + shadcn/ui (New York) が正常に動作しています。
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </main>
  );
}
