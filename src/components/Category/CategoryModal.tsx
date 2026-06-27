import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { message } from "antd";
import { useCreateCategory, useUpdateCategory } from "@/api/hooks/use-categories";
import type { Category, CategoryPayload } from "@/types/category";

interface CategoryModalProps {
  open: boolean;
  mode: "add" | "edit";
  item: Category | null;
  onClose: () => void;
}

const CategoryModal = ({ open, mode, item, onClose }: CategoryModalProps) => {
  const [form] = Form.useForm();

  const { mutate: createCategory, isPending: creating } = useCreateCategory();
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory(item?.id ?? 0);

  const isPending = creating || updating;

  useEffect(() => {
    if (open) {
      if (mode === "edit" && item) {
        form.setFieldsValue({ name: item.name, description: item.description });
      } else {
        form.resetFields();
      }
    }
  }, [open, mode, item, form]);

  const handleSubmit = () => {
    form.validateFields().then((values: CategoryPayload) => {
      if (mode === "add") {
        createCategory(values, {
          onSuccess: () => {
            message.success("Category created successfully!");
            onClose();
          },
          onError: () => message.error("Failed to create category!"),
        });
      } else {
        updateCategory(values, {
          onSuccess: () => {
            message.success("Category updated successfully!");
            onClose();
          },
          onError: () => message.error("Failed to update category!"),
        });
      }
    });
  };

  return (
    <Modal
      title={mode === "add" ? "Add New Category" : "Edit Category"}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={mode === "add" ? "Add Category" : "Save Changes"}
      cancelText="Cancel"
      confirmLoading={isPending}
      okButtonProps={{ className: "bg-blue-600" }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="pt-2">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter category name!" }]}
        >
          <Input placeholder="e.g. Burgers" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description!" }]}
        >
          <Input.TextArea placeholder="e.g. Gourmet burgers and handcrafted sandwiches" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
