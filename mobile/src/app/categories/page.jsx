"use client";
import {useEffect, useState} from "react";
import UseProfile from "@/components/UseProfile"
import toast from "react-hot-toast"
import DeleteButton from "@/components/DeleteButton"

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

    function handleDeleteClick(_id) {
        const promise = new Promise(async(resolve, reject) => {
        const response = await fetch('/api/categories?_id='+_id, {
            method: 'DELETE',
        });
        if (response.ok) {
            resolve();
        } else {
            reject();
        }
        });

        toast.promise(promise, {
            loading: 'Deleting...',
            success: 'Deleted',
            error: 'Error, sorry...',
        });
        fetchCategories();
    }

    if (profileLoading) {
        return 'Loading user info...'
    }
    if (!profileData.isAdmin) {
        return 'Not an admin';
    }
    return (
        <section className="mt-8 max-w-2xl mx-auto">
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
                    <div className="pb-2 flex gap-2">
                        <button type="submit" className="btn-register bg-primary rounded-full text-white px-10 py-2 ">
                            {editedCategory ? 'Update' : 'Create'}
                        </button>
                        <button type="button"
                                className="btn-register px-10 py-2 hover:bg-gray-200"
                                onClick={() => {setEditedCategory(null);
                                                setCategoryName('');
                                }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
            <div>
                <h2 className="mt-8 text-sm text-gray-500">Existing Categories</h2>
                
                {categories?.length > 0 && categories.map(c => (
                    <div key={c._id} className="bg-gray-100 rounded-xl p-2 px-4 flex items-center justify-between gap-1 mb-1 text-sm ">
                        <span
                            className="cursor-pointer">
                                {c.name}
                        </span>
                        <div className="flex gap-2">
                            <button type="button" 
                                    className="btn-register bg-white hover:bg-gray-200"
                                    onClick={() => {
                                        setEditedCategory(c);
                                        setCategoryName(c.name);
                                }}>
                                        Edit
                            </button>
                            <DeleteButton label="Delete" onDelete={() => handleDeleteClick(c._id)} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}