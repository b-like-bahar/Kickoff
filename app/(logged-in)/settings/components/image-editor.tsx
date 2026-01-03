"use client";

import { useState, useTransition } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Crop as CropIcon } from "lucide-react";
import { toast } from "@/utils/toast";

type ImageEditorProps = {
  src: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImage: File) => void;
  fileName: string;
};

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.crossOrigin = "anonymous";
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  fileName: string
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Save the context state
  ctx.save();

  // Translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);

  // Apply rotation
  ctx.rotate(rotRad);

  // Apply flipping - note the order matters
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);

  // Translate back to draw the image
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated and flipped image
  ctx.drawImage(image, 0, 0);

  // Restore the context
  ctx.restore();

  // Create new canvas for final crop
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set cropped canvas size
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise(resolve => {
    croppedCanvas.toBlob(
      blob => {
        if (blob) {
          const file = new File([blob], fileName, { type: "image/jpeg" });
          resolve(file);
        } else {
          resolve(null);
        }
      },
      "image/jpeg",
      0.9
    );
  });
}

export function ImageEditor({ src, isOpen, onClose, onSave, fileName }: ImageEditorProps) {
  const [isPending, startImageEditTransition] = useTransition();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const handleFlipHorizontal = () => {
    setFlipHorizontal(prev => !prev);
  };

  const handleFlipVertical = () => {
    setFlipVertical(prev => !prev);
  };

  const handleSave = () => {
    if (!croppedAreaPixels) {
      toast({
        type: "error",
        message: "Please select a crop area first",
      });
      return;
    }

    startImageEditTransition(async () => {
      const croppedImage = await getCroppedImg(
        src,
        croppedAreaPixels,
        rotation,
        { horizontal: flipHorizontal, vertical: flipVertical },
        fileName
      );

      if (croppedImage) {
        onSave(croppedImage);
        onClose();
        toast({
          type: "success",
          message: "Image edited successfully",
        });
      } else {
        toast({
          type: "error",
          message: "Failed to process the image. Please try again.",
        });
      }
    });
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setRotation(0);
    setZoom(1);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="h-5 w-5" />
            Edit Avatar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto pr-2">
          {/* Image Cropper */}
          <div className="relative h-80 w-full bg-muted rounded-lg overflow-hidden border border-border">
            <div
              style={{
                transform: `scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                width: "100%",
                height: "100%",
              }}
            >
              <Cropper
                image={src}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={onZoomChange}
                cropShape="round"
                showGrid={false}
              />
            </div>
          </div>

          <Separator />

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Zoom Control */}
            <Card className="flex-1">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>Zoom: {zoom.toFixed(2)}x</Label>
                  <Slider
                    value={[zoom]}
                    onValueChange={handleZoomChange}
                    min={1}
                    max={3}
                    step={0.1}
                    className="w-full"
                    data-testid="zoom-slider"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Rotation Controls */}
            <Card className="flex-1">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>Rotation & Flip</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRotateLeft}
                      className="h-9 w-9 p-0"
                      data-testid="rotate-left-button"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRotateRight}
                      className="h-9 w-9 p-0"
                      data-testid="rotate-right-button"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFlipHorizontal}
                      className={`h-9 w-9 p-0 ${flipHorizontal ? "bg-accent text-accent-foreground border-accent" : ""}`}
                      data-testid="flip-horizontal-button"
                    >
                      <FlipHorizontal className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFlipVertical}
                      className={`h-9 w-9 p-0 ${flipVertical ? "bg-accent text-accent-foreground border-accent" : ""}`}
                      data-testid="flip-vertical-button"
                    >
                      <FlipVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
