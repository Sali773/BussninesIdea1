import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Users, Shield, UserCog, Store, Search, Mail, Calendar, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function AdminUsers({ users }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');

    const toggleAdmin = (userId: number) => {
        router.patch(`/admin/users/${userId}/toggle-admin`);
    };

    // Filter and search logic
    const filteredUsers = useMemo(() => {
        let filtered = users.data;

        // Filter by role
        if (roleFilter === 'admin') {
            filtered = filtered.filter((user: any) => user.is_admin);
        } else if (roleFilter === 'seller') {
            filtered = filtered.filter((user: any) => user.is_seller && !user.is_admin);
        } else if (roleFilter === 'customer') {
            filtered = filtered.filter((user: any) => !user.is_seller && !user.is_admin);
        }

        // Search by name or email
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((user: any) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [users.data, roleFilter, searchQuery]);

    // Count users by role
    const roleCounts = useMemo(() => {
        return {
            all: users.data.length,
            admin: users.data.filter((u: any) => u.is_admin).length,
            seller: users.data.filter((u: any) => u.is_seller && !u.is_admin).length,
            customer: users.data.filter((u: any) => !u.is_seller && !u.is_admin).length,
        };
    }, [users.data]);

    const getRoleInfo = (user: any) => {
        if (user.is_admin) {
            return { label: 'Admin', icon: Shield, color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800' };
        } else if (user.is_seller) {
            return { label: 'Business', icon: Store, color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800' };
        } else {
            return { label: 'Customer', icon: Users, color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600' };
        }
    };

    return (
        <AppLayout>
            <Head title="Manage Users" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Manage Users</h1>
                                <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                                    Total: {users.total} user{users.total !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <Button asChild className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                                <Link href="/admin/dashboard">Back to Dashboard</Link>
                            </Button>
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
                                id="user-search"
                                name="search"
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                            />
                        </div>

                        {/* Role Filter Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            <button
                                onClick={() => setRoleFilter('all')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    roleFilter === 'all'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-blue-400'
                                }`}
                            >
                                All Users ({roleCounts.all})
                            </button>
                            <button
                                onClick={() => setRoleFilter('admin')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    roleFilter === 'admin'
                                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                                }`}
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Admins ({roleCounts.admin})
                            </button>
                            <button
                                onClick={() => setRoleFilter('seller')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    roleFilter === 'seller'
                                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-purple-400'
                                }`}
                            >
                                <Store className="w-3.5 h-3.5" />
                                Business ({roleCounts.seller})
                            </button>
                            <button
                                onClick={() => setRoleFilter('customer')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    roleFilter === 'customer'
                                        ? 'bg-slate-200 text-slate-700 border-2 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-slate-400'
                                }`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                Customers ({roleCounts.customer})
                            </button>
                        </div>

                        {/* Results count */}
                        {(searchQuery || roleFilter !== 'all') && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {filteredUsers.length} of {users.data.length} users
                                </p>
                                {(searchQuery || roleFilter !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setRoleFilter('all');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {filteredUsers.length === 0 ? (
                        <Card className="p-8 sm:p-12 text-center">
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">No users found</p>
                        </Card>
                    ) : (
                        <>
                            {/* Mobile: Horizontal Scrollable Cards */}
                            <div className="lg:hidden">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
                                    {filteredUsers.length > 1 ? 'Swipe left/right to see all users →' : ''}
                                </p>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                                    {filteredUsers.map((user: any) => {
                                        const role = getRoleInfo(user);
                                        const RoleIcon = role.icon;

                                        return (
                                            <Card key={user.id} className="flex-shrink-0 w-[85vw] max-w-sm snap-center shadow-lg">
                                                <div className="p-5">
                                                    {/* User Header */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                                                {user.name}
                                                            </h3>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                                                <Mail className="w-3.5 h-3.5" />
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border ${role.color}`}>
                                                            <RoleIcon className="w-3.5 h-3.5" />
                                                            {role.label}
                                                        </span>
                                                    </div>

                                                    {/* User Info */}
                                                    <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="w-4 h-4 text-slate-400" />
                                                            <span className="text-slate-600 dark:text-slate-400">
                                                                Joined {new Date(user.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                                        onClick={() => toggleAdmin(user.id)}
                                                    >
                                                        <UserCog className="w-4 h-4 mr-2" />
                                                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Desktop: Card Grid */}
                            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredUsers.map((user: any) => {
                                    const role = getRoleInfo(user);
                                    const RoleIcon = role.icon;

                                    return (
                                        <Card key={user.id} className="hover:shadow-xl transition-shadow">
                                            <div className="p-6">
                                                {/* User Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">
                                                            {user.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate">
                                                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="truncate">{user.email}</span>
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border flex-shrink-0 ml-2 ${role.color}`}>
                                                        <RoleIcon className="w-3.5 h-3.5" />
                                                        {role.label}
                                                    </span>
                                                </div>

                                                {/* User Info */}
                                                <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600 dark:text-slate-400">
                                                            Joined {new Date(user.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <Button
                                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                                    onClick={() => toggleAdmin(user.id)}
                                                >
                                                    <UserCog className="w-4 h-4 mr-2" />
                                                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                                </Button>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {users.links && (
                                <div className="mt-8 flex justify-center gap-2 flex-wrap">
                                    {users.links.map((link: any, i: number) => (
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
