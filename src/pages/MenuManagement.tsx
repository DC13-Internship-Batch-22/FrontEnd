import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import type { Food, DishPayload, Category } from '../types/food';
import MenuTable from '../components/Menu/MenuTable';
import DishModal from '../components/Menu/DishModal';
import { foodService } from '@/api/services';
import axios from 'axios';

const MenuManagement: React.FC = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [modalState, setModalState] = useState<{ open: boolean; mode: 'add' | 'edit'; item: Food | null }>({
        open: false,
        mode: 'add',
        item: null,
    });

    // 1. Hàm load danh sách món ăn từ API
    const loadFoods = async () => {
        try {
            const data = await foodService.getFoods();
            setFoods(data);
        } catch (error) {
            console.error(error);
            message.error('Không thể tải danh sách món ăn!');
        }
    };

    // 2. Hàm load danh mục từ API up.railway của bạn
    const loadCategories = async () => {
        try {
            const response = await axios.get('https://backend-production-f125.up.railway.app/categories');
            setCategories(response.data);
        } catch (error) {
            console.error(error);
            // Backup data nếu API categories gặp lỗi mạng
            setCategories([
                { id: 1, name: "Fried", description: "Delicious", createdAt: "", updatedAt: "" },
                { id: 2, name: "Drink", description: "Yummy", createdAt: "", updatedAt: "" }
            ]);
        }
    };

    useEffect(() => {
        loadFoods();
        loadCategories();
    }, []);

    const handleOpenAdd = () => setModalState({ open: true, mode: 'add', item: null });

    const handleOpenEdit = (item: Food) => setModalState({ open: true, mode: 'edit', item });

    // 3. Xử lý Thêm mới (POST) và Chỉnh sửa (PATCH) món ăn
    const handleSave = async (payload: DishPayload) => {
        try {
            if (modalState.mode === 'add') {
                await foodService.createFood(payload);
                message.success('Thêm món mới thành công!');
            } else {
                // ĐOẠN NÀY QUAN TRỌNG: Phải lấy đúng ID từ món đang edit
                if (modalState.item?.id) {
                    await foodService.updateFood(modalState.item.id, payload);
                    message.success('Cập nhật món ăn thành công!');
                } else {
                    message.error('Không tìm thấy ID món ăn để cập nhật!');
                    return;
                }
            }
            setModalState({ open: false, mode: 'add', item: null });
            loadFoods(); // Gọi lại hàm lấy danh sách để cập nhật giao diện (UI) mới nhất
        } catch (error) {
            console.error("Lỗi update:", error);
            message.error('Cập nhật thất bại!');
        }
    };

    // 4. Xử lý Xóa món ăn (DELETE) kèm Modal xác nhận từ Antd
    const handleDelete = (item: Food) => {
        Modal.confirm({
            title: 'Xác nhận xóa món',
            content: `Bạn chắc chắn muốn xóa món "${item.name}" (ID: ${item.id}) khỏi hệ thống chứ?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await foodService.deleteFood(item.id);
                    message.success('Đã xóa món ăn thành công!');
                    loadFoods(); // Refresh danh sách sau khi xóa
                } catch (error) {
                    console.error(error);
                    message.error('Xóa món ăn thất bại!');
                }
            }
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
                <MenuTable
                    data={foods}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modal điền form thông tin Add / Edit */}
            <DishModal
                open={modalState.open}
                mode={modalState.mode}
                initialData={modalState.item}
                categories={categories}
                onCancel={() => setModalState({ ...modalState, open: false })}
                onSave={handleSave}
            />
        </div>
    );
};

export default MenuManagement;