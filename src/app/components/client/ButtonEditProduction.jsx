"use client"

import { usePathname } from 'next/navigation'
import Link from "next/link"

function ButtonEditProduction({id}) {
  const pathname = usePathname()

  return (
    <Link href={`${pathname}?edit=1`} >modificar</Link>
  )
}

export default ButtonEditProduction