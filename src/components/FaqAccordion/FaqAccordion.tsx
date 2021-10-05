import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FaqAccordion.module.scss';
import { duration } from 'moment';

interface Q {
  question: string;
  answer: string;
}
interface IProps {
  questions: Q[];
}

interface IProps2 {
  i: number;
  expanded: boolean | number;
  setExpanded: any;
  q: string;
  a: string;
}

const Accordion = ({ i, expanded, setExpanded, q, a }: IProps2) => {
  const isOpen = i === expanded;

  return (
    <div className={styles.question}>
      <motion.header
        className={styles.question__headline}
        initial={false}
        // animate={{ backgroundColor: isOpen ? "#FF0088" : "#0055FF" }}
        onClick={() => setExpanded(isOpen ? false : i)}
      >
        <h4 className={`tg-desc ${styles['tg-desc']}`}>{q}</h4>

        <svg
          className={`${styles['icon']} ${isOpen ? styles['is-open'] : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx={18} cy={18} r={18} fill="url(#paint0_linear)" />
          <path d="M23 16.5l-5 5-5-5" stroke="#4047FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="paint0_linear" x1={18} y1={0} x2={18} y2={36} gradientUnits="userSpaceOnUse">
              <stop stopColor="#F8F8F8" stopOpacity=".6" />
              <stop offset={1} stopColor="#E8E8E8" />
            </linearGradient>
          </defs>
        </svg>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            className={styles.question__answer}
            variants={{
              open: { opacity: 1, display: 'block' },
              collapsed: { opacity: 0, display: 'none' }
            }}
          >
            <motion.p variants={{ collapsed: { y: 10 }, open: { y: 0 } }}>
              {a}
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqAccordian: React.FC<IProps> = ({ questions }: IProps) => {
  const [expanded, setExpanded] = useState<false | number>(-1);

  const ques = questions.map(({ answer, question }, i) => (
    <Accordion q={question} a={answer} key={i} i={i} expanded={expanded} setExpanded={setExpanded} />
  ));

  return <div className={styles.main}>{ques}</div>;
};

export default FaqAccordian;
