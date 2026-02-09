import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            className="container mx-auto space-y-8 max-w-3xl px-4 md:px-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold tracking-tight">{t('about')}</h1>

            <div className="prose prose-slate dark:prose-invert lg:prose-xl">
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Đây là bản source code được thiết kế bởi **LEO** để phục vụ cho các dự án ReactJS quy mô chuyên nghiệp.
                </p>

                <div className="mt-10 space-y-6">
                    <h3 className="text-2xl font-bold">{t('leo_standard.title')}</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                        {[
                            "Tailwind CSS + Shadcn UI",
                            "React Router DOM v7",
                            "Zustand & TanStack Query",
                            "i18n Language Support",
                            "Senior Architecture Pattern",
                            "AI-Ready Instructions"
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutPage;
