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

interface CreateReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentNode: any;
  onSuccess: () => void;
}

export const CreateReplyModal = ({
  isOpen,
  onClose,
  parentNode,
  onSuccess,
}: CreateReplyModalProps) => {
  const [operation, setOperation] = useState<"+" | "-" | "*" | "/">("+");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // ⚠️ Replace with actual token from auth store
  const token = "YOUR_AUTH_TOKEN";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !parentNode) return;

    setLoading(true);
    try {
      const response = await api.createReply(
        parentNode._id,
        operation,
        parseFloat(value),
        token
      );
      useTreeStore.getState().addNewNode(response.node);
      onSuccess();
      setValue("");
      onClose();
    } catch (error) {
      console.error("Error creating reply:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !parentNode) return null;

  const previewResult = () => {
    if (!value) return parentNode.result;
    const num = parseFloat(value);
    switch (operation) {
      case "+": return parentNode.result + num;
      case "-": return parentNode.result - num;
      case "*": return parentNode.result * num;
      case "/": return num !== 0 ? parentNode.result / num : "Error";
      default: return parentNode.result;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Reply</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Current Value */}
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Current Value</div>
            <div className="text-2xl font-semibold text-gray-800">
              {parentNode.result}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Operation Selection */}
            <div className="space-y-2">
              <Label>Operation</Label>
              <div className="grid grid-cols-4 gap-2">
                {["+", "-", "*", "/"].map((op) => (
                  <Button
                    key={op}
                    type="button"
                    onClick={() => setOperation(op as any)}
                    variant={operation === op ? "default" : "outline"}
                    className={`font-bold text-lg ${
                      operation === op
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : ""
                    }`}
                  >
                    {op}
                  </Button>
                ))}
              </div>
            </div>

            {/* Value Input */}
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter number..."
                required
              />
            </div>

            {/* Result Preview */}
            {value && (
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">Result Preview</div>
                <div className="text-xl font-semibold text-blue-800">
                  {parentNode.result} {operation} {value} = {previewResult()}
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-end gap-2 pt-3">
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
                Add Reply
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
