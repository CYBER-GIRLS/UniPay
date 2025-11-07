import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Bell, Lock, Globe, Palette, Shield, CreditCard } from 'lucide-react';

const MotionCard = motion(Card);

export default function SettingsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const settingsSections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage your notification preferences',
      color: 'violet',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Password, PIN, and two-factor authentication',
      color: 'blue',
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Language, currency, and timezone settings',
      color: 'green',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel',
      color: 'pink',
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Control your data and privacy settings',
      color: 'orange',
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage your linked payment methods',
      color: 'indigo',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </motion.div>

      <div className="grid gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <MotionCard
              key={section.title}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="border-0 shadow-sm cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-${section.color}-100 rounded-lg`}>
                      <Icon className={`h-6 w-6 text-${section.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </MotionCard>
          );
        })}
      </div>
    </motion.div>
  );
}
