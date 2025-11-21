import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Store, Mail, Calendar, ToggleRight, ToggleLeft, Trash2, Plus, Search, User, ChevronRight } from 'lucide-react';

export default function AdminBoutiques({ boutiques }: any) {
    const [processing, setProcessing] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const toggleStatus = (boutiqueId: number) => {
        setProcessing(true);
        router.patch(`/admin/boutiques/${boutiqueId}/toggle`, {}, {
            onFinish: () => setProcessing(false)
        });
    };

    const deleteBoutique = (boutiqueId: number, boutiqueName: string) => {
        if (confirm(`Are you sure you want to delete "${boutiqueName}"? This action cannot be undone.`)) {
            setDeletingId(boutiqueId);
            router.delete(`/boutiques/${boutiqueId}`, {
                onFinish: () => setDeletingId(null)
            });
        }
    };

    // Filter and search logic
    const filteredBoutiques = useMemo(() => {
        let filtered = boutiques.data;

        // Filter by status
        if (statusFilter === 'active') {
            filtered = filtered.filter((boutique: any) => boutique.is_active);
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter((boutique: any) => !boutique.is_active);
        }

        // Search by name, owner name, or email
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((boutique: any) =>
                boutique.name.toLowerCase().includes(query) ||
                boutique.user.name.toLowerCase().includes(query) ||
                boutique.user.email.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [boutiques.data, statusFilter, searchQuery]);

    // Count boutiques by status
    const statusCounts = useMemo(() => {
        return {
            all: boutiques.data.length,
            active: boutiques.data.filter((b: any) => b.is_active).length,
            inactive: boutiques.data.filter((b: any) => !b.is_active).length,
        };
    }, [boutiques.data]);

    return (
        <AppLayout>
            <Head title="Manage Boutiques" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Manage Boutiques</h1>
                                <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                                    Total: {boutiques.total} boutique{boutiques.total !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                <Button asChild className="bg-white text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none">
                                    <Link href="/admin/boutiques/create">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 flex-1 sm:flex-none">
                                    <Link href="/admin/dashboard">Dashboard</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                id="boutique-search"
                                name="search"
                                type="text"
                                placeholder="Search by boutique name, owner, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                            />
                        </div>

                        {/* Status Filter Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    statusFilter === 'all'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-blue-400'
                                }`}
                            >
                                All Boutiques ({statusCounts.all})
                            </button>
                            <button
                                onClick={() => setStatusFilter('active')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    statusFilter === 'active'
                                        ? 'bg-green-100 text-green-700 border-2 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-green-400'
                                }`}
                            >
                                <ToggleRight className="w-3.5 h-3.5" />
                                Active ({statusCounts.active})
                            </button>
                            <button
                                onClick={() => setStatusFilter('inactive')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    statusFilter === 'inactive'
                                        ? 'bg-slate-200 text-slate-700 border-2 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-slate-400'
                                }`}
                            >
                                <ToggleLeft className="w-3.5 h-3.5" />
                                Inactive ({statusCounts.inactive})
                            </button>
                        </div>

                        {/* Results count */}
                        {(searchQuery || statusFilter !== 'all') && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {filteredBoutiques.length} of {boutiques.data.length} boutiques
                                </p>
                                {(searchQuery || statusFilter !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('all');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {filteredBoutiques.length === 0 ? (
                        <Card className="p-8 sm:p-12 text-center">
                            <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">No boutiques found</p>
                        </Card>
                    ) : (
                        <>
                            {/* Mobile: Horizontal Scrollable Cards */}
                            <div className="lg:hidden">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
                                    {filteredBoutiques.length > 1 ? 'Swipe left/right to see all boutiques →' : ''}
                                </p>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                                    {filteredBoutiques.map((boutique: any) => (
                                        <Card key={boutique.id} className="flex-shrink-0 w-[85vw] max-w-sm snap-center shadow-lg">
                                            <div className="p-5">
                                                {/* Boutique Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                                                            <Store className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">
                                                                {boutique.name}
                                                            </h3>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate">
                                                                <User className="w-3.5 h-3.5 flex-shrink-0" />
                                                                {boutique.user.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ml-2 ${
                                                        boutique.is_active
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                                    }`}>
                                                        {boutique.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>

                                                {/* Boutique Info */}
                                                <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                        <span className="text-slate-600 dark:text-slate-400 truncate">
                                                            {boutique.user.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600 dark:text-slate-400">
                                                            Joined {new Date(boutique.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="space-y-2">
                                                    <Button
                                                        className={`w-full ${
                                                            boutique.is_active
                                                                ? 'bg-slate-600 hover:bg-slate-700 text-white'
                                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                                        }`}
                                                        onClick={() => toggleStatus(boutique.id)}
                                                        disabled={processing}
                                                    >
                                                        {boutique.is_active ? (
                                                            <>
                                                                <ToggleLeft className="w-4 h-4 mr-2" />
                                                                Deactivate
                                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ToggleRight className="w-4 h-4 mr-2" />
                                                                Activate
                                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                                                        onClick={() => deleteBoutique(boutique.id, boutique.name)}
                                                        disabled={deletingId === boutique.id}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        {deletingId === boutique.id ? 'Deleting...' : 'Delete'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Card Grid */}
                            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredBoutiques.map((boutique: any) => (
                                    <Card key={boutique.id} className="hover:shadow-xl transition-shadow">
                                        <div className="p-6">
                                            {/* Boutique Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                                                        <Store className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">
                                                            {boutique.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate">
                                                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="truncate">{boutique.user.name}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ml-2 ${
                                                    boutique.is_active
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                                }`}>
                                                    {boutique.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>

                                            {/* Boutique Info */}
                                            <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-slate-600 dark:text-slate-400 truncate">
                                                        {boutique.user.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        Joined {new Date(boutique.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="space-y-2">
                                                <Button
                                                    className={`w-full ${
                                                        boutique.is_active
                                                            ? 'bg-slate-600 hover:bg-slate-700 text-white'
                                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                                    }`}
                                                    onClick={() => toggleStatus(boutique.id)}
                                                    disabled={processing}
                                                >
                                                    {boutique.is_active ? (
                                                        <>
                                                            <ToggleLeft className="w-4 h-4 mr-2" />
                                                            Deactivate
                                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleRight className="w-4 h-4 mr-2" />
                                                            Activate
                                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                                                    onClick={() => deleteBoutique(boutique.id, boutique.name)}
                                                    disabled={deletingId === boutique.id}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    {deletingId === boutique.id ? 'Deleting...' : 'Delete'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {boutiques.links && (
                                <div className="mt-8 flex justify-center gap-2 flex-wrap">
                                    {boutiques.links.map((link: any, i: number) => (
                                        <div key={i}>
                                            {link.url ? (
                                                <Link href={link.url}>
                                                    <Button
                                                        variant={link.active ? 'default' : 'outline'}
                                                        size="sm"
                                                        className={link.active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                </Link>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
