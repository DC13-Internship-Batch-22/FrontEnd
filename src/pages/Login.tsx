import LogoLogin from "../assets/LogoLogin.png"
import { Button, Checkbox, Form, Input, notification } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useLogin } from "@/api/hooks"
import type { LoginPayload } from "@/types/auth"
import { useEffect } from "react"

const Login = () => {
  const { mutate: login, isPending, isError, error } = useLogin();
  const [form] = Form.useForm();

  const onFinish = (value: LoginPayload) => {
    login(value);
  };

  const errorMessage =
    (error as any)?.response?.data?.message
    ?? (error as any)?.message
    ?? "Invalid username or password.";

  useEffect(() => {
    if (isError && error) {
      notification.error({
        message: 'Login Failed',
        description: errorMessage,
        placement: 'topRight',
        duration: 5,
      });
    }
  }, [isError, error, errorMessage]);

  return (
    <div
      className='flex flex-col items-center justify-center min-h-screen gap-5 py-10'
      style={{
        background:
          'radial-gradient(circle, rgba(211,228,254,0.8) 0%, rgba(248,249,255,1) 100%)',
      }}
    >
      <div className='flex flex-col items-center justify-center'>
        <img src={LogoLogin} alt="Logo" className='w-15 h-15 my-2' />
        <h1 className='text-violet-700 font-bold text-4xl'>Velocity RMS</h1>
        <p className='text-gray-800 text-lg'>Restaurant Management Systems</p>
      </div>

      <div
        className='flex-1 border p-7 w-[30%] bg-white flex flex-col gap-7 shadow-xl rounded-2xl transition-all duration-300'
        style={{
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(179, 205, 255, 0.35)',
          borderColor: '#e2e8f0',
        }}
      >
        <div>
          <h1 className='font-semibold text-2xl'>Sign In</h1>
          <p className='text-gray-700 text-lg'>Enter your credentials to manage your floor.</p>
        </div>

        <Form
          form={form}
          requiredMark={false}
          onFinish={onFinish}
          disabled={isPending}
        >
          <Form.Item
            name='username'
            layout='vertical'
            className='font-semibold'
            label="Username"
            rules={[
              { required: true, message: "Please enter your username." },
              { max: 50, message: "Username must be no more than 50 characters." },
              { whitespace: true, message: "Username cannot be empty." },
            ]}
            hasFeedback
          >
            <Input
              prefix={<UserOutlined />}
              placeholder='Type your username'
              className='h-12'
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name='password'
            label="Password"
            layout='vertical'
            className='font-semibold'
            rules={[
              { required: true, message: "Please enter your password." },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Type your password'
              className='h-12'
            />
          </Form.Item>

          <Form.Item name="agreement" valuePropName="checked">
            <Checkbox>Remember device</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              block
              type='primary'
              htmlType='submit'
              size='large'
              loading={isPending}
              className='bg-blue-700! hover:bg-blue-600!'
            >
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className='flex flex-col items-center gap-2'>
        <h1 className='text-gray-700 text-sm font-medium'>
          v2.4.0-STABLE • SERVICE STATUS: <span className='font-bold'>ONLINE</span>
        </h1>
        <p className='text-gray-600 font-medium text-sm'>
          <span className='mr-3'>Privacy Policy</span>
          <span className='ml-3'>Term of use</span>
        </p>
      </div>
    </div>
  )
}

export default Login
