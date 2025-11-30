"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

interface OpinionTileProps {
  authorName?: string;
  rating?: number;
  content?: string;
  maxRating?: number;
}

export default function OpinionTile({
  authorName = "John Smith",
  rating = 4,
  content = "Excellent teacher! Dr. Johnson explains complex mathematical concepts in a very clear and understandable way. Her teaching style is engaging and she's always patient with questions. I've learned so much in her calculus class and would definitely recommend her to other students.",
  maxRating = 5,
}: OpinionTileProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <icons.Star
          key={i}
          className={`${i <= rating ? "fill-yellow-200 text-yellow-300" : "fill-gray-200 text-gray-200"}`}
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
