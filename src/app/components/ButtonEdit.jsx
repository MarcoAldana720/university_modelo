"use client"

import { usePathname } from 'next/navigation'
import Link from "next/link"

function ButtonEdit({id}) {
  const pathname = usePathname()
  return (
    <div className="container_btn_edit">
      <Link href={`${pathname}?edit=1`} className="btn_edit">Modificar</Link>
    </div>
  )
}

export default ButtonEdit