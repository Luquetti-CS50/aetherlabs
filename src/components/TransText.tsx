import { AnimatePresence, motion } from "framer-motion";

export function TransText({
  langKey,  // clave reactiva (por ej., language del context)
  className,
  children
}: {
  langKey: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={langKey}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
