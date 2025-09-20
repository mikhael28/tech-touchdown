import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
  } from "@headlessui/react";
  import { X } from "lucide-react";
  import { ReactNode, useEffect } from "react";
  
  interface LeftSideDrawerProps {
    children: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showCloseButton?: boolean;
  }
  
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };
  
  export default function LeftSideDrawer({
    children,
    open,
    setOpen,
    title,
    size,
    showCloseButton = true,
  }: LeftSideDrawerProps) {
    // Handle escape key
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
  
    const handleClose = () => setOpen(false);
  
    return (
      <Transition show={open}>
        <Dialog className="relative z-50" onClose={handleClose}>
          {/* Backdrop */}
          <TransitionChild
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
          </TransitionChild>
  
          {/* Drawer container */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full ">
                <TransitionChild
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <DialogPanel
                    className={`pointer-events-auto relative w-screen max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl`}
                  >
                    {/* Main content */}
                    <div className="flex h-full flex-col bg-white shadow-2xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
                      {/* Header */}
                      {(title || showCloseButton) && (
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                          {title && (
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {title}
                            </h2>
                          )}
                          {showCloseButton && (
                            <TransitionChild
                              enter="ease-in-out duration-300 delay-100"
                              enterFrom="opacity-0 scale-95"
                              enterTo="opacity-100 scale-100"
                              leave="ease-in-out duration-200"
                              leaveFrom="opacity-100 scale-100"
                              leaveTo="opacity-0 scale-95"
                            >
                              <button
                                type="button"
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-gray-800 dark:hover:text-gray-300 dark:focus:ring-offset-gray-900"
                                onClick={handleClose}
                                aria-label="Close drawer"
                              >
                                <X className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </TransitionChild>
                          )}
                        </div>
                      )}
  
                      {/* Content */}
                      <div className="flex-1 overflow-y-auto">
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
  