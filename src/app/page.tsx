'use client'
import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './components/layout/Layout';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
      router.push('/homepage');
    }, [router]);

    return (
        <Layout>
            <main>
                <section className='bg-white'>
                    <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
                        {/* Content here will not be rendered because it redirects */}
                    </div>
                </section>
            </main>
        </Layout>
    );
}
