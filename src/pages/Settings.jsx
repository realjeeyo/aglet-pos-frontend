import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[var(--color-muted-foreground)]">Settings page is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
