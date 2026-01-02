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
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card h-full flex flex-col">
            <CardHeader className="p-3 md:pb-3 md:p-6 flex-grow">
                <div className="flex items-start justify-between gap-2 mb-2 md:mb-0">
                    <div className="p-2 md:p-3 rounded-lg bg-primary/10 text-primary">
                        <ShoppingBag className="h-4 w-4 md:h-6 md:w-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] md:text-xs px-1.5 py-0.5 md:px-2.5 md:py-0.5">
                        {product.tag}
                    </Badge>
                </div>
                <CardTitle className="text-sm md:text-lg mt-1 md:mt-3 group-hover:text-primary transition-colors leading-tight">
                    {product.title}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm line-clamp-2 md:line-clamp-3 mt-1 md:mt-2">
                    {product.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0 mt-auto">
                <div className="flex flex-col gap-2">
                    <Button
                        variant="hero"
                        className="w-full gap-1.5 md:gap-2 text-xs md:text-sm h-8 md:h-10 px-2 md:px-4"
                        asChild
                    >
                        <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer">
                            <span className="truncate">Get on Gumroad</span>
                            <ExternalLink className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        </a>
                    </Button>

                    {product.previewUrl && (
                        <Button
                            variant="outline"
                            className="w-full gap-1.5 md:gap-2 text-xs md:text-sm h-8 md:h-10 px-2 md:px-4"
                            asChild
                        >
                            <a href={product.previewUrl} target="_blank" rel="noopener noreferrer">
                                <span className="truncate">Preview</span>
                                <Eye className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
