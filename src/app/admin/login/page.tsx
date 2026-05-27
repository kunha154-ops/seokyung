import LoginForm from './LoginForm'
import styles from './Login.module.css'

export const metadata = {
  title: '관리자 로그인 | 서경노회',
  description: '서경노회 홈페이지 시스템 관리자 로그인 페이지입니다.',
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>서경노회 관리자</h1>
          <p className={styles.subtitle}>시스템 관리를 위해 로그인해 주세요.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
