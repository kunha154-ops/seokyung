"use client";

import { useState } from "react";
import { updateUserStatus } from "@/app/actions/admin-users-actions";
import { useRouter } from "next/navigation";
import styles from "./adminUsers.module.css";

export default function UserStatusSelect({ userId, currentStatus }: { userId: number, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'approved' | 'pending' | 'suspended' | 'rejected';
    
    if (confirm(`상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) {
      setIsUpdating(true);
      const res = await updateUserStatus(userId, newStatus);
      setIsUpdating(false);
      
      if (res.success) {
        alert("상태가 변경되었습니다.");
        router.refresh();
      } else {
        alert(res.error || "오류가 발생했습니다.");
      }
    }
  };

  return (
    <select 
      value={currentStatus} 
      onChange={handleChange} 
      disabled={isUpdating}
      className={styles.actionSelect}
    >
      <option value="pending">승인 대기</option>
      <option value="approved">승인 완료</option>
      <option value="suspended">이용 정지</option>
      <option value="rejected">가입 거절</option>
    </select>
  );
}
