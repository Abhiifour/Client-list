'use client';

import { useState, useEffect } from 'react';
import ClientTable from './components/ClientTable';
import SortModal from './components/SortModal';
import { mockClients } from './utils/mockData';
import { SortCriterion } from './types/client';
import { CiSearch } from "react-icons/ci";
import { RxCaretSort } from "react-icons/rx";
import { CiFilter } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

// Local storage key for sort criteria
const SORT_CRITERIA_STORAGE_KEY = 'clientTableSortCriteria';

export default function Home() {
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>([
    { id: 'initial-sort', field: 'name', direction: 'asc' },
  ]);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  // Load sort criteria from local storage on component mount
  useEffect(() => {
    const savedSortCriteria = localStorage.getItem(SORT_CRITERIA_STORAGE_KEY);
    if (savedSortCriteria) {
      try {
        const parsedCriteria = JSON.parse(savedSortCriteria);
        setSortCriteria(parsedCriteria);
      } catch (error) {
        console.error('Error parsing saved sort criteria:', error);
      }
    }
  }, []);

  // Save sort criteria to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(SORT_CRITERIA_STORAGE_KEY, JSON.stringify(sortCriteria));
  }, [sortCriteria]);

  const openSortModal = () => setIsSortModalOpen(true);
  const closeSortModal = () => setIsSortModalOpen(false);

  return (
    <main className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 bg-white text-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Client List</h1>
      </div>
      
      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0 max-w-7xl mx-auto">
          <div className='flex flex-wrap gap-2 sm:gap-4'>
            <h2 className='text-base sm:text-base font-semibold underline underline-offset-4'>All</h2>
            <h2 className='text-base sm:text-base text-gray-500'>Individual</h2>
            <h2 className='text-base sm:text-base text-gray-500'>Company</h2>
          </div>
          
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-10 w-full sm:w-auto'>
            <div className='flex gap-3 sm:gap-4'>
              <CiSearch className='text-gray-500 text-xl cursor-pointer' />
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <RxCaretSort className='text-gray-500 text-xl cursor-pointer' onClick={openSortModal} />
              </motion.div>
              <CiFilter className='text-gray-500 text-xl cursor-pointer' />
            </div>

            <motion.div 
              className='bg-black text-white text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md flex gap-1 items-center cursor-pointer hover:bg-black/80'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className='text-white text-sm' />
              <p>Add Client</p>
            </motion.div>
          </div>
        </div>
        
        <div className="overflow-x-auto max-w-7xl mx-auto">
          <ClientTable clients={mockClients} sortCriteria={sortCriteria} />
        </div>
      </div>
      
      <AnimatePresence>
        {isSortModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{  
              type: 'spring',
              stiffness: 700,
              damping: 60 ,
              duration: 0.2 }}
          >
            <SortModal 
              isOpen={isSortModalOpen}
              onClose={closeSortModal}
              sortCriteria={sortCriteria}
              onSortChange={setSortCriteria}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
