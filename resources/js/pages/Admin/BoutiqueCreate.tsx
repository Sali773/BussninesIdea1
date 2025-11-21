import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ArrowLeft, Store } from 'lucide-react';

export default function BoutiqueCreate({ users }: any) {
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        description: '',
        is_active: true,
    });
    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/admin/boutiques', formData, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create New Boutique" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Link href="/admin/boutiques">
                            <Button variant="outline" size="sm" className="mb-4 bg-white text-purple-600 hover:bg-purple-50">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Boutiques
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <Store className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold">Create New Boutique</h1>
                                <p className="text-purple-100 mt-2">Add a new boutique to the platform</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Boutique Owner */}
                            <div>
                                <Label htmlFor="user_id">Boutique Owner *</Label>
                                <select
                                    id="user_id"
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                    className="w-full mt-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.user_id}</p>
                                )}
                            </div>

                            {/* Boutique Name */}
                            <div>
                                <Label htmlFor="name">Boutique Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Fashion Boutique"
                                    className="mt-2"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter boutique description..."
                                    rows={4}
                                    className="w-full mt-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                                {errors.description && (
                                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Activate boutique immediately
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    {processing ? 'Creating...' : 'Create Boutique'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/admin/boutiques')}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
