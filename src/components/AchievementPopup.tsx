// components/AchievementPopup.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

export const AchievementPopup = ({ achievement, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Achievement Unlocked!</h3>
          <p>{achievement.name}</p>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
);