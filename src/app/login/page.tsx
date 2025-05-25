
import { auth, signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { CredentialsSignin } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function Page() {

    const session = await auth();
    if (session) {
        redirect("/");
    }

    const loginHandler = async (formData: FormData) => {
        "use server"
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            throw new Error('Please enter email and password');
        }
        console.log(email, password);

        try {
            const result = await signIn("credentials", {
                redirect: false, // Prevent automatic redirection
                email,
                password,
            });
        } catch (error) {
            const err = error as CredentialsSignin;
            
        }
        // Redirect to a protected page after successful login
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={loginHandler} className='flex flex-col gap-4'>

                        <Input type='email' placeholder="Email" name='email' />
                        <Input type='password' placeholder="Password" name='password' />
                        <Button type='submit' className='w-full' >
                            Login
                        </Button>
                    </form>

                </CardContent>
                <CardFooter>

                    <span> Don't have an account? </span>
                    <Link href="/register" className='text-blue-500 hover:text-blue-700'>Register</Link>
                </CardFooter>
            </Card>

        </div>
    )
}

export default Page