import { Head, Link, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type SharedData } from '@/types';

export default function BoutiquesIndex({ boutiques }: any) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    return (
        <StorefrontLayout>
            <Head title="Boutiques" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">Browse Boutiques</h1>
                        {auth.user?.is_admin && (
                            <Button asChild>
                                <Link href="/boutiques/create">Create Boutique</Link>
                            </Button>
                        )}
                    </div>

                    {/* Boutique Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boutiques.data.map((boutique: any) => (
                            <Card key={boutique.id} className="overflow-hidden hover:shadow-lg transition">
                                {boutique.banner_path && (
                                    <img
                                        src={`/storage/${boutique.banner_path}`}
                                        alt={boutique.name}
                                        className="w-full h-40 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-2">{boutique.name}</h2>
                                    {boutique.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {boutique.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                                        {boutique.city && <p>📍 {boutique.city}, {boutique.country}</p>}
                                        {boutique.email && <p>📧 {boutique.email}</p>}
                                        {boutique.phone && <p>📱 {boutique.phone}</p>}
                                    </div>

                                    <Button asChild className="w-full">
                                        <Link href={`/boutiques/${boutique.id}`}>View Boutique</Link>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {boutiques.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No boutiques found</p>
                            {auth.user?.is_admin && (
                                <Button asChild>
                                    <Link href="/boutiques/create">Create First Boutique</Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
