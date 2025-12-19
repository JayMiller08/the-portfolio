import { FileText, Video, Link as LinkIcon, Figma } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface Artifact {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "link" | "figma";
  tag: string;
  url: string;
}

interface ArtifactCardProps {
  artifact: Artifact;
  onAccessClick: (artifact: Artifact) => void;
}

const typeIcons = {
  pdf: FileText,
  video: Video,
  link: LinkIcon,
  figma: Figma,
};

const typeLabels = {
  pdf: "PDF Download",
  video: "Video",
  link: "External Link",
  figma: "Figma File",
};

const typeColors = {
  pdf: "bg-destructive/10 text-destructive",
  video: "bg-secondary/10 text-secondary",
  link: "bg-primary/10 text-primary",
  figma: "bg-accent/10 text-accent",
};

export const ArtifactCard = ({ artifact, onAccessClick }: ArtifactCardProps) => {
  const Icon = typeIcons[artifact.type];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className={`p-3 rounded-lg ${typeColors[artifact.type]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="outline" className="text-xs">
            {artifact.tag}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
          {artifact.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {artifact.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {typeLabels[artifact.type]}
          </span>
          <Button
            variant="hero"
            size="sm"
            onClick={() => onAccessClick(artifact)}
          >
            Get Access
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};