import { useQuery } from '@tanstack/react-query';
import { marketplaceAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Store, Plus, Search, ShoppingBag } from 'lucide-react';

const MotionCard = motion(Card);

export default function MarketplacePage() {
  const { data: listingsData } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const response = await marketplaceAPI.getListings();
      return response.data;
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
      className="space-y-6 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Marketplace</h1>
          <p className="text-gray-600 mt-1">Buy and sell items within your university community</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for books, notes, gadgets..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {listingsData && listingsData.listings && listingsData.listings.length > 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listingsData.listings.map((listing: any) => (
            <MotionCard
              key={listing.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="border-0 shadow-sm cursor-pointer overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{listing.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-violet-600">${listing.price}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.category}</span>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Store className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
              <p className="text-gray-600 mb-6">Be the first to sell something in the marketplace</p>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
