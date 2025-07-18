"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

interface OpinionCardProps {
  authorName?: string;
  rating?: number;
  content?: string;
  maxRating?: number;
}

export default function OpinionCard({
  authorName = "John Smith",
  rating = 4,
  content = "Excellent teacher! Dr. Johnson explains complex mathematical concepts in a very clear and understandable way. Her teaching style is engaging and she's always patient with questions. I've learned so much in her calculus class and would definitely recommend her to other students.",
  maxRating = 5,
}: OpinionCardProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />,
      );
    }
    return stars;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{authorName}</h3>
          <div className="flex items-center gap-1">{renderStars()}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  );
}
