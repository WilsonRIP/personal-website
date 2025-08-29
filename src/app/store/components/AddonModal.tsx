"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product, Addon } from "../types";
import { useCart } from "../CartContext";

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isUpdate ? `Update ${product.name}` : `Customize Your ${product.name}`}
          </DialogTitle>
          <DialogDescription>
            {isUpdate 
              ? "Update your addon selections for this product."
              : "Select any addons you&apos;d like to include with your purchase, or skip to add the base package to your cart."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Base Package Info */}
          <div className="p-4 rounded-lg border border-[#e5e7eb] dark:border-[#1f2937] bg-[#f8fafc] dark:bg-[#0b1220]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#0f172a] dark:text-[#e5e7eb]">{product.name}</h3>
                <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#0f172a] dark:text-[#e5e7eb]">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">Base Package</div>
              </div>
            </div>
          </div>

          {/* Available Addons */}
          {product.addons && product.addons.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-[#0f172a] dark:text-[#e5e7eb]">
                Available Addons
              </h4>
              <div className="space-y-3">
                {product.addons.map((addon) => (
                  <div key={addon.id} className="flex items-start space-x-3 p-4 rounded-lg border border-[#e5e7eb] dark:border-[#1f2937] bg-[#f8fafc] dark:bg-[#0b1220] hover:bg-[#f1f5f9] dark:hover:bg-[#111827] transition-colors">
                    <Checkbox
                      id={addon.id}
                      checked={selectedAddons.includes(addon.id)}
                      onCheckedChange={() => handleAddonToggle(addon.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={addon.id}
                        className="text-sm font-medium text-[#0f172a] dark:text-[#e5e7eb] cursor-pointer"
                      >
                        {addon.name}
                      </label>
                      <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mt-1">
                        {addon.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-[#0ea5e9]">
                          +${addon.price.toFixed(2)}
                        </span>
                        {addon.tags && (
                          <div className="flex flex-wrap gap-1">
                            {addon.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-1.5 py-0.5 rounded border border-[#e5e7eb] dark:border-[#1f2937] text-[#6b7280] dark:text-[#94a3b8] bg-[#ffffff] dark:bg-[#1f2937]"
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
          <div className="p-4 rounded-lg border border-[#e5e7eb] dark:border-[#1f2937] bg-[#f0f9ff] dark:bg-[#0c4a6e]">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0f172a] dark:text-[#e5e7eb]">Total Price</div>
                {selectedAddons.length > 0 && (
                  <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                    {selectedAddons.length} addon{selectedAddons.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#0ea5e9]">
                  ${getTotalPrice().toFixed(2)}
                </div>
                {selectedAddons.length > 0 && (
                  <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                    +${getSelectedAddons().reduce((sum, addon) => sum + addon.price, 0).toFixed(2)} addons
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!isUpdate && (
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 sm:flex-none border-[#e5e7eb] dark:border-[#1f2937] text-[#0f172a] dark:text-[#e5e7eb] hover:bg-[#f8fafc] dark:hover:bg-[#0b1220]"
            >
              Skip Addons
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className={`flex-1 sm:flex-none ${
              isUpdate 
                ? "bg-[#f59e0b] hover:bg-[#d97706]" 
                : "bg-[#0ea5e9] hover:bg-[#0284c7]"
            }`}
          >
            {isUpdate ? "Update Selection" : "Add to Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
