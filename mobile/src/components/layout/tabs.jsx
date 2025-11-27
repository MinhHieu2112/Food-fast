'use client'
import Link from "next/link"
import {usePathname} from "next/navigation"

//UserTabs là thanh profile, categories, menu-items, orders, users
export default function UserTabs({isAdmin}) {
    const path = usePathname();
    return (
        <div className="flex gap-4 text-sm justify-center">
                
                {isAdmin && (
                    <>
                        <Link 
                            className={path === '/drones' ? 'active' : ''} 
                            href={'/drones'}
                            >
                                Drones
                        </Link>
                        <Link 
                            href={'/categories'}
                            className={path === '/categories' ? 'active' : ''}
                            >
                                Categories
                        </Link>
                        <Link 
                            href={'/menu-items'}
                            className={path.includes('/menu-items') ? 'active' : ''}
                            >
                                Menu Items
                        </Link>
                        <Link 
                            href={'/orders'}
                            className={path === '/orders' ? 'active' : ''}
                            >
                                Orders
                        </Link>
                        <Link 
                            href={'/users'}
                            className={path.includes('/users') ? 'active' : ''}
                            >
                                Users
                        </Link>
                    </>
                )}
            </div>
    );
}