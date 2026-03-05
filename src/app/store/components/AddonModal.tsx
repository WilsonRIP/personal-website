"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product, Addon } from "../types";
import { useCart } from "../CartContext";
import { Zap } from "lucide-react";

interface AddonModalProps {
  product: Product;
  onConfirm: (selectedAddons: string[]) => void;
  onSkip: () => void;
  onClose: () => void;
  isUpdate?: boolean;
}

export default function AddonModal({ product, onConfirm, onSkip, onClose, isUpdate = false }: AddonModalProps) {
  const { items } = useCart();
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Get current addon selections if this is an update
  useEffect(() => {
    if (isUpdate) {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem?.selectedAddons) {
        setSelectedAddons(existingItem.selectedAddons);
      }
    }
  }, [isUpdate, items, product.id]);

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getSelectedAddons = (): Addon[] => {
    if (!product.addons) return [];
    return product.addons.filter(addon => selectedAddons.includes(addon.id));
  };

  const getTotalPrice = (): number => {
    const addonPrice = getSelectedAddons().reduce((sum, addon) => sum + addon.price, 0);
    return product.price + addonPrice;
  };

  const handleConfirm = () => {
    onConfirm(selectedAddons);
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border text-card-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="w-8 h-[2px] bg-primary shrink-0" />
            <DialogTitle className="text-xl font-bold tracking-tight">
              {isUpdate ? `Update ${product.name}` : `Customize Your ${product.name}`}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground font-mono text-sm">
            {isUpdate
              ? "Update your addon selections for this product."
              : "Select any addons you&apos;d like to include with your purchase, or skip to add the base package to your cart."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Base Package Info */}
          <div className="p-4 rounded-xl border border-border bg-secondary/30 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground font-mono mt-1">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Base Package</div>
              </div>
            </div>
          </div>

          {/* Available Addons */}
          {product.addons && product.addons.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-foreground uppercase tracking-widest text-sm">
                  Available Addons
                </h4>
              </div>
              <div className="space-y-3">
                {product.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className={`group flex items-start space-x-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                      selectedAddons.includes(addon.id)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/70"
                    }`}
                    onClick={() => handleAddonToggle(addon.id)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddonToggle(addon.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedAddons.includes(addon.id)}
                  >
                    <Checkbox
                      id={addon.id}
                      checked={selectedAddons.includes(addon.id)}
                      onCheckedChange={() => handleAddonToggle(addon.id)}
                      className="mt-0.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={addon.id}
                        className="text-sm font-medium text-foreground cursor-pointer group-hover:text-primary transition-colors"
                      >
                        {addon.name}
                      </label>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {addon.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                        <span className="text-sm font-semibold text-primary">
                          +${addon.price.toFixed(2)}
                        </span>
                        {addon.tags && (
                          <div className="flex flex-wrap gap-1">
                            {addon.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 rounded-md border border-border text-foreground bg-muted"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Price */}
          <div className="p-4 rounded-xl border-l-4 border-l-primary border border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground uppercase tracking-widest text-sm">Total Price</div>
                {selectedAddons.length > 0 && (
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    {selectedAddons.length} addon{selectedAddons.length !== 1 ? "s" : ""} selected
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${getTotalPrice().toFixed(2)}
                </div>
                {selectedAddons.length > 0 && (
                  <div className="text-xs text-muted-foreground font-mono">
                    +${getSelectedAddons().reduce((sum, addon) => sum + addon.price, 0).toFixed(2)} addons
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 border-t border-border pt-4">
          {!isUpdate && (
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 sm:flex-none border-border rounded-none"
            >
              Skip Addons
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-none"
          >
            {isUpdate ? "Update Selection" : "Add to Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
