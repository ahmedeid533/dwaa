'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase/client";

// --- Type Definitions ---
interface Medicine {
    medicine_id: number;
    scientific_name: string;
    commercial_name: string | null;
    manufacturer: string | null;
    medicine_image: string | null;
}

// --- Main Medicine Management Component ---
export default function MedicineManagementPage() {
    const { profile: adminProfile, loading: authLoading } = useAuth();
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for the Add/Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [currentMedicine, setCurrentMedicine] = useState<Partial<Medicine> | null>(null);

    // State for the Delete Confirmation Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);

    const fetchMedicines = useCallback(async () => {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
            .from('medicines')
            .select('*')
            .order('commercial_name', { ascending: true });

        if (fetchError) {
            console.error("Error fetching medicines:", fetchError);
            setError("Could not fetch medicine data.");
        } else {
            setMedicines(data as Medicine[]);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (adminProfile?.role === 'Admin') {
            fetchMedicines();
        }
    }, [adminProfile, fetchMedicines]);

    const handleOpenModal = (mode: 'add' | 'edit', medicine: Partial<Medicine> | null = null) => {
        setModalMode(mode);
        setCurrentMedicine(medicine || { scientific_name: '', commercial_name: '', manufacturer: '', medicine_image: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentMedicine(null);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentMedicine) return;

        const { medicine_id, ...formData } = currentMedicine;

        let error;
        if (modalMode === 'edit' && medicine_id) {
            ({ error } = await supabase.from('medicines').update(formData).eq('medicine_id', medicine_id));
        } else {
            ({ error } = await supabase.from('medicines').insert(formData));
        }

        if (error) {
            alert(`Error saving medicine: ${error.message}`);
        } else {
            handleCloseModal();
            fetchMedicines(); // Refresh the list
        }
    };

    const handleDeleteClick = (medicine: Medicine) => {
        setMedicineToDelete(medicine);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!medicineToDelete) return;

        const { error: deleteError } = await supabase
            .from('medicines')
            .delete()
            .eq('medicine_id', medicineToDelete.medicine_id);

        if (deleteError) {
            alert(`Error deleting medicine: ${deleteError.message}`);
        } else {
            setIsDeleteModalOpen(false);
            setMedicineToDelete(null);
            fetchMedicines(); // Refresh the list
        }
    };


    if (authLoading) return <div className="p-8 text-center">Loading...</div>;
    if (adminProfile?.role !== 'Admin') return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Medicine Management</h1>
                <button onClick={() => handleOpenModal('add')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                    Add New Medicine
                </button>
            </div>

            {isLoading ? <p className="text-center">Loading medicines...</p> : error ? <p className="text-center text-red-500">{error}</p> : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold text-sm">Commercial Name</th>
                                <th className="p-4 font-semibold text-sm">Scientific Name</th>
                                <th className="p-4 font-semibold text-sm">Manufacturer</th>
                                <th className="p-4 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map(med => (
                                <tr key={med.medicine_id} className="border-b dark:border-gray-700">
                                    <td className="p-4 font-medium">{med.commercial_name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{med.scientific_name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{med.manufacturer}</td>
                                    <td className="p-4 space-x-4">
                                        <button onClick={() => handleOpenModal('edit', med)} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteClick(med)} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-6">{modalMode === 'add' ? 'Add New Medicine' : 'Edit Medicine'}</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Commercial Name</label>
                                <input type="text" value={currentMedicine?.commercial_name || ''} onChange={(e) => setCurrentMedicine({...currentMedicine, commercial_name: e.target.value})} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Scientific Name <span className="text-red-500">*</span></label>
                                <input type="text" required value={currentMedicine?.scientific_name || ''} onChange={(e) => setCurrentMedicine({...currentMedicine, scientific_name: e.target.value})} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Manufacturer</label>
                                <input type="text" value={currentMedicine?.manufacturer || ''} onChange={(e) => setCurrentMedicine({...currentMedicine, manufacturer: e.target.value})} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input type="text" value={currentMedicine?.medicine_image || ''} onChange={(e) => setCurrentMedicine({...currentMedicine, medicine_image: e.target.value})} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete &quot;{medicineToDelete?.commercial_name}&quot;? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
