import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { userSchema, UserSchema } from 'src/utils/rules'
import { date } from 'yup'
import DateSelect from '../User/components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/context/app.context'
import { setProfiletoLS } from 'src/utils/auth'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data
  const updateProfileMutation = useMutation(userApi.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    console.log('data =>> ', data)

    const res = await updateProfileMutation.mutateAsync({ ...data, date_of_birth: data.date_of_birth?.toISOString() })
    setProfile(res.data.data)
    setProfiletoLS(res.data.data)
    refetch()
    toast.success(res.data.message)
  })

  const value = watch()
  console.log('value', value)
  console.log('errors', errors)

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  return (
    <div className='rounded-sm bg-white px-7 pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='text-grey-700 mt-1 text-sm'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow pr-12 md:items-start'>
          <div className='flex flex-wrap'>
            <div className='w-[30%] truncate pt-3 text-right capitalize'>Email</div>
            <div className='w-[70%] pl-5'>
              <div className='pt-3 text-green-700'>ducviet****@gmail.com</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[30%] sm:text-right'>Tên</div>
            <div className='sm:w-[70%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[30%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[70%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[30%] sm:text-right'>Địa chỉ</div>
            <div className='sm:w-[70%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='w-[30%] truncate pt-3 text-right capitalize'>Ngày sinh</div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <div className='w-[30%] truncate pt-3 text-right capitalize' />
            <div className='w-[70%] pl-5'>
              <Button className='flex h-9 items-center bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                className='h-full w-full rounded-full object-cover'
                src='https://down-vn.img.susercontent.com/file/b8f6435c4623d5bd4b0e0b58f9d52ccc_tn'
                alt=''
              />
            </div>
            <input className='hidden' type='file' accept='.jpg, .jpeg, .png' />
            <button className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-gray-600 shadow-sm'>
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dung lượng file tối đa 1MB</div>
              <div>Định dạng : JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
