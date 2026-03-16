// Animation variants for Framer Motion
export const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } };
export const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };
export const fadeInDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };
export const fadeInLeft = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } } };
export const fadeInRight = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } } };
export const scaleIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } } };
export const slideUp = { hidden: { y: '100%' }, visible: { y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };
export const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
export const staggerItem = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
export const pulseScale = { scale: [1, 1.05, 1], transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } };
export const shimmer = { x: ['-100%', '100%'], transition: { duration: 1.5, repeat: Infinity, ease: 'linear' } };
export const springBounce = { type: 'spring', stiffness: 300, damping: 20 };
export const pageTransition = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.25 } };
export const modalOverlay = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
export const modalContent = { hidden: { opacity: 0, scale: 0.95, y: 10 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } }, exit: { opacity: 0, scale: 0.95, y: 10 } };