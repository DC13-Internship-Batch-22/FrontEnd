import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import type { DishPayload, Food, Category } from '../../types/food';

interface DishModalProps {
    open: boolean;
    mode: 'add' | 'edit';
    initialData: Food | null;
    categories: Category[];
    onCancel: () => void;
    onSave: (values: DishPayload) => void;
}

const DishModal: React.FC<DishModalProps> = ({ open, mode, initialData, categories, onCancel, onSave }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                form.setFieldsValue({
                    name: initialData.name,
                    price: initialData.price,
                    categoryId: initialData.categoryId,
                    imageUrl: initialData.imageUrl,
                    status: initialData.status,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ status: 'AVAILABLE' });
            }
        }
    }, [open, mode, initialData, form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const payload = {
                ...values,
                status: values.status || 'AVAILABLE',
            };
            onSave(payload);
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    return (
        <Modal
            title={<div className="text-lg font-bold border-b pb-2">{mode === 'add' ? 'Thêm món mới' : 'Chỉnh sửa món ăn'}</div>}
            open={open}
            onOk={handleSubmit}
            onCancel={onCancel}
            okText={mode === 'add' ? 'Thêm món' : 'Lưu thay đổi'}
            cancelText="Hủy"
            okButtonProps={{ className: 'bg-blue-600' }}
            destroyOnClose
        >
            <Form form={form} layout="vertical" className="pt-4">
                <Form.Item
                    name="name"
                    label={<span className="font-semibold">Tên món ăn</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập tên món!' }]}
                >
                    <Input placeholder="Ví dụ: Signature Wagyu Burger" className="rounded-lg" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="price"
                        label={<span className="font-semibold">Giá ($)</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber className="w-full rounded-lg" min={0} precision={2} />
                    </Form.Item>

                    <Form.Item
                        name="categoryId"
                        label={<span className="font-semibold">Danh mục</span>}
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                    >
                        <Select placeholder="Chọn danh mục">
                            {categories.map((cat) => (
                                <Select.Option key={cat.id} value={cat.id}>
                                    {cat.name} {/* Hiển thị tên danh mục: Fried, Drink... */}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="imageUrl"
                    label={<span className="font-semibold">URL Hình ảnh</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập URL ảnh!' }]}
                >
                    <Input placeholder="https://..." className="rounded-lg" />
                </Form.Item>

                <Form.Item name="status" label={<span className="font-semibold">Trạng thái</span>}>
                    <Select className="w-full" disabled>
                        <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DishModal;