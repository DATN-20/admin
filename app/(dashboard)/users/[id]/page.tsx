"use client"

import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import UserRequestTable from '@/components/UserRequestTable';
import { useEffect, useState } from 'react';
import { useGetUsersQuery } from '@/services/userManagement/userManagementApi';
import { Spin } from 'antd';

const UserDetailPage = ({params}: 
  {params: {id: string}}
) => {
  const router = useRouter();
  const id = params.id;
  const [loading, setLoading] = useState(true);

  const { data: users, isLoading } = useGetUsersQuery(
    { page: 1, limit: 10 },
  );

  useEffect(() => {
    if (!isLoading) {
      if (!users || !id || users.total < parseInt(id as string)) {
        router.push('/users');
      } else {
        setLoading(false);
      }
    }
  }, [users, id, isLoading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="flex-grow w-5/6">
        <UserRequestTable userId={id as string} />
      </div>
    </div>
  );
};

export default UserDetailPage;
