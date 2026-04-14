import { motion } from 'framer-motion';

const AboutPage = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4"
        >
            <h1 className="text-4xl font-bold mb-4">About padinputf1</h1>
            <p className="text-muted-foreground">This is the about page.</p>
        </motion.div>
    );
};

export default AboutPage;
