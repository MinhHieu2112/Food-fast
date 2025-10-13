'use client'
import Link from "next/link"
import {usePathname} from "next/navigation"
import {useState} from "react"

export default function UserTabs({isAdmin}) {
    const path = usePathname();
    return (
        <div className="flex gap-2 mx-auto tabs jussttify-center">
                <Link 
                    className={path === '/profile' ? 'active' : ''} 
                    href={'/profile'}
                    >
                        Profile
                    </Link>
                {isAdmin && (
                    <>
                        <Link 
                            href={'/categories'}
                            className={path === '/categories' ? 'active' : ''}
                            >
                                Categories
                        </Link>
                        <Link 
                            href={'/menu-items'}
                            className={path === '/menu-items' ? 'active' : ''}
                            >
                                Menu Items
                        </Link>
                        <Link 
                            href={'/users'}
                            className={path === '/users' ? 'active' : ''}
                            >
                                Users
                        </Link>
                    </>
                )}
            </div>
    );
}