import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './FilterPanel.module.css'

type Props = {
  isExpanded: boolean;
  setExpanded: any;
}
export default ({ isExpanded, setExpanded }: Props) => {
  React.useEffect(() => {
    // console.log('isExpanded', isExpanded);
  }, [isExpanded])

  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <section className={styles.main}>
      <motion.header
        initial={false}
        animate={{ backgroundColor: isExpanded ? "#FF0088" : "#0055FF" }}
        onClick={() => setExpanded(!!isExpanded)}
      />
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            Filter Panel
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
};
