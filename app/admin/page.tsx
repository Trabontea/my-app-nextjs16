// Import UI components for the admin dashboard
import SectionHeader from '@/components/common/section-header';
import StatsCard from '@/components/admin/stats-card';
import EmptyState from '@/components/common/empty-state';
import AdminProductCard from '@/components/admin/admin-product-card';
import { InboxIcon, ShieldIcon } from 'lucide-react';
// Import authentication utilities from Clerk
import { auth, clerkClient } from '@clerk/nextjs/server';
// Import Next.js navigation utility
import { redirect } from 'next/navigation';
// Import database query function for products
import { getAllProducts } from '@/lib/products/product-select';

export default async function AdminPage() {
  // Authenticate and get the current user ID
  const { userId } = await auth();

  // Redirect to sign-in page if user is not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch the user details from Clerk
  const response = await clerkClient();
  const user = await response.users.getUser(userId!);
  console.log(user);

  // Extract the public metadata to check admin status
  const metadata = user.publicMetadata;
  // Check if user has admin privileges (defaults to true if not set)
  const isAdmin = metadata.isAdmin ?? false;

  console.log(isAdmin);

  // Redirect to home page if user is not an admin
  if (!isAdmin) {
    redirect('/');
  }

  // Fetch all products from the database
  const allProducts = await getAllProducts();

  // Filter products by status to get count of approved products
  const approvedProducts = allProducts.filter(
    (product) => product.status === 'approved',
  );
  // Filter products by status to get count of pending products awaiting review
  const pendingProducts = allProducts.filter(
    (product) => product.status === 'pending',
  );
  // Filter products by status to get count of rejected products
  const rejectedProducts = allProducts.filter(
    (product) => product.status === 'rejected',
  );

  // Render the admin dashboard
  return (
    <div className="py-20">
      {/* Main wrapper container for consistent page layout */}
      <div className="wrapper">
        {/* Page header section with title, icon, and description */}
        <div className="mb-12">
          <SectionHeader
            title="Product Admin"
            icon={ShieldIcon}
            description="Review and manage submitted products"
          />
        </div>
        {/* Statistics card showing admin dashboard metrics */}
        <StatsCard
          approved={approvedProducts.length}
          pending={pendingProducts.length}
          rejected={rejectedProducts.length}
          all={allProducts.length}
        />

        {/* Placeholder section for additional admin content */}
        <section className="my-12">
          <div className="section-header-with-count">
            <h2 className="text-2xl font-bold">
              Pending Products ({pendingProducts.length})
            </h2>
          </div>
          <div className="space-y-4">
            {pendingProducts.length === 0 && (
              <EmptyState
                message="No pending products to review"
                icon={InboxIcon}
              />
            )}
            {pendingProducts.map((product) => (
              <AdminProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="my-12">
          <div className="section-header-with-count">
            <h2 className="text-2xl font-bold">All Products</h2>
          </div>
          <div className="space-y-4">
            {allProducts.map((product) => (
              <AdminProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
