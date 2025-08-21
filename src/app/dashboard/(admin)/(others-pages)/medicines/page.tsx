'use client';

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
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
    const [pageError, setPageError] = useState<string | null>(null);

    // State for the Add/Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [currentMedicine, setCurrentMedicine] = useState<Partial<Medicine> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    // State for the Delete Confirmation Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);

    const fetchMedicines = useCallback(async () => {
        setIsLoading(true);
        setPageError(null);
        const { data, error: fetchError } = await supabase
            .from('medicines')
            .select('*')
            .order('commercial_name', { ascending: true });

        if (fetchError) {
            console.error("Error fetching medicines:", fetchError);
            setPageError("Could not fetch medicine data.");
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
        setModalError(null); // Clear previous errors
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentMedicine(null);
        setIsSubmitting(false);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentMedicine) return;

        setIsSubmitting(true);
        setModalError(null);

        const { medicine_id, ...formData } = currentMedicine;

        let error;
        if (modalMode === 'edit' && medicine_id) {
            ({ error } = await supabase.from('medicines').update(formData).eq('medicine_id', medicine_id));
        } else {
            ({ error } = await supabase.from('medicines').insert(formData));
        }

        if (error) {
            setModalError(`Error saving medicine: ${error.message}`);
        } else {
            handleCloseModal();
            fetchMedicines(); // Refresh the list
        }
        setIsSubmitting(false);
    };

    const handleDeleteClick = (medicine: Medicine) => {
        setMedicineToDelete(medicine);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!medicineToDelete) return;
        setIsSubmitting(true);

        const { error: deleteError } = await supabase
            .from('medicines')
            .delete()
            .eq('medicine_id', medicineToDelete.medicine_id);

        if (deleteError) {
            // This is a good place to show a toast notification in a real app
            alert(`Error deleting medicine: ${deleteError.message}`);
        } else {
            setIsDeleteModalOpen(false);
            setMedicineToDelete(null);
            fetchMedicines(); // Refresh the list
        }
        setIsSubmitting(false);
    };


    if (authLoading) return <div className="p-8 text-center">Loading...</div>;
    if (adminProfile?.role !== 'Admin') return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Medicine Management</h1>
                    <button onClick={() => handleOpenModal('add')} className="bg-[#08d9b3] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#07c0a0] transition-colors duration-300 shadow-sm">
                        Add New Medicine
                    </button>
                </div>

                {isLoading ? <p className="text-center text-gray-500 dark:text-gray-400">Loading medicines...</p> : pageError ? <p className="text-center text-red-500">{pageError}</p> : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/30">
									<tr>
										<th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Image</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Commercial Name</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Scientific Name</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Manufacturer</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map(med => (
																	<tr key={med.medicine_id} className="border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
																				<td className="p-4">
																					<Image src={med.medicine_image || '/images/default-medicine.png'} alt={med.commercial_name || 'Medicine Image'} width={50} height={50} className="rounded-md" />
																				</td>
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{med.commercial_name}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{med.scientific_name}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{med.manufacturer}</td>
                                        <td className="p-4 space-x-4">
                                            <button onClick={() => handleOpenModal('edit', med)} className="font-medium text-[#08d9b3] hover:text-[#07c0a0] hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteClick(med)} className="font-medium text-red-500 hover:text-red-700 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">{modalMode === 'add' ? 'Add New Medicine' : 'Edit Medicine'}</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Commercial Name</label>
                                <input type="text" value={currentMedicine?.commercial_name || ''} onChange={(e) => setCurrentMedicine({...currentMedicine, commercial_name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Scientific Name <span className="text-red-500">*</span></label>
                                <input type="text" required value={currentMedicine?.scientific_name || ''} onChange={(e) => setCurrentMedicine({...currentMedicine, scientific_name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Manufacturer</label>
                                <input type="text" value={currentMedicine?.manufacturer || ''} onChange={(e) => setCurrentMedicine({...currentMedicine, manufacturer: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Image URL</label>
                                <input type="text" value={currentMedicine?.medicine_image || ''} onChange={(e) => setCurrentMedicine({...currentMedicine, medicine_image: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition" />
                            </div>

                            {modalError && <p className="text-sm text-red-500">{modalError}</p>}

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-[#08d9b3] text-white hover:bg-[#07c0a0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Confirm Deletion</h2>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">Are you sure you want to delete &quot;{medicineToDelete?.commercial_name}&quot;? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                            <button onClick={confirmDelete} disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
