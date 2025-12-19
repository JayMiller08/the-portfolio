import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Users,
  Calendar,
  Mail,
  Loader2,
  RefreshCw,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

const AdminHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
};

const AdminPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast({
        title: "Error",
        description: "Failed to load subscribers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no subscribers to export yet.",
      });
      return;
    }

    setIsExporting(true);

    try {
      // CSV headers
      const headers = ["ID", "Email", "Source", "Created At"];
      
      // CSV rows
      const rows = subscribers.map((sub) => [
        sub.id,
        sub.email,
        sub.source || "N/A",
        new Date(sub.created_at).toLocaleString(),
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `subscribers_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Exported ${subscribers.length} subscribers to CSV.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground">
        <AdminHeader />

        <main className="container mx-auto px-4 py-8 md:py-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your subscribers and view analytics.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{subscribers.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {
                    subscribers.filter((sub) => {
                      const subDate = new Date(sub.created_at);
                      const now = new Date();
                      return (
                        subDate.getMonth() === now.getMonth() &&
                        subDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Latest Source
                </CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium truncate">
                  {subscribers[0]?.source || "No subscribers yet"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              onClick={fetchSubscribers}
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={exportToCSV}
              variant="hero"
              disabled={isExporting || subscribers.length === 0}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export to Excel
            </Button>
          </div>

          {/* Subscribers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No subscribers yet. Share your Artifacts page to start
                    collecting emails!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">
                            {subscriber.email}
                          </TableCell>
                          <TableCell>{subscriber.source || "N/A"}</TableCell>
                          <TableCell>
                            {formatDate(subscriber.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            <p>Admin Dashboard — Jay Mthethwa Portfolio</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default AdminPage;