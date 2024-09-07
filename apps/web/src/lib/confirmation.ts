import type { FC } from "react";

import { atom } from "nanostores";

export type Confirmation = {
  open: boolean;
  title: string;
  description?: string;
  customContent?: FC;
  type: "default" | "destructive";
  important?: boolean;
  cancelText: string;
  confirmText: string;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
};

export interface ConfirmationCreate
  extends Omit<Confirmation, "open" | "type" | "cancelText" | "confirmText"> {
  open?: boolean;
  type?: "default" | "destructive";
  important?: boolean;
  cancelText?: string;
  confirmText?: string;
}

export const $confirmationAtom = atom<Confirmation | null>(null);

export const confirmation = {
  create: ({
    open = true,
    type = "default",
    cancelText = "Cancel",
    confirmText = "Confirm",
    ...rest
  }: ConfirmationCreate) => {
    $confirmationAtom.set({
      ...rest,
      open,
      type,
      cancelText,
      confirmText,
    });
  },
  show: () => {
    const confirmation = $confirmationAtom.get();
    if (!confirmation) return;
    $confirmationAtom.set({ ...confirmation, open: true });
  },
  hide: () => {
    const confirmation = $confirmationAtom.get();
    if (!confirmation) return;
    $confirmationAtom.set({ ...confirmation, open: false });
  },
  reset: () => {
    $confirmationAtom.set(null);
  },
};
