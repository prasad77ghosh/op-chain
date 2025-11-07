import { useState } from "react";
import { api } from "@/api/node-api";
import { useTreeStore } from "@/store/useNodeStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreateRootModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRootModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateRootModalProps) => {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // ⚠️ Replace this with actual token from auth store
  const token = "YOUR_AUTH_TOKEN";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    setLoading(true);
    try {
      const response = await api.createRoot(parseFloat(value), token);
      useTreeStore.getState().addNewRoot(response.data);
      onSuccess();
      setValue("");
      onClose();
    } catch (error) {
      console.error("Error creating root:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="initialValue">Initial Value</Label>
            <Input
              id="initialValue"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter starting number..."
              required
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
