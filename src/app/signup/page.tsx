
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
import dbConnect from '@/lib/db'
import User from '@/models/userModel'
import bcrypt from 'bcryptjs'
import { CredentialsSignin } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function Page() {
    const session = await auth();
    if (session) {
        redirect("/");
    }

    const signUpHanderler = async (formData: FormData) => {
        "use server"
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!name || !email || !password) {
            throw new Error('Please enter all fields');
        }
        dbConnect();

        const isUser = await User.findOne({ email });
        if (isUser) {
            console.log("User already exists" + isUser);    
            throw new Error('User already exists');
        }

        const hashPassword = await bcrypt.hash(password, 12);

        User.create({
            name,
            email,
            password: hashPassword,
        });

        redirect("/login");
        
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={signUpHanderler} className='flex flex-col gap-4'>

                        <Input type='text' placeholder="Name" name='name' />
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