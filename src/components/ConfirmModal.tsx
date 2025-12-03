"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "تایید",
  cancelText = "انصراف",
  onConfirm,
  onCancel
}: ConfirmModalProps) {

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm rtl text-right">   {/* 👈 RTL + راست‌چین */}

        <DialogHeader className="text-right">
          <DialogTitle className="text-lg font-bold text-right">
            {title}
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-right leading-relaxed">
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="destructive" onClick={onCancel}>
            {cancelText}
          </Button>

          <Button onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
