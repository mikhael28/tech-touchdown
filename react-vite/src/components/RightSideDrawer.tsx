import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
  } from "@headlessui/react";
  import { X } from "lucide-react";
  import { ReactNode, useCallback, useEffect } from "react";
  
  interface RightSideDrawerProps {
    children: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl";
  }
  
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  } as const;
  
  export default function RightSideDrawer({
    children,
    open,
    setOpen,
    title,
    size = "lg",
  }: RightSideDrawerProps) {
    const handleClose = useCallback(() => {
      setOpen(false);
    }, [setOpen]);
  
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
        }
      };
  
      if (open) {
        document.addEventListener("keydown", handleEscape);
        // Prevent body scroll when drawer is open
        document.body.style.overflow = "hidden";
      }
  
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [open, setOpen]);
  
    return (
      <Transition show={open} appear>
        <Dialog className="relative z-50" onClose={handleClose}>
          {/* Backdrop with improved blur effect */}
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all" />
          </TransitionChild>
  
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-6 lg:pl-8">
                <TransitionChild
                  enter="transform transition ease-out duration-300"
                  enterFrom="translate-x-full opacity-0 scale-95"
                  enterTo="translate-x-0 opacity-100 scale-100"
                  leave="transform transition ease-in duration-200"
                  leaveFrom="translate-x-0 opacity-100 scale-100"
                  leaveTo="translate-x-full opacity-0 scale-95"
                >
                  <DialogPanel
                    className={`pointer-events-auto relative w-screen max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl`}
                  >
                    {/* Enhanced container with modern styling */}
                    <div className="flex h-full flex-col bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:bg-gray-900/95 dark:ring-white/10">
                      {/* Header with close button */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
                        {title && (
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {title}
                          </h2>
                        )}
                        <button
                          type="button"
                          className="group relative ml-auto flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900 transition-all duration-200"
                          onClick={handleClose}
                          aria-label="Close drawer"
                        >
                          <X
                            className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
  
                      {/* Content area with improved scrolling */}
                      <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="p-6">{children}</div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
  