import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Edit, 
  Lock,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';

const MotionCard = motion(Card);

export default function ProfilePage() {
  const { user } = useAuthStore();

  const getInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name?.[0] || user.username?.[0] || '';
    const lastInitial = user.last_name?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
      </motion.div>

      <MotionCard variants={itemVariants} className="border-0 shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-4 border-violet-100">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-3xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-600 mt-1">@{user?.username}</p>
              
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Change PIN
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </MotionCard>

      <div className="grid md:grid-cols-2 gap-6">
        <MotionCard variants={itemVariants} className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">
                  {user?.phone || 'Not provided'}
                </p>
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={itemVariants} className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">University</p>
                <p className="font-medium text-gray-900">
                  {user?.university || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Faculty</p>
                <p className="font-medium text-gray-900">
                  {user?.faculty || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg border border-violet-200">
              <Award className="h-5 w-5 text-violet-600" />
              <div>
                <p className="text-sm text-violet-600">ISIC Status</p>
                <p className="font-medium text-violet-700">
                  {user?.is_verified ? 'Verified Student' : 'Not Verified'}
                </p>
              </div>
            </div>
          </CardContent>
        </MotionCard>
      </div>

      <MotionCard variants={itemVariants} className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Achievements & Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg border border-violet-100">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-violet-600" />
                <p className="text-sm font-medium text-violet-900">Savings Goals</p>
              </div>
              <p className="text-2xl font-bold text-violet-700">0</p>
              <p className="text-xs text-violet-600 mt-1">Goals completed</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">Transactions</p>
              </div>
              <p className="text-2xl font-bold text-green-700">0</p>
              <p className="text-xs text-green-600 mt-1">Total transactions</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Member Since</p>
              </div>
              <p className="text-lg font-bold text-blue-700">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
              <p className="text-xs text-blue-600 mt-1">UniPay member</p>
            </div>
          </div>
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
