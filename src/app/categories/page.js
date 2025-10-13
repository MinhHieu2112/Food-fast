"use client";
import UserTabs from "@/components/layout/tabs";
import {useEffect, useState} from "react";
import UseProfile from "@/components/UseProfile"
import toast from "react-hot-toast"
export default function CategoriesPage() {
    const [CategoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const {loading:profileLoading, data:profileData} = UseProfile();
    const [editedCategory, setEditedCategory] = useState(null);
    
    useEffect(() => {
        fetchCategories();
    }, []);
    function fetchCategories() {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategories(categories);
            });
        });
    }
    async function handleCategorySubmit(ev) {
        ev.preventDefault();
        const creationPromise = new Promise(async (resolve, reject) => {
            const data = {name:CategoryName};
            if (editedCategory) {
                data._id = editedCategory._id;
            }
            const response = await fetch('/api/categories', {
            method: editedCategory ? 'PUT' : 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data),
            });
            setCategoryName('');
            fetchCategories();
            if (response.ok)
                resolve();
            else
                reject();
        });
        await toast.promise(creationPromise, {
            loading: editedCategory 
                        ? 'Updating category...'
                        : 'Creating your new category...',
            success: editedCategory ?'Category updated'
                                    :'Category created',
            error: 'Error, sorry...',
        });
    }

    if (profileLoading) {
        return 'Loading user info...'
    }
    if (!profileData.isAdmin) {
        return 'Not an admin';
    }
    return (
        <section className="mt-8 max-w-md mx-auto">
            <UserTabs isAdmin={true} />
            <form className="mt-8" onSubmit={handleCategorySubmit}>
                <div className="flex gap-2 items-end">
                    <div className="grow">
                        <label>
                            {editedCategory ? 'Update category' : 'New category name'}
                            {editedCategory && (
                                <>: <b>{editedCategory.name}</b></>
                            )}
                        </label>
                        <input type="text" 
                                value={CategoryName}
                                onChange={ev => setCategoryName(ev.target.value)}
                        />
                    </div>
                    <div className="pb-2">
                        <button type="submit" className="bg-primary rounded-full text-white px-10 py-2">
                            {editedCategory ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </form>
            <div>
                <h2 className="mt-8 text-sm text-gray-500">Edit category:</h2>
                
                {categories?.length > 0 && categories.map(c => (
                    <button key={c._id || c.name} 
                        onClick={() => {
                            setEditedCategory(c);
                            setCategoryName(c.name);
                        }}
                        className="bg-gray-200 text-gray-700 rounded-xl px-4 py-2 mb-1 text-left w-full hover:bg-gray-300 transition-all"
                        
                        >
                        <span>{c.name}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}