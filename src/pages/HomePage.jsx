import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Rocket, Box, Shield, Zap, User, Star, Calendar, Mail, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LionLogo from '@/components/common/LionLogo';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogTrigger, 
    DialogFooter 
} from '@/components/ui/dialog';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const HomePage = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            className="space-y-24 py-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Hero Section */}
            <motion.section
                className="container mx-auto flex flex-col items-center text-center space-y-8 max-w-4xl px-4 md:px-0"
                variants={itemVariants}
            >
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative h-40 w-40 rounded-full bg-card border-4 border-background flex items-center justify-center overflow-hidden shadow-2xl">
                        <img src="/logo.png" alt="LEO" className="h-full w-full object-cover" />
                    </div>
                </div>

                <div className="space-y-4">
                    <motion.h1
                        className="text-6xl font-black tracking-[0.2em] lg:text-8xl mb-6 uppercase cursor-default select-none"
                        whileHover={{ skewX: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                        Minh Tâm
                        <span className="block text-primary text-3xl lg:text-4xl mt-6 font-light italic tracking-[0.3em] uppercase opacity-80">AKA LEO</span>
                    </motion.h1>
                    <div className="flex flex-wrap justify-center gap-6 text-muted-foreground font-semibold">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{t('dob')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span>{t('role')}</span>
                        </div>
                    </div>
                </div>

                <p className="text-xl text-muted-foreground leading-relaxed">
                    {t('personal_intro').split('Tam (LEO)').map((part, i, arr) => (
                        <span key={i}>
                            {part}
                            {i < arr.length - 1 && <strong className="text-foreground">Tâm (LEO)</strong>}
                        </span>
                    ))}
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Button size="lg" className="rounded-full h-12 px-8 gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                        <Mail className="h-4 w-4" />
                        {t('contact_me')}
                    </Button>
                    <a href="https://github.com/nmt1908" target="_blank" rel="noreferrer">
                        <Button variant="outline" size="lg" className="rounded-full h-12 px-8 gap-2 hover:bg-muted/50">
                            <Github className="h-4 w-4" />
                            {t('github')}
                        </Button>
                    </a>
                </div>
            </motion.section>

            {/* Feature Grid */}
            <motion.div
                className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0"
                variants={itemVariants}
            >
                <FeatureCard
                    icon={Rocket}
                    title={t('features.speed_title')}
                    description={t('features.speed_desc')}
                />
                <FeatureCard
                    icon={Box}
                    title={t('features.structure_title')}
                    description={t('features.structure_desc')}
                />
                <FeatureCard
                    icon={Shield}
                    title={t('features.realtime_title')}
                    description={t('features.realtime_desc')}
                />
                <FeatureCard
                    icon={Zap}
                    title={t('features.senior_title')}
                    description={t('features.senior_desc')}
                />
            </motion.div>

            {/* Senior Credentials Section */}
            <motion.section
                className="container mx-auto px-4 md:px-0"
                variants={itemVariants}
            >
                <div className="bg-primary/[0.02] rounded-[3rem] p-10 md:p-20 border border-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                        <Rocket className="h-96 w-96 -rotate-12" />
                    </div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-20 items-center text-left">
                        <div className="space-y-10">
                            <h2 className="text-5xl font-black tracking-[0.15em] leading-tight">
                                {t('leo_standard.title')}
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed font-light">
                                {t('leo_standard.description')}
                            </p>
                            <ul className="space-y-6">
                                {t('leo_standard.items', { returnObjects: true }).map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-6 group/item">
                                        <div className="h-1.5 w-6 bg-primary/20 group-hover:w-10 group-hover:bg-primary transition-all duration-500" />
                                        <span className="font-medium tracking-wide text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-10">
                            <div className="p-12 bg-white dark:bg-zinc-950 border border-primary/10 rounded-[2rem] shadow-2xl rotate-1 hover:rotate-0 transition-all duration-700 cursor-default">
                                <blockquote className="luxury-serif italic text-3xl text-muted-foreground leading-snug">
                                    "{t('leo_standard.quote')}"
                                </blockquote>
                                <p className="mt-8 font-black tracking-[0.2em] text-right text-primary">— LEO MINDSET</p>
                            </div>
                            <a href="#" className="group">
                                <div className="p-6 bg-primary text-primary-foreground rounded-3xl shadow-xl -rotate-1 hover:rotate-0 transition-all duration-500 flex justify-between items-center px-8">
                                    <span className="font-bold text-lg">{t('leo_standard.explore_agent')}</span>
                                    <ExternalLink className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.section>

        </motion.div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="p-8 border rounded-3xl bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 space-y-6 text-left group border-border/50">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Icon className="h-8 w-8" />
        </div>
        <div className="space-y-3">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
        </div>
    </div>
);

export default HomePage;
