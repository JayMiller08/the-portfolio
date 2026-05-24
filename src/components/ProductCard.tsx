import { ExternalLink, Eye, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { EmailDownloadDialog } from "./EmailDownloadDialog";

export interface Product {
    id: string;
    title: string;
    description: string;
    gumroadUrl?: string;
    downloadUrl?: string;
    previewUrl?: string;
    tag: string;
    image?: string;
}

interface ProductCardProps {
    product: Product;
}

const getTagStyles = (tag: string) => {
    const baseStyle = "backdrop-blur-md shadow-sm border font-semibold";
    switch (tag.toLowerCase()) {
        case "ebook":
            return `${baseStyle} bg-gradient-to-r from-violet-500/90 to-fuchsia-500/90 text-white border-white/20 dark:border-white/10`;
        case "free pdf guide":
            return `${baseStyle} bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white border-white/20 dark:border-white/10`;
        case "notion template":
            return `${baseStyle} bg-gradient-to-r from-orange-500/90 to-rose-500/90 text-white border-white/20 dark:border-white/10`;
        default:
            return `${baseStyle} bg-background/80 text-foreground border-border/50`;
    }
};

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card h-full flex flex-col hover:border-primary/50">
            {/* Image or Gradient Placeholder */}
            <div className="relative w-full aspect-video overflow-hidden bg-muted">
                {product.image ? (
                    <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 via-primary/10 to-background flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <ShoppingBag className="h-12 w-12 text-primary/20" />
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge className={getTagStyles(product.tag)}>
                        {product.tag}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 md:p-6 flex-grow">
                <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors leading-tight">
                    {product.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2 mt-2">
                    {product.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-4 md:p-6 pt-0 mt-auto">
                <div className="flex flex-col gap-3">
                    {product.gumroadUrl && (
                        <Button
                            variant="default"
                            className="w-full gap-2 shadow-md hover:shadow-lg transition-all"
                            asChild
                        >
                            <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer">
                                <span className="truncate">Get on Gumroad</span>
                                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                            </a>
                        </Button>
                    )}

                    {product.downloadUrl && (
                        <EmailDownloadDialog product={product}>
                            <Button
                                variant="default"
                                className="w-full gap-2 shadow-md hover:shadow-lg transition-all bg-foreground text-background hover:bg-foreground/90"
                            >
                                <span className="truncate">Download Free</span>
                                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                            </Button>
                        </EmailDownloadDialog>
                    )}

                    {product.previewUrl && (
                        <Button
                            variant="outline"
                            className="w-full gap-2 hover:bg-primary/5"
                            asChild
                        >
                            <a href={product.previewUrl} target="_blank" rel="noopener noreferrer">
                                <span className="truncate">Live Preview</span>
                                <Eye className="h-4 w-4 flex-shrink-0" />
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
