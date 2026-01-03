"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/utils/toast";
import { uploadAvatarAction, deleteAvatarAction } from "@/app/(logged-in)/settings/avatar-actions";
import { useTransition, useRef, useEffect, useCallback, useMemo } from "react";
import { useState } from "react";
import { Upload, Trash2, Edit } from "lucide-react";
import { getAvatarUrl, DEFAULT_AVATAR_URL } from "@/utils/client-utils";
import { avatarFileSchema, type AvatarFileType } from "@/utils/validators";
import { ImageEditor } from "@/app/(logged-in)/settings/components/image-editor";
import { Text } from "@/components/ui/typography";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AvatarUploadForm({ currentAvatarUrl }: { currentAvatarUrl: string | null }) {
  const [isPending, startUploadTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editedFile, setEditedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editorSrcUrl, setEditorSrcUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AvatarFileType>({
    resolver: zodResolver(avatarFileSchema),
  });

  const { handleSubmit, setValue, watch, reset } = form;
  const avatarFile = watch("avatar");

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (editorSrcUrl) {
        URL.revokeObjectURL(editorSrcUrl);
      }
    };
  }, [previewUrl, editorSrcUrl]);

  // Validate and prepare file for upload
  const validateAndSetFile = useCallback(
    (file: File) => {
      const validation = avatarFileSchema.safeParse({ avatar: file });

      if (!validation.success) {
        toast({
          type: "error",
          message: validation.error.issues[0].message,
        });
        return false;
      }

      setSelectedFile(file);
      setValue("avatar", file);

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Clean up editor URL if it exists
      if (editorSrcUrl) {
        URL.revokeObjectURL(editorSrcUrl);
        setEditorSrcUrl(null);
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setEditedFile(null); // Reset edited file when selecting new file
      return true;
    },
    [setValue, previewUrl, editorSrcUrl]
  );

  // Handle file selection from input
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = event.dataTransfer.files;
      if (files && files[0]) {
        validateAndSetFile(files[0]);
      }
    },
    [validateAndSetFile]
  );

  // Open image editor with proper URL management
  const handleEditImage = useCallback(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setEditorSrcUrl(url);
      setShowImageEditor(true);
    }
  }, [selectedFile]);

  // Clean up editor URL when closing
  const handleEditorClose = useCallback(() => {
    setShowImageEditor(false);
    if (editorSrcUrl) {
      URL.revokeObjectURL(editorSrcUrl);
      setEditorSrcUrl(null);
    }
  }, [editorSrcUrl]);

  // Handle edited image from editor
  const handleImageEdited = useCallback(
    (editedImage: File) => {
      setEditedFile(editedImage);
      setValue("avatar", editedImage);
      // Update preview with edited image
      const url = URL.createObjectURL(editedImage);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up old URL
      }
      setPreviewUrl(url);
      handleEditorClose();
    },
    [setValue, previewUrl, handleEditorClose]
  );

  // Reset form and clear all file state
  const handleClearFile = useCallback(() => {
    reset();
    setPreviewUrl(null);
    setSelectedFile(null);
    setEditedFile(null);
    // Clean up editor URL if it exists
    if (editorSrcUrl) {
      URL.revokeObjectURL(editorSrcUrl);
      setEditorSrcUrl(null);
    }
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [reset, editorSrcUrl]);

  const onSubmit = useCallback(
    async (data: AvatarFileType) => {
      // Prefer edited file over original
      const fileToUpload = editedFile || data.avatar;

      if (!fileToUpload) {
        toast({
          type: "error",
          message: "Please select an image to upload",
        });
        return;
      }

      startUploadTransition(async () => {
        const formData = new FormData();
        formData.append("avatar", fileToUpload);

        const { error } = await uploadAvatarAction(formData);
        if (error) {
          toast({
            type: "error",
            message: error,
          });
        } else {
          toast({
            type: "success",
            message: "Avatar updated successfully",
          });
          handleClearFile();
        }
      });
    },
    [editedFile, startUploadTransition, handleClearFile]
  );

  const handleDeleteAvatar = useCallback(() => {
    startDeleteTransition(async () => {
      const { error } = await deleteAvatarAction();
      if (error) {
        toast({
          type: "error",
          message: error,
        });
      } else {
        toast({
          type: "success",
          message: "Avatar removed successfully",
        });
        // Clear local state and immediately show default avatar, then refresh server components
        handleClearFile();
        setPreviewUrl(DEFAULT_AVATAR_URL);
      }
    });
  }, [startDeleteTransition, handleClearFile]);

  // Avatar display priority: preview > current > default
  const displayAvatarUrl = useMemo(
    () => previewUrl || getAvatarUrl(currentAvatarUrl),
    [previewUrl, currentAvatarUrl]
  );
  // Check if user has a manually uploaded avatar that can be deleted
  // Only returns true for avatars stored in the avatars bucket (user uploads)
  // Returns false for OAuth avatars (Google, GitHub) or default avatars
  const hasUserUploadedAvatar = useMemo(
    () => Boolean(currentAvatarUrl && currentAvatarUrl.includes("/avatars/")),
    [currentAvatarUrl]
  );

  return (
    <div className="space-y-8">
      {/* Current Avatar Display Section */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <Avatar className="h-32 w-32 ring-4 ring-border hover:ring-border/80 transition-all duration-200">
            <AvatarImage
              src={displayAvatarUrl}
              alt="User avatar"
              className="object-cover"
              data-testid="settings-avatar"
            />
          </Avatar>
          {hasUserUploadedAvatar && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    disabled={isDeleting || isPending}
                    className="absolute bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-lg hover:scale-110 transition-all duration-200"
                    data-testid="delete-avatar-button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove Avatar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <Separator className="my-8" />
      <div className="max-w-lg mx-auto w-full">
        <div className="text-center mb-6">
          <Text size="lg" weight="semibold" className="mb-2">
            Upload New Avatar
          </Text>
          <Text size="sm" variant="muted">
            Choose a high-quality image for the best results
          </Text>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload Field */}
            <FormField
              control={form.control}
              name="avatar"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Drag & Drop Upload Area */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative group border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer overflow-hidden ${
                          isDragOver
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/60 hover:bg-muted/50"
                        }`}
                      >
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <Label
                          htmlFor="avatar-upload"
                          className="flex flex-col items-center justify-center w-full h-48 p-8 cursor-pointer"
                        >
                          <div
                            className={`p-4 rounded-full mb-4 transition-colors duration-200 ${
                              isDragOver ? "bg-primary/10" : "bg-muted"
                            }`}
                          >
                            <Upload
                              className={`h-8 w-8 ${
                                isDragOver ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <Text
                            size="sm"
                            className={`text-center ${
                              isDragOver ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            {isDragOver ? "Drop image here" : "Click to upload or drag and drop"}
                          </Text>
                          <Text size="sm" variant="muted" className="text-center max-w-xs">
                            PNG, JPG, or WebP • Max 1MB
                          </Text>
                        </Label>

                        {/* Subtle background pattern in the upload area*/}
                        <div className="absolute inset-0 opacity-5 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                        </div>
                      </div>

                      {avatarFile && (
                        <div>
                          <div className="flex space-x-3">
                            {selectedFile && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleEditImage}
                                disabled={isPending}
                                className="flex-1"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                {editedFile ? "Edit Again" : "Edit Avatar"}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex space-x-3 pt-2">
              <Button
                type="submit"
                disabled={isPending || !avatarFile || isDeleting}
                className="flex-1"
              >
                {isPending ? "Uploading..." : "Upload"}
              </Button>

              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFile}
                  disabled={isPending || isDeleting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Image Editor Dialog */}
      {selectedFile && (
        <ImageEditor
          src={editorSrcUrl || ""}
          isOpen={showImageEditor}
          onClose={handleEditorClose}
          onSave={handleImageEdited}
          fileName={selectedFile.name}
        />
      )}
    </div>
  );
}
