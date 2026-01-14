import { ExternalLink, Eye, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface Product {
    id: string;
    title: string;
    description: string;
    gumroadUrl: string;
    previewUrl?: string;
    tag: string;
    image?: string;
}

interface ProductCardProps {
    product: Product;
}

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
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm">
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
