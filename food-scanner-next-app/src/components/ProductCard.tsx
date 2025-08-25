import Image from "next/image";
import { Card } from "@/components/ui/Card";
import {
  IconFlame,
  IconDroplet,
  IconEggFried,
  IconWheat,
  IconPhotoOff,
  IconMoodSurprised,
  IconLoader,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/lib/api/product";

interface ProductCardProps {
  barcode: string;
  className?: string;
  key?: string;
}

export function ProductCard({ barcode, className, key }: ProductCardProps) { 
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", barcode],
    queryFn: () => fetchProduct(barcode),
    enabled: !!barcode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isError = !!error;
  return (
    <Card className={`p-2 mb-0 flex-shrink-0 w-full ${className}`} key={key}>
      <div className="flex gap-3">
        {/* Left Section - Product Image */}
        <div className="relative flex aspect-square h-full w-24 items-center justify-center rounded-xl border border-gray-30 bg-gray-10">
          {isLoading ? (
            <IconLoader size={32} className="animate-spin text-gray-60" />
          ) : isError ? (
            <IconMoodSurprised size={32} className="text-gray-60" />
          ) : product?.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="rounded-lg object-contain"
              sizes="96px"
            />
          ) : (
            <IconPhotoOff size={32} className="text-gray-60" />
          )}
        </div>

        {/* Right Section - Product Info */}
        <div className="flex flex-1 flex-col justify-center gap-1">
          {/* Product Name and Weight */}
          <h2 className="line-clamp-2 max-h-9 font-medium text-ellipsis">
            {isLoading
              ? "Loading product..."
              : isError
                ? "Oops, nothing found"
                : product?.name || "Unknown Product"}
            {!isLoading && !isError && product?.product_quantity
              ? `, ${product.product_quantity} ${product.product_quantity_unit}`
              : ""}
          </h2>

          {(isError || isLoading) && (
            <p className="text-sm text-gray-60">
              {isLoading ? "Please wait..." : "Product not in knowledge base"}
            </p>
          )}

          {/* Nutritional Information */}
          {product && !isError && !isLoading && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div className="flex items-center gap-0.5">
                <IconFlame size={16} className="text-gray-50" />
                <span className="font-semibold">
                  {Math.round(product.nutrition.calories.value)}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <IconEggFried size={16} className="text-gray-50" />
                <span className="font-semibold">
                  {product.nutrition.protein.value.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <IconDroplet size={16} className="text-gray-50" />
                <span className="font-semibold">
                  {product.nutrition.fat.value.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <IconWheat size={16} className="text-gray-50" />
                <span className="font-semibold">
                  {product.nutrition.carbohydrates.value.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Health Assessment Label */}

          {!isLoading && !isError && product?.assessment && (
            <div className="mt-1">
              <span className="inline-block rounded-lg border border-bronze-60 bg-bronze-10 px-2 py-1 font-semibold text-bronze-60">
                {product?.assessment.description}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
