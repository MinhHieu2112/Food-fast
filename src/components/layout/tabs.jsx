'use client'
import Link from "next/link"
import {usePathname} from "next/navigation"

//UserTabs là thanh profile, categories, menu-items, orders, users
export default function UserTabs({role}) {
    const path = usePathname();
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';

    return (
        <div className="flex gap-2 text-sm justify-center">
                
                {isAdmin && (
                    <>
                        <Link 
                            href={'/users'}
                            className={path.includes('/users') ? 'active' : ''}
                        >
                            Users
                        </Link>
                        <Link 
                            href={'/store'}
                            className={path.includes('/store') ? 'active' : ''}
                            >
                                Stores
                        </Link>
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
                    </>
                )}
                {/* Chỉ Admin mới xem Users */}
                    {isManager && (
                        <>
                            <Link 
                                className={path === '/drones' ? 'active' : ''} 
                                href={'/drones'}
                                >
                                    Drones
                            </Link>
                            <Link 
                                href={'/orders'}
                                className={path === '/orders' ? 'active' : ''}
                                >
                                    Orders
                            </Link>
                        </>
                    )}
            </div>
    );
}