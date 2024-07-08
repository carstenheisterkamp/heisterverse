import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionProps {
    title: string;
    content: string;
    image: string;
}

const Section: React.FC<SectionProps> = ({ title, content, image }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.1 });

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const imageVariants = {
        hidden: { opacity: 0, y: 150 },
        visible: { opacity: 1, y: 0 },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 150 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={sectionVariants}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            <div className="flex items-center">
                <motion.img
                    src={image}
                    alt={title}
                    className="w-1/2 z-10"
                    variants={imageVariants}
                    transition={{ duration: 0.6 }}
                />
                <motion.div className="ml-4 w-1/2" variants={textVariants} transition={{ duration: 0.6 }}>
                    <h2 className="text-3xl mb-4">{title}</h2>
                    <p>{content}</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Section;
