import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Client, SortCriterion } from '../types/client';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose, 
  DialogFooter 
} from './ui/dialog';
import { Button } from './ui/button';
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { VscClose } from "react-icons/vsc";

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortCriteria: SortCriterion[];
  onSortChange: (criteria: SortCriterion[]) => void;
}

const availableFields: { label: string; value: keyof Client }[] = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Type', value: 'type' },
  { label: 'Status', value: 'status' },
  { label: 'Created At', value: 'createdAt' },
  { label: 'Updated At', value: 'updatedAt' },
];

const SortableItem = ({ criterion, onRemove, onDirectionToggle }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: criterion.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-white rounded-lg shadow-sm gap-2 sm:gap-0"
    >
     <div className='flex items-center gap-2 w-full sm:w-auto'>
     <button {...attributes} {...listeners} className="cursor-grab">
        ⋮⋮
      </button>
      <select
        value={criterion.field}
        onChange={(e) => onDirectionToggle(criterion.id, 'field', e.target.value)}
        className="p-1 border border-gray-300 text-sm rounded w-full sm:w-auto"
      >
        {availableFields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
     </div>
      <div className='flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-end'>
      <button
        onClick={() =>
          onDirectionToggle(criterion.id, 'direction', criterion.direction === 'asc' ? 'desc' : 'asc')
        }
        className="p-1 cursor-pointer text-sm text-gray-700"
      >
        {criterion.direction === 'asc' ? <FaChevronUp/> : <FaChevronDown/>}
      </button>
      <button 
        onClick={() => onRemove(criterion.id)} 
        className="cursor-pointer text-lg text-gray-700"
      >
      <VscClose/>
      </button>
      </div>
    </div>
  );
};

export default function SortModal({ isOpen, onClose, sortCriteria, onSortChange }: SortModalProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortCriteria.findIndex((c) => c.id === active.id);
      const newIndex = sortCriteria.findIndex((c) => c.id === over.id);
      onSortChange(arrayMove(sortCriteria, oldIndex, newIndex));
    }
  };

  const handleAdd = () => {
    const newCriterion: SortCriterion = {
      id: `sort-${Date.now()}`,
      field: 'name',
      direction: 'asc',
    };
    onSortChange([...sortCriteria, newCriterion]);
  };

  const handleRemove = (id: string) => {
    onSortChange(sortCriteria.filter((c) => c.id !== id));
  };

  const handleUpdate = (id: string, key: keyof SortCriterion, value: any) => {
    onSortChange(
      sortCriteria.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  if (!isOpen) return null;

  return (
    <Dialog>
      <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
        <div className="w-[95%] sm:w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto bg-white text-gray-900 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h3 className="font-medium text-base sm:text-lg">Sort By</h3>
              <Button 
                size="sm" 
                className="bg-black hover:bg-black/80 text-white cursor-pointer w-full sm:w-auto" 
                onClick={handleAdd}
              >
                Add Sort
              </Button>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sortCriteria} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto border-0">
                  {sortCriteria.map((criterion) => (
                    <SortableItem
                      key={criterion.id}
                      criterion={criterion}
                      onRemove={handleRemove}
                      onDirectionToggle={handleUpdate}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-end mt-6">
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="w-full sm:w-auto mr-0 sm:mr-2 cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={onClose} 
                className="w-full sm:w-auto mr-0 sm:mr-2 bg-black hover:bg-black/80 text-white cursor-pointer"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 