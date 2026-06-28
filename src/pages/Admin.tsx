import { useState, useEffect, useMemo, useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";
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
  Upload,
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
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const growthData = useMemo(() => {
    if (!subscribers.length) return [];
    
    // Sort ascending by date
    const sorted = [...subscribers].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    const countsByDate = sorted.reduce((acc, sub) => {
      const date = new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let cumulative = 0;
    return Object.entries(countsByDate).map(([date, count]) => {
      cumulative += count;
      return { date, count: cumulative };
    });
  }, [subscribers]);

  const sourceData = useMemo(() => {
    const counts = subscribers.reduce((acc, sub) => {
      const source = sub.source || "Imported";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [subscribers]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    setIsLoading(false);
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

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error("File is empty");

        const lines = text.split('\n').filter((line) => line.trim() !== '');
        if (lines.length < 2) throw new Error("CSV contains no data rows");

        // Parse headers
        const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim().toLowerCase());
        const emailIndex = headers.findIndex(h => h === 'email');
        const sourceIndex = headers.findIndex(h => h === 'source');
        const createdAtIndex = headers.findIndex(h => h === 'created at' || h === 'created_at');

        if (emailIndex === -1) {
          throw new Error("CSV must contain an 'Email' column");
        }

        const newSubscribers: Subscriber[] = lines.slice(1).map((line, index) => {
          const cells = line.split(',').map((c) => c.replace(/"/g, '').trim());
          const email = cells[emailIndex];
          const source = sourceIndex !== -1 && cells[sourceIndex] ? cells[sourceIndex] : 'Imported';
          const created_at = createdAtIndex !== -1 && cells[createdAtIndex] ? cells[createdAtIndex] : new Date().toISOString();
          
          return { id: String(index), email, source, created_at };
        }).filter(sub => sub.email);

        if (newSubscribers.length === 0) throw new Error("No valid subscribers found");

        setSubscribers(newSubscribers);

        toast({
          title: "Import successful",
          description: `Loaded ${newSubscribers.length} subscribers from CSV.`,
        });
      } catch (error: any) {
        console.error("Import error:", error);
        toast({
          title: "Import failed",
          description: error.message || "Something went wrong parsing the file.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      toast({
        title: "Import failed",
        description: "Failed to read file.",
        variant: "destructive",
      });
      setIsImporting(false);
    };

    reader.readAsText(file);
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
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImportCSV}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="hero"
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Import CSV
          </Button>
        </div>

        {/* Subscribers Table */}
        <Card className="mb-8">
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
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {growthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscriber Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {sourceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Admin Dashboard — Jay Mthethwa Portfolio</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;