"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  const [status, setStatus] = useState<"loading" | "healthy" | "error">("loading");
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`);
        if (response.ok) {
          setStatus("healthy");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
      setLastChecked(new Date());
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">System Status</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            API Status
            <Badge 
              variant={status === "healthy" ? "default" : status === "error" ? "destructive" : "secondary"}
              className={`ml-2 ${status === "healthy" ? "bg-green-500 hover:bg-green-600" : ""}`}
            >
              {status === "healthy" ? (
                <CheckCircle2 className="w-4 h-4 mr-1" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-1" />
              )}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}