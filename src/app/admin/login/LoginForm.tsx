'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import styles from './Login.module.css'

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <form action={formAction} className={styles.form}>
      {state?.error && <div className={styles.error}>{state.error}</div>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="username" className={styles.label}>아이디</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          required 
          className={styles.input} 
          placeholder="관리자 아이디를 입력하세요"
          autoComplete="username"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>비밀번호</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required 
          className={styles.input} 
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className={styles.button} disabled={isPending}>
        {isPending ? '로그인 중...' : '관리자 로그인'}
      </button>
    </form>
  )
}
