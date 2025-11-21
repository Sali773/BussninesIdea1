import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormEvent } from 'react';
import { Store } from 'lucide-react';

export default function BoutiqueEdit({ boutique }: any) {
    const { data, setData, patch, processing, errors } = useForm({
        name: boutique.name,
        description: boutique.description || '',
        email: boutique.email || '',
        phone: boutique.phone || '',
        address: boutique.address || '',
        city: boutique.city || '',
        country: boutique.country || '',
        logo: null as File | null,
        banner: null as File | null,
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        formData.append('city', data.city);
        formData.append('country', data.country);
        if (data.logo) {
            formData.append('logo', data.logo);
        }
        if (data.banner) {
            formData.append('banner', data.banner);
        }

        patch(`/boutiques/${boutique.id}`, {
            data: formData,
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit ${boutique.name}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-2xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/my-boutiques" className="text-blue-600 hover:text-blue-800">
                            My Boutiques
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href={`/boutiques/${boutique.id}`} className="text-blue-600 hover:text-blue-800">
                            {boutique.name}
                        </Link>
                        <span className="text-gray-400">/</span>
                        <div className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-purple-600" />
                            <h1 className="text-3xl font-bold">Edit Boutique</h1>
                        </div>
                    </div>

                    <Card className="p-8">
                        {/* Current Logo */}
                        {boutique.logo_path && (
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-2">Current Logo</p>
                                <img
                                    src={`/storage/${boutique.logo_path}`}
                                    alt={boutique.name}
                                    className="h-32 w-32 object-cover rounded-lg border"
                                />
                            </div>
                        )}

                        {/* Current Banner */}
                        {boutique.banner_path && (
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-2">Current Banner</p>
                                <img
                                    src={`/storage/${boutique.banner_path}`}
                                    alt={`${boutique.name} banner`}
                                    className="h-32 w-full object-cover rounded-lg border"
                                />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Boutique Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Boutique Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter boutique name"
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Tell customers about your boutique"
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Email and Phone Row */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="boutique@example.com"
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Street address"
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                )}
                            </div>

                            {/* City and Country Row */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="City"
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                    )}
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        placeholder="Country"
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    {errors.country && (
                                        <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                                    )}
                                </div>
                            </div>

                            {/* Logo Image */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Update Boutique Logo
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('logo', e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to keep current logo. Supported formats: JPEG, PNG, JPG (Max 2MB)
                                </p>
                                {errors.logo && (
                                    <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                                )}
                            </div>

                            {/* Banner Image */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Update Boutique Banner
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('banner', e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to keep current banner. Supported formats: JPEG, PNG, JPG (Max 2MB)
                                </p>
                                {errors.banner && (
                                    <p className="text-red-500 text-sm mt-1">{errors.banner}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-6">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={`/boutiques/${boutique.id}`}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
