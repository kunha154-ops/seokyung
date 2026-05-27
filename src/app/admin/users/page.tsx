import { getUsers } from "@/app/actions/admin-users-actions";
import { getCurrentUser } from "@/app/actions/post-actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./adminUsers.module.css";
import UserStatusSelect from "./UserStatusSelect";

export const metadata = { title: "관리자 - 회원 관리" };
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.isAdmin) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';
  const statusFilter = params.status || '';

  const { users, total, totalPages } = await getUsers(page, 20, search, statusFilter);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>회원 관리 ({total}명)</h1>
        
        <form className={styles.filters} method="GET" action="/admin/users">
          <select name="status" className={styles.select} defaultValue={statusFilter}>
            <option value="">상태 전체</option>
            <option value="pending">승인 대기</option>
            <option value="approved">승인 완료</option>
            <option value="suspended">이용 정지</option>
          </select>
          
          <input 
            type="text" 
            name="search" 
            placeholder="이름, 아이디, 소속교회 검색" 
            defaultValue={search}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.pageBtnActive} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}>검색</button>
        </form>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>아이디</th>
              <th>이름</th>
              <th>소속교회 / 직분</th>
              <th>연락처</th>
              <th>가입일</th>
              <th>최근 로그인</th>
              <th>상태 관리</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                  조건에 맞는 회원이 없습니다.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id}>
                  <td>{total - ((page - 1) * 20 + idx)}</td>
                  <td>{user.username}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>
                    {user.church || "-"} {user.position && `(${user.position})`}
                  </td>
                  <td>{user.phone || "-"}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>{formatDate(user.last_login)}</td>
                  <td>
                    <UserStatusSelect userId={user.id} currentStatus={user.status || 'pending'} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Link
            href={`/admin/users?page=${page - 1}${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`}
            className={`${styles.pageBtn} ${page <= 1 ? styles.pageBtnDisabled : ''}`}
          >
            ‹ 이전
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/users?page=${p}${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/users?page=${page + 1}${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`}
            className={`${styles.pageBtn} ${page >= totalPages ? styles.pageBtnDisabled : ''}`}
          >
            다음 ›
          </Link>
        </div>
      )}
    </div>
  );
}
