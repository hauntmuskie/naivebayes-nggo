import { useState } from "react";
import {
  ConfirmationDialog,
  ConfirmationDialogProps,
} from "../components/confirmation-dialog";

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<
    Omit<ConfirmationDialogProps, "isOpen" | "onClose">
  >({
    onConfirm: () => {},
    title: "",
    description: "",
  });

  const openDialog = (
    dialogConfig: Omit<ConfirmationDialogProps, "isOpen" | "onClose">
  ) => {
    setConfig(dialogConfig);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const ConfirmationDialogComponent = () => (
    <ConfirmationDialog {...config} isOpen={isOpen} onClose={closeDialog} />
  );

  return {
    openDialog,
    closeDialog,
    ConfirmationDialog: ConfirmationDialogComponent,
    isOpen,
  };
}
