import React, { useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Food, DishPayload } from '../types/food';
import MenuTable from '../components/Menu/MenuTable';
import DishModal from '../components/Menu/DishModal';
import { useFoods, useCreateFood, useUpdateFood, useDeleteFood } from '@/api/hooks/use-foods';
import { useCategories } from '@/api/hooks/use-categories';

const MenuManagement: React.FC = () => {
  const [modalState, setModalState] = useState<{ open: boolean; mode: 'add' | 'edit'; item: Food | null }>({
    open: false,
    mode: 'add',
    item: null,
  });

  const { data: foods = [] } = useFoods();
  const { data: categories = [] } = useCategories();
  const { mutate: createFood } = useCreateFood();
  const { mutate: updateFood } = useUpdateFood();
  const { mutate: deleteFood } = useDeleteFood();

  const handleOpenAdd = () => setModalState({ open: true, mode: 'add', item: null });
  const handleOpenEdit = (item: Food) => setModalState({ open: true, mode: 'edit', item });
  const handleCloseModal = () => setModalState({ open: false, mode: 'add', item: null });

  const handleSave = (payload: DishPayload) => {
    if (modalState.mode === 'add') {
      createFood(payload, {
        onSuccess: () => {
          message.success('Dish added successfully!');
          handleCloseModal();
        },
        onError: () => message.error('Failed to add dish!'),
      });
    } else {
      if (!modalState.item?.id) {
        message.error('Dish ID not found!');
        return;
      }
      updateFood({ id: modalState.item.id, body: payload }, {
        onSuccess: () => {
          message.success('Dish updated successfully!');
          handleCloseModal();
        },
        onError: () => message.error('Failed to update dish!'),
      });
    }
  };

  const handleDelete = (item: Food) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${item.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deleteFood(item.id, {
          onSuccess: () => message.success('Dish deleted successfully!'),
          onError: () => message.error('Failed to delete dish!'),
        });
      },
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-400 text-sm">Configure categories, prices, and food items.</p>
        </div>
        <Space>
          <Button type="primary" className="bg-blue-600 h-10" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            ADD NEW DISH
          </Button>
        </Space>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <MenuTable data={foods} onEdit={handleOpenEdit} onDelete={handleDelete} />
      </div>

      <DishModal
        open={modalState.open}
        mode={modalState.mode}
        initialData={modalState.item}
        categories={categories}
        onCancel={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
};

export default MenuManagement;
