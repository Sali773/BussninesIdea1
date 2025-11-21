import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    {status}
                </div>
            )}

            <Card className="p-6 sm:p-8 shadow-lg">
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="h-11"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request.url()}
                                                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="h-11"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                                        Remember me for 30 days
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Log in
                                </Button>
                            </div>

                            {canRegister && (
                                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                                    Don't have an account?{' '}
                                    <TextLink href={register.url()} tabIndex={5} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                                        Sign up
                                    </TextLink>
                                </div>
                            )}
                        </>
                    )}
                </Form>
            </Card>
        </AuthLayout>
    );
}
