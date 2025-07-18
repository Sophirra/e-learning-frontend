import {Star} from "lucide-react"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx"

interface CourseCardProps {
    title: string
    imageUrl: string
    rating: number
    level: string
    language: string
    price: string
    description: string
    onClick?: () => void
}

export function CourseCard({
                               title,
                               imageUrl,
                               rating,
                               level,
                               language,
                               price,
                               description,
                               onClick
                           }: CourseCardProps) {
    return (
        <Card className="w-[350px] overflow-hidden pt-0 spacing-y-4" onClick={onClick}>
        <div className="aspect-video w-full overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>
            <CardHeader>
            <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="flex items-center">
                        {Array.from({length: 5}).map((_, index) => (
                            <Star
                                key={index}
                                className={`h-4 w-4 ${
                                    index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{level}</span>
                    <span>•</span>
                    <span>{language}</span>
                    <span>•</span>
                    <span>${price}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground text-left">{description}</p>
            </CardContent>
        </Card>
    )
}