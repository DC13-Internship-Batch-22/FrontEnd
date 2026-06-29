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

    // 1. Lấy isFetching để làm loading cho Table
    const { data: foods = [], isFetching } = useFoods();
    const { data: categories = [] } = useCategories();
    
    // 2. Lấy isPending từ các mutations để quản lý loading của Button / Confirm
    const { mutate: createFood, isPending: isCreating } = useCreateFood();
    const { mutate: updateFood, isPending: isUpdating } = useUpdateFood();
    const { mutate: deleteFood, isPending: isDeleting } = useDeleteFood();

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
                // Trả về một Promise để Modal.confirm tự hiển thị hiệu ứng loading trên nút Delete
                return new Promise((resolve, reject) => {
                    deleteFood(item.id, {
                        onSuccess: () => {
                            message.success('Dish deleted successfully!');
                            resolve(true);
                        },
                        onError: () => {
                            message.error('Failed to delete dish!');
                            reject();
                        },
                    });
                });
            },
        });
    };

    // Gom trạng thái loading khi đang Add hoặc đang Edit lại để truyền vào Modal
    const isSubmitting = isCreating || isUpdating;

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
                {/* 3. Truyền isFetching hoặc isDeleting vào loading của Table */}
                <MenuTable 
                    data={foods} 
                    loading={isFetching || isDeleting} 
                    onEdit={handleOpenEdit} 
                    onDelete={handleDelete} 
                />
            </div>

            {/* 4. Truyền isSubmitting vào làm confirmLoading của Modal */}
            <DishModal
                open={modalState.open}
                mode={modalState.mode}
                initialData={modalState.item}
                categories={categories}
                confirmLoading={isSubmitting}
                onCancel={handleCloseModal}
                onSave={handleSave}
            />
        </div>
    );
};

export default MenuManagement;